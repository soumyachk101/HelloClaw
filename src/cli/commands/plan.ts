import { Command } from 'commander'
import chalk from 'chalk'
import { runPlanMode } from '@/agent/modes/plan'

export const planCommand = new Command('plan')
  .description('Generate a step-by-step plan for a goal')
  .argument('<goal>', 'The high-level goal')
  .action(async (goal: string) => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Plan Mode'))
    console.log(chalk.gray('  │'))
    console.log(chalk.gray('  ├─ ') + chalk.gray('Goal: ') + chalk.white(goal))
    console.log(chalk.gray('  │'))
    console.log(chalk.gray('  ├─ ') + chalk.gray('Generating plan...'))

    try {
      const plan = await runPlanMode(goal)

      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Plan:'))
      console.log(chalk.gray('  │'))

      // Print plan with proper indentation
      const lines = plan.split('\n')
      for (const line of lines) {
        console.log(chalk.gray('  │  ') + line)
      }

      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  └─ ') + chalk.green('✔ Plan generated'))
      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.gray('  └─ ') + chalk.red('✖ Failed'))
      console.log(chalk.red(`     ${message}`))
      console.log('')
      process.exit(1)
    }
  })
