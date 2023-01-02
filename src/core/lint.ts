import { sync } from 'cross-spawn'
import fs from 'node:fs'

import defineConfig from '../../config'
import { error, success } from '../utils/log.js'
import { getPackageManager } from '../utils/package.js'

const __dirname = process.cwd()
const eslintDir = `${__dirname}/.eslintrc.cjs`
const eslintIgnoreDir = `${__dirname}/.eslintignore`
const prettierDir = `${__dirname}/.eslintrc.cjs`

export const lint = async (name: string, options: any) => {
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

  const packageManager = getPackageManager()

  sync(
    packageManager,
    ['install', defineConfig.eslint, defineConfig.prettier, '-D'],
    { stdio: 'inherit' },
  )

  fs.writeFileSync(
    `${__dirname}/.eslintrc.cjs`,
    `module.exports = require("${defineConfig.eslint}")`,
  )
  fs.writeFileSync(`${__dirname}/.eslintignore`, `**/dist/**`)
  fs.writeFileSync(
    `${__dirname}/.prettierrc.cjs`,
    `module.exports = require("${defineConfig.prettier}")`,
  )

  success('lint init success')
}
