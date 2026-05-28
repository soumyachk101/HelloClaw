import chalk from 'chalk'

export function renderDiff(diff: string): void {
  const lines = diff.split('\n')

  for (const line of lines) {
    if (line.startsWith('+++') || line.startsWith('---')) {
      console.log(chalk.bold(line))
    } else if (line.startsWith('@@')) {
      console.log(chalk.cyan(line))
    } else if (line.startsWith('+')) {
      console.log(chalk.green(line))
    } else if (line.startsWith('-')) {
      console.log(chalk.red(line))
    } else {
      console.log(line)
    }
  }
}

export function renderStagedChanges(changes: Array<{ path: string; type: string; approved?: boolean }>): void {
  console.log(chalk.bold('\nStaged Changes:'))
  for (const change of changes) {
    const status = change.approved === true
      ? chalk.green('✓ approved')
      : change.approved === false
        ? chalk.red('✗ rejected')
        : chalk.yellow('○ pending')

    const typeColor = change.type === 'create'
      ? chalk.green
      : change.type === 'delete'
        ? chalk.red
        : chalk.yellow

    console.log(`  ${status}  ${typeColor(change.type.padEnd(8))} ${change.path}`)
  }
  console.log()
}
