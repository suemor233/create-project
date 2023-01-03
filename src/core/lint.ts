import { sync } from 'cross-spawn'
import fs from 'node:fs'
import path from 'node:path'
import prompts from 'prompts'

import defineConfig from '../../config'
import { error, success } from '../utils/log.js'
import { getPackageManager } from '../utils/package.js'

const __dirname = process.cwd()
const eslintDir = `${__dirname}/.eslintrc.cjs`
const eslintIgnoreDir = `${__dirname}/.eslintignore`
const prettierDir = `${__dirname}/.prettierrc.cjs`

export const lint = async (_: string, options: any) => {
  checkFileExists(options)

  const packageManager = getPackageManager()

  const { eslint, prettier } = await choiceLint()
  sync(packageManager, ['install', eslint, prettier, '-D'], {
    stdio: 'inherit',
  })

  await writeLint(eslint, prettier)

  success('eslint 和 ')
}

const checkFileExists = (options: any) => {
  if (!options.force) {
    if (fs.existsSync(eslintDir)) {
      error('eslint config file already exists', true)
    }
    if (fs.existsSync(eslintIgnoreDir)) {
      error('eslint ignore file already exists', true)
    }
    if (fs.existsSync(prettierDir)) {
      error('prettier config file already exists', true)
    }
  }
}

const choiceLint = async () => {
  const {
    eslint = defineConfig.eslint[0],
    prettier = defineConfig.prettier[0],
  } = await prompts([
    {
      type: defineConfig.eslint.length > 1 ? 'select' : null,
      name: 'eslint',
      message: '选择当前项目的 eslint',
      choices: defineConfig.eslint.map((name) => {
        return {
          title: name,
          value: name,
        }
      }),
      initial: 0,
      onState: (state) => {
        if (state.aborted) {
          process.nextTick(() => {
            process.exit(0)
          })
        }
      },
    },
    {
      type: defineConfig.prettier.length > 1 ? 'select' : null,
      name: 'prettier',
      message: '选择当前项目的 prettier',
      choices: defineConfig.prettier.map((name) => {
        return {
          title: name,
          value: name,
        }
      }),
      initial: 0,
      onState: (state) => {
        if (state.aborted) {
          process.nextTick(() => {
            process.exit(0)
          })
        }
      },
    },
  ])

  return { eslint, prettier }
}
const writeLint = async (eslint: string, prettier: string) => {
  fs.writeFileSync(eslintDir, `module.exports = require("${eslint}")`)
  fs.writeFileSync(eslintIgnoreDir, `**/dist/**`)
  fs.writeFileSync(prettierDir, `module.exports = require("${prettier}")`)

  const _path = path.resolve(__dirname, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(_path, 'utf-8'))
  if (!packageJson) {
    error('无法找到 package.json', true)
  }

  packageJson.scripts['lint'] = 'eslint --ext .ts,.tsx,.js,.jsx ./'
  packageJson.scripts['lint:fix'] =
    'eslint --fix --ext .ts,.tsx,.js,.jsx --quiet ./'
  fs.writeFileSync(_path, JSON.stringify(packageJson, null, 2))
}
