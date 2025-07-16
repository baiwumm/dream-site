export default defineAppConfig({
  theme: {
    dark: true,
    colors: {
      primary: '#ff0000'
    }
  },
  // umami 配置
  umami: {
    id: '4eb40830-3733-4175-8a7b-e8991c5329a8',
    host: 'https://umami.baiwumm.com',
    useDirective: true,
    version: 2,
    domains: ['site.baiwumm.com'],
    ignoreLocalhost: true
  }
})
