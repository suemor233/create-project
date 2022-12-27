import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'
import fs from 'fs-extra'

import { create } from './create'

const packageJson = JSON.parse(
  fs.readFileSync('./package.json', {
    encoding: 'utf-8',
  }),
)

const main = () => {
  program
    .command('create <app-name>')
    .description('create a new project')
    // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
      // 打印执行结果
      create(name, options)
    })

  program
    // 配置版本号信息
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

main()
