import chalk from 'chalk'

export function renderDiff(diff: string): void {
  const lines = diff.split('\n')

  console.log('')
  console.log(chalk.cyan('  ┌─ Diff ─────────────────────────────────────────────────────'))

  for (const line of lines) {
    if (line.startsWith('+++') || line.startsWith('---')) {
      console.log(chalk.cyan('  │ ') + chalk.bold.white(line))
    } else if (line.startsWith('@@')) {
      console.log(chalk.cyan('  │ ') + chalk.cyan(line))
    } else if (line.startsWith('+')) {
      console.log(chalk.cyan('  │ ') + chalk.green(line))
    } else if (line.startsWith('-')) {
      console.log(chalk.cyan('  │ ') + chalk.red(line))
    } else {
      console.log(chalk.cyan('  │ ') + chalk.gray(line))
    }
  }

  console.log(chalk.cyan('  └────────────────────────────────────────────────────────────'))
  console.log('')
}

export function renderStagedChanges(changes: Array<{ path: string; type: string; approved?: boolean }>): void {
  console.log('')
  console.log(chalk.cyan('  ┌─ Staged Changes ───────────────────────────────────────────'))
  console.log(chalk.cyan('  │'))

  for (const change of changes) {
    const status = change.approved === true
      ? chalk.green('✔ approved')
      : change.approved === false
        ? chalk.red('✖ rejected')
        : chalk.yellow('○ pending')

    const typeColor = change.type === 'create'
      ? chalk.green
      : change.type === 'delete'
        ? chalk.red
        : chalk.yellow

    const typeLabel = change.type.padEnd(8)
    console.log(chalk.cyan('  │ ') + `  ${status}  ${typeColor(typeLabel)} ${chalk.white(change.path)}`)
  }

  console.log(chalk.cyan('  │'))
  console.log(chalk.cyan('  └────────────────────────────────────────────────────────────'))
  console.log('')
}

export function renderToolCall(toolName: string, args: Record<string, unknown>): void {
  const argsStr = Object.entries(args)
    .map(([k, v]) => `${k}=${chalk.white(String(v).slice(0, 50))}`)
    .join(' ')

  console.log(chalk.cyan('  ◆ ') + chalk.gray('tool') + ' ' + chalk.yellow(toolName) + ' ' + chalk.gray(argsStr))
}

export function renderToolResult(success: boolean, message?: string): void {
  if (success) {
    console.log(chalk.green('  ✔ ') + chalk.gray(message ?? 'done'))
  } else {
    console.log(chalk.red('  ✖ ') + chalk.gray(message ?? 'failed'))
  }
}

export function renderThinking(): void {
  process.stdout.write(chalk.cyan('\r  ⠋ ') + chalk.gray('Thinking...'))
}

export function clearThinking(): void {
  process.stdout.write('\r' + ' '.repeat(50) + '\r')
}
