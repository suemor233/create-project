import chalk from 'chalk'
import downloadGitRepo from 'download-git-repo'
import fs from 'fs-extra'
import path from 'node:path'
import prompts from 'prompts'
import utils from 'util'

import defineConfig from '../../config'
import { wrapLoading } from '../utils/animation.js'
import { install } from '../utils/install.js'
import { error, success } from '../utils/log.js'

export const create = async (name: string, options: any) => {
  if (!name) {
    name = await (await inputName()).name
  }
  await checkFolder(name, options)
  await createFolder(name)
}

const inputName = async () => {
  return prompts({
    type: 'text',
    name: 'name',
    initial: 'my-app',
    message: '请输入项目名称',
    onState: (state) => {
      if (state.aborted) {
        process.nextTick(() => {
          process.exit(0)
        })
      }
    },
  })
}

const checkFolder = async (name: string, options: any) => {
  const cwd = process.cwd()
  const targetDir = path.join(cwd, name)
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      fs.removeSync(targetDir)
      return
    }
    await prompts({
      type: 'confirm',
      name: 'coverFolder',
      initial: true,
      message: '当前文件夹已经存在是否覆盖？',
      onState: (state) => {
        if (state.aborted) {
          process.nextTick(() => {
            process.exit(0)
          })
        }
        if (!state.value) {
          error(`请先移除当前文件夹`)
          process.exit(0)
        }
        fs.remove(targetDir)
      },
    })
  }
}

const createFolder = async (name: string) => {
  const cwd = process.cwd()
  const targetDir = path.join(cwd, name)

  const { template, installTools } = await prompts([
    {
      type: 'select',
      name: 'template',
      message: '请选择模板',
      choices: defineConfig.repo.map((name) => {
        return {
          title: name,
          value: name,
        }
      }),
      onState: (state) => {
        if (state.aborted) {
          process.nextTick(() => {
            process.exit(0)
          })
        }
      },
    },
    {
      type: 'select',
      name: 'installTools',
      message: '选择什么工具安装依赖？',
      choices: [
        {
          title: 'pnpm',
          value: 'pnpm',
        },
        {
          title: 'yarn',
          value: 'yarn',
        },
        {
          title: 'npm',
          value: 'npm',
        },
      ],
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

  try {
    await fetchGitRepo(template, targetDir)
  } catch (error) {
    error('下载模板失败')
    process.exit(0)
  }

  await updatePackageJson(name, targetDir)

  try {
    await install({
      cwd: targetDir,
      package: installTools,
    })
  } catch (error) {
    error('安装失败')
    process.exit(0)
  }

  success(`成功安装依赖`)
  console.log(`\r\n  cd ${chalk.cyan(name)}`)
  console.log(`  ${installTools} run dev\r\n`)
}

const fetchGitRepo = async (template: string, targetDir: string) => {
  const requestUrl = `${defineConfig.username}/${template}`
  await wrapLoading(
    utils.promisify(downloadGitRepo),
    '下载模板中。。。',
    requestUrl,
    path.resolve(process.cwd(), targetDir),
  )
}

const updatePackageJson = async (name: string, targetDir: string) => {
  const _path = path.resolve(targetDir, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(_path, 'utf-8'))
  if (!packageJson) {
    error('无法找到 package.json')
    process.exit(0)
  }
  packageJson.name = name
  fs.writeFileSync(_path, JSON.stringify(packageJson, null, 2))
}
