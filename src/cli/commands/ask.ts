import { Command } from 'commander'
import chalk from 'chalk'
import { runAskMode } from '@/agent/modes/ask'
import { writeFile } from 'fs/promises'

export const askCommand = new Command('ask')
  .description('Read-only Q&A mode')
  .argument('<query>', 'The question to ask')
  .option('-s, --save <path>', 'Save output to a file')
  .action(async (query: string, options: { save?: string }) => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Ask Mode'))
    console.log(chalk.gray('  │'))
    console.log(chalk.gray('  ├─ ') + chalk.gray('Query: ') + chalk.white(query))
    console.log(chalk.gray('  │'))
    console.log(chalk.gray('  ├─ ') + chalk.gray('Thinking...'))

    try {
      const response = await runAskMode(query)

      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Response:'))
      console.log(chalk.gray('  │'))

      // Print response with proper indentation
      const lines = response.split('\n')
      for (const line of lines) {
        console.log(chalk.gray('  │  ') + line)
      }

      if (options.save) {
        await writeFile(options.save, response, 'utf-8')
        console.log(chalk.gray('  │'))
        console.log(chalk.gray('  ├─ ') + chalk.green('✔ Saved to ') + chalk.white(options.save))
      }

      console.log(chalk.gray('  └─ ') + chalk.green('✔ Complete'))
      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.gray('  └─ ') + chalk.red('✖ Failed'))
      console.log(chalk.red(`     ${message}`))
      console.log('')
      process.exit(1)
    }
  })
