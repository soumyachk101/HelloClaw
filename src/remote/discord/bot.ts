import { Client, GatewayIntentBits } from 'discord.js'
import { getConfig } from '@/config'
import { registerSlashCommands, handleDiscordInteraction } from '@/remote/discord/handlers'
import { logger } from '@/utils/logger'

async function main() {
  const config = getConfig()

  if (!config.discord_bot_token) {
    logger.error('Discord bot token not configured. Set it with: nexusclaw config set discord_bot_token <token>')
    process.exit(1)
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  })

  client.once('ready', async () => {
    logger.success(`Discord bot logged in as ${client.user?.tag}`)
    await registerSlashCommands(client)
  })

  client.on('interactionCreate', (interaction) => {
    handleDiscordInteraction(interaction as any)
  })

  await client.login(config.discord_bot_token)
}

main().catch((err) => {
  logger.error(`Discord bot failed: ${err}`)
  process.exit(1)
})
