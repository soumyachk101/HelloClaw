import { Command } from 'commander'
import chalk from 'chalk'
import { reviewFile, reviewDiff } from '@/review/reviewer'

export const reviewCommand = new Command('review')
  .description('AI code review')
  .argument('[file]', 'File to review (or use --diff)')
  .option('--diff [ref]', 'Review the diff (staged or since ref)')
  .action(async (file?: string, options?: { diff?: string | boolean }) => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Code Review'))
    console.log(chalk.gray('  │'))

    try {
      if (options?.diff !== undefined) {
        console.log(chalk.gray('  ├─ ') + chalk.gray('Reviewing diff...'))
      } else if (file) {
        console.log(chalk.gray('  ├─ ') + chalk.gray('Reviewing: ') + chalk.white(file))
      } else {
        console.log(chalk.gray('  ├─ ') + chalk.gray('Reviewing staged changes...'))
      }

      console.log(chalk.gray('  │'))

      let result: string
      if (options?.diff !== undefined) {
        result = await reviewDiff(typeof options.diff === 'string' ? options.diff : undefined)
      } else if (file) {
        result = await reviewFile(file)
      } else {
        result = await reviewDiff()
      }

      console.log(chalk.gray('  ├─ ') + chalk.gray('Findings:'))
      console.log(chalk.gray('  │'))

      // Parse and colorize review output
      const lines = result.split('\n')
      for (const line of lines) {
        if (line.includes('[CRITICAL]')) {
          console.log(chalk.gray('  │  ') + chalk.red.bold(line))
        } else if (line.includes('[WARNING]')) {
          console.log(chalk.gray('  │  ') + chalk.yellow(line))
        } else if (line.includes('[INFO]')) {
          console.log(chalk.gray('  │  ') + chalk.cyan(line))
        } else {
          console.log(chalk.gray('  │  ') + line)
        }
      }

      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  └─ ') + chalk.green('✔ Review complete'))
      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.gray('  └─ ') + chalk.red('✖ Failed'))
      console.log(chalk.red(`     ${message}`))
      console.log('')
      process.exit(1)
    }
  })
