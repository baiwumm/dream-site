// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'https://dream-site.cn'
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
    url: 'https://dream-site.cn',
    name: 'Dream Site',
    description: '致力于打造程序员的梦中情站',
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