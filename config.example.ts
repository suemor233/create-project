import { defineConfig } from './src/types/index.js'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  // github 用户名
  username: 'suemor233',
  // github 仓库名
  repo: ['nest-template', 'vue3-template'],
  // eslint 配置
  eslint: '@suemor/eslint-config-ts',
  // prettier 配置
  prettier: '@suemor/prettier'
})
