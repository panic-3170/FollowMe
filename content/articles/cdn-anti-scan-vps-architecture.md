---
id: cdn-anti-scan-vps-architecture
title: 海外 VPS 的 CDN 加速与网站防探测架构（Cloudflare + nginx 反代 + WebSocket 后端完整方案）
date: 2026-06-15
category: 网络工具
readTime: 10 分钟
tags:
  - Cloudflare
  - nginx
  - 反向代理
  - WebSocket
  - CDN 加速
  - 网站防探测
  - VPS 安全
  - 端口扫描
  - 指纹识别
  - Origin 证书
---

# 海外 VPS 的 CDN 加速与网站防探测架构（Cloudflare + nginx 反代 + WebSocket 后端完整方案）

> **核心结论**：海外 VPS 一旦暴露真实 IP，会被全球的端口扫描器（Shodan、Censys、ZoomEye）持续探测，443 端口上的服务指纹会被识别收录。**正确做法是把所有流量套上 Cloudflare CDN 隐藏真实 IP，再用 nginx 反向代理做"防探测"——外部扫描器看到的是普通博客 / 静态站点，真正的业务服务（WebSocket / API）只跑在 127.0.0.1 上、永远不对外暴露**。本文给出一套从零到一的完整部署方案，**适用所有需要保护 VPS 真实 IP 的场景**（个人项目、SaaS、API 服务、实时通信后端等）。

**3 分钟摘要**：
- VPS 真实 IP 暴露后，会被扫描器 24/7 探测，443 端口指纹泄露
- 用 Cloudflare CDN **隐藏真实 VPS IP**（免费方案）
- 真实 WebSocket / API 服务跑在 `127.0.0.1` 的非标准端口，**永不对外暴露**
- nginx 终结 TLS + 转发 WebSocket；非业务路径返回假博客
- 外部扫描器看到的是 "一个普通的 HTTPS 博客"，无法识别真实服务

**实测环境**：RackNerd VPS（Ubuntu 22.04）+ Node.js（`ws` 库） + nginx 1.18 + Cloudflare 免费版
**适用场景**：海外 VPS 上跑 WebSocket 后端 / API 服务 / 实时通信，需要隐藏真实 IP、防止指纹探测
**最终效果**：VPS 真实 IP 永不暴露，对外只有一个 Cloudflare CDN 节点，扫描器看到的 443 端口是普通博客

---

## 一、问题背景

从 RackNerd 买了一台美国 VPS，IP `104.223.xxx.xxx`，准备在上面跑一个 WebSocket 实时通知服务。

**异常表现**：
- 服务刚上线，端口扫描器（Censys / Shodan）几小时内就把 443 端口的指纹收录了
- 收到一堆来源不明的 HTTPS 探测请求，识别出 "非标准 WebSocket 服务"
- 真实 IP 直接暴露在 DNS A 记录里 → 任何人都能绕过 CDN 直连 VPS
- VPS 频繁收到自动化探测流量，**服务指纹被识别 → 容易被针对性攻击或封禁**

**结论**：VPS 真实 IP + 业务端口一旦直接暴露在全球互联网上，**被扫描是必然的、被指纹识别是早晚的**。

**正确做法**：**让所有流量走 Cloudflare CDN，真实 IP 不再出现在 DNS 里**；**业务服务只跑在 127.0.0.1 上**，对外不可见；**nginx 在公网 443 终结 TLS、转发到内部服务**，同时给扫描器看一个假博客。

---

## 二、最终架构

```
┌────────────────────────────────────────┐
│  客户端（浏览器 / 移动 App）            │
│   业务域名: app.example.com            │
│   访问 /api 或 /ws 走 WebSocket        │
└─────────────┬──────────────────────────┘
              │  TLS 443（看起来是普通 HTTPS）
              ▼
┌────────────────────────────────────────┐
│  Cloudflare Edge（全球 CDN 节点）       │
│   - 隐藏真实 VPS IP                     │
│   - 全球边缘加速                        │
│   - 缓解端口扫描 / 指纹识别             │
└─────────────┬──────────────────────────┘
              │  TLS 443（CF 回源）
              ▼
┌────────────────────────────────────────┐
│  VPS nginx (0.0.0.0:443)               │
│   路径 /ws   → 127.0.0.1:10000 → 后端  │
│   其他路径  → /var/www/site (假博客)    │
└─────────────┬──────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  Node.js WebSocket 后端                 │
│   监听 127.0.0.1:10000                  │
│   永不对外暴露                           │
└────────────────────────────────────────┘
```

