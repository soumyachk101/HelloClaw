<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:6e40c9,100:0d1117&height=220&section=header&text=NexusClaw&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=CLI-first%20autonomous%20AI%20coding%20agent&descSize=18&descAlignY=55" width="100%"/>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/version-1.0.0-6e40c9?style=for-the-badge&logo=git&logoColor=white" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/Bun-f9f1e1?style=for-the-badge&logo=bun&logoColor=black" alt="Bun"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/MIT-green?style=for-the-badge" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/tests-19%20passing-brightgreen?style=for-the-badge" alt="Tests"></a>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=6e40c9&center=true&vCenter=true&multiline=true&repeat=true&width=600&height=80&lines=Autonomous+AI+coding+agent;With+remote+control+via+Telegram+%26+Discord;Powered+by+Vercel+AI+SDK+%2B+OpenRouter" alt="Typing SVG" />
</p>

<br>

---

## 🎬 How It Works

### Execution Pipeline

```mermaid
flowchart TB
    subgraph Input["📥 INPUT"]
        A1["🖥️ CLI Command"]
        A2["📱 Telegram Bot"]
        A3["💬 Discord Bot"]
    end

    subgraph Core["🧠 AGENT CORE"]
        direction TB
        B1["Commander.js Parser"] --> B2["Mode Router"]
        B2 --> B3{"Mode?"}
        B3 -->|"agent"| B4["Full Tools"]
        B3 -->|"ask"| B5["Read Only"]
        B3 -->|"plan"| B6["Plan Only"]
        B3 -->|"review"| B7["Review Only"]
        B4 --> B8["System Prompt Builder"]
        B5 --> B8
        B6 --> B8
        B7 --> B8
        B8 --> B9["Memory Context\n(LanceDB RAG)"]
        B9 --> B10["Vercel AI SDK\nStream"]
    end

    subgraph Tools["🔧 TOOL SYSTEM"]
        direction TB
        C1["read_file"]
        C2["write_file"]
        C3["create_file"]
        C4["delete_file"]
        C5["run_command"]
        C6["search_web"]
        C7["memory_search"]
        C8["list_directory"]
    end

    subgraph Safety["🛡️ SAFETY LAYER"]
        direction TB
        D1["Staging Buffer\n(in-memory)"] --> D2{"User\nApproval?"}
        D2 -->|"✓ Approve"| D3["Write to Disk"]
        D2 -->|"✗ Reject"| D4["Discard Changes"]
    end

    subgraph Output["📤 OUTPUT"]
        E1["Terminal"]
        E2["Telegram"]
        E3["Discord"]
    end

    Input --> Core
    Core --> Tools
    Tools --> Safety
    Safety --> Output

    style Input fill:#1a1b26,stroke:#6e40c9,stroke-width:2px,color:#fff
    style Core fill:#1a1b26,stroke:#6e40c9,stroke-width:2px,color:#fff
    style Tools fill:#1a1b26,stroke:#6e40c9,stroke-width:2px,color:#fff
    style Safety fill:#1a1b26,stroke:#ff6b6b,stroke-width:2px,color:#fff
    style Output fill:#1a1b26,stroke:#6e40c9,stroke-width:2px,color:#fff
    style A1 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style A2 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style A3 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style B1 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style B2 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style B3 fill:#3d3d5c,stroke:#ff6b6b,color:#fff
    style B4 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style B5 fill:#2d2d3f,stroke:#facc15,color:#fff
    style B6 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style B7 fill:#2d2d3f,stroke:#f472b6,color:#fff
    style B8 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style B9 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style B10 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style C1 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style C2 fill:#2d2d3f,stroke:#facc15,color:#fff
    style C3 fill:#2d2d3f,stroke:#facc15,color:#fff
    style C4 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style C5 fill:#2d2d3f,stroke:#f472b6,color:#fff
    style C6 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style C7 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style C8 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style D1 fill:#2d2d3f,stroke:#facc15,color:#fff
    style D2 fill:#3d3d5c,stroke:#ff6b6b,color:#fff
    style D3 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style D4 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style E1 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style E2 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style E3 fill:#2d2d3f,stroke:#f472b6,color:#fff
```

