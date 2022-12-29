import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/core/index'],
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      minify: true,
    },
  },
  alias: {
    prompts: 'prompts/lib/index.js',
  },
})
