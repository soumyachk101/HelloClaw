import { Command } from 'commander'
import chalk from 'chalk'
import { getConfig, setConfig, resetConfig, getConfigPath } from '@/config'
import type { NexusClawConfig } from '@/config'

export const configCommand = new Command('config')
  .description('Manage configuration')

configCommand
  .command('show')
  .description('Show current configuration')
  .action(() => {
    const config = getConfig()

    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Configuration'))
    console.log(chalk.gray('  │'))

    // Mask API keys
    const entries: Array<[string, unknown]> = Object.entries(config)
    const maxKeyLen = Math.max(...entries.map(([k]) => k.length))

    for (const [key, value] of entries) {
      let displayValue: string

      if ((key.includes('key') || key.includes('token')) && typeof value === 'string' && value) {
        displayValue = chalk.yellow('***' + value.slice(-4))
      } else if (typeof value === 'boolean') {
        displayValue = value ? chalk.green('true') : chalk.red('false')
      } else if (Array.isArray(value)) {
        displayValue = value.length > 0 ? chalk.white(value.join(', ')) : chalk.gray('(empty)')
      } else {
        displayValue = chalk.white(String(value || '(not set)'))
      }

      console.log(chalk.gray('  ├─ ') + chalk.gray(key.padEnd(maxKeyLen)) + '  ' + displayValue)
    }

    console.log(chalk.gray('  │'))
    console.log(chalk.gray('  └─ ') + chalk.gray('Path: ') + chalk.white(getConfigPath()))
    console.log('')
  })

configCommand
  .command('set <key> <value>')
  .description('Set a configuration value')
  .action(async (key: string, value: string) => {
    const validKeys: (keyof NexusClawConfig)[] = [
      'model', 'openrouter_api_key', 'telegram_bot_token', 'discord_bot_token',
      'discord_guild_id', 'firecrawl_api_key', 'openai_api_key',
      'memory_enabled', 'token_tracking', 'max_agent_iterations', 'safe_mode',
    ]

    if (!validKeys.includes(key as keyof NexusClawConfig)) {
      console.log(chalk.red(`  ✖ Invalid key: ${key}`))
      console.log(chalk.gray(`    Valid keys: ${validKeys.join(', ')}`))
      process.exit(1)
    }

    // Parse booleans and numbers
    let parsed: string | number | boolean = value
    if (value === 'true') parsed = true
    else if (value === 'false') parsed = false
    else if (!isNaN(Number(value))) parsed = Number(value)

    setConfig({ [key]: parsed } as Partial<NexusClawConfig>)

    const displayValue = key.includes('key') || key.includes('token') ? '***' : parsed
    console.log('')
    console.log(chalk.green('  ✔ ') + chalk.gray('Set ') + chalk.white(key) + chalk.gray(' = ') + chalk.yellow(String(displayValue)))
    console.log('')
  })

configCommand
  .command('reset')
  .description('Reset configuration to defaults')
  .action(async () => {
    resetConfig()
    console.log('')
    console.log(chalk.green('  ✔ ') + chalk.gray('Configuration reset to defaults'))
    console.log('')
  })
