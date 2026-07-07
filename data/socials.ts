// data/socials.ts
// 全网社交账号中心 - 统一管理个人 IP / 品牌 / 店铺的所有链接
// 使用说明:
//   - status: 'active' 已配置,渲染为可点击卡片
//   - status: 'pending' 待添加,渲染为灰色虚线卡片(用户后续填入 url 即可激活)
//   - 新增平台:在对应分组下追加对象即可,无需改页面
//   - 想删除某条:直接从数组里删
//   - 想标记某条为已添加:把 status 改为 'active',并填入 url / username

export type SocialStatus = 'active' | 'pending'
export type SocialRegion = 'china' | 'global'
export type SocialType = 'personal' | 'brand' | 'store'

export interface SocialLink {
  platform: string
  url: string
  username: string
  status: SocialStatus
  note?: string
}

export interface SocialGroup {
  title: string
  type: SocialType
  region: SocialRegion
  description: string
  links: SocialLink[]
}

export const socialGroups: SocialGroup[] = [
  // ============ 个人 IP 账号 ============
  {
    title: '个人 IP · 国内',
    type: 'personal',
    region: 'china',
    description: '个人创作与读者聚集地',
    links: [
      { platform: '微信公众号', url: '', username: '待添加', status: 'pending' },
      { platform: '微信视频号', url: '', username: '待添加', status: 'pending' },
      { platform: '微博', url: '', username: '待添加', status: 'pending' },
      { platform: '知乎', url: '', username: '待添加', status: 'pending' },
      { platform: 'B 站', url: '', username: '待添加', status: 'pending' },
      { platform: '小红书', url: '', username: '待添加', status: 'pending' },
      { platform: '抖音', url: '', username: '待添加', status: 'pending' },
      { platform: '掘金', url: '', username: '待添加', status: 'pending' },
      { platform: 'CSDN', url: '', username: '待添加', status: 'pending' },
      { platform: '简书', url: '', username: '待添加', status: 'pending' },
      { platform: '即刻', url: '', username: '待添加', status: 'pending' },
    ],
  },
  {
    title: '个人 IP · 海外',
    type: 'personal',
    region: 'global',
    description: '英文圈个人创作与开发',
    links: [
      { platform: 'GitHub', url: 'https://github.com/panic-3170', username: '@panic-3170', status: 'active' },
      { platform: 'X (Twitter)', url: 'https://x.com/theruoshui3000', username: '@theruoshui3000', status: 'active' },
      { platform: 'Instagram', url: '', username: '待添加', status: 'pending' },
      { platform: 'YouTube', url: '', username: '待添加', status: 'pending' },
      { platform: 'TikTok', url: '', username: '待添加', status: 'pending' },
      { platform: 'LinkedIn', url: '', username: '待添加', status: 'pending' },
      { platform: 'Threads', url: '', username: '待添加', status: 'pending' },
      { platform: 'Mastodon', url: '', username: '待添加', status: 'pending' },
      { platform: 'Medium', url: '', username: '待添加', status: 'pending' },
      { platform: 'Dev.to', url: '', username: '待添加', status: 'pending' },
      { platform: 'Hashnode', url: '', username: '待添加', status: 'pending' },
      { platform: 'Product Hunt', url: '', username: '待添加', status: 'pending' },
    ],
  },

  // ============ 品牌 / 店铺账号 ============
  {
    title: '品牌账号 · 国内',
    type: 'brand',
    region: 'china',
    description: '品牌官方账号与产品发布',
    links: [
      { platform: '微信公众号', url: '', username: '待添加', status: 'pending' },
      { platform: '微信视频号', url: '', username: '待添加', status: 'pending' },
      { platform: '微博', url: '', username: '待添加', status: 'pending' },
      { platform: '抖音', url: '', username: '待添加', status: 'pending' },
      { platform: '小红书', url: '', username: '待添加', status: 'pending' },
      { platform: 'B 站', url: '', username: '待添加', status: 'pending' },
      { platform: '快手', url: '', username: '待添加', status: 'pending' },
    ],
  },
  {
    title: '品牌账号 · 海外',
    type: 'brand',
    region: 'global',
    description: '海外品牌账号与产品发布',
    links: [
      { platform: 'Instagram', url: '', username: '待添加', status: 'pending' },
      { platform: 'TikTok', url: '', username: '待添加', status: 'pending' },
      { platform: 'YouTube', url: '', username: '待添加', status: 'pending' },
      { platform: 'Facebook', url: '', username: '待添加', status: 'pending' },
      { platform: 'Pinterest', url: '', username: '待添加', status: 'pending' },
      { platform: 'X (Twitter)', url: '', username: '待添加', status: 'pending' },
      { platform: 'Reddit', url: '', username: '待添加', status: 'pending' },
    ],
  },

  // ============ 店铺链接(直接购买 / 访问) ============
  {
    title: '店铺 · 国内',
    type: 'store',
    region: 'china',
    description: '国内电商平台店铺',
    links: [
      { platform: '淘宝', url: '', username: '待添加', status: 'pending' },
      { platform: '天猫', url: '', username: '待添加', status: 'pending' },
      { platform: '京东', url: '', username: '待添加', status: 'pending' },
      { platform: '拼多多', url: '', username: '待添加', status: 'pending' },
      { platform: '1688', url: '', username: '待添加', status: 'pending' },
      { platform: '闲鱼', url: '', username: '待添加', status: 'pending' },
      { platform: '得物', url: '', username: '待添加', status: 'pending' },
    ],
  },
  {
    title: '店铺 · 海外',
    type: 'store',
    region: 'global',
    description: '海外电商 / DTC 独立站',
    links: [
      { platform: 'Amazon', url: '', username: '待添加', status: 'pending' },
      { platform: 'Shopify 独立站', url: '', username: '待添加', status: 'pending' },
      { platform: 'Etsy', url: '', username: '待添加', status: 'pending' },
      { platform: 'eBay', url: '', username: '待添加', status: 'pending' },
      { platform: 'TikTok Shop', url: '', username: '待添加', status: 'pending' },
      { platform: 'Temu', url: '', username: '待添加', status: 'pending' },
      { platform: '独立站', url: '', username: '待添加', status: 'pending' },
    ],
  },
]
