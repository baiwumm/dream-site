export default defineAppConfig({
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000'
    }
  },
  // umami 配置
  umami: {
    id: '95653e90-7b8b-4541-b6de-ea5e544d8c2d',
    host: 'https://umami.baiwumm.com',
    useDirective: true,
    version: 2,
    domains: ['dream-site.cn'],
    ignoreLocalhost: true
  }
})
