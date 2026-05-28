import { Command } from 'commander'
import { intro, outro, spinner } from '@clack/prompts'
import { runPlanMode } from '@/agent/modes/plan'
import { logger } from '@/utils/logger'

export const planCommand = new Command('plan')
  .description('Generate a step-by-step plan for a goal')
  .argument('<goal>', 'The high-level goal')
  .action(async (goal: string) => {
    intro('NexusClaw — Plan Mode')

    const s = spinner()
    s.start('Generating plan...')

    try {
      const plan = await runPlanMode(goal)
      s.stop('Plan generated')
      console.log('\n' + plan)
      outro('✓ Done')
    } catch (err: unknown) {
      s.stop('Failed')
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
      process.exit(1)
    }
  })
