import { Command } from 'commander'
import { intro, outro, spinner } from '@clack/prompts'
import { initMemoryStore, clearMemoryStore, getMemoryCount } from '@/memory/store'
import { indexProject } from '@/memory/indexer'
import { memoryRetriever } from '@/memory/retriever'
import { logger } from '@/utils/logger'

export const memoryCommand = new Command('memory')
  .description('Manage project memory')

memoryCommand
  .command('init')
  .description('Index current project into memory store')
  .action(async () => {
    intro('NexusClaw — Memory Init')

    const s = spinner()
    try {
      s.start('Initializing memory store...')
      await initMemoryStore()
      s.stop('Store initialized')

      s.start('Indexing project files...')
      const count = await indexProject()
      s.stop(`Indexed ${count} chunks`)

      outro('✓ Memory ready')
    } catch (err: unknown) {
      s.stop('Failed')
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
      process.exit(1)
    }
  })

memoryCommand
  .command('search <query>')
  .description('Search project memory')
  .option('-k, --top-k <n>', 'Number of results', '5')
  .action(async (query: string, options: { topK?: string }) => {
    try {
      await initMemoryStore()
      const results = await memoryRetriever.search(query, parseInt(options.topK ?? '5'))
      if (results.length === 0) {
        logger.info('No results found. Run: nexusclaw memory init')
      } else {
        for (const result of results) {
          console.log(`\n${result}`)
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
    }
  })

memoryCommand
  .command('clear')
  .description('Clear all memory data')
  .action(async () => {
    try {
      await initMemoryStore()
      await clearMemoryStore()
      logger.success('Memory cleared')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
    }
  })

memoryCommand
  .command('count')
  .description('Show number of stored memory chunks')
  .action(async () => {
    try {
      await initMemoryStore()
      const count = await getMemoryCount()
      logger.info(`Memory contains ${count} chunks`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
    }
  })
