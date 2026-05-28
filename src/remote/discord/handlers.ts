import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  type ChatInputCommandInteraction,
  type TextChannel,
} from 'discord.js'
import { runAskMode } from '@/agent/modes/ask'
import { runAgentMode } from '@/agent/modes/agent'
import { runPlanMode } from '@/agent/modes/plan'
import { reviewFile, reviewDiff } from '@/review/reviewer'
import { gitStatus } from '@/git/operations'
import { getConfig } from '@/config'
import { logger } from '@/utils/logger'

const commands = [
  new SlashCommandBuilder().setName('ask').setDescription('Ask a question')
    .addStringOption(opt => opt.setName('query').setDescription('The question').setRequired(true)),
  new SlashCommandBuilder().setName('agent').setDescription('Run autonomous agent')
    .addStringOption(opt => opt.setName('task').setDescription('The task').setRequired(true)),
  new SlashCommandBuilder().setName('plan').setDescription('Generate a plan')
    .addStringOption(opt => opt.setName('goal').setDescription('The goal').setRequired(true)),
  new SlashCommandBuilder().setName('review').setDescription('Code review')
    .addStringOption(opt => opt.setName('file').setDescription('File to review')),
  new SlashCommandBuilder().setName('status').setDescription('Show git status'),
].map(cmd => cmd.toJSON())

export async function registerSlashCommands(client: Client): Promise<void> {
  const config = getConfig()

  if (!config.discord_bot_token || !config.discord_guild_id) {
    logger.error('Discord bot token and guild ID required')
    return
  }

  const rest = new REST({ version: '10' }).setToken(config.discord_bot_token)

  try {
    await rest.put(
      Routes.applicationGuildCommands(client.user!.id, config.discord_guild_id),
      { body: commands },
    )
    logger.success('Discord slash commands registered')
  } catch (err) {
    logger.error(`Failed to register commands: ${err}`)
  }
}

export function handleDiscordInteraction(interaction: ChatInputCommandInteraction): void {
  // Run async handlers without blocking
  const handler = async () => {
    if (!interaction.isChatInputCommand()) return

    switch (interaction.commandName) {
      case 'ask': {
        const query = interaction.options.getString('query', true)
        await interaction.deferReply()
        try {
          const response = await runAskMode(query)
          await interaction.editReply(response.slice(0, 2000))
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err)
          await interaction.editReply(`Error: ${message}`)
        }
        break
      }
      case 'agent': {
        const task = interaction.options.getString('task', true)
        await interaction.deferReply()
        try {
          const { response, staging } = await runAgentMode(task)
          await interaction.editReply(response.slice(0, 2000))
          if (staging.size > 0) {
            const diff = staging.getDiff().slice(0, 1500)
            await interaction.followUp(`\`\`\`diff\n${diff}\n\`\`\``)
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err)
          await interaction.editReply(`Error: ${message}`)
        }
        break
      }
      case 'plan': {
        const goal = interaction.options.getString('goal', true)
        await interaction.deferReply()
        try {
          const plan = await runPlanMode(goal)
          await interaction.editReply(plan.slice(0, 2000))
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err)
          await interaction.editReply(`Error: ${message}`)
        }
        break
      }
      case 'review': {
        const file = interaction.options.getString('file')
        await interaction.deferReply()
        try {
          const result = file ? await reviewFile(file) : await reviewDiff()
          await interaction.editReply(result.slice(0, 2000))
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err)
          await interaction.editReply(`Error: ${message}`)
        }
        break
      }
      case 'status': {
        try {
          const status = await gitStatus()
          await interaction.reply(
            `Branch: ${status.current}\nModified: ${status.modified.length}\nStaged: ${status.staged.length}`,
          )
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err)
          await interaction.reply(`Error: ${message}`)
        }
        break
      }
    }
  }

  handler().catch(err => logger.error(`Discord handler error: ${err}`))
}
