# CLAUDE.md — NexusClaw AI Instructions
> This file tells AI coding assistants (Claude Code, Cursor, Copilot) everything they need to know about this project.

---

## Project Identity

**Name:** NexusClaw  
**Type:** CLI-first autonomous AI coding agent  
**Runtime:** Bun + TypeScript (strict mode)  
**Purpose:** OpenClaw clone with extended features — local agent, remote Telegram/Discord control, persistent memory, Git automation

---

## Golden Rules (Never Break These)

1. **Never apply file mutations directly to disk.** All writes/creates/deletes MUST go through `StagingBuffer`. The only method that writes to disk is `StagingBuffer.apply()` and it must only be called after explicit user approval.

2. **Never hardcode API keys.** All credentials live in `~/.nexusclaw/config.json`, read via `src/config/index.ts`.

3. **All tools must return serializable objects.** Tool return values are fed back to the LLM. No class instances, no circular refs.

4. **Strict TypeScript — no `any`.** Use `unknown` + type narrowing or proper interfaces. Run `bun run lint` before considering a task done.

5. **All async errors must be caught.** Unhandled promise rejections crash the CLI. Wrap tool executions in try/catch and return structured errors.

6. **Bun-native imports only.** Do not use `fs`, `path` from Node — use `Bun.file()`, `Bun.write()`, `import.meta.dir`. Exception: `simple-git` and `discord.js` use Node-compatible APIs.

---

## File System Rules

```
src/cli/          → Only CLI wiring. No business logic here.
src/agent/        → Core agent loop + tools + staging. Heart of the app.
src/memory/       → LanceDB vector store. Isolated, no cross-imports from remote/.
src/remote/       → Telegram + Discord bots. They call agent/ APIs, not vice versa.
src/git/          → Git operations. Never called by agent tools directly — exposed via CLI command.
src/plugins/      → Plugin loader only. Plugins live in /plugins dir.
src/config/       → Single source of truth for config. No other file reads config directly.
src/utils/        → Shared helpers only. No business logic.
```

**Circular import rule:** `remote/` → `agent/` → `tools/` → `utils/`. Never reverse.

---

## Key Interfaces (Memorize These)

### StagedChange
```typescript
interface StagedChange {
  type: 'write' | 'create' | 'delete'
  path: string                   // Always relative to workspace_root
  originalContent?: string
  newContent?: string
  approved?: boolean             // Default: undefined (pending)
}
```

### NexusClawPlugin
```typescript
interface NexusClawPlugin {
  name: string
  version: string
  description: string
  tools: NexusClawTool[]
  onLoad?: () => Promise<void>
  onUnload?: () => Promise<void>
}
```

### ClawError
```typescript
class ClawError extends Error {
  constructor(
    message: string,
    public code: string,          // e.g., 'TOOL_FAILED', 'CONFIG_MISSING'
    public recoverable: boolean,
    public context?: Record<string, unknown>
  )
}
```

---

## How the Agent Loop Works

```
1. User provides task (CLI arg or Telegram/Discord message)
2. AgentCore.run(task, mode) called
3. Memory retriever runs → top-K relevant chunks fetched
4. System prompt built with mode + memory context
5. streamText() called with all tools registered
6. For each tool call from LLM:
   - If non-mutating (read, search, shell readonly): execute immediately
   - If mutating (write, create, delete): push to StagingBuffer
7. Tool result returned to LLM
8. Loop until LLM stops calling tools (task done) or maxSteps hit
9. After completion: show StagingBuffer.getDiff() to user
10. User approves/rejects → StagingBuffer.apply() if approved
```

---

## Adding a New Tool

1. Create file in `src/agent/tools/<toolname>.ts`
2. Export using Vercel AI SDK `tool()` helper with Zod schema
3. Register in `src/agent/tools/index.ts` — add to `coreTools` object
4. If the tool mutates files, it must call `stagingBuffer.stage()` NOT write directly
5. Write unit test in `tests/tools/<toolname>.test.ts`

**Template:**
```typescript
// src/agent/tools/example.ts
import { tool } from 'ai'
import { z } from 'zod'
import { ClawError } from '@/utils/errors'

export const exampleTool = tool({
  description: 'Clear one-line description of what this tool does',
  parameters: z.object({
    param: z.string().describe('What this param is for'),
  }),
  execute: async ({ param }) => {
    try {
      // implementation
      return { success: true, result: 'data' }
    } catch (err) {
      throw new ClawError('Tool failed', 'EXAMPLE_FAILED', true, { param })
    }
  },
})
```

---

## Adding a New CLI Command

1. Create `src/cli/commands/<command>.ts`
2. Export a Commander `Command` object
3. Register in `src/cli/index.ts` via `program.addCommand()`

