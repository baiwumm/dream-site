// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 5173
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NODE_ENV === 'production' ? process.env.NUXT_SITE_URL : 'http://localhost:5173',
      siteTitle: process.env.NUXT_SITE_NAME,
      siteDescription: process.env.NUXT_SITE_DESCRIPTION,
      siteKeywords: process.env.NUXT_SITE_KEYWORDS,
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }, // 页面过渡效果
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.baiwumm.com/fonts/MapleMono-CN-Regular/result.css"
        }
      ]
    }
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
    'nuxt-gtag',
    'nuxt-clarity-analytics'
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
    id: '87f94791-c0a5-424f-a3f4-e0171d82352b',
    host: 'https://um.baiwumm.com',
    autoTrack: true
  },
  // nuxt-gtag 谷歌统计
  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-76RP7KMHMQ',
    config: {
      page_title: process.env.NUXT_SITE_NAME
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
  // 站点地图配置
  sitemap: {
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
    ],
  },
  experimental: {
    viewTransition: true
  },
  css: ['~/assets/css/main.css']
})