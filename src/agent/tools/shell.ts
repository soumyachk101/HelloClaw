import { tool } from 'ai'
import { z } from 'zod'
import { ClawError } from '@/utils/errors'

const BLOCKED_PATTERNS = [
  /\brm\s+-rf\s+\/\b/,
  /\bsudo\b/,
  /\bchmod\s+777\b/,
  /\bcurl\s.*\|\s*bash\b/,
  /\bwget\s.*\|\s*sh\b/,
  /\bmkfs\b/,
  /\bdd\s+if=/,
]

function isBlocked(command: string): boolean {
  return BLOCKED_PATTERNS.some(pattern => pattern.test(command))
}

export const runCommandTool = tool({
  description: 'Execute a shell command. Some dangerous commands are blocked.',
  parameters: z.object({
    command: z.string().describe('The shell command to execute'),
    timeout: z.number().optional().describe('Timeout in milliseconds (default: 30000)'),
  }),
  execute: async ({ command, timeout = 30000 }) => {
    if (isBlocked(command)) {
      throw new ClawError(
        `Blocked dangerous command: ${command}`,
        'COMMAND_BLOCKED',
        true,
        { command },
      )
    }

    try {
      const proc = Bun.spawn(['sh', '-c', command], {
        stdout: 'pipe',
        stderr: 'pipe',
        timeout,
        cwd: process.cwd(),
      })

      const stdout = await new Response(proc.stdout).text()
      const stderr = await new Response(proc.stderr).text()
      const exitCode = await proc.exited

      return {
        success: exitCode === 0,
        exitCode,
        stdout: stdout.slice(0, 10000),
        stderr: stderr.slice(0, 10000),
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      throw new ClawError(`Command failed: ${message}`, 'COMMAND_FAILED', true, { command })
    }
  },
})
