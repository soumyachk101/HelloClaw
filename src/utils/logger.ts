import chalk from 'chalk'

const icons = {
  success: chalk.green('✔'),
  error: chalk.red('✖'),
  warn: chalk.yellow('⚠'),
  info: chalk.cyan('ℹ'),
  debug: chalk.gray('⚙'),
  thinking: chalk.cyan('⠋'),
  arrow: chalk.cyan('→'),
  dot: chalk.cyan('●'),
  bullet: chalk.gray('•'),
  line: chalk.gray('│'),
  corner: chalk.gray('╰'),
  tee: chalk.gray('├'),
  pipe: chalk.gray('│'),
}

export const logger = {
  info: (msg: string) => {
    console.log(`  ${icons.info} ${msg}`)
  },

  success: (msg: string) => {
    console.log(`  ${icons.success} ${msg}`)
  },

  warn: (msg: string) => {
    console.log(`  ${icons.warn} ${msg}`)
  },

  error: (msg: string) => {
    console.log(`  ${icons.error} ${msg}`)
  },

  debug: (msg: string) => {
    if (process.env.DEBUG) {
      console.log(`  ${icons.debug} ${chalk.gray(msg)}`)
    }
  },

  thinking: (msg: string) => {
    process.stdout.write(`  ${chalk.cyan('⠋')} ${chalk.gray(msg)}\r`)
  },

  task: (msg: string) => {
    console.log(`  ${icons.bullet} ${msg}`)
  },

  result: (label: string, value: string) => {
    console.log(`  ${icons.arrow} ${chalk.gray(label)}: ${chalk.white(value)}`)
  },

  box: (title: string, content: string[]) => {
    const maxWidth = Math.max(title.length + 4, ...content.map(l => l.length + 4)) + 2
    const border = '─'.repeat(maxWidth)

    console.log(`  ${chalk.cyan('╭')}${chalk.cyan(border)}${chalk.cyan('╮')}`)
    console.log(`  ${chalk.cyan('│')} ${chalk.white.bold(title.padEnd(maxWidth - 2))} ${chalk.cyan('│')}`)
    console.log(`  ${chalk.cyan('├')}${chalk.cyan(border)}${chalk.cyan('┤')}`)

    for (const line of content) {
      console.log(`  ${chalk.cyan('│')} ${chalk.gray(line.padEnd(maxWidth - 2))} ${chalk.cyan('│')}`)
    }

    console.log(`  ${chalk.cyan('╰')}${chalk.cyan(border)}${chalk.cyan('╯')}`)
  },

  section: (title: string) => {
    console.log('')
    console.log(`  ${chalk.cyan('◆')} ${chalk.white.bold(title)}`)
    console.log(`  ${chalk.gray('│')}`)
  },

  item: (text: string, indent = 0) => {
    const prefix = '  '.repeat(indent + 1)
    console.log(`${prefix}${chalk.gray('│')} ${text}`)
  },

  divider: () => {
    console.log(`  ${chalk.gray('─'.repeat(60))}`)
  },
}