**三层防护**：
1. **CF CDN** — 客户端只看到 CF 节点，**永远看不到 VPS IP**
2. **nginx 反代** — 端口扫描器看到的是普通博客，**看不到真实业务服务**
3. **127.0.0.1 监听** — 业务服务只对内网可见，**公网完全无法直连**

---

## 三、前置准备

| 项目 | 说明 |
|------|------|
| 域名 | 自己的域名（已在 Cloudflare 接入，能改 NS） |
| VPS | 任意海外 VPS（本文用 RackNerd Ubuntu 22.04） |
| Node.js 18+ | VPS 上已装好（用于跑 WebSocket 后端） |
| nginx | VPS 上已装好（TLS 终结 + 反向代理） |

**本文用到的占位符**（实际配置时替换成自己的）：

| 占位符 | 含义 | 示例 |
|--------|------|------|
| `<域名>` | CF 上接入的域名 | `qzz.io` |
| `app.<域名>` | 业务子域 | `app.qzz.io` |
| `<VPS_IP>` | VPS 真实 IP | `104.223.xxx.xxx` |
| `<WS_PORT>` | 内部 WebSocket 端口 | `10000` |

---

## 四、VPS 端配置

### 4.1 部署 WebSocket 后端（监听 127.0.0.1）

**用一个最简的 Node.js WebSocket echo 服务作为示例**（生产环境换成你的真实业务服务）：

```bash
mkdir -p /opt/wsapp && cd /opt/wsapp
cat > package.json <<'EOF'
{
  "name": "wsapp",
  "version": "1.0.0",
  "type": "module",
  "dependencies": { "ws": "^8.18.0" }
}
EOF
npm install
```

```bash
cat > /opt/wsapp/server.mjs <<'EOF'
import { WebSocketServer } from 'ws'

// 关键:只监听 127.0.0.1,公网完全无法直连
const wss = new WebSocketServer({ host: '127.0.0.1', port: 10000 })

wss.on('connection', (ws) => {
  console.log('client connected')
  ws.on('message', (data) => {
    // 业务逻辑:这里换成你的真实处理
    ws.send(`echo: ${data.toString()}`)
  })
  ws.on('close', () => console.log('client disconnected'))
})

console.log('WebSocket server running on ws://127.0.0.1:10000')
EOF
```

**用 systemd 管理**：

```bash
cat > /etc/systemd/system/wsapp.service <<'EOF'
[Unit]
Description=WebSocket Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/wsapp
ExecStart=/usr/bin/node /opt/wsapp/server.mjs
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now wsapp
systemctl status wsapp
```

**验证**：

```bash
ss -tlnp | grep 10000
# 期望看到:127.0.0.1:10000  (必须是 127.0.0.1,不是 0.0.0.0)
```

### 4.2 生成 Cloudflare Origin Certificate

CF 控制台 → **SSL/TLS** → **Origin Server** → **Create Certificate**：

- Hostname：填 `app.<域名>`（比如 `app.qzz.io`）
- Validity：`15 years`
- 点 **Create**

复制生成的两段内容：
- `Certificate` 框内容（含 `-----BEGIN CERTIFICATE-----`）→ 存到 VPS `/etc/ssl/cf/cert.pem`
- `Private key` 框内容（含 `-----BEGIN PRIVATE KEY-----`）→ 存到 VPS `/etc/ssl/cf/key.pem`

在 VPS 上执行：

