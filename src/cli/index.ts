import { Command } from 'commander'
import { showBanner } from '@/cli/ui/banner'
import { agentCommand } from '@/cli/commands/agent'
import { askCommand } from '@/cli/commands/ask'
import { planCommand } from '@/cli/commands/plan'
import { reviewCommand } from '@/cli/commands/review'
import { gitCommand } from '@/cli/commands/git'
import { memoryCommand } from '@/cli/commands/memory'
import { pluginCommand } from '@/cli/commands/plugin'
import { snapshotCommand } from '@/cli/commands/snapshot'
import { configCommand } from '@/cli/commands/config'
import { chatCommand } from '@/cli/commands/chat'

const program = new Command()

program
  .name('nexusclaw')
  .description('CLI-first autonomous AI coding agent')
  .version('1.0.0')

// Show banner for root command
program.hook('preAction', (thisCommand) => {
  if (thisCommand.name() === 'nexusclaw' && process.argv.length <= 2) {
    showBanner()
  }
})

program.addCommand(agentCommand)
program.addCommand(askCommand)
program.addCommand(planCommand)
program.addCommand(reviewCommand)
program.addCommand(gitCommand)
program.addCommand(memoryCommand)
program.addCommand(pluginCommand)
program.addCommand(snapshotCommand)
program.addCommand(configCommand)
program.addCommand(chatCommand)

program.parse()
