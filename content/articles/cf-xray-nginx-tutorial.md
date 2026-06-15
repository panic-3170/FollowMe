# 移动宽带 SSH 不到海外 VPS？CF + nginx 反向代理的全套方案

> **核心结论**：国内网络移动运营商会主动阻断到海外 VPS 的 SSH 流量。**正确做法是让所有流量走 Cloudflare CDN**，国内网络 看不到真实 VPS IP，配合 nginx 网站防主动探测。本文提供从零到一的完整部署方案。

**3 分钟摘要**：
- 移动宽带到 VPS 的 SSH 流量被 GFW 识别并阻断
- 用 Cloudflare CDN 隐藏真实 VPS IP（免费方案）
- xray VLESS + WebSocket 加密代理流量
- nginx 网站防御 G网 主动探测

**实测环境**：RackNerd VPS（Ubuntu 22.04）+ 3X-UI + Clash Verge + 域名走 Cloudflare
**适用场景**：家庭移动宽带（移动/电信/联通）被国内网络移动运营商阻断 SSH 直连海外 VPS
**最终效果**：根本不用 SSH 直连 VPS，所有代理流量都套上 Cloudflare CDN + 网站防主动探测

---

## 一、问题背景

从 RackNerd 买了一台美国 VPS，IP `104.223.xxx.xxx`，给了 root 账号密码让我从 22 端口登录。

**异常表现**：
- `ping` 这个 IP ✅ 通
- 家里中国移动宽带 `ssh root@IP -p 22` ❌ 卡住
- 改成 `ssh -p 443` 也卡住
- 手机 4G/5G 热点 `ssh root@IP -p 22` ✅ 正常
- 服务器侧 sshd 日志显示 `fatal: Timeout before authentication for <我的国内IP>`

**结论**：家里移动宽带到 VPS 的 SSH 流量被 GFW/移动运营商识别并阻断。**不是 VPS 的问题，是 ISP/GFW 的事**。

客服让"换 ISP 试试"——这等于踢皮球，正确做法是**让所有流量走 Cloudflare CDN**，GFW 看不到真实 VPS IP。

---

## 二、最终架构

```
┌────────────────────────────────────────┐
│  客户端（家里移动宽带）                  │
│   Clash Verge → 节点 rackvps-cf         │
└─────────────┬──────────────────────────┘
              │  TLS 443（看起来是普通 HTTPS）
              ▼
┌────────────────────────────────────────┐
│  Cloudflare Edge（全球 CDN 节点）       │
│   - 隐藏真实 VPS IP                     │
│   - 缓解 GFW 主动探测                   │
└─────────────┬──────────────────────────┘
              │  TLS 443（CF 回源）
              ▼
┌────────────────────────────────────────┐
│  VPS nginx (0.0.0.0:443)               │
│   路径 /ws  → 127.0.0.1:10000 → xray  │
│   其他路径  → /var/www/fake (假博客)    │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  xray (VLESS + WebSocket)              │
│   鉴权通过 → 流量转发到互联网            │
└────────────────────────────────────────┘
```

三层防护：
1. **CF CDN** — 客户端只看到 CF 节点，看不到 VPS IP
2. **nginx fallback** — GFW 主动探测看到的是普通博客
3. **xray VLESS+WS** — 真实代理流量加密传输

---

## 三、前置准备

