import { confirm, select, text, spinner, intro, outro, isCancel, note } from '@clack/prompts'
import chalk from 'chalk'

export function showIntro(message: string): void {
  intro(chalk.cyan('◆') + ' ' + chalk.white.bold(message))
}

export function showOutro(message: string): void {
  outro(chalk.green('✔') + ' ' + message)
}

export function createSpinner() {
  return spinner()
}

export async function promptConfirm(message: string, initialValue = true): Promise<boolean> {
  const result = await confirm({
    message: chalk.white(message),
    initialValue,
  })
  if (isCancel(result)) return false
  return result
}

export async function promptText(message: string, placeholder?: string): Promise<string | null> {
  const result = await text({
    message: chalk.white(message),
    placeholder,
  })
  if (isCancel(result)) return null
  return result
}

export async function promptSelect<T extends string>(
  message: string,
  options: Array<{ value: T; label: string; hint?: string }>,
): Promise<T | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await select({ message: chalk.white(message), options: options as any })
  if (isCancel(result)) return null
  return result as T
}

export function showNote(content: string, title?: string): void {
  note(content, title)
}

export function cancelAndExit(): never {
  console.log(chalk.yellow('\n  Operation cancelled'))
  process.exit(0)
}
