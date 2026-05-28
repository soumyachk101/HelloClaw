import { Command } from 'commander'
import { intro, outro, spinner } from '@clack/prompts'
import { generateCommitMessage, generatePRDescription, generateChangelog } from '@/git/ai'
import { gitCommit, gitBranch, gitPush, gitStatus, gitAdd, gitDiff } from '@/git/operations'
import { renderDiff } from '@/cli/ui/diff'
import { promptConfirm } from '@/cli/ui/prompts'
import { logger } from '@/utils/logger'

export const gitCommand = new Command('git')
  .description('Git workflow automation')

gitCommand
  .command('commit')
  .description('AI-generated commit message from staged diff')
  .option('-m, --message <msg>', 'Use provided message instead of AI')
  .action(async (options: { message?: string }) => {
    intro('NexusClaw — Git Commit')

    const s = spinner()
    try {
      const diff = await gitDiff(true)
      if (!diff.trim()) {
        logger.warn('No staged changes. Stage files first with: git add .')
        process.exit(0)
      }

      let message: string
      if (options.message) {
        message = options.message
      } else {
        s.start('Generating commit message...')
        message = await generateCommitMessage()
        s.stop('Message generated')
        console.log(`\nProposed message:\n${message}\n`)
      }

      const approved = await promptConfirm('Use this commit message?')
      if (approved) {
        await gitCommit(message)
        logger.success('Committed')
      } else {
        logger.warn('Commit cancelled')
      }

      outro('✓ Done')
    } catch (err: unknown) {
      s.stop('Failed')
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
      process.exit(1)
    }
  })

gitCommand
  .command('branch <name>')
  .description('Create a feature branch')
  .action(async (name: string) => {
    try {
      const branchName = await gitBranch(name)
      logger.success(`Switched to branch: ${branchName}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
      process.exit(1)
    }
  })

gitCommand
  .command('pr')
  .description('Push and create a GitHub PR with AI-generated description')
  .action(async () => {
    intro('NexusClaw — Git PR')

    const s = spinner()
    try {
      s.start('Generating PR description...')
      const { title, body } = await generatePRDescription()
      s.stop('PR description generated')

      console.log(`\nTitle: ${title}\n\n${body}\n`)

      const approved = await promptConfirm('Push and create PR?')
      if (approved) {
        s.start('Pushing...')
        await gitPush()
        s.stop('Pushed')

        // Create PR via gh CLI
        const proc = Bun.spawn([
          'gh', 'pr', 'create',
          '--title', title,
          '--body', body,
        ], { stdout: 'pipe', stderr: 'pipe' })

        const stdout = await new Response(proc.stdout).text()
        const exitCode = await proc.exited

        if (exitCode === 0) {
          logger.success(`PR created: ${stdout.trim()}`)
        } else {
          const stderr = await new Response(proc.stderr).text()
          logger.error(`gh pr create failed: ${stderr}`)
        }
      } else {
        logger.warn('PR cancelled')
      }

      outro('✓ Done')
    } catch (err: unknown) {
      s.stop('Failed')
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
      process.exit(1)
    }
  })

gitCommand
  .command('changelog')
  .description('Generate CHANGELOG from recent commits')
  .action(async () => {
    const s = spinner()
    s.start('Generating changelog...')

    try {
      const changelog = await generateChangelog()
      s.stop('Done')
      console.log('\n' + changelog)
    } catch (err: unknown) {
      s.stop('Failed')
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
      process.exit(1)
    }
  })

gitCommand
  .command('status')
  .description('Show git status')
  .action(async () => {
    try {
      const status = await gitStatus()
      console.log('Branch:', status.current)
      console.log('Modified:', status.modified.length)
      console.log('Staged:', status.staged.length)
      console.log('Untracked:', status.not_added.length)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      logger.error(message)
    }
  })
