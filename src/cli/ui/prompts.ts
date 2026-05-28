import { confirm, select, text, spinner, intro, outro, isCancel } from '@clack/prompts'
import { logger } from '@/utils/logger'

export function showIntro(message: string): void {
  intro(message)
}

export function showOutro(message: string): void {
  outro(message)
}

export function createSpinner() {
  return spinner()
}

export async function promptConfirm(message: string, initialValue = true): Promise<boolean> {
  const result = await confirm({ message, initialValue })
  if (isCancel(result)) return false
  return result
}

export async function promptText(message: string, placeholder?: string): Promise<string | null> {
  const result = await text({ message, placeholder })
  if (isCancel(result)) return null
  return result
}

export async function promptSelect<T extends string>(
  message: string,
  options: Array<{ value: T; label: string; hint?: string }>,
): Promise<T | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await select({ message, options: options as any })
  if (isCancel(result)) return null
  return result as T
}

export function cancelAndExit(): never {
  logger.warn('Operation cancelled')
  process.exit(0)
}
