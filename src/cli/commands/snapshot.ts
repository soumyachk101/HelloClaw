import { Command } from 'commander'
import chalk from 'chalk'
import { readFile, readdir, writeFile } from 'fs/promises'
import { resolve, relative } from 'path'

const IGNORED = new Set(['.git', 'node_modules', 'dist', '.nexusclaw', '.DS_Store'])

export const snapshotCommand = new Command('snapshot')
  .description('Manage project snapshots')

snapshotCommand
  .command('create')
  .description('Create a compressed snapshot of the current project')
  .option('-o, --output <path>', 'Output file path', 'project.nexus')
  .action(async (options: { output: string }) => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Create Snapshot'))
    console.log(chalk.gray('  │'))
    console.log(chalk.gray('  ├─ ') + chalk.gray('Scanning project...'))

    try {
      const root = process.cwd()
      const files: Record<string, string> = {}

      async function walk(dir: string) {
        const entries = await readdir(dir, { withFileTypes: true })
        for (const entry of entries) {
          if (IGNORED.has(entry.name)) continue
          const fullPath = resolve(dir, entry.name)
          if (entry.isDirectory()) {
            await walk(fullPath)
          } else {
            try {
              const content = await readFile(fullPath, 'utf-8')
              files[relative(root, fullPath)] = content
            } catch {
              // Skip binary files
            }
          }
        }
      }

      await walk(root)

      const snapshot = {
        created_at: new Date().toISOString(),
        root,
        files,
      }

      await writeFile(options.output, JSON.stringify(snapshot, null, 2))

      console.log(chalk.gray('  ├─ ') + chalk.gray('Files: ') + chalk.white(String(Object.keys(files).length)))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Output: ') + chalk.white(options.output))
      console.log(chalk.gray('  └─ ') + chalk.green('✔ Snapshot created'))
      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.gray('  └─ ') + chalk.red('✖ Failed'))
      console.log(chalk.red(`     ${message}`))
      console.log('')
    }
  })

snapshotCommand
  .command('load <path>')
  .description('Load a snapshot and show its contents')
  .action(async (snapshotPath: string) => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Load Snapshot'))
    console.log(chalk.gray('  │'))

    try {
      const content = await readFile(snapshotPath, 'utf-8')
      const snapshot = JSON.parse(content) as { created_at: string; files: Record<string, string> }

      console.log(chalk.gray('  ├─ ') + chalk.gray('Created: ') + chalk.white(snapshot.created_at))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Files: ') + chalk.white(String(Object.keys(snapshot.files).length)))
      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Contents:'))
      console.log(chalk.gray('  │'))

      const filePaths = Object.keys(snapshot.files).sort()
      for (let i = 0; i < filePaths.length; i++) {
        const path = filePaths[i]!
        const isLast = i === filePaths.length - 1
        const prefix = isLast ? '  └─ ' : '  ├─ '
        console.log(chalk.gray(prefix) + chalk.white(path))
      }

      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.gray('  └─ ') + chalk.red('✖ Failed'))
      console.log(chalk.red(`     ${message}`))
      console.log('')
    }
  })
