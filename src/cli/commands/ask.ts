import { Command } from 'commander'
import { intro, outro, spinner } from '@clack/prompts'
import { runAskMode } from '@/agent/modes/ask'
import { writeFile } from 'fs/promises'
import { logger } from '@/utils/logger'

export const askCommand = new Command('ask')
  .description('Read-only Q&A mode')
  .argument('<query>', 'The question to ask')
  .option('-s, --save <path>', 'Save output to a file')
  .action(async (query: string, options: { save?: string }) => {
    intro('NexusClaw — Ask Mode')

    const s = spinner()
    s.start('Thinking...')

    try {
      const response = await runAskMode(query)
      s.stop('Done')

      if (options.save) {
        await writeFile(options.save, response, 'utf-8')
        logger.success(`Output saved to ${options.save}`)
      }

      outro('✓ Complete')
    } catch (err: unknown) {
      s.stop('Failed')
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
      process.exit(1)
    }
  })
