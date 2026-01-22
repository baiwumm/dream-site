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
  LIGHT: { value: 'light', label: '亮色模式', icon: 'sun' },
  DARK: { value: 'dark', label: '暗黑模式', icon: 'moon' },
  SYSTEM: { value: 'system', label: '跟随系统', icon: 'laptop' }
});

/**
 * @description: OAuth Providers
 */
export const OAUTH_PROVIDERS = Enum({
  GOOGLE: { value: 'google', label: '使用 Google 登录' },
  GITHUB: { value: 'github', label: '使用 Github 登录' },
})