### Staging Safety Flow

```mermaid
flowchart LR
    subgraph LLM["🤖 LLM Decides"]
        A1["write_file()\ncreate_file()\ndelete_file()"]
    end

    subgraph Buffer["📦 Staging Buffer"]
        direction TB
        B1["In-Memory Queue"]
        B2["Unified Diff\nGenerator"]
        B3["Approval State\nTracker"]
    end

    subgraph Review["👁️ User Reviews"]
        direction TB
        C1["Colored Diff\nPreview"]
        C2["✓ Approve\n✗ Reject"]
    end

    subgraph Disk["💾 Disk Write"]
        D1["Only Approved\nChanges Applied"]
    end

    A1 --> B1
    B1 --> B2
    B2 --> C1
    C1 --> C2
    C2 -->|"approve()"| B3
    B3 --> D1
    C2 -->|"reject()"| B1

    style LLM fill:#1a1b26,stroke:#6e40c9,stroke-width:2px,color:#fff
    style Buffer fill:#1a1b26,stroke:#facc15,stroke-width:2px,color:#fff
    style Review fill:#1a1b26,stroke:#4ade80,stroke-width:2px,color:#fff
    style Disk fill:#1a1b26,stroke:#38bdf8,stroke-width:2px,color:#fff
    style A1 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style B1 fill:#2d2d3f,stroke:#facc15,color:#fff
    style B2 fill:#2d2d3f,stroke:#facc15,color:#fff
    style B3 fill:#2d2d3f,stroke:#facc15,color:#fff
    style C1 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style C2 fill:#3d3d5c,stroke:#4ade80,color:#fff
    style D1 fill:#2d2d3f,stroke:#38bdf8,color:#fff
```

### Memory RAG Flow

```mermaid
flowchart TB
    subgraph Index["📚 INDEXING (one-time)"]
        direction LR
        I1["Walk\nProject\nFiles"] --> I2["Chunk\n500\ntokens"] --> I3["OpenAI\nEmbedding\nAPI"] --> I4["Store in\nLanceDB"]
    end

    subgraph Query["🔍 QUERY (per-request)"]
        direction LR
        Q1["User\nQuestion"] --> Q2["Embed\nQuery"] --> Q3["Vector\nSearch"] --> Q4["Top-K\nResults"]
    end

    subgraph Inject["💉 INJECTION"]
        direction LR
        N1["Memory\nChunks"] --> N2["System\nPrompt"] --> N3["LLM has\nProject\nContext"]
    end

    Index --> Query
    Query --> Inject

    style Index fill:#1a1b26,stroke:#6e40c9,stroke-width:2px,color:#fff
    style Query fill:#1a1b26,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Inject fill:#1a1b26,stroke:#4ade80,stroke-width:2px,color:#fff
    style I1 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style I2 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style I3 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style I4 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style Q1 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style Q2 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style Q3 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style Q4 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style N1 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style N2 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style N3 fill:#2d2d3f,stroke:#4ade80,color:#fff
```

### Git Automation Flow

```mermaid
flowchart TB
    subgraph Commit["📝 AI COMMIT"]
        direction LR
        G1["git diff\n--cached"] --> G2["Send to\nLLM"] --> G3["AI generates\nconventional\ncommit message"] --> G4{"User\napprove?"}
        G4 -->|"Yes"| G5["git commit"]
        G4 -->|"No"| G6["Cancel"]
    end

    subgraph PR["🔀 AI PR"]
        direction LR
        P1["git diff\n+\ngit log"] --> P2["AI generates\ntitle + body"] --> P3{"User\napprove?"}
        P3 -->|"Yes"| P4["git push\n+\ngh pr create"]
        P3 -->|"No"| P5["Cancel"]
    end

    subgraph Changelog["📋 AI CHANGELOG"]
        direction LR
        CL1["git log\n-50"] --> CL2["AI groups\nby type"] --> CL3["CHANGELOG.md"]
    end

    style Commit fill:#1a1b26,stroke:#6e40c9,stroke-width:2px,color:#fff
    style PR fill:#1a1b26,stroke:#4ade80,stroke-width:2px,color:#fff
    style Changelog fill:#1a1b26,stroke:#facc15,stroke-width:2px,color:#fff
    style G1 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style G2 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style G3 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style G4 fill:#3d3d5c,stroke:#ff6b6b,color:#fff
    style G5 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style G6 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style P1 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style P2 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style P3 fill:#3d3d5c,stroke:#ff6b6b,color:#fff
    style P4 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style P5 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style CL1 fill:#2d2d3f,stroke:#facc15,color:#fff
    style CL2 fill:#2d2d3f,stroke:#facc15,color:#fff
    style CL3 fill:#2d2d3f,stroke:#facc15,color:#fff
```

