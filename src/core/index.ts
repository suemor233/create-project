import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'
import fs from 'fs-extra'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { lint } from './lint';

import { error } from '../utils/log.js'
import { create } from './create'

const __dirname = dirname(fileURLToPath(import.meta.url))

const packageJson = JSON.parse(
  fs.readFileSync(`${__dirname}/../package.json`, {
    encoding: 'utf-8',
  }),
)

const main = async () => {
  program
    .command('create')
    .description('创建一个项目')
    .argument('[name]', '项目名称')
    .option('-f, --force', '如果文件夹存在则覆盖')
    .helpOption('-h, --help', '查看帮助')
    .action((name, options) => {
      create(name, options)
    })

    program
    .command('lint')
    .description('配置 eslint 和 prettier')
    .argument('[]')
    .option('-f, --force', '如果文件存在则覆盖')
    .helpOption('-h, --help', '查看帮助')
    .action((name, options) => {
      lint(name,options)
    })

  program
    .description('查看当前 cli 版本')
    .version(`v${packageJson.version}`)
    .usage('<command> [option]')

  program.on('--help', async () => {
    console.log(
      `\r\n${figlet.textSync('suemor', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true,
      })}`,
    )

    // 新增说明信息
    console.log(
      `\r\n输入 ${chalk.cyan(`sr <command> --help`)} 来获取具体帮助\r\n`,
    )
  })

  program.parse(process.argv)
}

main().catch((e) => {
  console.error(e)
  error('Something went wrong!',true)
})
