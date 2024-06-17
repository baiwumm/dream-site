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
      title: process.env.SITE_TITLE,
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'keywords', content: process.env.SITE_KEYWORDS },
        { name: 'description', content: process.env.SITE_DESCRIPTION }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
      ]
    }
  },
  // 源目录
  srcDir: 'src/',
  // 引入模块
  modules: ['@nuxt/image', 'nuxt-icons', '@nuxtjs/supabase', '@nuxtjs/tailwindcss', '@element-plus/nuxt', '@nuxtjs/color-mode', 'nuxt-icon'],
  supabase: {
    url: 'https://dream-site.cn',
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
  css: ['element-plus/theme-chalk/dark/css-vars.css', '~/assets/scss/main.scss']
})
