import { Command } from 'commander'
import * as readline from 'readline'
import chalk from 'chalk'
import { AgentCore, type AgentMode } from '@/agent/core'
import { StagingBuffer } from '@/agent/staging'
import { renderDiff, renderStagedChanges } from '@/cli/ui/diff'
import { getConfig } from '@/config'
import type { CoreMessage } from 'ai'

export const chatCommand = new Command('chat')
  .description('Interactive chat mode with AI agent')
  .option('-m, --mode <mode>', 'Agent mode: agent, ask, plan, review', 'ask')
  .option('-s, --system <prompt>', 'Custom system prompt')
  .action(async (options: { mode: string; system?: string }) => {
    const mode = options.mode as AgentMode
    const agent = new AgentCore()
    const messages: CoreMessage[] = []

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const prompt = (): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(chalk.cyan('  You: '), resolve)
      })
    }

    // Welcome banner
    console.log('')
    console.log(chalk.cyan('  ╭─────────────────────────────────────────────────────────────╮'))
    console.log(chalk.cyan('  │') + chalk.white.bold('                     NexusClaw Chat Mode                       ') + chalk.cyan('│'))
    console.log(chalk.cyan('  ├─────────────────────────────────────────────────────────────┤'))
    console.log(chalk.cyan('  │') + chalk.gray('  Type your message and press Enter to chat                  ') + chalk.cyan('│'))
    console.log(chalk.cyan('  │') + chalk.gray('  Commands:                                                   ') + chalk.cyan('│'))
    console.log(chalk.cyan('  │') + chalk.yellow('    /mode <agent|ask|plan|review>') + chalk.gray('  - Switch mode            ') + chalk.cyan('│'))
    console.log(chalk.cyan('  │') + chalk.yellow('    /diff') + chalk.gray('                          - Show staged diff         ') + chalk.cyan('│'))
    console.log(chalk.cyan('  │') + chalk.yellow('    /approve') + chalk.gray('                        - Approve staged changes   ') + chalk.cyan('│'))
    console.log(chalk.cyan('  │') + chalk.yellow('    /reject') + chalk.gray('                         - Reject staged changes    ') + chalk.cyan('│'))
    console.log(chalk.cyan('  │') + chalk.yellow('    /clear') + chalk.gray('                          - Clear chat history       ') + chalk.cyan('│'))
    console.log(chalk.cyan('  │') + chalk.yellow('    /exit') + chalk.gray('                           - Exit chat                ') + chalk.cyan('│'))
    console.log(chalk.cyan('  ╰─────────────────────────────────────────────────────────────╯'))
    console.log('')
    console.log(chalk.gray('  Mode: ') + chalk.white.bold(mode) + chalk.gray('  │  Model: ') + chalk.white.bold(getConfig().model))
    console.log(chalk.gray('  Type /exit to quit'))
    console.log('')

    let currentMode: AgentMode = mode
    let stagingBuffer: StagingBuffer | null = null

    while (true) {
      try {
        const input = await prompt()

        if (!input.trim()) continue

        // Handle commands
        if (input.startsWith('/')) {
          const [command, ...args] = input.split(' ')

          switch (command) {
            case '/exit':
            case '/quit':
              console.log('')
              console.log(chalk.cyan('  ◆ ') + chalk.gray('Goodbye!'))
              console.log('')
              rl.close()
              process.exit(0)

            case '/mode':
              const newMode = args[0] as AgentMode
              if (['agent', 'ask', 'plan', 'review'].includes(newMode)) {
                currentMode = newMode
                console.log(chalk.green(`  ✔ Mode switched to: ${currentMode}`))
              } else {
                console.log(chalk.red('  ✖ Invalid mode. Use: agent, ask, plan, review'))
              }
              continue

            case '/diff':
              if (stagingBuffer && stagingBuffer.size > 0) {
                renderStagedChanges(stagingBuffer.getAll())
                renderDiff(stagingBuffer.getDiff())
              } else {
                console.log(chalk.gray('  • No staged changes'))
              }
              continue

            case '/approve':
              if (stagingBuffer && stagingBuffer.size > 0) {
                stagingBuffer.approve()
                await stagingBuffer.apply()
                console.log(chalk.green('  ✔ All changes applied'))
                stagingBuffer = null
              } else {
                console.log(chalk.gray('  • No changes to approve'))
              }
              continue

            case '/reject':
              if (stagingBuffer && stagingBuffer.size > 0) {
                stagingBuffer.clear()
                stagingBuffer = null
                console.log(chalk.red('  ✖ Changes discarded'))
              } else {
                console.log(chalk.gray('  • No changes to reject'))
              }
              continue

            case '/clear':
              messages.length = 0
              console.clear()
              console.log(chalk.green('  ✔ Chat history cleared'))
              continue

            case '/help':
              console.log('')
              console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Available Commands'))
              console.log(chalk.gray('  │'))
              console.log(chalk.gray('  ├─ ') + chalk.yellow('/mode <mode>') + chalk.gray('   - Switch mode (agent, ask, plan, review)'))
              console.log(chalk.gray('  ├─ ') + chalk.yellow('/diff') + chalk.gray('         - Show staged diff'))
              console.log(chalk.gray('  ├─ ') + chalk.yellow('/approve') + chalk.gray('       - Approve staged changes'))
              console.log(chalk.gray('  ├─ ') + chalk.yellow('/reject') + chalk.gray('        - Reject staged changes'))
              console.log(chalk.gray('  ├─ ') + chalk.yellow('/clear') + chalk.gray('         - Clear chat history'))
              console.log(chalk.gray('  └─ ') + chalk.yellow('/exit') + chalk.gray('          - Exit chat'))
              console.log('')
              continue

            default:
              console.log(chalk.red(`  ✖ Unknown command: ${command}. Type /help for commands.`))
              continue
          }
        }

        // Add user message to history
        messages.push({ role: 'user', content: input })

        // Show thinking indicator
        process.stdout.write(chalk.gray('\n  NexusClaw: '))

        // Run agent
        let fullResponse = ''
        const onToken = (token: string) => {
          process.stdout.write(token)
        }

        try {
          fullResponse = await agent.run({
            task: input,
            mode: currentMode,
            messages: messages.slice(0, -1), // Exclude current message (already in task)
            onToken,
          })
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : String(err)
          console.log(chalk.red(`\n  ✖ Error: ${errorMsg}`))
          continue
        }

        // Add assistant response to history
        messages.push({ role: 'assistant', content: fullResponse })

        // Check for staged changes
        const staging = agent.getStaging()
        if (staging.size > 0) {
          stagingBuffer = staging
          console.log('')
          console.log(chalk.yellow(`  ⚠ ${staging.size} change(s) staged. Type /diff to review, /approve to apply, /reject to discard.`))
        }

        console.log('') // Newline after response

      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('readline')) {
          // User pressed Ctrl+C
          console.log('')
          console.log(chalk.cyan('  ◆ ') + chalk.gray('Goodbye!'))
          console.log('')
          rl.close()
          process.exit(0)
        }
        const errorMsg = err instanceof Error ? err.message : String(err)
        console.log(chalk.red(`\n  ✖ Error: ${errorMsg}`))
      }
    }
  })
