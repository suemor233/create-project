import downloadGitRepo from 'download-git-repo'
import fs from 'fs-extra'
import path from 'node:path'
import prompts from 'prompts'
import utils from 'util'

import { wrapLoading } from '../utils/animation.js'
import { error, success } from '../utils/log.js'
import { getRepoList } from './http.js'

export const create = async (name: string, options: any) => {
  await existFolder(name, options)
  await createFolder(name)
}

const existFolder = async (name: string, options: any) => {
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
        error(`请先移除当前文件夹`)
        !state.value && process.exit(0)
        fs.removeSync(targetDir)
        success(`覆盖成功`)
      },
    })
  }
}

const createFolder = async (name: string) => {
  const cwd = process.cwd()
  const targetDir = path.join(cwd, name)
  const repoList = await wrapLoading(getRepoList, '获取模板列表中。。。')

  const { template } = await prompts([
    {
      type: 'select',
      name: 'template',
      message: '请选择模板',
      choices: repoList.map((item) => {
        return {
          title: item.name,
          value: item.name,
        }
      }),
    },
    
  ])

  fetchGitRepo(template, targetDir)
}

const fetchGitRepo = async (template: string, targetDir: string) => {
  const requestUrl = `zhurong-cli/${template}`
  await wrapLoading(
    utils.promisify(downloadGitRepo),
    '下载模板中。。。',
    requestUrl,
    path.resolve(process.cwd(), targetDir),
  )

  success('下载成功')
}
