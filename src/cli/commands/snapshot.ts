import { Command } from 'commander'
import { readFile, readdir, writeFile } from 'fs/promises'
import { resolve, relative } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { logger } from '@/utils/logger'

const IGNORED = new Set(['.git', 'node_modules', 'dist', '.nexusclaw', '.DS_Store'])

export const snapshotCommand = new Command('snapshot')
  .description('Manage project snapshots')

snapshotCommand
  .command('create')
  .description('Create a compressed snapshot of the current project')
  .option('-o, --output <path>', 'Output file path', 'project.nexus')
  .action(async (options: { output: string }) => {
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
      logger.success(`Snapshot created: ${options.output} (${Object.keys(files).length} files)`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
    }
  })

snapshotCommand
  .command('load <path>')
  .description('Load a snapshot and show its contents')
  .action(async (snapshotPath: string) => {
    try {
      const content = await readFile(snapshotPath, 'utf-8')
      const snapshot = JSON.parse(content) as { created_at: string; files: Record<string, string> }

      console.log(`Snapshot created: ${snapshot.created_at}`)
      console.log(`Files: ${Object.keys(snapshot.files).length}`)
      console.log('\nFile list:')
      for (const path of Object.keys(snapshot.files).sort()) {
        console.log(`  ${path}`)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
    }
  })