### Remote Control Architecture

```mermaid
flowchart TB
    subgraph Users["👥 USERS"]
        direction LR
        U1["📱 Mobile\nTelegram"]
        U2["💻 Desktop\nDiscord"]
    end

    subgraph Bots["🤖 BOT LAYER"]
        direction LR
        B1["Telegraf\nBot"]
        B2["discord.js\nBot"]
    end

    subgraph Commands["⚡ COMMANDS"]
        direction TB
        C1["/ask"]
        C2["/agent"]
        C3["/plan"]
        C4["/review"]
        C5["/status"]
    end

    subgraph Engine["🧠 NEXUSCLAW ENGINE"]
        E1["Agent Core"]
    end

    subgraph Output["📤 OUTPUT"]
        O1["Text Response"]
        O2["Code Blocks"]
        O3["Diff Preview"]
    end

    U1 --> B1
    U2 --> B2
    B1 --> Commands
    B2 --> Commands
    Commands --> Engine
    Engine --> Output

    style Users fill:#1a1b26,stroke:#6e40c9,stroke-width:2px,color:#fff
    style Bots fill:#1a1b26,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Commands fill:#1a1b26,stroke:#4ade80,stroke-width:2px,color:#fff
    style Engine fill:#1a1b26,stroke:#ff6b6b,stroke-width:2px,color:#fff
    style Output fill:#1a1b26,stroke:#facc15,stroke-width:2px,color:#fff
    style U1 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style U2 fill:#2d2d3f,stroke:#5865f2,color:#fff
    style B1 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style B2 fill:#2d2d3f,stroke:#5865f2,color:#fff
    style C1 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style C2 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style C3 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style C4 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style C5 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style E1 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style O1 fill:#2d2d3f,stroke:#facc15,color:#fff
    style O2 fill:#2d2d3f,stroke:#facc15,color:#fff
    style O3 fill:#2d2d3f,stroke:#facc15,color:#fff
```

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph CLI["💻 CLI Layer"]
        direction TB
        CLI1["index.ts\nCommander.js Root"]
        CLI2["commands/\nagent, ask, plan,\nreview, git, memory,\nplugin, snapshot, config"]
        CLI3["ui/\nbanner, prompts, diff"]
    end

    subgraph Agent["🧠 Agent Layer"]
        direction TB
        A1["core.ts\nAgentCore Class"]
        A2["staging.ts\nStagingBuffer"]
        A3["modes/\nagent, ask, plan"]
        A4["tools/\nfs, shell, web, memory"]
    end

    subgraph Services["⚙️ Services"]
        direction TB
        S1["memory/\nstore, indexer, retriever"]
        S2["git/\noperations, ai"]
        S3["review/\nreviewer"]
        S4["plugins/\ntypes, loader"]
        S5["tracker/\nusage"]
    end

    subgraph Remote["🤖 Remote"]
        direction TB
        R1["telegram/\nbot, handlers"]
        R2["discord/\nbot, handlers"]
    end

    subgraph Config["⚙️ Config"]
        C1["config/index.ts\nconf package"]
    end

    subgraph Utils["🔧 Utils"]
        direction LR
        U1["errors.ts"]
        U2["logger.ts"]
        U3["fs.ts"]
    end

    CLI --> Agent
    Agent --> Services
    CLI --> Remote
    Agent --> Config
    Agent --> Utils
    Services --> Config
    Services --> Utils
    Remote --> Agent

    style CLI fill:#1a1b26,stroke:#6e40c9,stroke-width:2px,color:#fff
    style Agent fill:#1a1b26,stroke:#ff6b6b,stroke-width:2px,color:#fff
    style Services fill:#1a1b26,stroke:#4ade80,stroke-width:2px,color:#fff
    style Remote fill:#1a1b26,stroke:#38bdf8,stroke-width:2px,color:#fff
    style Config fill:#1a1b26,stroke:#facc15,stroke-width:2px,color:#fff
    style Utils fill:#1a1b26,stroke:#f472b6,stroke-width:2px,color:#fff
    style CLI1 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style CLI2 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style CLI3 fill:#2d2d3f,stroke:#6e40c9,color:#fff
    style A1 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style A2 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style A3 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style A4 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style S1 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style S2 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style S3 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style S4 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style S5 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style R1 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style R2 fill:#2d2d3f,stroke:#38bdf8,color:#fff
    style C1 fill:#2d2d3f,stroke:#facc15,color:#fff
    style U1 fill:#2d2d3f,stroke:#f472b6,color:#fff
    style U2 fill:#2d2d3f,stroke:#f472b6,color:#fff
    style U3 fill:#2d2d3f,stroke:#f472b6,color:#fff
