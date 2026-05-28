import figlet from 'figlet'
import chalk from 'chalk'

export function showBanner(): void {
  const banner = figlet.textSync('NexusClaw', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  })

  console.log(chalk.cyan(banner))
  console.log(chalk.gray('  CLI-first autonomous AI coding agent\n'))
}