```bash
mkdir -p /etc/ssl/cf
nano /etc/ssl/cf/cert.pem    # 粘贴证书内容,Ctrl+O 保存,Ctrl+X 退出
nano /etc/ssl/cf/key.pem     # 粘贴私钥内容
chmod 644 /etc/ssl/cf/cert.pem
chmod 600 /etc/ssl/cf/key.pem
```

### 4.3 配置 Cloudflare 加密模式和 WebSocket

CF 控制台：

**SSL/TLS → Overview**：
- 加密模式选 **`完整 (严格)`**（不要选"灵活"，否则 CF 到源站不加密，nginx 收不到 TLS 握手）

**Network**：
- **WebSockets** → **`On`**

### 4.4 在 Cloudflare 添加 DNS 记录

CF 控制台 → **DNS** → **Records** → **+ Add record**：

| 字段 | 值 |
|------|-----|
| Type | `A` |
| Name | `app`（子域名前缀，最终域名是 `app.<域名>`） |
| IPv4 address | `<VPS_IP>` |
| Proxy status | **`Proxied`（橙色云朵）** ← 必须选这个 |
| TTL | `Auto` |

保存后验证（Windows PowerShell）：

```powershell
nslookup app.<域名>
```

**期望返回 CF 的 IP**（`104.21.x.x` / `172.67.x.x` 等），**不是 VPS IP**。如果返回 VPS IP，说明橙色云朵没开。

> ⚠️ **这一步是关键**：DNS 显示 CF IP 而不是 VPS IP，意味着端口扫描器通过 DNS 查不到真实 VPS，**真实 IP 被有效隐藏**。

### 4.5 验证：先单独测 CF → VPS → 后端链路

在写 nginx 之前，先确认 CF → VPS → 10000 端口的链路通：

**临时直接用 nginx listen 10000 转发测试**（如果不想折腾，可以跳过这一步直接到 4.6）：

```bash
# 用 curl 从 VPS 内部测试 WebSocket 后端
curl.exe --include \
  --no-buffer \
  --header "Connection: Upgrade" \
  --header "Upgrade: websocket" \
  --header "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  --header "Sec-WebSocket-Version: 13" \
  http://127.0.0.1:10000/
# 期望:HTTP/1.1 101 Switching Protocols
```

### 4.6 安装 nginx

VPS 上（如果还没装）：

```bash
apt update && apt install -y nginx
```

> ⚠️ 注意是 `apt install` 不是 `install`（常见笔误）。

### 4.7 写"防探测"展示站

**关键思路**：让端口扫描器访问你的域名时，看到的是一个**普通博客**——而不是 WebSocket 服务。

```bash
mkdir -p /var/www/site
cat > /var/www/site/index.html <<'EOF'
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

cat > /var/www/site/robots.txt <<'EOF'
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /
EOF
```

### 4.8 写 nginx 配置

```bash
cat > /etc/nginx/conf.d/app.conf <<'EOF'
# 默认 server:处理无 SNI / 端口扫描请求(防止指纹识别)
server {
    listen 443 ssl http2 default_server;
    server_name _;

    ssl_certificate     /etc/ssl/cf/cert.pem;
    ssl_certificate_key /etc/ssl/cf/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    root  /var/www/site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 真实业务:匹配 app.<域名>
server {
    listen 443 ssl http2;
    server_name app.<域名>;

    ssl_certificate     /etc/ssl/cf/cert.pem;
    ssl_certificate_key /etc/ssl/cf/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    root  /var/www/site;
    index index.html;

    # WebSocket 路径 → 后端服务
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

    # 默认:返回防探测展示站
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTP → HTTPS 重定向
server {
    listen 80;
    server_name app.<域名>;
    return 301 https://$host$request_uri;
}

# 80 端口 default_server(防止端口扫描暴露)
server {
    listen 80 default_server;
    server_name _;
    root /var/www/site;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 删掉 nginx 默认站(避免冲突)
rm -f /etc/nginx/sites-enabled/default

# 检查 + 启动
nginx -t
systemctl enable --now nginx
```

### 4.9 验证

