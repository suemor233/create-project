import spawn from 'cross-spawn'
import fs from 'node:fs'

interface installProps {
  cwd: string // 项目路径
  package: string // 包管理器
}

export const install = async (options: installProps) => {
  const cwd = options.cwd
  return new Promise((resolve, reject) => {
    const command = options.package
    const args = ['install']

    const child = spawn(command, args, {
      cwd,
      stdio: ['pipe', process.stdout, process.stderr],
    })
    child.once('close', (code: number) => {
      if (code !== 0) {
        reject('安装失败')
        return
      }
      resolve(null)
    })
    child.once('error', reject)
  })
}

const npm = 'package-lock.json'
const yarn = 'yarn.lock'
const pnpm = 'pnpm-lock.yaml'
const lockFiles = [npm, yarn, pnpm]

export const getPackageManager = () => {
  const pkgManager = lockFiles.find((v) => fs.existsSync(v))
  if (!pkgManager) {
    return 'npm'
  } else {
    const pkg = pkgManager.split('-')[0]
    if (pkg === 'package') {
      return 'npm'
    }
    return pkg
  }
}
