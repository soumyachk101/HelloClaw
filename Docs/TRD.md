# TRD — NexusClaw
> Technical Requirements Document · v1.0 · Author: Soumya · Status: Draft

---

## 1. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Runtime | Bun | Fast startup, native TS, built-in bundler |
| Language | TypeScript (strict) | Type safety for tool schemas + agent logic |
| CLI Framework | Commander.js | Subcommand routing |
| Terminal UI | Clack + Figlet + Chalk | Spinners, prompts, ASCII art, colors |
| AI SDK | Vercel AI SDK (`ai` package) | Unified interface for streaming + tool calls |
| LLM Router | OpenRouter | Free model access, multi-LLM routing |
| Web Scraping | Firecrawl SDK | Structured web search + scraping |
| Telegram | Telegraf | Bot framework for Telegram |
| Discord | discord.js | Bot framework for Discord |
| Vector Store | LanceDB (local) | Zero-infra local embeddings for memory |
| Embeddings | OpenAI `text-embedding-3-small` | Small, fast, cheap |
| Git | simple-git | Programmatic Git operations |
| Diff Display | `diff` npm package | Unified diff generation |
| Config | `conf` npm package | Persistent config at `~/.nexusclaw/` |
| Testing | Bun test runner | Built-in, fast |

---

## 2. Project Structure

```
nexusclaw/
├── src/
│   ├── cli/
│   │   ├── index.ts              # Commander.js root, registers all commands
│   │   ├── commands/
│   │   │   ├── agent.ts          # Agent mode command handler
│   │   │   ├── ask.ts            # Ask mode command handler
│   │   │   ├── plan.ts           # Plan mode command handler
│   │   │   ├── review.ts         # Review mode command handler
│   │   │   ├── git.ts            # Git mode command handler
│   │   │   ├── memory.ts         # Memory management commands
│   │   │   ├── plugin.ts         # Plugin management commands
│   │   │   ├── snapshot.ts       # Snapshot commands
│   │   │   └── config.ts         # Config management
│   │   └── ui/
│   │       ├── prompts.ts        # Clack prompt wrappers
│   │       ├── banner.ts         # Figlet ASCII banner
│   │       └── diff.ts           # Diff display renderer
│   ├── agent/
│   │   ├── core.ts               # Main agent loop (Vercel AI SDK)
│   │   ├── staging.ts            # StagingBuffer — holds pending file ops
│   │   ├── tools/
│   │   │   ├── index.ts          # Tool registry + loader
│   │   │   ├── fs.ts             # read/write/create/delete/list tools
│   │   │   ├── shell.ts          # run_command tool (sandboxed)
│   │   │   ├── web.ts            # search_web tool (Firecrawl)
│   │   │   └── memory.ts         # memory_search tool
│   │   └── modes/
│   │       ├── agent.ts          # Agent mode logic
│   │       ├── ask.ts            # Ask mode logic
│   │       └── plan.ts           # Plan mode logic
│   ├── memory/
│   │   ├── store.ts              # LanceDB vector store wrapper
│   │   ├── indexer.ts            # Project file indexer
│   │   └── retriever.ts          # Semantic search retriever
│   ├── git/
│   │   ├── operations.ts         # simple-git wrappers
│   │   └── ai.ts                 # AI commit/PR/changelog generation
│   ├── review/
│   │   └── reviewer.ts           # Code review logic
│   ├── remote/
│   │   ├── telegram/
│   │   │   ├── bot.ts            # Telegraf bot setup
│   │   │   └── handlers.ts       # Command handlers
│   │   └── discord/
│   │       ├── bot.ts            # discord.js client setup
│   │       └── handlers.ts       # Slash command handlers
│   ├── plugins/
│   │   ├── loader.ts             # Dynamic plugin loader
│   │   └── types.ts              # NexusClawPlugin interface
│   ├── tracker/
│   │   └── usage.ts              # Token + cost tracking
│   ├── config/
│   │   └── index.ts              # Config read/write via `conf`
│   └── utils/
│       ├── logger.ts             # Chalk-based logger
│       └── fs.ts                 # File system utilities
├── tests/
│   ├── agent.test.ts
│   ├── staging.test.ts
│   ├── memory.test.ts
│   └── git.test.ts
├── plugins/                      # User plugins directory
├── .nexusclaw/                   # Runtime data (gitignored)
│   ├── config.json
│   ├── usage.json
│   └── memory/                   # LanceDB files
├── package.json
├── tsconfig.json
└── bunfig.toml
```

