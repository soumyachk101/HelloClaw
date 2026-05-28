import { streamText, type CoreMessage, type CoreTool } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { getConfig } from '@/config'
import { StagingBuffer } from '@/agent/staging'
import { coreTools } from '@/agent/tools'
import { memoryRetriever } from '@/memory/retriever'
import { usageTracker } from '@/tracker/usage'

export type AgentMode = 'agent' | 'ask' | 'plan' | 'review'

interface AgentRunOptions {
  task: string
  mode: AgentMode
  messages?: CoreMessage[]
  onToken?: (token: string) => void
}

export class AgentCore {
  private staging: StagingBuffer
  private workspaceRoot: string

  constructor(workspaceRoot?: string) {
    const config = getConfig()
    this.workspaceRoot = workspaceRoot ?? config.workspace_root
    this.staging = new StagingBuffer(this.workspaceRoot)
  }

  getStaging(): StagingBuffer {
    return this.staging
  }

  async run({ task, mode, messages = [], onToken }: AgentRunOptions): Promise<string> {
    const config = getConfig()

    if (!config.openrouter_api_key) {
      throw new Error('OpenRouter API key not configured. Run: nexusclaw config set openrouter_api_key <key>')
    }

    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: config.openrouter_api_key,
    })

    const model = openrouter(config.model)

    let memoryContext = ''
    if (config.memory_enabled) {
      try {
        const chunks = await memoryRetriever.search(task, 5)
        if (chunks.length > 0) {
          memoryContext = `\n## Project Memory Context\n${chunks.join('\n---\n')}\n`
        }
      } catch {
        // Memory not initialized yet — skip
      }
    }

    const systemPrompt = this.buildSystemPrompt(mode, memoryContext)

    const tools: Record<string, CoreTool> = mode === 'ask'
      ? { read_file: coreTools.read_file, list_directory: coreTools.list_directory, search_web: coreTools.search_web }
      : mode === 'plan'
        ? { read_file: coreTools.read_file, list_directory: coreTools.list_directory }
        : { ...coreTools, memory_search: coreTools.memory_search }

    const allMessages: CoreMessage[] = [
      { role: 'user', content: task },
      ...messages,
    ]

    let fullResponse = ''

    const result = streamText({
      model,
      system: systemPrompt,
      messages: allMessages,
      tools,
      maxSteps: config.max_agent_iterations,
      onFinish: ({ usage }) => {
        if (config.token_tracking) {
          usageTracker.record({
            model: config.model,
            mode,
            tokens_in: usage.promptTokens,
            tokens_out: usage.completionTokens,
          })
        }
      },
    })

    for await (const delta of result.textStream) {
      fullResponse += delta
      if (onToken) onToken(delta)
      else process.stdout.write(delta)
    }

    return fullResponse
  }

  private buildSystemPrompt(mode: AgentMode, memoryContext: string): string {
    const config = getConfig()
    const modeInstructions: Record<AgentMode, string> = {
      agent: `You are in AGENT MODE. You have full tool access to read, write, create, and delete files.
All file mutations are staged in a buffer — they do NOT hit disk until the user approves.
Use tools to accomplish the user's task. Be thorough but focused.`,
      ask: `You are in ASK MODE. This is READ-ONLY. You can read files and search the web, but you CANNOT write or delete anything.
Analyze code, answer questions, explain architecture. Be concise and precise.`,
      plan: `You are in PLAN MODE. Break the user's goal into an ordered, actionable step list.
You can read files to understand the codebase. Output a numbered plan with clear descriptions.
Do NOT execute the plan — just produce it.`,
      review: `You are in REVIEW MODE. Analyze the provided code or diff for issues.
Output structured feedback with severity levels: [CRITICAL], [WARNING], [INFO].
Focus on bugs, security issues, performance, and code quality.`,
    }

    return `You are NexusClaw, an autonomous AI coding agent running locally on the developer's machine.

Current mode: ${mode}
Workspace root: ${config.workspace_root}
Current time: ${new Date().toISOString()}
${memoryContext}
## Rules
${modeInstructions[mode]}
- All tool return values must be serializable
- Be concise in explanations
- Prefer small, focused changes
- If a tool fails, explain the error and try an alternative approach`
  }
}
