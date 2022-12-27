import { green, red, yellow } from 'kolorist'

function success(...args: any[]) {
  console.log(green(`\n[SUCCESS] ${args}`))
}

function warn(...args: any[]) {
  console.log(yellow(`\n[WARN] ${args}`))
}

function error(...args: any[]) {
  console.log(red(`\n[ERROR] ${args}`))
}

export { success, warn, error }
