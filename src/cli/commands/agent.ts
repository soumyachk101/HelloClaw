import { Command } from 'commander'
import { intro, outro, spinner } from '@clack/prompts'
import { runAgentMode } from '@/agent/modes/agent'
import { renderDiff, renderStagedChanges } from '@/cli/ui/diff'
import { promptConfirm } from '@/cli/ui/prompts'
import { logger } from '@/utils/logger'

export const agentCommand = new Command('agent')
  .description('Run autonomous agent on workspace')
  .argument('<task>', 'The task for the agent to perform')
  .option('-y, --yes', 'Auto-approve all changes')
  .option('-d, --dry-run', 'Show diff without applying')
  .action(async (task: string, options: { yes?: boolean; dryRun?: boolean }) => {
    intro('NexusClaw — Agent Mode')

    const s = spinner()
    s.start('Agent is working...')

    try {
      const { response, staging } = await runAgentMode(task)
      s.stop('Agent finished')

      if (staging.size > 0) {
        console.log('\n--- Proposed Changes ---')
        renderStagedChanges(staging.getAll())
        renderDiff(staging.getDiff())

        if (options.dryRun) {
          logger.info('Dry run — no changes applied')
        } else if (options.yes) {
          staging.approve()
          await staging.apply()
          logger.success('All changes applied')
        } else {
          const approved = await promptConfirm('Apply these changes?')
          if (approved) {
            staging.approve()
            await staging.apply()
            logger.success('Changes applied')
          } else {
            staging.clear()
            logger.warn('Changes discarded')
          }
        }
      }

      outro('✓ Done')
    } catch (err: unknown) {
      s.stop('Agent failed')
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
      process.exit(1)
    }
  })
