// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseUrl: process.env.NODE_ENV === 'production' ? process.env.SITE_URL : 'http://localhost:3000'
    }
  },
  app: {
    pageTransition: { name: 'blur', mode: 'out-in' } // 页面过渡效果
  },
  // 源目录
  srcDir: 'src/',
  // 引入模块
  modules: [
    '@nuxt/image',
    'nuxt-icons',
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@element-plus/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    'nuxt-clarity-analytics',
    'nuxt-gtag',
    '@nuxtjs/seo'
  ],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/']
    }
  },
  colorMode: {
    classSuffix: ''
  },
  experimental: {
    viewTransition: true
  },
  css: ['element-plus/theme-chalk/dark/css-vars.css', '~/assets/scss/main.scss'],
  extends: ['nuxt-umami'],
  // SEO 配置
  site: {
    url: 'https://site.baiwumm.com',
    name: 'Dream Site',
    description: '个人常用站点收录',
    defaultLocale: 'zh-cn',
    exclude: ['/admin/_components/**'], // 过滤不需要的 url
    cacheMaxAgeSeconds: 24 * 3600, // 缓存时间一天
    autoLastmod: true // 自动检测每个 URL 的 lastmod 日期
  },
  routeRules: {
    // Don't add any /secret/** URLs to the sitemap.xml
    '/admin/_components/**': { robots: false }
  }
})