```bash
# 1. 端口监听
ss -tlnp | grep -E ':80|:443|:10000'
# 期望:
#   nginx 在 *:80、*:443
#   wsapp 在 127.0.0.1:10000(必须是 127.0.0.1,不是 0.0.0.0)

# 2. 域名访问展示站
curl.exe -sI https://app.<域名>/
# 期望:HTTP/2 200

# 3. 看展示站内容
curl.exe -s https://app.<域名>/ | findstr "My Notes"
# 期望:能找到 My Notes 字样
```

---

## 五、客户端连接示例

### 5.1 浏览器 WebSocket 客户端

```html
<!DOCTYPE html>
<html>
<body>
  <script>
    const ws = new WebSocket('wss://app.<域名>/ws')
    ws.onopen = () => {
      console.log('connected')
      ws.send('hello from browser')
    }
    ws.onmessage = (e) => console.log('received:', e.data)
    ws.onerror = (e) => console.error('error:', e)
  </script>
</body>
</html>
```

### 5.2 Node.js WebSocket 客户端

```javascript
import WebSocket from 'ws'

const ws = new WebSocket('wss://app.<域名>/ws')

ws.on('open', () => {
  console.log('connected')
  ws.send('hello from node')
})

ws.on('message', (data) => {
  console.log('received:', data.toString())
})
```

### 5.3 验证全链路

```bash
# 用 websocat 测(推荐)
npm install -g websocat
websocat wss://app.<域名>/ws
# 试着发:hello world
# 期望:收到 echo: hello world
```

浏览器访问：
- `https://app.<域名>/` → 应该看到展示站
- `https://app.<域名>/ws` → WebSocket 连接成功

---

## 六、故障排查

### 6.1 浏览器报 `HTTP 521`

CF 连不上 VPS。**在 VPS 上**：

```bash
ss -tlnp | grep 443
```

- 看不到任何 443 监听 → nginx 没起来 → `systemctl restart nginx`
- 看到其他服务在 443 → 杀掉那个服务后重启 nginx

### 6.2 浏览器报 `HTTP 502`

nginx 起来了但连不上后端：

```bash
ss -tlnp | grep 10000
```

看不到 `127.0.0.1:10000` → 后端没在 10000 监听 → `systemctl status wsapp` 看日志

### 6.3 WebSocket 连接显示 Timeout

按顺序检查：

1. **域名解析**：
   ```powershell
   nslookup app.<域名>
   ```
   必须是 CF IP，不能是 VPS IP。

2. **CF SSL 模式**：必须是 `完整 (严格)`，不能是 `灵活`。

3. **CF WebSockets**：必须是 `On`。

4. **nginx 配置**：
   ```bash
   nginx -t
   ```
   配置语法必须通过。

5. **路径是否对**：客户端 `/ws` 和 nginx `location /ws` 必须完全一致。

### 6.4 nginx 启动报 `bind() to 0.0.0.0:443 failed (98: Unknown error)`

443 端口被占。先确认没有其他服务在 443：

```bash
ss -tlnp | grep 443
```

看到其他服务 → 杀掉该服务 → `systemctl restart nginx`

### 6.5 展示站能访问但 `/ws` 报 400

nginx 转发到后端的配置出问题：

- 路径 `/ws` 必须跟 nginx `location /ws` 完全一致
- nginx 配置里 `Connection "upgrade"` 引号必须是英文双引号
- nginx 转发 HTTP/1.1 给后端，后端必须支持 WebSocket 协议升级

### 6.6 Windows PowerShell `curl` 用不了

PowerShell 的 `curl` 是 `Invoke-WebRequest` 的别名，参数不一样。**用真 curl**：

```powershell
curl.exe -sI https://app.<域名>/
curl.exe -s https://app.<域名>/ | findstr "My Notes"
```

或装 Git for Windows 自带 `curl.exe`。

### 6.7 后端服务意外停止

`systemd` 配置了 `Restart=always`，服务崩溃会自动重启。手动重启：

```bash
systemctl restart wsapp
journalctl -u wsapp -f    # 看实时日志
```

---

## 七、日常维护

### 7.1 看 WebSocket 流量

VPS 上：

