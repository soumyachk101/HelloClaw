import Conf from 'conf'
import { ClawError } from '@/utils/errors'

export interface NexusClawConfig {
  model: string
  openrouter_api_key: string
  telegram_bot_token?: string
  discord_bot_token?: string
  discord_guild_id?: string
  firecrawl_api_key?: string
  openai_api_key?: string
  memory_enabled: boolean
  token_tracking: boolean
  max_agent_iterations: number
  safe_mode: boolean
  workspace_root: string
  plugins: string[]
}

const defaults: NexusClawConfig = {
  model: 'google/gemini-flash-1.5',
  openrouter_api_key: '',
  memory_enabled: true,
  token_tracking: true,
  max_agent_iterations: 20,
  safe_mode: true,
  workspace_root: process.cwd(),
  plugins: [],
}

const conf = new Conf<NexusClawConfig>({
  projectName: 'nexusclaw',
  defaults,
})

export function getConfig(): NexusClawConfig {
  return conf.store
}

export function setConfig(updates: Partial<NexusClawConfig>): void {
  for (const [key, value] of Object.entries(updates)) {
    conf.set(key, value)
  }
}

export function getConfigValue<K extends keyof NexusClawConfig>(key: K): NexusClawConfig[K] {
  return conf.get(key)
}

export function setConfigValue<K extends keyof NexusClawConfig>(key: K, value: NexusClawConfig[K]): void {
  conf.set(key, value)
}

export function resetConfig(): void {
  conf.clear()
}

export function getConfigPath(): string {
  return conf.path
}
