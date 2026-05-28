<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/runtime-Bun-orange?style=for-the-badge" alt="Bun">
  <img src="https://img.shields.io/badge/language-TypeScript-blue?style=for-the-badge" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/tests-19%20passing-brightgreen?style=for-the-badge" alt="Tests">
</p>

```
███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗ ██████╗██╗      █████╗ ██╗    ██╗
████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝██╔════╝██║     ██╔══██╗██║    ██║
██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗██║     ██║     ███████║██║ █╗ ██║
██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║██║     ██║     ██╔══██║██║███╗██║
██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║╚██████╗███████╗██║  ██║╚███╔███╔╝
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝
```

<p align="center">
  <strong>CLI-first autonomous AI coding agent with remote control</strong><br>
  <sub>Built with Bun + TypeScript + Vercel AI SDK</sub>
</p>

---

## 🎬 How It Works — Animated Workflow

### The NexusClaw Execution Pipeline

```
  USER INPUT                 PROCESSING                    OUTPUT
  ──────────                 ──────────                    ──────

  "Fix the    ──▶  ┌──────────────────┐  ──▶  ┌──────────────────┐
   auth bug"       │                  │        │                  │
                   │   CLI PARSER     │        │   AGENT CORE     │
                   │                  │        │                  │
                   │  ┌────────────┐  │        │  ┌────────────┐  │
                   │  │  Commander │  │        │  │  System    │  │
                   │  │  .js       │  │        │  │  Prompt    │  │
                   │  └──────┬─────┘  │        │  └──────┬─────┘  │
                   │         │        │        │         │        │
                   │  ┌──────▼─────┐  │        │  ┌──────▼─────┐  │
                   │  │   Mode     │  │        │  │  Memory    │  │
                   │  │   Router   │  │        │  │  Context   │  │
                   │  └──────┬─────┘  │        │  └──────┬─────┘  │
                   └─────────┼────────┘        └─────────┼────────┘
                             │                           │
                             ▼                           ▼
                   ┌──────────────────┐        ┌──────────────────┐
                   │  MODE SELECTION  │        │  LLM STREAMING   │
                   │                  │        │  (OpenRouter)    │
                   │  ┌────────────┐  │        │                  │
                   │  │ agent: ask │  │        │  ┌────────────┐  │
                   │  │ : plan :   │  │        │  │  Vercel    │  │
                   │  │ review     │  │        │  │  AI SDK    │  │
                   │  └────────────┘  │        │  └──────┬─────┘  │
                   └──────────────────┘        └─────────┼────────┘
                                                         │
                                                         ▼
                                               ┌──────────────────┐
                                               │  TOOL EXECUTION  │
                                               │                  │
                                               │  ┌────────────┐  │
                                               │  │ 8 Tools    │  │
                                               │  │ Available  │  │
                                               │  └──────┬─────┘  │
                                               │         │        │
                                               │  ┌──────▼─────┐  │
                                               │  │  STAGING   │  │
                                               │  │  BUFFER    │  │
                                               │  └──────┬─────┘  │
                                               │         │        │
                                               │  ┌──────▼─────┐  │
                                               │  │  USER      │  │
                                               │  │  APPROVAL  │  │
                                               │  └──────┬─────┘  │
                                               │         │        │
                                               │  ┌──────▼─────┐  │
                                               │  │  DISK      │  │
                                               │  │  WRITE     │  │
                                               │  └────────────┘  │
                                               └──────────────────┘
```

### Safety-First Staging Flow

