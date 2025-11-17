import type { Social } from '~/lib/type'
import pkg from '../../package.json'

/**
 * @description: 底部备案
 */
export const FooterRecord: Social[] = [
  {
    icon: 'icp.png',
    url: 'https://beian.miit.gov.cn/#/Integrated/index',
    tip: '粤ICP备2023007649号-3'
  },
  {
    icon: 'beian.png',
    url: 'https://beian.mps.gov.cn/#/query/webSearch',
    tip: '粤公网安备44030002003295号'
  }
]

/**
 * @description: 社交图标
 */
export const FooterSocial: Social[] = [
  {
    icon: 'ri:bar-chart-2-line',
    url: 'https://um.baiwumm.com/share/3kXaMUYbKgUFkphU',
    tip: '网站统计'
  },
  { icon: 'i-ri-github-line', url: `https://github.com/${pkg.author.name}`, tip: 'Github' },
  { icon: 'i-ri-mail-line', url: `mailto:${pkg.author.email}`, tip: 'Email' },
  { icon: 'i-ri-quill-pen-line', url: pkg.author.url, tip: '博客' },
  { icon: 'mdi:api', url: 'https://api.baiwumm.com', tip: 'Easy Api' }
]
