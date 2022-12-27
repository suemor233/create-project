import fs from 'fs-extra'
import path from 'node:path'
import prompts from 'prompts'

export const create = async (name: string, options: any) => {
  const cwd = process.cwd()
  console.log(cwd)
  const tragetAir = path.join(cwd, name)
  if (fs.existsSync(tragetAir)) {
    if (options.force) {
      fs.removeSync(tragetAir)
      return
    }
    const { action } = await prompts({
      type: 'confirm',
      name: 'action',
      message: '当前文件夹已经存在是否覆盖？',
    })

    if (!action) {
      return
    }
    console.log(`\r\nRemoving...`)
    fs.removeSync(tragetAir)
  }
}
