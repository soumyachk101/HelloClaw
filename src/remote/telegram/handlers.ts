import { Telegraf, type Context } from 'telegraf'
import { runAskMode } from '@/agent/modes/ask'
import { runAgentMode } from '@/agent/modes/agent'
import { runPlanMode } from '@/agent/modes/plan'
import { reviewFile, reviewDiff } from '@/review/reviewer'
import { gitCommit, gitStatus } from '@/git/operations'
import { generateCommitMessage } from '@/git/ai'
import { getConfig } from '@/config'
import { renderDiff } from '@/cli/ui/diff'

function isAllowedUser(ctx: Context): boolean {
  const config = getConfig()
  const userId = ctx.from?.id.toString()
  const allowedUsers = process.env.TELEGRAM_ALLOWED_USERS?.split(',').map(u => u.trim()) ?? []
  if (allowedUsers.length === 0) return true // No restriction
  return userId ? allowedUsers.includes(userId) : false
}

async function sendLongMessage(ctx: Context, text: string): Promise<void> {
  if (text.length <= 4000) {
    await ctx.replyWithMarkdown(text)
    return
  }

  const chunks: string[] = []
  let remaining = text
  while (remaining.length > 0) {
    chunks.push(remaining.slice(0, 4000))
    remaining = remaining.slice(4000)
  }

  for (const chunk of chunks) {
    await ctx.replyWithMarkdown(chunk)
  }
}

export function registerTelegramHandlers(bot: Telegraf): void {
  bot.command('ask', async (ctx) => {
    if (!isAllowedUser(ctx)) return ctx.reply('Access denied')

    const query = ctx.message.text.replace(/^\/ask\s*/, '').trim()
    if (!query) return ctx.reply('Usage: /ask <query>')

    await ctx.reply('Thinking...')
    try {
      const response = await runAskMode(query)
      await sendLongMessage(ctx, response)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      await ctx.reply(`Error: ${message}`)
    }
  })

  bot.command('agent', async (ctx) => {
    if (!isAllowedUser(ctx)) return ctx.reply('Access denied')

    const task = ctx.message.text.replace(/^\/agent\s*/, '').trim()
    if (!task) return ctx.reply('Usage: /agent <task>')

    await ctx.reply('Agent working...')
    try {
      const { response, staging } = await runAgentMode(task)
      await sendLongMessage(ctx, response)

      if (staging.size > 0) {
        const diff = staging.getDiff()
        await ctx.replyWithMarkdown(`\`\`\`diff\n${diff.slice(0, 3000)}\n\`\`\``)
        await ctx.reply('Type /approve to apply or /reject to discard')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      await ctx.reply(`Error: ${message}`)
    }
  })

  bot.command('plan', async (ctx) => {
    if (!isAllowedUser(ctx)) return ctx.reply('Access denied')

    const goal = ctx.message.text.replace(/^\/plan\s*/, '').trim()
    if (!goal) return ctx.reply('Usage: /plan <goal>')

    await ctx.reply('Generating plan...')
    try {
      const plan = await runPlanMode(goal)
      await sendLongMessage(ctx, plan)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      await ctx.reply(`Error: ${message}`)
    }
  })

  bot.command('review', async (ctx) => {
    if (!isAllowedUser(ctx)) return ctx.reply('Access denied')

    const file = ctx.message.text.replace(/^\/review\s*/, '').trim()
    await ctx.reply('Reviewing...')
    try {
      const result = file ? await reviewFile(file) : await reviewDiff()
      await sendLongMessage(ctx, result)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      await ctx.reply(`Error: ${message}`)
    }
  })

  bot.command('status', async (ctx) => {
    if (!isAllowedUser(ctx)) return ctx.reply('Access denied')

    try {
      const status = await gitStatus()
      const lines = [
        `Branch: ${status.current}`,
        `Modified: ${status.modified.length}`,
        `Staged: ${status.staged.length}`,
        `Untracked: ${status.not_added.length}`,
      ]
      await ctx.reply(lines.join('\n'))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      await ctx.reply(`Error: ${message}`)
    }
  })

  bot.command('approve', async (ctx) => {
    if (!isAllowedUser(ctx)) return ctx.reply('Access denied')
    await ctx.reply('Use the CLI to approve staged changes: nexusclaw agent <task> --yes')
  })

  bot.command('reject', async (ctx) => {
    if (!isAllowedUser(ctx)) return ctx.reply('Access denied')
    await ctx.reply('Use the CLI to reject changes. Staged changes are cleared on next run.')
  })
}
