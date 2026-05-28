import { Command } from 'commander'
import chalk from 'chalk'
import { generateCommitMessage, generatePRDescription, generateChangelog } from '@/git/ai'
import { gitCommit, gitBranch, gitPush, gitStatus, gitDiff } from '@/git/operations'
import { renderDiff } from '@/cli/ui/diff'
import { promptConfirm } from '@/cli/ui/prompts'

export const gitCommand = new Command('git')
  .description('Git workflow automation')

gitCommand
  .command('commit')
  .description('AI-generated commit message from staged diff')
  .option('-m, --message <msg>', 'Use provided message instead of AI')
  .action(async (options: { message?: string }) => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Git Commit'))
    console.log(chalk.gray('  │'))

    try {
      const diff = await gitDiff(true)
      if (!diff.trim()) {
        console.log(chalk.gray('  ├─ ') + chalk.yellow('No staged changes'))
        console.log(chalk.gray('  └─ ') + chalk.gray('Stage files first with: git add .'))
        console.log('')
        process.exit(0)
      }

      console.log(chalk.gray('  ├─ ') + chalk.gray('Staged changes found'))
      console.log(chalk.gray('  │'))

      let message: string
      if (options.message) {
        message = options.message
      } else {
        console.log(chalk.gray('  ├─ ') + chalk.gray('Generating commit message...'))
        message = await generateCommitMessage()
        console.log(chalk.gray('  │'))
      }

      console.log(chalk.gray('  ├─ ') + chalk.gray('Proposed message:'))
      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  │  ') + chalk.white.bold(message))
      console.log(chalk.gray('  │'))

      const approved = await promptConfirm('Use this commit message?')
      if (approved) {
        await gitCommit(message)
        console.log(chalk.gray('  └─ ') + chalk.green('✔ Committed'))
      } else {
        console.log(chalk.gray('  └─ ') + chalk.yellow('Cancelled'))
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

gitCommand
  .command('branch <name>')
  .description('Create a feature branch')
  .action(async (name: string) => {
    try {
      const branchName = await gitBranch(name)
      console.log('')
      console.log(chalk.green('  ✔ ') + chalk.gray('Created branch: ') + chalk.white.bold(branchName))
      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.red(`  ✖ ${message}`))
      process.exit(1)
    }
  })

gitCommand
  .command('pr')
  .description('Push and create a GitHub PR with AI-generated description')
  .action(async () => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Git PR'))
    console.log(chalk.gray('  │'))

    try {
      console.log(chalk.gray('  ├─ ') + chalk.gray('Generating PR description...'))
      const { title, body } = await generatePRDescription()

      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Title: ') + chalk.white.bold(title))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Body:'))
      console.log(chalk.gray('  │'))

      const bodyLines = body.split('\n')
      for (const line of bodyLines.slice(0, 10)) {
        console.log(chalk.gray('  │  ') + line)
      }
      if (bodyLines.length > 10) {
        console.log(chalk.gray('  │  ') + chalk.gray(`... (${bodyLines.length - 10} more lines)`))
      }

      console.log(chalk.gray('  │'))
      const approved = await promptConfirm('Push and create PR?')
      if (approved) {
        console.log(chalk.gray('  ├─ ') + chalk.gray('Pushing...'))
        await gitPush()

        console.log(chalk.gray('  ├─ ') + chalk.gray('Creating PR...'))
        const proc = Bun.spawn([
          'gh', 'pr', 'create',
          '--title', title,
          '--body', body,
        ], { stdout: 'pipe', stderr: 'pipe' })

        const stdout = await new Response(proc.stdout).text()
        const exitCode = await proc.exited

        if (exitCode === 0) {
          console.log(chalk.gray('  └─ ') + chalk.green('✔ PR created: ') + chalk.white(stdout.trim()))
        } else {
          const stderr = await new Response(proc.stderr).text()
          console.log(chalk.gray('  └─ ') + chalk.red('✖ gh pr create failed'))
          console.log(chalk.red(`     ${stderr}`))
        }
      } else {
        console.log(chalk.gray('  └─ ') + chalk.yellow('Cancelled'))
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

gitCommand
  .command('changelog')
  .description('Generate CHANGELOG from recent commits')
  .action(async () => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Git Changelog'))
    console.log(chalk.gray('  │'))
    console.log(chalk.gray('  ├─ ') + chalk.gray('Generating changelog...'))

    try {
      const changelog = await generateChangelog()

      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Changelog:'))
      console.log(chalk.gray('  │'))

      const lines = changelog.split('\n')
      for (const line of lines) {
        console.log(chalk.gray('  │  ') + line)
      }

      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  └─ ') + chalk.green('✔ Done'))
      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.gray('  └─ ') + chalk.red('✖ Failed'))
      console.log(chalk.red(`     ${message}`))
      console.log('')
      process.exit(1)
    }
  })

gitCommand
  .command('status')
  .description('Show git status')
  .action(async () => {
    try {
      const status = await gitStatus()

      console.log('')
      console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Git Status'))
      console.log(chalk.gray('  │'))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Branch: ') + chalk.white.bold(status.current ?? 'detached'))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Modified: ') + (status.modified.length > 0 ? chalk.yellow(String(status.modified.length)) : chalk.green('0')))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Staged: ') + (status.staged.length > 0 ? chalk.green(String(status.staged.length)) : chalk.gray('0')))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Untracked: ') + (status.not_added.length > 0 ? chalk.yellow(String(status.not_added.length)) : chalk.gray('0')))
      console.log(chalk.gray('  └─ ') + chalk.gray('Deleted: ') + (status.deleted.length > 0 ? chalk.red(String(status.deleted.length)) : chalk.gray('0')))
      console.log('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(chalk.red(`  ✖ ${message}`))
    }
  })