**Template:**
```typescript
// src/cli/commands/mycommand.ts
import { Command } from 'commander'
import { intro, outro, spinner } from '@clack/prompts'

export const myCommand = new Command('mycommand')
  .description('What this command does')
  .argument('[input]', 'Optional input')
  .option('-f, --flag', 'Some flag')
  .action(async (input, options) => {
    intro('NexusClaw — My Command')
    const s = spinner()
    s.start('Doing the thing...')
    // implementation
    s.stop('Done!')
    outro('✓ Complete')
  })
```

---

## Telegram Bot Patterns

- All Telegram message text is sent via `ctx.reply()` or `ctx.replyWithMarkdown()`
- Diffs are sent as code blocks: ` ```diff\n${diff}\n``` `
- Approve/Reject buttons use `Markup.inlineKeyboard`
- Long outputs (>4096 chars) must be split or truncated with a "truncated, see terminal" note
- The bot must only respond to user IDs in `config.telegram_allowed_users`
- Bot runs independently: `bun run telegram` — does NOT need the CLI to be running

---

## Memory Layer Usage

```typescript
// Initialize (run once per project)
await memoryStore.init(workspaceRoot)

// In agent loop (automatic — called by AgentCore)
const context = await memoryRetriever.search(task, topK: 5)

// Manual indexing (on file save hooks or explicit command)
await memoryIndexer.indexFile(filePath)

// Do NOT call LanceDB directly — always go through store.ts wrapper
```

---

## Config Access Pattern

```typescript
// CORRECT
import { getConfig, setConfig } from '@/config'
const config = getConfig()
const apiKey = config.openrouter_api_key

// WRONG — never do this
import conf from '~/.nexusclaw/config.json'
```

---

## Token Tracking Pattern

Every `streamText()` call MUST include `onFinish`:
```typescript
onFinish: ({ usage, finishReason }) => {
  usageTracker.record({
    model: config.model,
    mode: currentMode,
    tokens_in: usage.promptTokens,
    tokens_out: usage.completionTokens,
  })
}
```

---

## Shell Command Safety

The `run_command` tool must:
1. Check command against blocklist before execution
2. Show command to user and wait for confirmation (unless `--yes` flag passed)
3. Set a 30-second timeout
4. Capture both stdout and stderr
5. Never run as root or with sudo

**Blocklist includes:** `rm -rf /`, `sudo`, `chmod 777`, `curl | bash`, `wget | sh`, `mkfs`, `dd if=`

---

## Testing Conventions

```typescript
// tests/agent/staging.test.ts
import { expect, test, describe } from 'bun:test'
import { StagingBuffer } from '@/agent/staging'

describe('StagingBuffer', () => {
  test('should stage a write without applying to disk', async () => {
    const buffer = new StagingBuffer('/tmp/test-workspace')
    buffer.stage({ type: 'write', path: 'test.ts', newContent: 'hello' })
    expect(buffer.getAll()).toHaveLength(1)
    // File should NOT exist yet
    expect(await Bun.file('/tmp/test-workspace/test.ts').exists()).toBe(false)
  })
})
```

---

## Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---|---|
| `fs.writeFileSync(path, content)` | `stagingBuffer.stage({ type: 'write', path, newContent })` |
| `process.env.OPENROUTER_API_KEY` | `getConfig().openrouter_api_key` |
| Calling `LanceDB` directly | `memoryStore.search()` / `memoryIndexer.index()` |
| `any` type | `unknown` + type guard or proper interface |
| `console.log()` in production code | `logger.info()` / `logger.error()` from `@/utils/logger` |
| Direct Telegram message in agent code | Agent returns result → remote handler formats + sends |

---

## Path Aliases (tsconfig)

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

Use `@/agent/staging`, `@/config`, etc. throughout.

---

## Running the Project

```bash
# Development
bun run dev agent "refactor the auth module"
bun run dev ask "explain this codebase"
bun run dev plan "build a REST API"
bun run dev review src/auth.ts
bun run dev git commit
bun run dev memory init

# Run bots (separate terminals)
bun run telegram
bun run discord

# Tests
bun test

# Type check
bun run lint

# Build binary
bun run build
./dist/nexusclaw agent "do something"
```

---

## When You're Unsure

1. Check `src/agent/tools/fs.ts` — it's the canonical example of a well-implemented tool
2. Check `src/agent/staging.ts` — it's the canonical example of state management
3. Check `src/cli/commands/agent.ts` — it's the canonical example of a CLI command wiring to agent logic
4. If a pattern doesn't exist in codebase yet, follow the templates in this file

---

*This file is the source of truth for AI assistants working on this codebase. Keep it updated as the project evolves.*