```bash
tail -f /var/log/nginx/access.log | findstr /ws
```

持续输出 `GET /ws HTTP/1.1 101 ...` 的日志。**`101` = WebSocket 升级成功**。

### 7.2 改展示站内容

```bash
nano /var/www/site/index.html
systemctl reload nginx
```

### 7.3 加新 WebSocket 服务

1. 部署新后端：端口 `10001`，监听 `127.0.0.1`
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
4. 客户端连接 `wss://app.<域名>/ws2`

### 7.4 重启服务

```bash
systemctl restart nginx
systemctl restart wsapp
```

### 7.5 防火墙

UFW 通常 inactive 即可，需要开：

```bash
ufw allow 443/tcp
```

> **不需要**开 10000 端口的对外规则——后端只在 127.0.0.1 监听，公网访问会被内核直接拒绝。

---

## 八、关键点回顾

| 关键点 | 错误做法 | 正确做法 |
|---|---|---|
| CF DNS 记录 | 灰色云朵（DNS only） | **橙色云朵（Proxied）** |
| CF SSL 模式 | 灵活 | **完整 (严格)** |
| 后端监听地址 | `0.0.0.0:10000` | **`127.0.0.1:10000`**（永远不对外） |
| CF Origin Cert | 用 Let's Encrypt | **用 CF Origin Cert（15 年）** |
| 真实 IP 暴露 | DNS A 记录直接指向 VPS | **必须走 CF Proxied 隐藏 IP** |
| nginx 公网代理路径 | 留空 Path | **`/ws` 走内部服务，`/` 走展示站** |
| Windows curl | `curl -sI URL` | **`curl.exe -sI URL`**（带 .exe 后缀）|
| 防火墙 | 开放 10000 端口 | **不开放 10000，后端只在 127.0.0.1** |

---

## 九、最终目录结构

```
VPS 文件结构:
/etc/ssl/cf/
├── cert.pem              # CF Origin 证书
└── key.pem               # CF Origin 私钥
/var/www/site/
├── index.html            # 防探测展示站
└── robots.txt
/etc/nginx/conf.d/
└── app.conf              # nginx 反代配置
/opt/wsapp/
├── package.json          # Node.js 依赖
└── server.mjs            # WebSocket 后端服务
/etc/systemd/system/
└── wsapp.service         # systemd 服务管理
```

---

## 十、写在最后

整套方案的核心思路：

1. **永远不要直连 VPS IP**（被扫描器收录、指纹识别、被定向攻击是必然的）
2. **所有公网流量套上 Cloudflare CDN**（隐藏 IP + 全球加速）
3. **业务服务只跑在 127.0.0.1**（公网完全不可达，攻击者即便知道 VPS IP 也连不到）
4. **nginx 终结 TLS + 转发到内部**（端口扫描器看到的是静态博客）
5. **展示站 + 业务服务并行**（同一域名不同路径，让流量看起来"正常"）

这样就实现了：
- VPS 真实 IP 永不暴露 ✅
- 全球任何地区用户访问都很快（CDN 加速）✅
- 端口扫描器看到的 443 端口是普通博客 ✅
- 业务服务（WebSocket / API）只在内部运行 ✅
- 日常维护只需要改 nginx + 重启后端服务 ✅

---

## 常见问题 FAQ

### 为什么 VPS 一上线就被扫描？

VPS 的 IP 段通常被**商业扫描器**（Shodan、Censys、ZoomEye、BinaryEdge）**全网段持续扫描**。新分配的 IP 上线后**几小时内**就会被收录到这些搜索引擎的数据库。**这不是有人针对你，是自动化的全网扫描**。

**解决方法**：让真实 IP 不出现在 DNS 里（CF Proxied 模式），扫描器查不到 IP，就无从扫描。

### Cloudflare 免费版够用吗？

**够用**。本方案用的就是 CF 免费版：

- DNS 解析：免费
- CDN 加速：免费（全球 300+ 节点）
- Origin Certificate：免费 15 年有效期
- 不限流量（公平使用政策）

