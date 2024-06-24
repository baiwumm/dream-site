// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseUrl: 'https://dream-site.cn'
    }
  },
  // SEO 和 Meta
  app: {
    head: {
      title: '程序员的梦中情站',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'keywords', content: 'Nuxt.js,导航,网站' },
        { name: 'description', content: '致力于打造程序员的梦中情站' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
      ]
    },
    pageTransition: { name: 'blur', mode: 'out-in' }, // 页面过渡效果
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
    "nuxt-gtag"
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
  extends: ['nuxt-umami']
})