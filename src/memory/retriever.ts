import OpenAI from 'openai'
import { getConfig } from '@/config'
import { searchEntries } from '@/memory/store'
import { ClawError } from '@/utils/errors'

async function embed(query: string): Promise<number[]> {
  const config = getConfig()

  if (!config.openai_api_key) {
    throw new ClawError(
      'OpenAI API key required for embeddings. Set with: nexusclaw config set openai_api_key <key>',
      'CONFIG_MISSING',
      true,
    )
  }

  const openai = new OpenAI({ apiKey: config.openai_api_key })
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: [query],
  })

  return response.data[0]!.embedding
}

async function search(query: string, topK: number = 5): Promise<string[]> {
  const vector = await embed(query)
  const entries = await searchEntries(vector, topK)
  return entries.map(e => `[${e.path}]\n${e.chunk}`)
}

export const memoryRetriever = { search }