```
  ┌─────────────────────────────────────────────────────────────────┐
  │                    STAGING BUFFER WORKFLOW                       │
  │                                                                 │
  │   LLM Tool Call          Staging Buffer          User Action    │
  │   ─────────────          ──────────────          ───────────    │
  │                                                                 │
  │   write_file()    ──▶   ┌─────────────┐   ──▶   Review diff    │
  │   create_file()   ──▶   │  STAGED     │   ──▶   ✓ Approve     │
  │   delete_file()   ──▶   │  (in-memory)│   ──▶   ✗ Reject      │
  │                         └─────────────┘                         │
  │                              │                                  │
  │                              ▼                                  │
  │                    ┌─────────────────┐                          │
  │                    │  apply()        │                          │
  │                    │  writes to disk │                          │
  │                    │  ONLY approved  │                          │
  │                    └─────────────────┘                          │
  │                                                                 │
  │   ⚠️  NO FILE IS EVER WRITTEN WITHOUT EXPLICIT USER APPROVAL    │
  └─────────────────────────────────────────────────────────────────┘
```

### Complete Mode Comparison

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                        MODE COMPARISON                               │
  ├─────────────────┬───────────┬───────────┬───────────┬──────────────┤
  │   Capability    │   Agent   │    Ask    │   Plan    │   Review     │
  ├─────────────────┼───────────┼───────────┼───────────┼──────────────┤
  │ Read files      │    ✓      │    ✓      │    ✓      │    ✓         │
  │ List directory  │    ✓      │    ✓      │    ✓      │    ✗         │
  │ Write files     │    ✓*     │    ✗      │    ✗      │    ✗         │
  │ Create files    │    ✓*     │    ✗      │    ✗      │    ✗         │
  │ Delete files    │    ✓*     │    ✗      │    ✗      │    ✗         │
  │ Run commands    │    ✓      │    ✗      │    ✗      │    ✗         │
  │ Web search      │    ✓      │    ✓      │    ✗      │    ✗         │
  │ Memory search   │    ✓      │    ✗      │    ✗      │    ✗         │
  │ Code analysis   │    ✓      │    ✓      │    ✓      │    ✓         │
  │ Generate plan   │    ✗      │    ✗      │    ✓      │    ✗         │
  │ Review code     │    ✗      │    ✗      │    ✗      │    ✓         │
  ├─────────────────┼───────────┼───────────┼───────────┼──────────────┤
  │ * = staged      │           │           │           │              │
  │   (requires     │           │           │           │              │
  │    approval)    │           │           │           │              │
  └─────────────────┴───────────┴───────────┴───────────┴──────────────┘
```

### Tool Execution Flow

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                     TOOL EXECUTION LOOP                              │
  │                                                                     │
  │   ┌──────────────┐                                                  │
  │   │  LLM thinks  │                                                  │
  │   └──────┬───────┘                                                  │
  │          │                                                          │
  │          ▼                                                          │
  │   ┌──────────────┐     ┌─────────────────────────────────────────┐ │
  │   │ Tool call?   │─NO─▶│  Return final response                  │ │
  │   └──────┬───────┘     └─────────────────────────────────────────┘ │
  │          │ YES                                                      │
  │          ▼                                                          │
  │   ┌──────────────────────────────────────────────────────────────┐ │
  │   │  TOOL DISPATCHER                                             │ │
  │   │                                                              │ │
  │   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │ │
  │   │  │read_file │ │write_file│ │run_cmd   │ │web_search│       │ │
  │   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │ │
  │   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │ │
  │   │  │create_f  │ │delete_f  │ │list_dir  │ │mem_search│       │ │
  │   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │ │
  │   └──────────────────────────────────────────────────────────────┘ │
  │          │                                                          │
  │          ▼                                                          │
  │   ┌──────────────┐                                                  │
  │   │ Return result │                                                  │
  │   │ to LLM       │                                                  │
  │   └──────┬───────┘                                                  │
  │          │                                                          │
  │          └──────────────────────┐                                   │
  │                                 ▼                                   │
  │                          ┌──────────────┐                           │
  │                          │  LLM thinks  │ (loop back)              │
  │                          └──────────────┘                           │
  │                                                                     │
  │   ⏱️  Max iterations: 20 (configurable)                            │
  └─────────────────────────────────────────────────────────────────────┘
```

