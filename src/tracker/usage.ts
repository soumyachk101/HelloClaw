import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { getConfig } from '@/config'
import { logger } from '@/utils/logger'

interface SessionUsage {
  session_id: string
  timestamp: string
  model: string
  mode: string
  tokens_in: number
  tokens_out: number
  estimated_cost_usd: number
}

interface UsageStore {
  sessions: SessionUsage[]
  total_cost_usd: number
}

const PRICING: Record<string, { input: number; output: number }> = {
  'google/gemini-flash-1.5': { input: 0.075 / 1_000_000, output: 0.30 / 1_000_000 },
  'google/gemini-pro-1.5': { input: 1.25 / 1_000_000, output: 5.00 / 1_000_000 },
  'anthropic/claude-3.5-sonnet': { input: 3.00 / 1_000_000, output: 15.00 / 1_000_000 },
  'anthropic/claude-3-haiku': { input: 0.25 / 1_000_000, output: 1.25 / 1_000_000 },
  'openai/gpt-4o': { input: 2.50 / 1_000_000, output: 10.00 / 1_000_000 },
  'openai/gpt-4o-mini': { input: 0.15 / 1_000_000, output: 0.60 / 1_000_000 },
}

function getUsagePath(): string {
  const config = getConfig()
  return resolve(config.workspace_root, '.nexusclaw', 'usage.json')
}

function loadStore(): UsageStore {
  const path = getUsagePath()
  if (existsSync(path)) {
    try {
      return JSON.parse(readFileSync(path, 'utf-8')) as UsageStore
    } catch {
      return { sessions: [], total_cost_usd: 0 }
    }
  }
  return { sessions: [], total_cost_usd: 0 }
}

function saveStore(store: UsageStore): void {
  const path = getUsagePath()
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(store, null, 2))
}

function estimateCost(model: string, tokensIn: number, tokensOut: number): number {
  const pricing = PRICING[model]
  if (!pricing) return 0
  return tokensIn * pricing.input + tokensOut * pricing.output
}

export const usageTracker = {
  record(entry: { model: string; mode: string; tokens_in: number; tokens_out: number }): void {
    const config = getConfig()
    if (!config.token_tracking) return

    const store = loadStore()
    const cost = estimateCost(entry.model, entry.tokens_in, entry.tokens_out)

    store.sessions.push({
      session_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...entry,
      estimated_cost_usd: cost,
    })
    store.total_cost_usd += cost

    saveStore(store)

    logger.info(
      `Tokens: ${entry.tokens_in.toLocaleString()} in / ${entry.tokens_out.toLocaleString()} out` +
      ` | Model: ${entry.model} | Cost: $${cost.toFixed(4)}`,
    )
  },

  getSummary(): UsageStore {
    return loadStore()
  },

  getSessionTotal(): number {
    const store = loadStore()
    return store.sessions.reduce((sum, s) => sum + s.estimated_cost_usd, 0)
  },
}
