export default defineAppConfig({
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000'
    }
  },
  // umami 配置
  umami: {
    id: '96eadfe8-9796-4281-9d75-40f949b69a43',
    host: 'https://umami.baiwumm.com',
    useDirective: true,
    version: 2,
    domains: ['dream-site.cn'],
    ignoreLocalhost: true
  }
})
