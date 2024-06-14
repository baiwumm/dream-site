module.exports = {
  root: true,
  env: {
    browser: true, // 支持浏览器环境的检测
    es2021: true, // 支持es2021语法的检测
    node: true // 支持node环境的检测
  },
  extends: ['@nuxt/eslint-config'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest', // 解析文件的时候使用最新的ecmaVersion
    sourceType: 'module' // 文件是ES6模块规范
  },
  plugins: ['vue'],
  rules: {
    camelcase: 'off', // 驼峰
    indent: [2, 2], // 缩进2个空格
    semi: [2, 'never'], // 要求或禁止使用分号代替 ASI,即禁用行尾使用分号
    quotes: ['error', 'single'], // 强制使用一致的反勾号、双引号或单引号
    'no-debugger': 2, // 不能debugg
    'no-empty': 2, // 块语句中的内容不能为空
    'no-extra-parens': 2, // 禁止非必要的括号
    'no-extra-semi': 2, // 禁止多余的冒号
    'comma-dangle': [2, 'never'], // 键值对最后一个不能有,
    'spaced-comment': ['error', 'always'], // 注释必须空格
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 8,
        multiline: {
          max: 10
        }
      }
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off'
  }
}
