import { Command } from 'commander'
import { getConfig, setConfig, resetConfig, getConfigPath } from '@/config'
import { logger } from '@/utils/logger'
import type { NexusClawConfig } from '@/config'

export const configCommand = new Command('config')
  .description('Manage configuration')

configCommand
  .command('show')
  .description('Show current configuration')
  .action(() => {
    const config = getConfig()
    // Mask API keys
    const masked: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string' && key.includes('key') || key.includes('token')) {
        masked[key] = value ? '***' + value.slice(-4) : '(not set)'
      } else {
        masked[key] = value
      }
    }
    console.log(JSON.stringify(masked, null, 2))
    console.log(`\nConfig path: ${getConfigPath()}`)
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
      logger.error(`Invalid key: ${key}. Valid keys: ${validKeys.join(', ')}`)
      process.exit(1)
    }

    // Parse booleans and numbers
    let parsed: string | number | boolean = value
    if (value === 'true') parsed = true
    else if (value === 'false') parsed = false
    else if (!isNaN(Number(value))) parsed = Number(value)

    setConfig({ [key]: parsed } as Partial<NexusClawConfig>)
    logger.success(`Set ${key} = ${key.includes('key') || key.includes('token') ? '***' : parsed}`)
  })

configCommand
  .command('reset')
  .description('Reset configuration to defaults')
  .action(async () => {
    resetConfig()
    logger.success('Configuration reset to defaults')
  })
