import chalk from 'chalk'
import { getConfig } from '@/config'

export function showBanner(): void {
  const config = getConfig()

  const lines = [
    '',
    chalk.cyan('  ╭─────────────────────────────────────────────────────────────╮'),
    chalk.cyan('  │') + chalk.white.bold('                                                             ') + chalk.cyan('│'),
    chalk.cyan('  │') + chalk.white.bold('   ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗ ██████╗██╗   ') + chalk.cyan('│'),
    chalk.cyan('  │') + chalk.white.bold('   ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝██╔════╝██║   ') + chalk.cyan('│'),
    chalk.cyan('  │') + chalk.white.bold('   ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗██║     ██║   ') + chalk.cyan('│'),
    chalk.cyan('  │') + chalk.white.bold('   ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║██║     ██║   ') + chalk.cyan('│'),
    chalk.cyan('  │') + chalk.white.bold('   ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║╚██████╗███████╗') + chalk.cyan('│'),
    chalk.cyan('  │') + chalk.white.bold('   ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝╚══════╝') + chalk.cyan('│'),
    chalk.cyan('  │') + chalk.white.bold('                                                             ') + chalk.cyan('│'),
    chalk.cyan('  │') + chalk.gray('   CLI-first autonomous AI coding agent                       ') + chalk.cyan('│'),
    chalk.cyan('  │') + chalk.gray('   ') + chalk.yellow('v1.0.0') + chalk.gray('                                                    ') + chalk.cyan('│'),
    chalk.cyan('  │') + chalk.white.bold('                                                             ') + chalk.cyan('│'),
    chalk.cyan('  ╰─────────────────────────────────────────────────────────────╯'),
    '',
    chalk.gray('  Model: ') + chalk.white(config.model),
    chalk.gray('  Memory: ') + (config.memory_enabled ? chalk.green('enabled') : chalk.red('disabled')),
    chalk.gray('  Tracking: ') + (config.token_tracking ? chalk.green('enabled') : chalk.red('disabled')),
    '',
  ]

  console.log(lines.join('\n'))
}

export function showMiniBanner(): void {
  console.log('')
  console.log(chalk.cyan('  ◆ ') + chalk.white.bold('NexusClaw') + chalk.gray(' v1.0.0'))
  console.log(chalk.gray('  │'))
}
