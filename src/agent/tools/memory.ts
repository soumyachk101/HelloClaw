import { tool } from 'ai'
import { z } from 'zod'
import { memoryRetriever } from '@/memory/retriever'
import { ClawError } from '@/utils/errors'

export const memorySearchTool = tool({
  description: 'Search the project memory store for relevant context',
  parameters: z.object({
    query: z.string().describe('What to search for in project memory'),
    topK: z.number().optional().describe('Number of results (default: 5)'),
  }),
  execute: async ({ query, topK = 5 }) => {
    try {
      const results = await memoryRetriever.search(query, topK)
      return {
        success: true,
        results,
        count: results.length,
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        success: false,
        error: `Memory search failed: ${message}. Run 'nexusclaw memory init' first.`,
      }
    }
  },
})