| 项目 | 说明 |
|------|------|
| 域名 | 自己的域名（已在 Cloudflare 接入，能改 NS） |
| VPS | 任意海外 VPS（本文用 RackNerd Ubuntu 22.04） |
| 3X-UI | VPS 上已装好（如果没装，参考 [3X-UI 安装](#四vps-端配置)） |
| 客户端 | Clash Verge（Windows / macOS / iOS / Android 都有） |

**本文用到的占位符**（实际配置时替换成自己的）：

| 占位符 | 含义 | 示例 |
|--------|------|------|
| `<域名>` | CF 上接入的域名 | `qzz.io` |
| `proxy.<域名>` | 代理用的子域 | `proxy.qzz.io` |
| `<VPS_IP>` | VPS 真实 IP | `104.223.xxx.xxx` |
| `<UUID>` | 3X-UI 生成的客户端 UUID | `b1a4d8e7-xxxx-...` |

---

## 四、VPS 端配置

### 4.1 安装 3X-UI（如果还没装）

SSH 到 VPS（用手机 4G 热点连），执行：

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

安装过程中会问：
- **用户名**：自己设（默认 `admin`）
- **密码**：自己设（默认 `admin`，**务必改**）
- **面板端口**：自己设（默认 `54321`，建议改成 `2053` 之类不常见的）

安装完后访问 `http://<VPS_IP>:<面板端口>`，能看到登录页就 OK。

### 4.2 创建入站（VLESS + WebSocket + TLS）

3X-UI 面板 → **Inbounds** → **+ Add Inbound**：

| 字段 | 填什么 |
|------|--------|
| Remark | `cf-vless`（随便起） |
| Protocol | `vless` |
| Listen IP | 留空（默认 0.0.0.0，先这样，最后再改） |
| Port | `443` |
| Transmission | `ws` |
| Path | `/ws` |
| Security | `TLS` |
| Certificate | **暂时留空**（下一步填）|
| Key | **暂时留空** |
| ALPN | `h2, http/1.1` |

**Clients** → 点 `+ Add Client`：
- Email：随便填
- 点 🔄 生成 UUID → **复制这个 UUID 备用**（客户端要填）

点 **Create** 保存。

### 4.3 生成 Cloudflare Origin Certificate

CF 控制台 → **SSL/TLS** → **Origin Server** → **Create Certificate**：

- Hostname：填 `proxy.<域名>`（比如 `proxy.qzz.io`）
- Validity：`15 years`
- 点 **Create**

复制生成的两段内容：
- `Certificate` 框内容（含 `-----BEGIN CERTIFICATE-----`）→ 存到 VPS `/etc/ssl/cf/cert.pem`
- `Private key` 框内容（含 `-----BEGIN PRIVATE KEY-----`）→ 存到 VPS `/etc/ssl/cf/key.pem`

在 VPS 上执行：

```bash
mkdir -p /etc/ssl/cf
nano /etc/ssl/cf/cert.pem    # 粘贴证书内容，Ctrl+O 保存，Ctrl+X 退出
nano /etc/ssl/cf/key.pem     # 粘贴私钥内容
chmod 644 /etc/ssl/cf/cert.pem
chmod 600 /etc/ssl/cf/key.pem
```

回到 3X-UI 面板，把入站重新编辑：
- **Certificate** 字段：粘贴 cert.pem 全部内容
- **Key** 字段：粘贴 key.pem 全部内容
- 保存

### 4.4 配置 Cloudflare 加密模式和 WebSocket

CF 控制台：

**SSL/TLS → Overview**：
- 加密模式选 **`完整 (严格)`**（不要选"灵活"，否则 CF 到源站不加密，xray 收不到 TLS 握手）

**Network**：
- **WebSockets** → **`On`**

### 4.5 在 Cloudflare 添加 DNS 记录

CF 控制台 → **DNS** → **Records** → **+ Add record**：

| 字段 | 值 |
|------|-----|
| Type | `A` |
| Name | `proxy`（子域名前缀，最终域名是 `proxy.<域名>`） |
| IPv4 address | `<VPS_IP>` |
| Proxy status | **`Proxied`（橙色云朵）** ← 必须选这个 |
| TTL | `Auto` |

保存后验证（Windows PowerShell）：

```powershell
nslookup proxy.<域名>
```

**期望返回 CF 的 IP**（`104.21.x.x` / `172.67.x.x` 等），**不是 VPS IP**。如果返回 VPS IP，说明橙色云朵没开。

### 4.6 验证：客户端能通过域名连代理

到此步 VPS 还在用 3X-UI 单独跑（监听 443 + TLS）。先在客户端验证代理能不能用。

**Clash Verge 临时配置**：

```yaml
proxies:
  - name: "rackvps-cf"
    type: vless
    server: proxy.<域名>
    port: 443
    uuid: <UUID>
    network: ws
    ws-opts:
      path: /ws
      headers:
        Host: proxy.<域名>
    tls: true
    servername: proxy.<域名>
    alpn:
      - h2
      - http/1.1

proxy-groups:
  - name: "PROXY"
    type: select
    proxies:
      - rackvps-cf
      - DIRECT

rules:
  - MATCH,PROXY
```

Clash Verge → Profiles → 粘贴上面 YAML → 启用 → 系统代理打开 → 浏览器开 Google 验证。

**通了之后继续下面步骤，加 nginx 反代做防探测。**

### 4.7 安装 nginx

VPS 上：

```bash
apt update && apt install -y nginx
```

> ⚠️ 注意是 `apt install` 不是 `install`（常见笔误）。

### 4.8 写假网站内容

```bash
mkdir -p /var/www/fake
cat > /var/www/fake/index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Notes</title>
    <style>
        body { font-family: -apple-system, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #333; }
        h1 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .post { margin: 20px 0; }
        .date { color: #999; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>My Notes</h1>
    <div class="post">
        <h2>Hello, world</h2>
        <p class="date">2026-01-15</p>
        <p>Just a personal blog. Nothing to see here.</p>
    </div>
    <div class="post">
        <h2>About</h2>
        <p>This is my personal site. Drop me a line if you want to chat.</p>
    </div>
</body>
</html>
EOF

cat > /var/www/fake/robots.txt <<'EOF'
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /
EOF
```

### 4.9 写 nginx 配置

```bash
cat > /etc/nginx/conf.d/proxy.conf <<'EOF'
# 默认 server：处理无 SNI / 主动探测请求（防御 GFW）
server {
    listen 443 ssl http2 default_server;
    server_name _;

    ssl_certificate     /etc/ssl/cf/cert.pem;
    ssl_certificate_key /etc/ssl/cf/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    root  /var/www/fake;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 真实代理：匹配 proxy.<域名>
server {
    listen 443 ssl http2;
    server_name proxy.<域名>;

    ssl_certificate     /etc/ssl/cf/cert.pem;
    ssl_certificate_key /etc/ssl/cf/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    root  /var/www/fake;
    index index.html;

    # WebSocket 路径 → xray
    location /ws {
        proxy_pass http://127.0.0.1:10000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 3600s;
    }

    # 默认：返回假网站
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTP → HTTPS 重定向
server {
    listen 80;
    server_name proxy.<域名>;
    return 301 https://$host$request_uri;
}

# 80 端口 default_server（防止端口扫描暴露）
server {
    listen 80 default_server;
    server_name _;
    root /var/www/fake;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 删掉 nginx 默认站（避免冲突）
rm -f /etc/nginx/sites-enabled/default

# 检查 + 启动
nginx -t
systemctl enable --now nginx
```

### 4.10 修改 3X-UI 入站（让出 443 端口给 nginx）

3X-UI 面板 → Inbounds → 编辑 `cf-vless` 入站：

| 字段 | 改为什么 |
|------|---------|
| Port | `443` → **`10000`** |
| Listen IP | 留空 → **`127.0.0.1`** |
| Security | `TLS` → **`None`**（关掉，TLS 由 nginx 处理）|
| 数字证书 | **清空** |

保存。

### 4.11 重启服务（顺序很重要）

```bash
x-ui restart           # 3X-UI 重启，xray 切到 127.0.0.1:10000
systemctl restart nginx # nginx 现在能抢到 443 了
```

> ⚠️ **顺序必须是先 `x-ui restart` 再 `systemctl restart nginx`**。否则 xray 还占着 443，nginx 启动会报 `bind() failed (98: Address already in use)`。

### 4.12 验证

```bash
# 1. 端口监听
ss -tlnp | grep -E ':80|:443|:10000'
# 期望：
#   nginx 在 *:80、*:443
#   xray 在 127.0.0.1:10000（必须是 127.0.0.1，不是 0.0.0.0）

# 2. 域名访问假网站
curl -sI https://proxy.<域名>/
# 期望：HTTP/2 200

# 3. 看假网站内容
curl -s https://proxy.<域名>/ | grep "My Notes"
# 期望：能找到 My Notes 字样
```

---

## 五、客户端配置（Clash Verge）

### 5.1 创建 Profile

Clash Verge → **Profiles** → **New Profile** → 选空白模板。

### 5.2 写入配置

```yaml
mixed-port: 7890
allow-lan: false
mode: rule
log-level: info

proxies:
  - name: "rackvps-cf"
    type: vless
    server: proxy.<域名>
    port: 443
    uuid: <UUID>
    network: ws
    ws-opts:
      path: /ws
      headers:
        Host: proxy.<域名>
    tls: true
    servername: proxy.<域名>
    alpn:
      - h2
      - http/1.1
    skip-cert-verify: false
    udp: true

proxy-groups:
  - name: "PROXY"
    type: select
    proxies:
      - rackvps-cf
      - DIRECT

rules:
  - GEOIP,LAN,DIRECT
  - GEOIP,CN,DIRECT
  - MATCH,PROXY
```

> 把 `<域名>` 和 `<UUID>` 替换成自己的。

### 5.3 启用代理

- 顶部 **Proxies** → `PROXY` 组 → 选 `rackvps-cf`
- 主界面打开 **System Proxy** 或 **TUN Mode**（TUN 更彻底）

### 5.4 验证代理生效

浏览器访问：

- <https://ip.sb> — 应显示美国 IP `104.223.xxx.xxx`
- <https://www.google.com> — 应能打开
- <https://ipinfo.io/json> — 应显示 `country: "US"`

或 PowerShell：

```powershell
curl.exe -s https://ifconfig.me
# 期望：104.223.xxx.xxx
```

---

## 六、故障排查

### 6.1 浏览器报 `HTTP 521`

CF 连不上 VPS。**在 VPS 上**：

```bash
ss -tlnp | grep 443
```

- 看不到任何 443 监听 → nginx 没起来 → `systemctl restart nginx`
- 看到 xray 在 443 → 3X-UI 入站没改 10000/127.0.0.1/None → 改完 `x-ui restart` 再 `systemctl restart nginx`

### 6.2 浏览器报 `HTTP 502`

nginx 起来了但连不上 xray：

```bash
ss -tlnp | grep 10000
```

看不到 `127.0.0.1:10000` → xray 没在 10000 监听 → 3X-UI 入站改没改好。

### 6.3 Clash Verge 节点显示 Timeout

按顺序检查：

1. **域名解析**：
   ```powershell
   nslookup proxy.<域名>
   ```
   必须是 CF IP，不能是 VPS IP。

2. **CF SSL 模式**：必须是 `完整 (严格)`，不能是 `灵活`。

3. **CF WebSockets**：必须是 `On`。

4. **UUID 是否对**：3X-UI 面板复制 UUID 重新填。

5. **路径是否对**：客户端 `/ws` 和 3X-UI `Path: /ws` 必须完全一致。

### 6.4 nginx 启动报 `bind() to 0.0.0.0:443 failed (98: Unknown error)`

443 端口被占。先确认 xray 没在 443：

```bash
ss -tlnp | grep 443
```

看到 xray → 3X-UI 入站改成 10000/127.0.0.1/None → `x-ui restart` → 再启 nginx。

### 6.5 假网站能访问但 `/ws` 报 400

nginx 转发到 xray 的配置出问题：

- 路径 `/ws` 必须跟 3X-UI 入站 `Path: /ws` 完全一致
- nginx 配置里 `Connection "upgrade"` 引号必须是英文双引号
- nginx 转发 HTTP/1.1 给 xray，xray 必须也是 WS 模式（不能是别的传输）

### 6.6 Windows PowerShell `curl` 用不了

PowerShell 的 `curl` 是 `Invoke-WebRequest` 的别名，参数不一样。**用真 curl**：

```powershell
curl.exe -sI https://proxy.<域名>/
curl.exe -s https://proxy.<域名>/ | findstr "My Notes"
```

或装 Git for Windows 自带 `curl.exe`。

### 6.7 改了 3X-UI 入站后代理掉了

3X-UI 入站**千万别改回 443/0.0.0.0/TLS**——nginx 就会因为端口冲突起不来。

合法改动：端口改 10001/10002...、路径改 /ws2 /ws3...，**Listen IP 永远 127.0.0.1，Security 永远 None**。

---

## 七、日常维护

### 7.1 看代理流量

VPS 上：

```bash
tail -f /var/log/nginx/access.log | grep /ws
```

持续输出 `GET /ws HTTP/1.1 101 ...` 的日志。**`101` = WebSocket 升级成功 = 代理流量**。

### 7.2 改假网站

```bash
nano /var/www/fake/index.html
systemctl reload nginx
```

### 7.3 加新节点

1. 3X-UI 创建新入站：端口 `10001`，Listen `127.0.0.1`，Security `None`，Path `/ws2`
2. nginx 加新转发：
   ```nginx
   location /ws2 {
       proxy_pass http://127.0.0.1:10001;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_read_timeout 3600s;
   }
   ```
3. `systemctl reload nginx`
4. 客户端加节点，path 填 `/ws2`

### 7.4 重启服务

```bash
systemctl restart nginx
x-ui restart
```

### 7.5 防火墙

UFW 通常 inactive 即可，需要开：

```bash
ufw allow 443/tcp
ufw allow <3X-UI面板端口>/tcp    # 比如 2053
```

---

## 八、关键点回顾

| 关键点 | 错误做法 | 正确做法 |
|--------|---------|---------|
| CF DNS 记录 | 灰色云朵（DNS only） | **橙色云朵（Proxied）** |
| CF SSL 模式 | 灵活 | **完整 (严格)** |
| 3X-UI 入站端口 | 443 | **10000 + Listen 127.0.0.1 + Security None** |
| CF Origin Cert | 用 Let's Encrypt | **用 CF Origin Cert（15 年）** |
| nginx 启动顺序 | 先启 nginx 再改 3X-UI | **先 `x-ui restart`，再 `systemctl restart nginx`** |
| nginx fallback 路径 | 留空 Path | **Path `/` + Dest `127.0.0.1:8080`** （用方案 A 时）|
| Windows curl | `curl -sI URL` | **`curl.exe -sI URL`**（带 .exe 后缀）|

---

## 九、最终目录结构

```
VPS 文件结构：
/etc/ssl/cf/
├── cert.pem              # CF Origin 证书
└── key.pem               # CF Origin 私钥
/var/www/fake/
├── index.html            # 假博客首页
└── robots.txt            # 防爬虫提示
/etc/nginx/conf.d/
└── proxy.conf            # nginx 反代配置
/usr/local/x-ui/          # 3X-UI 安装目录
└── bin/config.json       # 3X-UI 生成的 xray 配置
```

---

## 十、写在最后

整套方案的核心思路：

1. **不要直连 VPS IP**（被 GFW/ISP 干扰）
2. **所有流量套上 Cloudflare CDN**（GFW 不敢全面封 CF）
3. **VPS 上不要让 xray 直接接 TLS**（主动探测会暴露 xray）
4. **用 nginx 终结 TLS + 转发 WS**（探测时看到的是普通博客）
5. **3X-UI 监听 127.0.0.1 的非标准端口**（永远不暴露到公网）

这样就实现了：
- 国内移动宽带可以科学上网 ✅
- 国外网络也照样能用 ✅
- GFW 主动探测看到的是博客 ✅
- VPS IP 永远不会直接暴露 ✅
- 日常维护只需要改 3X-UI 入站和 nginx 配置 ✅

---

## 常见问题 FAQ

### 为什么 SSH 连不上 VPS，但 ping 是通的？

这是 GFW/移动运营商对 SSH 流量的**主动识别与阻断**。GFW 维护了常用协议的特征库，SSH（22/443 端口）的握手包有明显特征。一旦匹配，直接 RST 断开连接。`ping` 用的是 ICMP 协议，不在阻断范围内，所以会通。

**解决方法**：不要直连 VPS IP，让所有流量走 Cloudflare CDN，GFW 看不到真实 IP。

### Cloudflare 免费版够用吗？

**够用**。本方案用的就是 CF 免费版：

- DNS 解析：免费
- CDN 加速：免费
- Origin Certificate：免费 15 年有效期
- 不限流量（公平使用）

唯一限制：免费版**不支持 Spectrum（TCP/UDP 转发）**，但 VLESS + WebSocket 走 HTTPS 443 端口完全够用。

### 一定要用 RackNerd VPS 吗？其他 VPS 行不行？

**可以**。本方案对 VPS 厂商没有要求，只要满足：
- 系统：Ubuntu 20.04+ / Debian 11+ / CentOS 7+
- 能 SSH 登录（用手机 4G 热点或机场中转）
- IP 没被墙（可以用 `ping.chinaz.com` 测一下）

**推荐 VPS 厂商**（按性价比）：RackNerd、CloudCone、BandwagonHost（搬瓦工）、HostDare、Vultr（按小时计费）。

### 为什么用 VLESS 而不是 VMess 或 Trojan？

| 协议 | 特点 | 推荐度 |
|------|------|------|
| **VLESS** | 新一代轻量协议，无加密依赖 TLS | ⭐⭐⭐⭐⭐（推荐） |
| VMess | 老牌协议，自带加密但效率低 | ⭐⭐⭐ |
| Trojan | 伪装成 HTTPS，但握手特征明显 | ⭐⭐ |
| Shadowsocks | 已被 GFW 部分识别 | ⭐⭐ |

**VLESS + WebSocket + TLS** 是目前最难被 GFW 识别的组合，因为流量完全包裹在标准 HTTPS 中。

### nginx 假网站有什么作用？

**防 GFW 主动探测**。GFW 会对 Cloudflare CDN 后面的 IP 发起 HTTPS 探测请求：
- 如果 443 端口返回的是 xray 的特征 → 标记为代理，封 IP
- 如果 443 端口返回的是普通博客 → 当作正常网站放行

nginx 假网站就是让"非代理用户"访问时看到的是博客，真实代理用户访问 `/ws` 路径才走 xray。

### 3X-UI 面板要不要暴露到公网？

**绝对不要**。3X-UI 面板必须：
- 监听 `127.0.0.1`（仅本机访问）
- 端口改非标准（如 `2053`、`31456`）
- 设置强密码 + 改默认用户名 `admin`

访问面板通过 SSH 端口转发：`ssh -L 2053:127.0.0.1:2053 root@VPS_IP`，然后浏览器开 `http://127.0.0.1:2053`。

### 这套方案会被封吗？

**大概率不会长期稳定，但能用很久**。G网 不断升级，本质是一场猫鼠游戏。本方案的优势：
- VPS IP 永远不暴露 → 封 IP 难度极大
- 网站防探测 → G网 看不到 xray 特征
- Cloudflare CDN 缓冲 → 真实流量被分散到 CF 全球节点

**降低风险的额外建议**：
- 不要在 VPS 上做违规内容
- 节点不要分享给太多人
- 定期更换 UUID 和路径

### 一个域名能部署多个节点吗？

**可以**。在 Cloudflare DNS 里加多个 A 记录（如 `proxy1`、`proxy2`、`proxy3`），都指向同一 VPS IP。客户端可以配置多个节点做负载均衡 / 故障转移。


- 本文只做技术方案，不涉及任何法律问题。请在法律范围内使用。

**完。**
