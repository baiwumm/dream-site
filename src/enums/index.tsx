import { ArrowRightArrowLeft, ArrowUpArrowDown } from '@gravity-ui/icons';
import { Enum } from 'enum-plus';

/**
 * @description: 请求状态
 */
export const RESPONSE = Enum({
  SUCCESS: { value: 200, label: '请求成功' },
  ERROR: { value: 500, label: '请求失败' }
})

/**
 * @description: 主题模式
 */
export const THEME_MODE = Enum({
  LIGHT: { value: 'light', label: '亮色模式' },
  DARK: { value: 'dark', label: '暗黑模式' },
  SYSTEM: { value: 'system', label: '跟随系统' }
});

/**
 * @description: OAuth Providers
 */
export const OAUTH_PROVIDERS = Enum({
  GOOGLE: { value: 'google', label: '使用 Google 登录' },
  GITHUB: { value: 'github', label: '使用 Github 登录' },
})

/**
 * @description: Admin Tabs
 */
export const ADMIN_TABS = Enum({
  CATEGOTYS: { value: 'categorys', label: '网站分类' },
  WEBSITES: { value: 'websites', label: '网站列表' },
})

/**
 * @description: 过渡动画方向
 */
export const TRANSITION_DIRECTION = Enum({
  LTR: { value: 'ltr', label: '左到右', icon: <ArrowRightArrowLeft className="-scale-x-100" />, clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'] },
  RTL: { value: 'rtl', label: '右到左', icon: <ArrowRightArrowLeft />, clipPath: ['inset(0 0 0 100%)', 'inset(0 0 0 0)'] },
  TTB: { value: 'ttb', label: '上到下', icon: <ArrowUpArrowDown />, clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'] },
  BTT: { value: 'btt', label: '下到上', icon: <ArrowUpArrowDown className="-scale-x-100" />, clipPath: ['inset(100% 0 0 0)', 'inset(0 0 0 0)'] }
});