唯一限制：免费版**不支持 Spectrum（TCP/UDP 转发）**，但 WebSocket 走 HTTPS 443 端口完全够用。

### 一定要用 RackNerd VPS 吗？其他 VPS 行不行？

**可以**。本方案对 VPS 厂商没有要求，只要满足：

- 系统：Ubuntu 20.04+ / Debian 11+ / CentOS 7+
- 能 SSH 登录
- 公网带宽 ≥ 1Mbps

**推荐 VPS 厂商**（按性价比）：RackNerd、CloudCone、BandwagonHost（搬瓦工）、HostDare、Vultr（按小时计费）。

### nginx "防探测"展示站有什么作用？

**防指纹识别**。全球端口扫描器会对 Cloudflare CDN 后面的 IP 发起 HTTPS 探测请求：

- 如果 443 端口返回的是 **WebSocket 服务特征** → 标记为"可疑服务"，被收录到公开数据库
- 如果 443 端口返回的是 **普通博客 / 静态站** → 当作正常网站，不被关注

nginx 展示站就是让"非业务访问者"看到的是博客，业务访问者访问 `/ws` 路径才走内部服务。**和正常网站无差别，扫描器无法识别**。

### 业务面板要不要暴露到公网？

**绝对不要**。任何管理面板（数据库管理、监控、运维工具）必须：

- 监听 `127.0.0.1`（仅本机访问）
- 端口改非标准（如 `2053`、`31456`）
- 设置强密码 + 改默认用户名

通过 SSH 端口转发访问：`ssh -L 2053:127.0.0.1:2053 root@VPS_IP`，然后浏览器开 `http://127.0.0.1:2053`。

### 这套架构安全吗？

**对常见威胁（端口扫描、指纹识别、IP 暴露、DDoS 基础防护）非常有效**：

- VPS IP 永远不暴露 → 扫描难度极大
- 展示站防探测 → 业务指纹不泄露
- Cloudflare CDN 缓冲 → 真实流量被分散到 CF 全球节点
- 业务服务 127.0.0.1 监听 → 即便知道 IP 也连不到

**降低风险的额外建议**：
- 在 VPS 上做合规业务
- 服务不要对外大量分享
- 定期轮换 Origin 证书和 WebSocket 路径

### 一个域名能部署多个服务吗？

**可以**。在 Cloudflare DNS 里加多个 A 记录（如 `app1`、`app2`、`app3`），都指向同一 VPS IP（都走 Proxied）。每个子域配不同 nginx `server_name`，分别反向代理到不同的内部端口：

- `app1.<域名>` → `127.0.0.1:10000`
- `app2.<域名>` → `127.0.0.1:10001`
- `app3.<域名>` → `127.0.0.1:10002`

每个子域独立管理，互不影响。

### Origin 证书和 Let's Encrypt 有什么区别？

| 维度 | Let's Encrypt | CF Origin Cert |
|---|---|---|
| 签发方 | Let's Encrypt CA | Cloudflare CA |
| 有效期 | 90 天 | **15 年** |
| 自动续签 | ✅ | ❌（但 15 年几乎等于永久） |
| 验证方式 | 公网验证 | Cloudflare 内部验证 |
| 浏览器访问 | ✅ | ❌（仅 CF 回源用） |

**本场景必须用 CF Origin Cert**：浏览器访问经过 CF CF，CF 验证 Origin 证书即可，不需要公网信任的 CA 证书。

### 如何监控整个架构的健康度？

```bash
# 1. 看 CF → VPS 链路
systemctl status nginx

# 2. 看后端服务
systemctl status wsapp
journalctl -u wsapp --since "1 hour ago"

# 3. 看 WebSocket 流量
tail -f /var/log/nginx/access.log | findstr /ws

# 4. 看 443 端口
ss -tlnp | grep 443

# 5. 看后端端口
ss -tlnp | grep 10000
```

进阶可以用 Prometheus + Grafana 做监控大盘，但小项目上面这些命令够用。

---

> 本文只做技术方案分享，所有配置均为公开的 Cloudflare + nginx 标准用法。请在合法范围内使用，部署合规业务。
