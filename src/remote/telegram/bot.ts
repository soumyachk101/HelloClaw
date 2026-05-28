import { Telegraf } from 'telegraf'
import { getConfig } from '@/config'
import { registerTelegramHandlers } from '@/remote/telegram/handlers'
import { logger } from '@/utils/logger'

async function main() {
  const config = getConfig()

  if (!config.telegram_bot_token) {
    logger.error('Telegram bot token not configured. Set it with: nexusclaw config set telegram_bot_token <token>')
    process.exit(1)
  }

  const bot = new Telegraf(config.telegram_bot_token)

  registerTelegramHandlers(bot)

  bot.launch()
  logger.success('Telegram bot started')

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

main().catch((err) => {
  logger.error(`Telegram bot failed: ${err}`)
  process.exit(1)
})