```

---

## 🎯 Mode Comparison

| Feature | `agent` | `ask` | `plan` | `review` |
|:--------|:-------:|:-----:|:------:|:--------:|
| Read files | ✅ | ✅ | ✅ | ✅ |
| List directory | ✅ | ✅ | ✅ | ❌ |
| Write files | ⚠️ staged | ❌ | ❌ | ❌ |
| Create files | ⚠️ staged | ❌ | ❌ | ❌ |
| Delete files | ⚠️ staged | ❌ | ❌ | ❌ |
| Run commands | ✅ | ❌ | ❌ | ❌ |
| Web search | ✅ | ✅ | ❌ | ❌ |
| Memory search | ✅ | ❌ | ❌ | ❌ |
| Code analysis | ✅ | ✅ | ✅ | ✅ |
| Generate plan | ❌ | ❌ | ✅ | ❌ |
| Review code | ❌ | ❌ | ❌ | ✅ |

> ⚠️ = staged in buffer, requires user approval before writing to disk

---

## 🚀 Quick Start

### Prerequisites

1. **Bun** — JavaScript runtime
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **OpenRouter API key** (free tier)
   - Sign up at [openrouter.ai](https://openrouter.ai)
   - Create a key (starts with `sk-or-...`)

### Installation

```bash
git clone https://github.com/yourusername/nexusclaw.git
cd nexusclaw
bun install
bun run dev config set openrouter_api_key sk-or-YOUR_KEY
```

### First Commands

```bash
# Safe — read only
bun run dev ask "What files are here?"

# Plan — no execution
bun run dev plan "Add authentication"

# Agent — staged changes
bun run dev agent "Create Express server"

# Review — code analysis
bun run dev review src/index.ts
```

---

## 📖 Commands

### `nexusclaw agent <task>`

```bash
bun run dev agent "Fix the auth bug"           # Interactive approval
bun run dev agent "Fix the auth bug" --yes      # Auto-approve
bun run dev agent "Fix the auth bug" --dry-run  # Preview only
```

### `nexusclaw ask <query>`

```bash
bun run dev ask "How does auth work?"
bun run dev ask "Explain the code" --save explanation.md
```

### `nexusclaw plan <goal>`

```bash
bun run dev plan "Add WebSocket support"
```

### `nexusclaw review [file]`

```bash
bun run dev review src/auth.ts
bun run dev review --diff
```

### `nexusclaw git`

```bash
bun run dev git status
bun run dev git commit
bun run dev git pr
bun run dev git changelog
```

### `nexusclaw memory`

```bash
bun run dev memory init
bun run dev memory search "authentication"
bun run dev memory count
bun run dev memory clear
```

### `nexusclaw config`

```bash
bun run dev config show
bun run dev config set <key> <value>
bun run dev config reset
```

### `nexusclaw plugin`

```bash
bun run dev plugin add ./plugins/my-plugin.ts
bun run dev plugin list
bun run dev plugin remove my-plugin
```

### `nexusclaw snapshot`

```bash
bun run dev snapshot create
bun run dev snapshot load backup.nexus
```

---

## 🔌 Plugin Development

```typescript
// plugins/weather.plugin.ts
import { tool } from 'ai'
import { z } from 'zod'
import type { NexusClawPlugin } from '../src/plugins/types'