---

## 3. Core Architecture

### 3.1 Agent Loop

```
User Input
    │
    ▼
┌─────────────────────────────────────┐
│           Agent Core                │
│  1. Build system prompt             │
│  2. Inject memory context (RAG)     │
│  3. Stream LLM via Vercel AI SDK    │
│  4. Parse tool calls                │
│  5. Execute tools (non-mutating     │
│     tools execute immediately;      │
│     mutating tools → StagingBuffer) │
│  6. Feed tool results back to LLM   │
│  7. Repeat until task complete      │
│     or max iterations reached       │
└─────────────────────────────────────┘
    │
    ▼
StagingBuffer.flush() → Show diff → User approval → Apply to disk
```

### 3.2 StagingBuffer

```typescript
interface StagedChange {
  type: 'write' | 'create' | 'delete'
  path: string
  originalContent?: string
  newContent?: string
  approved?: boolean
}

class StagingBuffer {
  private changes: Map<string, StagedChange>
  
  stage(change: StagedChange): void
  getAll(): StagedChange[]
  getDiff(): string          // unified diff string
  approve(path?: string): void  // approve all or specific
  reject(path?: string): void
  apply(): Promise<void>    // write approved changes to disk
  clear(): void
}
```

### 3.3 Tool Schema Pattern (Vercel AI SDK)

```typescript
import { tool } from 'ai'
import { z } from 'zod'

export const readFileTool = tool({
  description: 'Read the contents of a file at the given path',
  parameters: z.object({
    path: z.string().describe('Relative path to the file'),
  }),
  execute: async ({ path }) => {
    // Implementation
    return { content, lines: content.split('\n').length }
  },
})
```

### 3.4 Memory Architecture (RAG)

```
Project Files
     │
     ▼
Indexer (on nexusclaw memory init)
  - Chunks files into ~500 token segments
  - Generates embeddings via OpenAI
  - Stores in LanceDB (local)
     │
     ▼
Retriever (on every agent invocation)
  - Embeds the current task/query
  - Top-K semantic search against store
  - Returns relevant chunks as context
     │
     ▼
System Prompt injection:
  "Relevant project context:\n{retrieved_chunks}"
```

---

## 4. Data Models

### 4.1 Config Schema
```typescript
interface NexusClawConfig {
  model: string                    // OpenRouter model string
  openrouter_api_key: string
  telegram_bot_token?: string
  discord_bot_token?: string
  discord_guild_id?: string
  firecrawl_api_key?: string
  openai_api_key?: string          // For embeddings
  memory_enabled: boolean
  token_tracking: boolean
  max_agent_iterations: number     // Default: 20
  safe_mode: boolean               // Require approval for all changes
  workspace_root: string           // Default: process.cwd()
  plugins: string[]                // Paths to loaded plugin files
}
```

### 4.2 Usage Tracking Schema
```typescript
interface SessionUsage {
  session_id: string
  timestamp: string
  model: string
  mode: 'agent' | 'ask' | 'plan' | 'review' | 'git'
  tokens_in: number
  tokens_out: number
  estimated_cost_usd: number
}

interface UsageStore {
  sessions: SessionUsage[]
  total_cost_usd: number
}
```

### 4.3 Plugin Interface
```typescript
interface NexusClawTool {
  name: string
  description: string
  parameters: z.ZodObject<any>
  execute: (args: any) => Promise<any>
}

interface NexusClawPlugin {
  name: string
  version: string
  description: string
  tools: NexusClawTool[]
  onLoad?: () => Promise<void>
  onUnload?: () => Promise<void>
}
```

### 4.4 Plan Schema
```typescript
interface PlanStep {
  id: string
  title: string
  description: string
  enabled: boolean
  status: 'pending' | 'running' | 'done' | 'failed'
  tools_needed?: string[]
}

interface Plan {
  goal: string
  steps: PlanStep[]
  created_at: string
}
```

---

## 5. AI Integration Details

