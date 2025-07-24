// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NODE_ENV === 'production' ? process.env.SITE_URL : 'http://localhost:3000',
      siteTitle: process.env.SITE_TITLE,
      siteDescription: process.env.SITE_DESCRIPTION,
      siteKeywords: process.env.SITE_KEYWORDS,
    }
  },
  app: {
    pageTransition: { name: 'blur', mode: 'out-in' }, // 页面过渡效果
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/supabase',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo',
    'nuxt-umami',
    'dayjs-nuxt',
    '@nuxt/ui',
    'nuxt-gtag'
  ],
  // supabase Auth
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/']
    }
  },
  // nuxt-umami Umami 统计
  umami: {
    id: '4eb40830-3733-4175-8a7b-e8991c5329a8',
    host: 'https://umami.baiwumm.com',
    autoTrack: true
  },
  // nuxt-gtag 谷歌统计
  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-76RP7KMHMQ',
    config: {
      page_title: process.env.SITE_TITLE
    },
  },
  // dayjs 插件
  dayjs: {
    locales: ['zh-cn'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'zh-cn',
    defaultTimezone: 'Asia/Shanghai',
  },
  // @nuxtjs/color-mode 配置
  colorMode: {
    classSuffix: ''
  },
  // @nuxt/icon 配置
  icon: {
    customCollections: [
      {
        prefix: 'my-icon',
        dir: './app/assets/icons'
      },
    ],
  },
  // @nuxt/ui 配置
  ui: {
    fonts: false
  },
  experimental: {
    viewTransition: true
  },
  css: ['~/assets/css/main.css']
})