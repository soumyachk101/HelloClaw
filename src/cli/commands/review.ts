import { Command } from 'commander'
import { intro, outro, spinner } from '@clack/prompts'
import { reviewFile, reviewDiff } from '@/review/reviewer'
import { logger } from '@/utils/logger'

export const reviewCommand = new Command('review')
  .description('AI code review')
  .argument('[file]', 'File to review (or use --diff)')
  .option('--diff [ref]', 'Review the diff (staged or since ref)')
  .action(async (file?: string, options?: { diff?: string | boolean }) => {
    intro('NexusClaw — Review Mode')

    const s = spinner()
    s.start('Reviewing...')

    try {
      let result: string
      if (options?.diff !== undefined) {
        result = await reviewDiff(typeof options.diff === 'string' ? options.diff : undefined)
      } else if (file) {
        result = await reviewFile(file)
      } else {
        result = await reviewDiff()
      }

      s.stop('Review complete')
      console.log('\n' + result)
      outro('✓ Done')
    } catch (err: unknown) {
      s.stop('Review failed')
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
      process.exit(1)
    }
  })