### 5.1 OpenRouter Setup
```typescript
import { createOpenAI } from '@ai-sdk/openai'

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: config.openrouter_api_key,
})

const model = openrouter(config.model)
// e.g., 'google/gemini-flash-1.5' or 'anthropic/claude-3.5-haiku'
```

### 5.2 Streaming with Tool Calls
```typescript
import { streamText } from 'ai'

const result = streamText({
  model,
  system: buildSystemPrompt(mode, memoryContext),
  messages: conversationHistory,
  tools: { ...coreTools, ...pluginTools },
  maxSteps: config.max_agent_iterations,
  onFinish: ({ usage }) => tracker.record(usage),
})

for await (const delta of result.textStream) {
  process.stdout.write(delta)
}
```

### 5.3 System Prompt Structure
```
You are NexusClaw, an autonomous AI coding agent running locally on the developer's machine.

Current mode: {mode}
Workspace root: {workspace_root}
Current time: {timestamp}

## Project Memory Context
{retrieved_memory_chunks}

## Rules
- You MUST stage file mutations; never apply directly
- Always confirm before running shell commands
- Be concise in explanations
- Prefer small, focused changes
```

---

## 6. Remote Bots

### 6.1 Telegram Architecture
```
Telegram API
     │
     ▼
Telegraf Bot (long polling or webhook)
     │
     ▼
Command Router
  /ask    → AskMode.run(query)
  /agent  → AgentMode.run(task)
  /plan   → PlanMode.run(goal)
  /review → Reviewer.run(file)
  /approve → StagingBuffer.approve()
  /reject  → StagingBuffer.reject()
     │
     ▼
Response Formatter (Telegram Markdown)
  - Code blocks for diffs
  - Inline keyboard for approve/reject
```

### 6.2 Discord Architecture
```
discord.js Client
  - Registers slash commands on guild startup
  - Listens for interactionCreate events
  - Uses embeds for structured output
  - Uses MessageActionRow + Buttons for approve/reject
```

---

## 7. Security Considerations

| Risk | Mitigation |
|---|---|
| Agent deletes critical files | All mutations staged; never auto-applied |
| Dangerous shell commands | Blocklist (`rm -rf /`, `sudo`, etc.) + user confirmation |
| API key exposure | Keys stored in `~/.nexusclaw/config.json`, never in codebase |
| Telegram bot public access | Whitelist allowed Telegram user IDs in config |
| Discord bot access | Guild-only slash commands, role-based restrictions |
| Runaway agent iterations | Hard cap via `max_agent_iterations` |

---

## 8. Error Handling Strategy

- All tool executions wrapped in try/catch → errors returned to LLM as tool results
- LLM can self-correct on tool failure (up to 3 retries per tool)
- Unrecoverable errors bubble up with structured `ClawError` type
- All errors logged to `~/.nexusclaw/error.log`

```typescript
class ClawError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean,
    public context?: Record<string, unknown>
  ) {
    super(message)
  }
}
```

---

## 9. Testing Strategy

| Layer | Approach |
|---|---|
| Tools | Unit tests with mocked FS |
| StagingBuffer | Unit tests for all state transitions |
| Agent loop | Integration tests with mocked LLM responses |
| Memory | Unit tests for indexer + retriever |
| Git operations | Tests against a temp git repo |
| CLI commands | E2E tests using Bun subprocess |

Run: `bun test`

---

## 10. Environment Variables

```env
OPENROUTER_API_KEY=
OPENAI_API_KEY=           # For embeddings only
FIRECRAWL_API_KEY=
TELEGRAM_BOT_TOKEN=
DISCORD_BOT_TOKEN=
DISCORD_GUILD_ID=
TELEGRAM_ALLOWED_USERS=  # Comma-separated Telegram user IDs
```

---

## 11. Package.json Scripts

```json
{
  "scripts": {
    "dev": "bun run src/cli/index.ts",
    "build": "bun build src/cli/index.ts --outfile=dist/nexusclaw --compile",
    "test": "bun test",
    "lint": "bunx tsc --noEmit",
    "telegram": "bun run src/remote/telegram/bot.ts",
    "discord": "bun run src/remote/discord/bot.ts"
  }
}
```

---

*Last updated: May 2026*