### Memory/RAG System Flow

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                    MEMORY SYSTEM (RAG)                               │
  │                                                                     │
  │  INDEXING (one-time, on "memory init")                              │
  │  ──────────────────────────────────────                             │
  │                                                                     │
  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
  │  │  Walk    │───▶│  Chunk   │───▶│  Embed   │───▶│  Store   │     │
  │  │  Files   │    │  (500    │    │  (OpenAI │    │  (LanceDB│     │
  │  │          │    │  tokens) │    │  API)    │    │  )       │     │
  │  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
  │                                                                     │
  │  RETRIEVAL (per-query, automatic)                                   │
  │  ─────────────────────────────────                                  │
  │                                                                     │
  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
  │  │  User    │───▶│  Embed   │───▶│  Vector  │───▶│  Inject  │     │
  │  │  Query   │    │  Query   │    │  Search  │    │  Context │     │
  │  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
  │                                                                     │
  │  The agent automatically has context about your project!            │
  └─────────────────────────────────────────────────────────────────────┘
```

### Remote Control Architecture

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                    REMOTE CONTROL SYSTEM                             │
  │                                                                     │
  │  ┌─────────────┐                    ┌─────────────┐                │
  │  │  📱 Mobile   │                    │  💻 Desktop  │                │
  │  │  Telegram    │                    │  Discord     │                │
  │  │  App         │                    │  Client      │                │
  │  └──────┬──────┘                    └──────┬──────┘                │
  │         │                                  │                        │
  │         │  Bot API                   Bot API│                        │
  │         │                                  │                        │
  │         ▼                                  ▼                        │
  │  ┌─────────────┐                    ┌─────────────┐                │
  │  │  Telegraf   │                    │  discord.js │                │
  │  │  Bot        │                    │  Bot        │                │
  │  └──────┬──────┘                    └──────┬──────┘                │
  │         │                                  │                        │
  │         └──────────────┬───────────────────┘                        │
  │                        │                                            │
  │                        ▼                                            │
  │              ┌─────────────────┐                                    │
  │              │  AGENT CORE     │                                    │
  │              │  (shared)       │                                    │
  │              └────────┬────────┘                                    │
  │                       │                                             │
  │                       ▼                                             │
  │              ┌─────────────────┐                                    │
  │              │  Terminal       │                                    │
  │              │  Output         │                                    │
  │              └─────────────────┘                                    │
  │                                                                     │
  │  Security: TELEGRAM_ALLOWED_USERS=123456,789012                    │
  └─────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Deep Dive

### Project Structure

```
nexusclaw/
│
├── package.json                    # Dependencies & npm scripts
├── tsconfig.json                   # TypeScript strict config
├── bunfig.toml                     # Bun runtime configuration
│
├── src/                            # Source code
│   ├── config/                     # Configuration layer
│   │   └── index.ts                # Persistent config via `conf` package
│   │                               #   Location: ~/.nexusclaw/config.json
│   │                               #   Manages: API keys, model, settings
│   │
│   ├── utils/                      # Shared utilities
│   │   ├── errors.ts               # ClawError class
│   │   │                           #   Properties: code, recoverable, context
│   │   ├── logger.ts               # Chalk-based colored logging
│   │   │                           #   Methods: info, success, warn, error, debug
│   │   └── fs.ts                   # File system helpers
│   │                               #   safePath() prevents directory traversal
│   │
│   ├── agent/                      # 🧠 CORE ENGINE (heart of NexusClaw)
│   │   ├── core.ts                 # AgentCore class
│   │   │                           #   - run(task, mode) → response
│   │   │                           #   - Builds system prompts per mode
│   │   │                           #   - Injects memory context from RAG
│   │   │                           #   - Streams via Vercel AI SDK
│   │   │                           #   - Handles tool call loops (max 20)
│   │   │                           #   - Tracks token usage
│   │   │
│   │   ├── staging.ts              # StagingBuffer — THE SAFETY LAYER
│   │   │                           #   - stage(change) → queue file mutation
│   │   │                           #   - getDiff() → unified diff preview
│   │   │                           #   - approve(path?) → mark as approved
│   │   │                           #   - reject(path?) → mark as rejected
│   │   │                           #   - apply() → write ONLY approved to disk
│   │   │                           #   - clear() → discard everything
│   │   │
│   │   ├── modes/                  # Mode implementations
│   │   │   ├── agent.ts            # Full tool access, staged mutations
│   │   │   ├── ask.ts              # Read-only, no writes allowed
│   │   │   └── plan.ts             # Planning only, no execution
│   │   │
│   │   └── tools/                  # Tool definitions (8 tools)
│   │       ├── index.ts            # Tool registry
│   │       ├── fs.ts               # read_file, list_directory, write_file,
│   │       │                       # create_file, delete_file
│   │       ├── shell.ts            # run_command (with dangerous command blocklist)
│   │       ├── web.ts              # search_web via Firecrawl API
│   │       └── memory.ts           # memory_search (RAG vector lookup)
│   │
│   ├── memory/                     # 🧠 RAG SYSTEM (Retrieval Augmented Generation)
│   │   ├── store.ts                # LanceDB vector store wrapper
│   │   │                           #   - initMemoryStore() → create/open DB
│   │   │                           #   - insertEntries() → store chunks
│   │   │                           #   - searchEntries() → vector similarity search
│   │   ├── indexer.ts              # File chunking + embedding pipeline
│   │   │                           #   - Walks project directory
│   │   │                           #   - Filters by file extension
│   │   │                           #   - Chunks by 500 tokens with overlap
│   │   │                           #   - Generates embeddings via OpenAI
│   │   │                           #   - Stores in LanceDB
│   │   └── retriever.ts            # Query interface
│   │                               #   - Embeds user query → vector search → top-K
│   │
│   ├── git/                        # 🔀 GIT AUTOMATION
│   │   ├── operations.ts           # simple-git wrappers
│   │   │                           #   - gitStatus, gitBranch, gitCommit
│   │   │                           #   - gitAdd, gitPush, gitDiff, gitLog
│   │   └── ai.ts                   # AI-powered git workflows
│   │                               #   - generateCommitMessage() → conventional commits
│   │                               #   - generatePRDescription() → title + body
│   │                               #   - generateChangelog() → grouped by type
│   │
│   ├── review/                     # 🔍 CODE REVIEW
│   │   └── reviewer.ts             # File & diff review with severity levels
│   │                               #   - reviewFile(path) → [CRITICAL] [WARNING] [INFO]
│   │                               #   - reviewDiff(ref?) → analyze staged/unstaged
│   │
│   ├── cli/                        # 💻 CLI INTERFACE
│   │   ├── index.ts                # Commander.js root — registers all commands
│   │   │
│   │   ├── ui/                     # Terminal UI components
│   │   │   ├── banner.ts           # Figlet ASCII art banner
│   │   │   ├── prompts.ts          # Clack prompt wrappers
│   │   │   │                       #   - promptConfirm, promptText, promptSelect
│   │   │   └── diff.ts             # Colored diff renderer
│   │   │                           #   - renderDiff() → green/red/cyan output
│   │   │
│   │   └── commands/               # Command handlers
│   │       ├── agent.ts            # nexusclaw agent <task> [--yes] [--dry-run]
│   │       ├── ask.ts              # nexusclaw ask <query> [--save]
│   │       ├── plan.ts             # nexusclaw plan <goal>
│   │       ├── review.ts           # nexusclaw review [file] [--diff]
│   │       ├── git.ts              # nexusclaw git [commit|pr|changelog|status]
│   │       ├── memory.ts           # nexusclaw memory [init|search|clear|count]
│   │       ├── plugin.ts           # nexusclaw plugin [add|remove|list]
│   │       ├── snapshot.ts         # nexusclaw snapshot [create|load]
│   │       └── config.ts           # nexusclaw config [show|set|reset]
│   │
│   ├── remote/                     # 🤖 REMOTE CONTROL
│   │   ├── telegram/               # Telegram bot
│   │   │   ├── bot.ts              # Telegraf client setup
│   │   │   └── handlers.ts         # /ask, /agent, /plan, /review, /status
│   │   │
│   │   └── discord/                # Discord bot
│   │       ├── bot.ts              # discord.js client setup
│   │       └── handlers.ts         # Slash commands: /ask, /agent, /plan, etc.
│   │
│   ├── plugins/                    # 🔌 PLUGIN SYSTEM
│   │   ├── types.ts                # NexusClawPlugin interface
│   │   │                           #   - name, version, description, tools
│   │   │                           #   - onLoad(), onUnload() lifecycle hooks
│   │   └── loader.ts               # Dynamic .ts file loader
│   │                               #   - loadPlugin(path) → import + register
│   │                               #   - unloadPlugin(name) → cleanup
│   │
│   └── tracker/                    # 📊 USAGE TRACKING
│       └── usage.ts                # Token counting + cost estimation
│                                   #   - Per-session tracking
│                                   #   - Model-based pricing tables
│                                   #   - Saves to .nexusclaw/usage.json
│
├── tests/                          # 🧪 TEST SUITE (19 tests, 39 assertions)
│   ├── staging.test.ts             # 12 tests — StagingBuffer operations
│   ├── git.test.ts                 # 4 tests — Git operations
│   ├── agent.test.ts               # 2 tests — ClawError, config shape
│   └── memory.test.ts              # 1 test — Memory entry shape
│
└── plugins/                        # User plugins directory
    └── example.plugin.ts           # Example plugin template