const weatherTool = tool({
  description: 'Get weather for a city',
  parameters: z.object({
    city: z.string(),
  }),
  execute: async ({ city }) => {
    return { city, temp: '22°C', condition: 'Sunny' }
  },
})

const plugin: NexusClawPlugin = {
  name: 'weather',
  version: '1.0.0',
  description: 'Weather lookup',
  tools: { get_weather: weatherTool },
}

export default plugin
```

```bash
bun run dev plugin add ./plugins/weather.plugin.ts
```

---

## 🤖 Remote Control

### Telegram

1. Message [@BotFather](https://t.me/BotFather) → `/newbot` → copy token
2. `bun run dev config set telegram_bot_token YOUR_TOKEN`
3. `bun run telegram`
4. Send `/ask`, `/agent`, `/plan`, `/review` to your bot

### Discord

1. [Developer Portal](https://discord.com/developers/applications) → New App → Bot → copy token
2. `bun run dev config set discord_bot_token YOUR_TOKEN`
3. `bun run dev config set discord_guild_id YOUR_SERVER_ID`
4. `bun run discord`
5. Use slash commands: `/ask`, `/agent`, `/plan`, `/status`

---

## 🛡️ Security

```mermaid
flowchart LR
    subgraph Blocked["🚫 Blocked Commands"]
        direction TB
        B1["rm -rf /"]
        B2["sudo *"]
        B3["curl | bash"]
        B4["chmod 777"]
    end

    subgraph Protected["🔒 Protected"]
        direction TB
        P1["API keys masked\nin config show"]
        P2["Path traversal\nprevention"]
        P3["Staging buffer\nno direct writes"]
    end

    subgraph Auth["🔐 Access Control"]
        direction TB
        A1["TELEGRAM_ALLOWED_USERS"]
        A2["Discord guild restriction"]
    end

    style Blocked fill:#1a1b26,stroke:#ff6b6b,stroke-width:2px,color:#fff
    style Protected fill:#1a1b26,stroke:#4ade80,stroke-width:2px,color:#fff
    style Auth fill:#1a1b26,stroke:#facc15,stroke-width:2px,color:#fff
    style B1 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style B2 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style B3 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style B4 fill:#2d2d3f,stroke:#ff6b6b,color:#fff
    style P1 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style P2 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style P3 fill:#2d2d3f,stroke:#4ade80,color:#fff
    style A1 fill:#2d2d3f,stroke:#facc15,color:#fff
    style A2 fill:#2d2d3f,stroke:#facc15,color:#fff
```

---

## 📊 Cost Tracking

| Model | Input / 1M tokens | Output / 1M tokens |
|:------|------------------:|--------------------:|
| gemini-flash-1.5 | $0.075 | $0.30 |
| gemini-pro-1.5 | $1.25 | $5.00 |
| claude-3.5-sonnet | $3.00 | $15.00 |
| claude-3-haiku | $0.25 | $1.25 |
| gpt-4o | $2.50 | $10.00 |
| gpt-4o-mini | $0.15 | $0.60 |

---

## 🧪 Tests

```
✅ staging.test.ts   — 12 tests
✅ git.test.ts       —  4 tests
✅ agent.test.ts     —  2 tests
✅ memory.test.ts    —  1 test
─────────────────────────────
   19 tests, 39 assertions, 0 failures
```

---

## 📄 License

MIT

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:6e40c9,100:0d1117&height=120&section=footer" width="100%"/>
</p>
