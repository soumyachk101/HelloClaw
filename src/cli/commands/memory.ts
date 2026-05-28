import { Command } from 'commander'
import chalk from 'chalk'
import { initMemoryStore, clearMemoryStore, getMemoryCount } from '@/memory/store'
import { indexProject } from '@/memory/indexer'
import { memoryRetriever } from '@/memory/retriever'

export const memoryCommand = new Command('memory')
  .description('Manage project memory')

memoryCommand
  .command('init')
  .description('Index current project into memory store')
  .action(async () => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Memory Init'))
    console.log(chalk.gray('  │'))

    try {
      console.log(chalk.gray('  ├─ ') + chalk.gray('Initializing memory store...'))
      await initMemoryStore()

      console.log(chalk.gray('  ├─ ') + chalk.gray('Indexing project files...'))
      const count = await indexProject()

      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  └─ ') + chalk.green(`✔ Indexed ${count} chunks`))
      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.gray('  └─ ') + chalk.red('✖ Failed'))
      console.log(chalk.red(`     ${message}`))
      console.log('')
      process.exit(1)
    }
  })

memoryCommand
  .command('search <query>')
  .description('Search project memory')
  .option('-k, --top-k <n>', 'Number of results', '5')
  .action(async (query: string, options: { topK?: string }) => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Memory Search'))
    console.log(chalk.gray('  │'))
    console.log(chalk.gray('  ├─ ') + chalk.gray('Query: ') + chalk.white(query))
    console.log(chalk.gray('  │'))

    try {
      await initMemoryStore()
      const results = await memoryRetriever.search(query, parseInt(options.topK ?? '5'))

      if (results.length === 0) {
        console.log(chalk.gray('  ├─ ') + chalk.yellow('No results found'))
        console.log(chalk.gray('  └─ ') + chalk.gray('Run: nexusclaw memory init'))
      } else {
        console.log(chalk.gray('  ├─ ') + chalk.gray(`Found ${results.length} results:`))
        console.log(chalk.gray('  │'))

        for (let i = 0; i < results.length; i++) {
          const lines = results[i]!.split('\n')
          console.log(chalk.gray('  ├─ ') + chalk.white.bold(`[${i + 1}]`))
          for (const line of lines) {
            console.log(chalk.gray('  │  ') + line)
          }
          console.log(chalk.gray('  │'))
        }

        console.log(chalk.gray('  └─ ') + chalk.green('✔ Done'))
      }

      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.gray('  └─ ') + chalk.red('✖ Failed'))
      console.log(chalk.red(`     ${message}`))
      console.log('')
    }
  })

memoryCommand
  .command('clear')
  .description('Clear all memory data')
  .action(async () => {
    try {
      await initMemoryStore()
      await clearMemoryStore()
      console.log('')
      console.log(chalk.green('  ✔ ') + chalk.gray('Memory cleared'))
      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.red(`  ✖ ${message}`))
    }
  })

memoryCommand
  .command('count')
  .description('Show number of stored memory chunks')
  .action(async () => {
    try {
      await initMemoryStore()
      const count = await getMemoryCount()
      console.log('')
      console.log(chalk.cyan('  ◆ ') + chalk.gray('Memory contains ') + chalk.white.bold(String(count)) + chalk.gray(' chunks'))
      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.red(`  ✖ ${message}`))
    }
  })
