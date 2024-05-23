// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // SEO 和 Meta
  app: {
    head: {
      title: '程序员的梦中情站',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'keywords', content: '程序员,梦中情站,工具,AI' },
        { name: 'description', content: '程序员的梦中情站，致力于开发一个能提高程序员开发效率的网站' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' }
      ]
    }
  },
  // 源目录
  srcDir: 'src/',
  // 引入模块
  modules: ['@nuxt/ui', '@nuxt/image', 'nuxt-icons', '@nuxtjs/supabase'],
  supabase: {
    redirect: false // https://supabase.nuxtjs.org/get-started#redirect
  },
  experimental: {
    viewTransition: true
  }
})