```

---

## 🚀 Quick Start (Beginner's Guide)

### Step 1: Install Bun

Bun is a fast JavaScript runtime (like Node.js but faster).

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (WSL)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version
```

### Step 2: Get Your API Key

You need an **OpenRouter API key** (free tier available):

1. Go to [https://openrouter.ai](https://openrouter.ai)
2. Click "Sign Up" (free)
3. Go to **Keys** in the sidebar
4. Click **Create Key**
5. Copy the key (it starts with `sk-or-...`)

### Step 3: Install NexusClaw

```bash
# Clone the repository
git clone https://github.com/yourusername/nexusclaw.git
cd nexusclaw

# Install all dependencies
bun install

# Set your API key
bun run dev config set openrouter_api_key sk-or-YOUR_KEY_HERE

# Verify it works
bun run dev -- --help
```

### Step 4: Your First Commands

```bash
# ─── SAFE START: Ask Mode (read-only, no changes made) ───

# Ask about your project
bun run dev ask "What files are in this directory?"

# Ask about code
bun run dev ask "Explain what package.json does"

# Save output to a file
bun run dev ask "List all TypeScript files" --save files.txt


# ─── PLAN MODE (generates a plan, no execution) ───

# Generate a plan
bun run dev plan "Add user authentication with JWT"

# You'll see a step-by-step plan without any changes


# ─── AGENT MODE (autonomous, with safety staging) ───

# Run the agent
bun run dev agent "Create a simple Express server"

# The agent will:
# 1. Think about the task
# 2. Create files (staged, NOT written yet)
# 3. Show you the diff
# 4. Ask: "Apply these changes? [Y/n]"
# 5. ONLY write to disk if you approve


# ─── REVIEW MODE (code analysis) ───

# Review a file
bun run dev review package.json

# Review staged changes
bun run dev review --diff
```

---

## 📖 Command Reference

### `nexusclaw agent <task>`

Run the autonomous agent. All file changes are staged and require approval.

```bash
bun run dev agent "Create a REST API"
bun run dev agent "Fix TypeScript errors" --yes         # Auto-approve
bun run dev agent "Refactor database" --dry-run         # Preview only
```

| Option | Description |
|--------|-------------|
| `-y, --yes` | Auto-approve all changes |
| `-d, --dry-run` | Show diff without applying |

---

### `nexusclaw ask <query>`

Read-only Q&A mode. Can read files, cannot write.

```bash
bun run dev ask "What does the StagingBuffer do?"
bun run dev ask "How many files are in src/?" --save answer.txt
```

| Option | Description |
|--------|-------------|
| `-s, --save <path>` | Save output to file |

---

### `nexusclaw plan <goal>`

Generate a step-by-step plan. No execution.

```bash
bun run dev plan "Add WebSocket support"
bun run dev plan "Migrate from REST to GraphQL"
```

---

### `nexusclaw review [file]`

AI code review with severity levels.

```bash
bun run dev review src/index.ts            # Review file
bun run dev review --diff                  # Review staged changes
bun run dev review --diff HEAD~1           # Review since ref
```

---

### `nexusclaw git [subcommand]`

Git automation with AI.

```bash
bun run dev git status                     # Show status
bun run dev git commit                     # AI commit message
bun run dev git commit -m "my message"     # Manual message
bun run dev git branch feature-name        # Create branch
bun run dev git pr                         # Push + create PR
bun run dev git changelog                  # Generate changelog
```

---

### `nexusclaw memory [subcommand]`

Manage the RAG memory system.

```bash
bun run dev memory init                    # Index project files
bun run dev memory search "auth"           # Search memory
bun run dev memory count                   # Show chunk count
bun run dev memory clear                   # Clear all data
```

---

### `nexusclaw config [subcommand]`

Manage configuration.

```bash
bun run dev config show                    # Show all (keys masked)
bun run dev config set <key> <value>       # Set value
bun run dev config reset                   # Reset to defaults
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `model` | string | `google/gemini-flash-1.5` | LLM model |
| `openrouter_api_key` | string | — | OpenRouter key (required) |
| `openai_api_key` | string | — | OpenAI key (for embeddings) |
| `firecrawl_api_key` | string | — | Firecrawl key (web search) |
| `telegram_bot_token` | string | — | Telegram bot token |
| `discord_bot_token` | string | — | Discord bot token |
| `discord_guild_id` | string | — | Discord server ID |
| `memory_enabled` | boolean | `true` | Enable RAG memory |
| `token_tracking` | boolean | `true` | Track usage |
| `max_agent_iterations` | number | `20` | Max tool loops |
| `safe_mode` | boolean | `true` | Block dangerous commands |

---

### `nexusclaw plugin [subcommand]`

Manage plugins.

```bash
bun run dev plugin add ./plugins/my-plugin.ts
bun run dev plugin list
bun run dev plugin remove my-plugin
```

---

### `nexusclaw snapshot [subcommand]`

Project snapshots for sharing.

```bash
bun run dev snapshot create                 # Create snapshot
bun run dev snapshot create -o backup.nexus # Custom filename
bun run dev snapshot load backup.nexus      # View contents
```

---

## 🔌 Plugin Development

Create custom tools by writing a plugin file:

```typescript
// plugins/weather.plugin.ts
import { tool } from 'ai'
import { z } from 'zod'
import type { NexusClawPlugin } from '../src/plugins/types'

const weatherTool = tool({
  description: 'Get current weather for a city',
  parameters: z.object({
    city: z.string().describe('City name'),
  }),
  execute: async ({ city }) => {
    // Your implementation here
    return { city, temp: '22°C', condition: 'Sunny' }
  },
})

const plugin: NexusClawPlugin = {
  name: 'weather',
  version: '1.0.0',
  description: 'Weather lookup tool',
  tools: {
    get_weather: weatherTool,
  },
  onLoad: async () => {
    console.log('Weather plugin loaded!')
  },
  onUnload: async () => {
    console.log('Weather plugin unloaded')
  },
}

export default plugin
```

**Load and use:**

```bash
# Load the plugin
bun run dev plugin add ./plugins/weather.plugin.ts

# Now the agent can use it
bun run dev ask "What's the weather in Tokyo?"

# List loaded plugins
bun run dev plugin list

# Unload
bun run dev plugin remove weather
```

---

## 🤖 Remote Control Setup

### Telegram Bot

**1. Create a bot:**

1. Open Telegram, search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot`
3. Follow the prompts (choose a name and username)
4. Copy the bot token (looks like `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

**2. Configure:**

```bash
bun run dev config set telegram_bot_token YOUR_BOT_TOKEN
```

**3. Run the bot:**

```bash
bun run telegram
```

**4. Use it (send these commands to your bot):**

```
/ask What files are in this project?
/agent Fix the TypeScript errors
/plan Add dark mode support
/review src/index.ts
/status
```

**5. Optional — Restrict access:**

```bash
# Only allow specific Telegram user IDs
export TELEGRAM_ALLOWED_USERS=123456789,987654321
```

---

### Discord Bot

**1. Create a bot:**

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → name it → "Create"
3. Go to "Bot" tab → "Add Bot"
4. Copy the token
5. Enable "Message Content Intent" under "Privileged Gateway Intents"

**2. Configure:**

```bash
bun run dev config set discord_bot_token YOUR_BOT_TOKEN
bun run dev config set discord_guild_id YOUR_SERVER_ID
```

**3. Run the bot:**

```bash
bun run discord
```

**4. Use slash commands in Discord:**

```
/ask query:How does auth work?
/agent task:Fix the login bug
/plan goal:Add WebSocket support
/status
```

---

## 🧪 Testing

```bash
# Run all tests
bun test

# Run specific file
bun test tests/staging.test.ts

# Verbose output
bun test --verbose
```

**Test results:**

```
tests/staging.test.ts   — 12 tests ✓ (StagingBuffer operations)
tests/git.test.ts       —  4 tests ✓ (Git operations)
tests/agent.test.ts     —  2 tests ✓ (ClawError, config shape)
tests/memory.test.ts    —  1 test  ✓ (Memory entry shape)

Total: 19 tests, 39 assertions, 0 failures
```

---

## 🛡️ Security Features

### Command Blocklist

Dangerous commands are automatically blocked:

```
BLOCKED:
  rm -rf /
  sudo anything
  chmod 777
  curl ... | bash
  wget ... | sh
  mkfs
  dd if=
```

### Path Traversal Prevention

All file operations are validated against the workspace root:

```typescript
// This is blocked:
safePath('/home/user/project', '../../etc/passwd')
// Error: Path traversal detected
```

### API Key Protection

- Stored in `~/.nexusclaw/config.json` (user home, not project)
- `config show` displays masked: `***x4o2`
- Never logged or sent to LLM

---

## 📊 Token & Cost Tracking

Every session tracks tokens and estimated cost:

```
Tokens: 1,234 in / 567 out
Model: google/gemini-flash-1.5
Cost: $0.0003
```

**Pricing table:**

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| google/gemini-flash-1.5 | $0.075 | $0.30 |
| google/gemini-pro-1.5 | $1.25 | $5.00 |
| anthropic/claude-3.5-sonnet | $3.00 | $15.00 |
| anthropic/claude-3-haiku | $0.25 | $1.25 |
| openai/gpt-4o | $2.50 | $10.00 |
| openai/gpt-4o-mini | $0.15 | $0.60 |

View usage: `cat .nexusclaw/usage.json`

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| `OpenRouter API key not configured` | `bun run dev config set openrouter_api_key sk-or-...` |
| `Memory store not initialized` | `bun run dev memory init` |
| `OpenAI API key required for embeddings` | `bun run dev config set openai_api_key sk-...` |
| TypeScript errors after pulling | `bun install && bun run lint` |
| Tests failing | `bun install && bun test` |

---

## 🤝 Contributing

```bash
# 1. Fork and clone
git clone https://github.com/yourusername/nexusclaw.git
cd nexusclaw

# 2. Create branch
bun run dev git branch my-feature

# 3. Make changes and test
bun test
bun run lint

# 4. Commit and push
bun run dev git commit
bun run dev git pr
```

---

## 📄 License

MIT License

---

<p align="center">
  <strong>Built with Bun, TypeScript, and Vercel AI SDK</strong>
</p>
