import { Command } from 'commander'
import chalk from 'chalk'
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
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Agent Mode'))
    console.log(chalk.gray('  │'))
    console.log(chalk.gray('  ├─ ') + chalk.gray('Task: ') + chalk.white(task))
    console.log(chalk.gray('  │'))

    try {
      console.log(chalk.gray('  ├─ ') + chalk.gray('Thinking...'))

      const { response, staging } = await runAgentMode(task)

      console.log(chalk.gray('  │'))

      if (staging.size > 0) {
        console.log(chalk.gray('  ├─ ') + chalk.yellow(`${staging.size} change(s) staged`))
        console.log(chalk.gray('  │'))

        renderStagedChanges(staging.getAll())
        renderDiff(staging.getDiff())

        if (options.dryRun) {
          console.log(chalk.gray('  └─ ') + chalk.gray('Dry run — no changes applied'))
        } else if (options.yes) {
          staging.approve()
          await staging.apply()
          console.log(chalk.gray('  └─ ') + chalk.green('✔ All changes applied'))
        } else {
          const approved = await promptConfirm('Apply these changes?')
          if (approved) {
            staging.approve()
            await staging.apply()
            console.log(chalk.gray('  └─ ') + chalk.green('✔ Changes applied'))
          } else {
            staging.clear()
            console.log(chalk.gray('  └─ ') + chalk.yellow('Changes discarded'))
          }
        }
      } else {
        console.log(chalk.gray('  └─ ') + chalk.green('✔ Complete'))
      }

      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.gray('  └─ ') + chalk.red('✖ Failed'))
      console.log(chalk.red(`     ${message}`))
      console.log('')
      process.exit(1)
    }
  })
