import { tool } from 'ai'
import { z } from 'zod'
import { getConfig } from '@/config'
import { ClawError } from '@/utils/errors'

export const searchWebTool = tool({
  description: 'Search the web for information using Firecrawl',
  parameters: z.object({
    query: z.string().describe('The search query'),
    limit: z.number().optional().describe('Number of results (default: 5)'),
  }),
  execute: async ({ query, limit = 5 }) => {
    const config = getConfig()

    if (!config.firecrawl_api_key) {
      return {
        success: false,
        error: 'Firecrawl API key not configured. Set it with: nexusclaw config set firecrawl_api_key <key>',
      }
    }

    try {
      const response = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.firecrawl_api_key}`,
        },
        body: JSON.stringify({ query, limit }),
      })

      if (!response.ok) {
        throw new ClawError(`Firecrawl API error: ${response.status}`, 'WEB_SEARCH_FAILED', true)
      }

      const data = await response.json() as { success: boolean; data?: Array<{ url: string; title: string; markdown?: string }> }
      return {
        success: true,
        results: (data.data ?? []).map(r => ({
          url: r.url,
          title: r.title,
          snippet: r.markdown?.slice(0, 500),
        })),
      }
    } catch (err: unknown) {
      if (err instanceof ClawError) throw err
      const message = err instanceof Error ? err.message : String(err)
      throw new ClawError(`Web search failed: ${message}`, 'WEB_SEARCH_FAILED', true, { query })
    }
  },
})
