import { green, red, yellow } from 'kolorist'

function success(...args: any[]) {
  console.log(green(`\n[SUCCESS] ${args}`))
}

function warn(...args: any[]) {
  console.log(yellow(`\n[WARN] ${args}`))
}

function error(message: string, exit = false) {
  console.log(red(`\n[ERROR] ${message}`))
  if (exit) process.exit(1)
}

export { success, warn, error }
