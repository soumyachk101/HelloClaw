<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:6e40c9,100:0d1117&height=250&section=header&text=NexusClaw&fontSize=90&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=CLI-first%20autonomous%20AI%20coding%20agent&descSize=20&descAlignY=58" width="100%"/>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/version-1.0.0-6e40c9?style=for-the-badge&logo=git&logoColor=white" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/Bun-f9f1e1?style=for-the-badge&logo=bun&logoColor=black" alt="Bun"></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#"><img src="https://img.shields.io/badge/Vercel%20AI%20SDK-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel AI SDK"></a>
  <a href="#"><img src="https://img.shields.io/badge/MIT-green?style=for-the-badge" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/tests-19%20passing-brightgreen?style=for-the-badge" alt="Tests"></a>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=6e40c9&center=true&vCenter=true&multiline=true&repeat=true&width=600&height=80&lines=Autonomous+AI+coding+agent;With+remote+control+via+Telegram+%26+Discord;Powered+by+Vercel+AI+SDK+%2B+OpenRouter" alt="Typing SVG" />
</p>

<br>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-commands">Commands</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-plugins">Plugins</a> •
  <a href="#-remote-control">Remote Control</a> •
  <a href="#-security">Security</a> •
  <a href="#-contributing">Contributing</a>
</p>

<br>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 Autonomous Agent
Full tool access with staged mutations. Every file change requires your explicit approval before writing to disk.

</td>
<td width="50%">

### 🛡️ Safety First
Staging buffer pattern ensures no file is ever modified without your review. Unified diffs, approve/reject flow.

</td>
</tr>
<tr>
<td width="50%">

### 🧠 Memory RAG
LanceDB vector store with OpenAI embeddings. Your agent automatically has context about your entire project.

</td>
<td width="50%">

### 🔀 Git Automation
AI-generated commit messages, PR descriptions, and changelogs. Conventional commits, semantic versioning.

</td>
</tr>
<tr>
<td width="50%">

### 📱 Remote Control
Control your agent from Telegram or Discord. Run commands, review changes, approve/reject from your phone.

</td>
<td width="50%">

### 🔌 Plugin System
Extend NexusClaw with custom tools. Write TypeScript plugins that add new capabilities to the agent.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Cost Tracking
Per-session token counting with model-based pricing. Know exactly what each operation costs.

</td>
<td width="50%">

### 🔍 Code Review
AI-powered code review with severity levels: CRITICAL, WARNING, INFO. Review files or diffs.

</td>
</tr>
<tr>
<td width="50%">

### 💬 Interactive Chat
Chat mode with persistent conversation history. Switch modes on the fly, review and approve changes inline.

</td>
<td width="50%">

### 🔧 Extensible
Plugin system lets you add custom tools. Weather, database, API integrations — anything you can code.

</td>
</tr>
</table>

<br>

---

## 🎬 How It Works

### Terminal Demo

<!-- Animated terminal demo -->
<p align="center">
  <img src="https://raw.githubusercontent.com/withastro/astro/main/assets/social/banner.png" alt="NexusClaw Demo" width="80%"/>
</p>

```bash
$ nexusclaw agent "Create a REST API with Express and TypeScript"

  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗ ██████╗██╗      █████╗ ██╗    ██╗
  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝██╔════╝██║     ██╔══██╗██║    ██║
  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗██║     ██║     ███████║██║ █╗ ██║
  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║██║     ██║     ██╔══██║██║███╗██║
  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║╚██████╗███████╗██║  ██║╚███╔███╔╝
  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝

  ✓ Agent is working...

  I'll create a REST API with Express and TypeScript. Let me set up the project structure.

  [Tool: create_file] src/index.ts
  [Tool: create_file] src/routes/users.ts
  [Tool: create_file] src/routes/health.ts
  [Tool: create_file] src/middleware/errorHandler.ts
  [Tool: write_file]  package.json
  [Tool: write_file]  tsconfig.json

  ✓ Agent finished

  ─── Proposed Changes ────────────────────────────────────────────

    ✓ approved  CREATE   src/index.ts
    ○ pending   CREATE   src/routes/users.ts
    ○ pending   CREATE   src/routes/health.ts
    ○ pending   CREATE   src/middleware/errorHandler.ts
    ○ pending   MODIFY   package.json
    ○ pending   MODIFY   tsconfig.json

  ─── Unified Diff ────────────────────────────────────────────────

  --- /dev/null
  +++ src/index.ts
  @@ -0,0 +1,25 @@
  +import express from 'express';
  +import { errorHandler } from './middleware/errorHandler';
  +import { userRoutes } from './routes/users';
  +import { healthRoutes } from './routes/health';
  +
  +const app = express();
  +const PORT = process.env.PORT || 3000;
  +
  +app.use(express.json());
  +app.use('/api/users', userRoutes);
  +app.use('/api/health', healthRoutes);
  +app.use(errorHandler);
  +
  +app.listen(PORT, () => {
  +  console.log(`Server running on port ${PORT}`);
  +});
  +
  ─────────────────────────────────────────────────────────────────

  Apply these changes? › Yes / No
  › Yes

  ✓ src/index.ts written
  ✓ src/routes/users.ts written
  ✓ src/routes/health.ts written
  ✓ src/middleware/errorHandler.ts written
  ✓ package.json written
  ✓ tsconfig.json written

  ✓ Done
```

<br>

### Execution Pipeline

```mermaid
flowchart TB
    subgraph Input["📥 INPUT LAYER"]
        direction LR
        A1["🖥️ CLI"]
        A2["📱 Telegram"]
        A3["💬 Discord"]
    end

    subgraph Core["🧠 AGENT CORE"]
        direction TB
        B1["Commander.js Parser"] --> B2["Mode Router"]
        B2 --> B3{"Mode Selection"}
        B3 -->|"agent"| B4["🔧 Full Tools\n8 tools available"]
        B3 -->|"ask"| B5["📖 Read Only\nSafe exploration"]
        B3 -->|"plan"| B6["📋 Plan Only\nNo execution"]
        B3 -->|"review"| B7["🔍 Review Only\nCode analysis"]
        B4 --> B8["System Prompt Builder"]
        B5 --> B8
        B6 --> B8
        B7 --> B8
        B8 --> B9["Memory Context\n(LanceDB RAG)"]
        B9 --> B10["Vercel AI SDK\nStreaming Response"]
    end

    subgraph Tools["🔧 TOOL SYSTEM"]
        direction TB
        C1["📄 read_file\nRead file contents"]
        C2["📝 write_file\nStage file write"]
        C3["✨ create_file\nStage new file"]
        C4["🗑️ delete_file\nStage deletion"]
        C5["⚡ run_command\nExecute shell"]
        C6["🌐 search_web\nFirecrawl API"]
        C7["🧠 memory_search\nRAG vector search"]
        C8["📁 list_directory\nList files"]
    end

    subgraph Safety["🛡️ SAFETY LAYER"]
        direction TB
        D1["📦 Staging Buffer\n(in-memory queue)"] --> D2["📊 Diff Generator\nUnified format"]
        D2 --> D3{"👤 User\nApproval?"}
        D3 -->|"✓ Approve"| D4["💾 Write to Disk\nOnly approved"]
        D3 -->|"✗ Reject"| D5["🗑️ Discard\nChanges lost"]
    end

    subgraph Output["📤 OUTPUT LAYER"]
        direction LR
        E1["🖥️ Terminal"]
        E2["📱 Telegram"]
        E3["💬 Discord"]
    end

    Input --> Core
    Core --> Tools
    Tools --> Safety
    Safety --> Output

    style Input fill:#0d1117,stroke:#6e40c9,stroke-width:3px,color:#fff
    style Core fill:#0d1117,stroke:#ff6b6b,stroke-width:3px,color:#fff
    style Tools fill:#0d1117,stroke:#4ade80,stroke-width:3px,color:#fff
    style Safety fill:#0d1117,stroke:#facc15,stroke-width:3px,color:#fff
    style Output fill:#0d1117,stroke:#38bdf8,stroke-width:3px,color:#fff
    style A1 fill:#161b22,stroke:#6e40c9,color:#fff
    style A2 fill:#161b22,stroke:#38bdf8,color:#fff
    style A3 fill:#161b22,stroke:#5865f2,color:#fff
    style B1 fill:#161b22,stroke:#6e40c9,color:#fff
    style B2 fill:#161b22,stroke:#6e40c9,color:#fff
    style B3 fill:#1f2937,stroke:#ff6b6b,color:#fff,stroke-width:2px
    style B4 fill:#161b22,stroke:#4ade80,color:#fff
    style B5 fill:#161b22,stroke:#facc15,color:#fff
    style B6 fill:#161b22,stroke:#38bdf8,color:#fff
    style B7 fill:#161b22,stroke:#f472b6,color:#fff
    style B8 fill:#161b22,stroke:#6e40c9,color:#fff
    style B9 fill:#161b22,stroke:#6e40c9,color:#fff
    style B10 fill:#161b22,stroke:#6e40c9,color:#fff
    style C1 fill:#161b22,stroke:#4ade80,color:#fff
    style C2 fill:#161b22,stroke:#facc15,color:#fff
    style C3 fill:#161b22,stroke:#facc15,color:#fff
    style C4 fill:#161b22,stroke:#ff6b6b,color:#fff
    style C5 fill:#161b22,stroke:#f472b6,color:#fff
    style C6 fill:#161b22,stroke:#38bdf8,color:#fff
    style C7 fill:#161b22,stroke:#6e40c9,color:#fff
    style C8 fill:#161b22,stroke:#4ade80,color:#fff
    style D1 fill:#161b22,stroke:#facc15,color:#fff
    style D2 fill:#161b22,stroke:#facc15,color:#fff
    style D3 fill:#1f2937,stroke:#ff6b6b,color:#fff,stroke-width:2px
    style D4 fill:#161b22,stroke:#4ade80,color:#fff
    style D5 fill:#161b22,stroke:#ff6b6b,color:#fff
    style E1 fill:#161b22,stroke:#6e40c9,color:#fff
    style E2 fill:#161b22,stroke:#38bdf8,color:#fff
    style E3 fill:#161b22,stroke:#5865f2,color:#fff
```

<br>

### Staging Safety Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI as NexusClaw CLI
    participant Agent as Agent Core
    participant LLM as LLM (OpenRouter)
    participant Buffer as Staging Buffer
    participant Disk as File System

    User->>CLI: nexusclaw agent "Fix auth bug"
    CLI->>Agent: Run task
    Agent->>LLM: Stream with tools
    
    loop Tool Call Loop
        LLM->>Agent: Call: read_file("src/auth.ts")
        Agent->>Disk: Read file
        Disk-->>Agent: File contents
        Agent-->>LLM: Return content
        
        LLM->>Agent: Call: write_file("src/auth.ts", newContent)
        Agent->>Buffer: Stage change
        Buffer-->>Agent: Staged ✓
        Agent-->>LLM: Return staged
    end
    
    Agent->>CLI: 3 changes staged
    CLI->>User: Show diff preview
    
    Note over User: Review changes
    User->>CLI: Approve
    CLI->>Buffer: approve()
    Buffer->>Disk: Write approved files
    Buffer-->>CLI: Applied ✓
    CLI-->>User: ✓ Done
```

<br>

### Memory RAG System

```mermaid
flowchart TB
    subgraph Index["📚 INDEXING PHASE (One-time)"]
        direction TB
        I1["🔍 Walk Project\nDirectory"] --> I2["📄 Filter Files\n.ts .js .md .py .go"]
        I2 --> I3["✂️ Chunk Text\n500 tokens, 50 overlap"]
        I3 --> I4["🧮 OpenAI API\ntext-embedding-3-small"]
        I4 --> I5["💾 LanceDB Store\n.nexusclaw/memory/"]
    end

    subgraph Query["🔍 QUERY PHASE (Per-request)"]
        direction TB
        Q1["❓ User Question"] --> Q2["🧮 Embed Query\nOpenAI API"]
        Q2 --> Q3["🔎 Vector Search\nCosine Similarity"]
        Q3 --> Q4["📊 Top-K Results\nDefault: 5 chunks"]
    end

    subgraph Inject["💉 INJECTION PHASE"]
        direction TB
        N1["📝 Memory Chunks"] --> N2["🎯 System Prompt\nContext Section"]
        N2 --> N3["🤖 LLM Response\nWith Project Context"]
    end

    Index -->|"Store vectors"| Query
    Query -->|"Relevant chunks"| Inject

    style Index fill:#0d1117,stroke:#6e40c9,stroke-width:3px,color:#fff
    style Query fill:#0d1117,stroke:#38bdf8,stroke-width:3px,color:#fff
    style Inject fill:#0d1117,stroke:#4ade80,stroke-width:3px,color:#fff
    style I1 fill:#161b22,stroke:#6e40c9,color:#fff
    style I2 fill:#161b22,stroke:#6e40c9,color:#fff
    style I3 fill:#161b22,stroke:#6e40c9,color:#fff
    style I4 fill:#161b22,stroke:#6e40c9,color:#fff
    style I5 fill:#161b22,stroke:#6e40c9,color:#fff
    style Q1 fill:#161b22,stroke:#38bdf8,color:#fff
    style Q2 fill:#161b22,stroke:#38bdf8,color:#fff
    style Q3 fill:#161b22,stroke:#38bdf8,color:#fff
    style Q4 fill:#161b22,stroke:#38bdf8,color:#fff
    style N1 fill:#161b22,stroke:#4ade80,color:#fff
    style N2 fill:#161b22,stroke:#4ade80,color:#fff
    style N3 fill:#161b22,stroke:#4ade80,color:#fff
```

<br>

### Git Automation

```mermaid
flowchart LR
    subgraph Commit["📝 AI COMMIT"]
        direction TB
        G1["📋 git diff\n--cached"] --> G2["🤖 LLM\nGenerate message"]
        G2 --> G3{"👤 Approve?"}
        G3 -->|"✓"| G4["✅ git commit"]
        G3 -->|"✗"| G5["❌ Cancel"]
    end

    subgraph PR["🔀 AI PR"]
        direction TB
        P1["📋 git diff\n+ git log"] --> P2["🤖 LLM\nTitle + Body"]
        P2 --> P3{"👤 Approve?"}
        P3 -->|"✓"| P4["🚀 git push\n+ gh pr create"]
        P3 -->|"✗"| P5["❌ Cancel"]
    end

    subgraph CL["📋 CHANGELOG"]
        direction TB
        CL1["📋 git log\n-50 commits"] --> CL2["🤖 LLM\nGroup by type"]
        CL2 --> CL3["📄 CHANGELOG.md"]
    end

    style Commit fill:#0d1117,stroke:#6e40c9,stroke-width:3px,color:#fff
    style PR fill:#0d1117,stroke:#4ade80,stroke-width:3px,color:#fff
    style CL fill:#0d1117,stroke:#facc15,stroke-width:3px,color:#fff
    style G1 fill:#161b22,stroke:#6e40c9,color:#fff
    style G2 fill:#161b22,stroke:#6e40c9,color:#fff
    style G3 fill:#1f2937,stroke:#ff6b6b,color:#fff,stroke-width:2px
    style G4 fill:#161b22,stroke:#4ade80,color:#fff
    style G5 fill:#161b22,stroke:#ff6b6b,color:#fff
    style P1 fill:#161b22,stroke:#4ade80,color:#fff
    style P2 fill:#161b22,stroke:#4ade80,color:#fff
    style P3 fill:#1f2937,stroke:#ff6b6b,color:#fff,stroke-width:2px
    style P4 fill:#161b22,stroke:#4ade80,color:#fff
    style P5 fill:#161b22,stroke:#ff6b6b,color:#fff
    style CL1 fill:#161b22,stroke:#facc15,color:#fff
    style CL2 fill:#161b22,stroke:#facc15,color:#fff
    style CL3 fill:#161b22,stroke:#facc15,color:#fff
```

<br>

### Remote Control Architecture

```mermaid
flowchart TB
    subgraph Users["👥 USERS"]
        direction LR
        U1["📱 Mobile\nTelegram App"]
        U2["💻 Desktop\nDiscord Client"]
    end

    subgraph Bots["🤖 BOT LAYER"]
        direction LR
        B1["Telegraf\nBot Framework"]
        B2["discord.js\nBot Framework"]
    end

    subgraph Commands["⚡ AVAILABLE COMMANDS"]
        direction TB
        C1["/ask <query>\nRead-only Q&A"]
        C2["/agent <task>\nFull autonomous"]
        C3["/plan <goal>\nGenerate plan"]
        C4["/review [file]\nCode review"]
        C5["/status\nGit status"]
    end

    subgraph Engine["🧠 NEXUSCLAW ENGINE"]
        E1["Agent Core\n+ Tools + Memory"]
    end

    subgraph Output["📤 OUTPUT"]
        direction LR
        O1["📝 Text Response"]
        O2["💻 Code Blocks"]
        O3["📊 Diff Preview"]
    end

    U1 -->|"Bot API"| B1
    U2 -->|"Bot API"| B2
    B1 -->|"Route"| Commands
    B2 -->|"Route"| Commands
    Commands -->|"Execute"| Engine
    Engine -->|"Render"| Output

    style Users fill:#0d1117,stroke:#6e40c9,stroke-width:3px,color:#fff
    style Bots fill:#0d1117,stroke:#38bdf8,stroke-width:3px,color:#fff
    style Commands fill:#0d1117,stroke:#4ade80,stroke-width:3px,color:#fff
    style Engine fill:#0d1117,stroke:#ff6b6b,stroke-width:3px,color:#fff
    style Output fill:#0d1117,stroke:#facc15,stroke-width:3px,color:#fff
    style U1 fill:#161b22,stroke:#38bdf8,color:#fff
    style U2 fill:#161b22,stroke:#5865f2,color:#fff
    style B1 fill:#161b22,stroke:#38bdf8,color:#fff
    style B2 fill:#161b22,stroke:#5865f2,color:#fff
    style C1 fill:#161b22,stroke:#4ade80,color:#fff
    style C2 fill:#161b22,stroke:#4ade80,color:#fff
    style C3 fill:#161b22,stroke:#4ade80,color:#fff
    style C4 fill:#161b22,stroke:#4ade80,color:#fff
    style C5 fill:#161b22,stroke:#4ade80,color:#fff
    style E1 fill:#161b22,stroke:#ff6b6b,color:#fff
    style O1 fill:#161b22,stroke:#facc15,color:#fff
    style O2 fill:#161b22,stroke:#facc15,color:#fff
    style O3 fill:#161b22,stroke:#facc15,color:#fff
```

<br>

---

## 🏗️ Architecture

### System Architecture

```mermaid
graph TB
    subgraph CLI["💻 CLI LAYER"]
        direction TB
        CLI1["index.ts\nCommander.js Root"]
        CLI2["commands/\n10 command handlers"]
        CLI3["ui/\nbanner, prompts, diff"]
    end

    subgraph Agent["🧠 AGENT LAYER"]
        direction TB
        A1["core.ts\nAgentCore Class"]
        A2["staging.ts\nStagingBuffer"]
        A3["modes/\nagent, ask, plan"]
        A4["tools/\n8 tool definitions"]
    end

    subgraph Services["⚙️ SERVICES"]
        direction TB
        S1["memory/\nstore, indexer, retriever"]
        S2["git/\noperations, ai"]
        S3["review/\nreviewer"]
        S4["plugins/\ntypes, loader"]
        S5["tracker/\nusage"]
    end

    subgraph Remote["🤖 REMOTE"]
        direction TB
        R1["telegram/\nbot, handlers"]
        R2["discord/\nbot, handlers"]
    end

    subgraph Config["⚙️ CONFIG"]
        C1["config/index.ts\nconf package"]
    end

    subgraph Utils["🔧 UTILS"]
        direction LR
        U1["errors.ts"]
        U2["logger.ts"]
        U3["fs.ts"]
    end

    CLI -->|"Commands"| Agent
    Agent -->|"Tools"| Services
    CLI -->|"Bots"| Remote
    Agent -->|"Settings"| Config
    Agent -->|"Helpers"| Utils
    Services -->|"Config"| Config
    Services -->|"Utils"| Utils
    Remote -->|"Agent"| Agent

    style CLI fill:#0d1117,stroke:#6e40c9,stroke-width:3px,color:#fff
    style Agent fill:#0d1117,stroke:#ff6b6b,stroke-width:3px,color:#fff
    style Services fill:#0d1117,stroke:#4ade80,stroke-width:3px,color:#fff
    style Remote fill:#0d1117,stroke:#38bdf8,stroke-width:3px,color:#fff
    style Config fill:#0d1117,stroke:#facc15,stroke-width:3px,color:#fff
    style Utils fill:#0d1117,stroke:#f472b6,stroke-width:3px,color:#fff
    style CLI1 fill:#161b22,stroke:#6e40c9,color:#fff
    style CLI2 fill:#161b22,stroke:#6e40c9,color:#fff
    style CLI3 fill:#161b22,stroke:#6e40c9,color:#fff
    style A1 fill:#161b22,stroke:#ff6b6b,color:#fff
    style A2 fill:#161b22,stroke:#ff6b6b,color:#fff
    style A3 fill:#161b22,stroke:#ff6b6b,color:#fff
    style A4 fill:#161b22,stroke:#ff6b6b,color:#fff
    style S1 fill:#161b22,stroke:#4ade80,color:#fff
    style S2 fill:#161b22,stroke:#4ade80,color:#fff
    style S3 fill:#161b22,stroke:#4ade80,color:#fff
    style S4 fill:#161b22,stroke:#4ade80,color:#fff
    style S5 fill:#161b22,stroke:#4ade80,color:#fff
    style R1 fill:#161b22,stroke:#38bdf8,color:#fff
    style R2 fill:#161b22,stroke:#38bdf8,color:#fff
    style C1 fill:#161b22,stroke:#facc15,color:#fff
    style U1 fill:#161b22,stroke:#f472b6,color:#fff
    style U2 fill:#161b22,stroke:#f472b6,color:#fff
    style U3 fill:#161b22,stroke:#f472b6,color:#fff
```

### Data Flow

```mermaid
flowchart LR
    subgraph Input["📥 Input"]
        I1["User Task"]
    end

    subgraph Process["⚙️ Process"]
        direction TB
        P1["Parse Command"] --> P2["Select Mode"]
        P2 --> P3["Build Prompt"]
        P3 --> P4["Inject Memory"]
        P4 --> P5["Stream LLM"]
        P5 --> P6["Execute Tools"]
        P6 --> P7["Stage Changes"]
    end

    subgraph Review["👁️ Review"]
        R1["Show Diff"]
        R2["User Decision"]
    end

    subgraph Output["📤 Output"]
        O1["Write Files"]
        O2["Track Usage"]
    end

    Input --> Process
    Process --> Review
    Review -->|"Approve"| Output
    Review -->|"Reject"| Process

    style Input fill:#0d1117,stroke:#6e40c9,stroke-width:2px,color:#fff
    style Process fill:#0d1117,stroke:#4ade80,stroke-width:2px,color:#fff
    style Review fill:#0d1117,stroke:#facc15,stroke-width:2px,color:#fff
    style Output fill:#0d1117,stroke:#38bdf8,stroke-width:2px,color:#fff
    style I1 fill:#161b22,stroke:#6e40c9,color:#fff
    style P1 fill:#161b22,stroke:#4ade80,color:#fff
    style P2 fill:#161b22,stroke:#4ade80,color:#fff
    style P3 fill:#161b22,stroke:#4ade80,color:#fff
    style P4 fill:#161b22,stroke:#4ade80,color:#fff
    style P5 fill:#161b22,stroke:#4ade80,color:#fff
    style P6 fill:#161b22,stroke:#4ade80,color:#fff
    style P7 fill:#161b22,stroke:#4ade80,color:#fff
    style R1 fill:#161b22,stroke:#facc15,color:#fff
    style R2 fill:#1f2937,stroke:#ff6b6b,color:#fff,stroke-width:2px
    style O1 fill:#161b22,stroke:#38bdf8,color:#fff
    style O2 fill:#161b22,stroke:#38bdf8,color:#fff
```

<br>

### Project Structure

```
nexusclaw/
├── 📦 package.json                    # Dependencies & scripts
├── ⚙️ tsconfig.json                   # TypeScript strict config
├── 🔧 bunfig.toml                    # Bun runtime config
│
├── src/
│   ├── 📁 config/                    # Configuration
│   │   └── index.ts                  # Persistent config via `conf`
│   │
│   ├── 📁 utils/                     # Utilities
│   │   ├── errors.ts                 # ClawError class
│   │   ├── logger.ts                 # Chalk logging
│   │   └── fs.ts                     # Path safety
│   │
│   ├── 📁 agent/                     # 🧠 Core Engine
│   │   ├── core.ts                   # AgentCore class
│   │   ├── staging.ts                # StagingBuffer
│   │   ├── 📁 modes/                 # Mode implementations
│   │   └── 📁 tools/                 # 8 tool definitions
│   │
│   ├── 📁 memory/                    # 🧠 RAG System
│   │   ├── store.ts                  # LanceDB wrapper
│   │   ├── indexer.ts                # Chunking + embedding
│   │   └── retriever.ts              # Vector search
│   │
│   ├── 📁 git/                       # 🔀 Git Automation
│   │   ├── operations.ts             # simple-git wrappers
│   │   └── ai.ts                     # AI commit/PR/changelog
│   │
│   ├── 📁 review/                    # 🔍 Code Review
│   │   └── reviewer.ts               # File/diff analysis
│   │
│   ├── 📁 cli/                       # 💻 CLI Interface
│   │   ├── index.ts                  # Commander.js root
│   │   ├── 📁 ui/                    # Terminal UI
│   │   └── 📁 commands/              # 10 commands (incl. chat)
│   │
│   ├── 📁 remote/                    # 🤖 Remote Control
│   │   ├── 📁 telegram/              # Telegram bot
│   │   └── 📁 discord/               # Discord bot
│   │
│   ├── 📁 plugins/                   # 🔌 Plugin System
│   │   ├── types.ts                  # Plugin interface
│   │   └── loader.ts                 # Dynamic loader
│   │
│   └── 📁 tracker/                   # 📊 Usage Tracking
│       └── usage.ts                  # Token + cost
│
├── 📁 tests/                         # 🧪 Test Suite
│   ├── staging.test.ts               # 12 tests
│   ├── git.test.ts                   # 4 tests
│   ├── agent.test.ts                 # 2 tests
│   └── memory.test.ts                # 1 test
│
└── 📁 plugins/                       # User plugins
```

---

## 🎯 Mode Comparison

<table>
<tr>
<th>Capability</th>
<th><code>agent</code></th>
<th><code>ask</code></th>
<th><code>plan</code></th>
<th><code>review</code></th>
</tr>
<tr>
<td>Read files</td>
<td align="center">✅</td>
<td align="center">✅</td>
<td align="center">✅</td>
<td align="center">✅</td>
</tr>
<tr>
<td>List directory</td>
<td align="center">✅</td>
<td align="center">✅</td>
<td align="center">✅</td>
<td align="center">❌</td>
</tr>
<tr>
<td>Write files</td>
<td align="center">⚠️ staged</td>
<td align="center">❌</td>
<td align="center">❌</td>
<td align="center">❌</td>
</tr>
<tr>
<td>Create files</td>
<td align="center">⚠️ staged</td>
<td align="center">❌</td>
<td align="center">❌</td>
<td align="center">❌</td>
</tr>
<tr>
<td>Delete files</td>
<td align="center">⚠️ staged</td>
<td align="center">❌</td>
<td align="center">❌</td>
<td align="center">❌</td>
</tr>
<tr>
<td>Run commands</td>
<td align="center">✅</td>
<td align="center">❌</td>
<td align="center">❌</td>
<td align="center">❌</td>
</tr>
<tr>
<td>Web search</td>
<td align="center">✅</td>
<td align="center">✅</td>
<td align="center">❌</td>
<td align="center">❌</td>
</tr>
<tr>
<td>Memory search</td>
<td align="center">✅</td>
<td align="center">❌</td>
<td align="center">❌</td>
<td align="center">❌</td>
</tr>
<tr>
<td>Code analysis</td>
<td align="center">✅</td>
<td align="center">✅</td>
<td align="center">✅</td>
<td align="center">✅</td>
</tr>
<tr>
<td>Generate plan</td>
<td align="center">❌</td>
<td align="center">❌</td>
<td align="center">✅</td>
<td align="center">❌</td>
</tr>
<tr>
<td>Review code</td>
<td align="center">❌</td>
<td align="center">❌</td>
<td align="center">❌</td>
<td align="center">✅</td>
</tr>
</table>

> ⚠️ **Staged** = changes are held in memory buffer, require explicit user approval before writing to disk

---

## 🚀 Quick Start

### Prerequisites

<table>
<tr>
<td width="50%">

**1. Bun Runtime**

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (WSL)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify
bun --version
```

</td>
<td width="50%">

**2. OpenRouter API Key**

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up (free tier available)
3. Navigate to **Keys** → **Create Key**
4. Copy key (starts with `sk-or-...`)

</td>
</tr>
</table>

### Installation

**Option 1: npm/npx (Recommended)**

```bash
# Install globally
npm install -g nexusclaw

# Or run directly with npx (no install needed)
npx nexusclaw ask "What files are here?"

# Configure your API key
nexusclaw config set openrouter_api_key sk-or-YOUR_KEY
```

**Option 2: From Source (Development)**

```bash
# Clone repository
git clone https://github.com/soumyachk101/NexusClaw.git
cd nexusclaw

# Install dependencies
bun install

# Configure API key
bun run dev config set openrouter_api_key sk-or-YOUR_KEY_HERE

# Verify installation
bun run dev -- --help
```

### First Commands

```bash
# If installed via npm/npx:
nexusclaw ask "What files are in this directory?"
nexusclaw plan "Add user authentication"
nexusclaw agent "Create a REST API"
nexusclaw chat

# If running from source:
bun run dev ask "What files are in this directory?"

# Generate a plan (no execution)
bun run dev plan "Add user authentication with JWT"

# Run agent (staged changes)
bun run dev agent "Create a REST API with Express"

# Review code
bun run dev review src/index.ts
```

---

## 📖 Commands

### `nexusclaw agent <task>`

Run autonomous agent with full tool access. All file changes are staged.

```bash
bun run dev agent "Fix the authentication bug"
bun run dev agent "Add input validation" --yes          # Auto-approve
bun run dev agent "Refactor database layer" --dry-run   # Preview only
```

| Option | Description |
|:-------|:------------|
| `-y, --yes` | Auto-approve all changes |
| `-d, --dry-run` | Show diff without applying |

---

### `nexusclaw chat`

Interactive chat mode with persistent conversation history. Chat with the AI agent in real-time.

```bash
bun run dev chat                          # Start chat (default: ask mode)
bun run dev chat -m agent                 # Start in agent mode
bun run dev chat -m plan                  # Start in plan mode
bun run dev chat -s "You are a senior dev"  # Custom system prompt
```

**Chat Commands:**
```
/mode <agent|ask|plan|review>   Switch mode on the fly
/diff                          Show staged changes diff
/approve                       Approve all staged changes
/reject                        Reject all staged changes
/clear                         Clear chat history
/exit                          Exit chat
/help                          Show available commands
```

| Option | Description |
|:-------|:------------|
| `-m, --mode <mode>` | Initial mode (default: ask) |
| `-s, --system <prompt>` | Custom system prompt |

---

### `nexusclaw ask <query>`

Read-only Q&A mode. Safe for exploration.

```bash
bun run dev ask "How does the StagingBuffer work?"
bun run dev ask "Explain the error handling" --save explanation.md
```

| Option | Description |
|:-------|:------------|
| `-s, --save <path>` | Save output to file |

---

### `nexusclaw plan <goal>`

Generate step-by-step plan. No execution.

```bash
bun run dev plan "Add WebSocket support for real-time updates"
bun run dev plan "Migrate from REST to GraphQL"
```

---

### `nexusclaw review [file]`

AI code review with severity levels.

```bash
bun run dev review src/auth.ts              # Review file
bun run dev review --diff                   # Review staged changes
bun run dev review --diff HEAD~1            # Review since ref
```

| Option | Description |
|:-------|:------------|
| `--diff [ref]` | Review diff (staged or since ref) |

---

### `nexusclaw git [subcommand]`

Git automation with AI.

```bash
bun run dev git status                      # Show status
bun run dev git commit                      # AI commit message
bun run dev git commit -m "my message"      # Manual message
bun run dev git branch feature-name         # Create branch
bun run dev git pr                          # Push + create PR
bun run dev git changelog                   # Generate changelog
```

---

### `nexusclaw memory [subcommand]`

Manage RAG memory system.

```bash
bun run dev memory init                     # Index project
bun run dev memory search "authentication"  # Search memory
bun run dev memory count                    # Show count
bun run dev memory clear                    # Clear data
```

---

### `nexusclaw config [subcommand]`

Manage configuration.

```bash
bun run dev config show                     # Show all (masked)
bun run dev config set <key> <value>        # Set value
bun run dev config reset                    # Reset defaults
```

<details>
<summary><strong>All Configuration Keys</strong></summary>

| Key | Type | Default | Description |
|:----|:-----|:--------|:------------|
| `model` | string | `google/gemini-flash-1.5` | LLM model |
| `openrouter_api_key` | string | — | OpenRouter key (required) |
| `openai_api_key` | string | — | OpenAI key (embeddings) |
| `firecrawl_api_key` | string | — | Firecrawl key (web search) |
| `telegram_bot_token` | string | — | Telegram bot token |
| `discord_bot_token` | string | — | Discord bot token |
| `discord_guild_id` | string | — | Discord server ID |
| `memory_enabled` | boolean | `true` | Enable RAG |
| `token_tracking` | boolean | `true` | Track usage |
| `max_agent_iterations` | number | `20` | Max tool loops |
| `safe_mode` | boolean | `true` | Block dangerous commands |

</details>

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
bun run dev snapshot create
bun run dev snapshot create -o backup.nexus
bun run dev snapshot load backup.nexus
```

---

## 🔌 Plugins

Create custom tools by writing TypeScript plugins:

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
    // Your implementation
    return { city, temp: '22°C', condition: 'Sunny' }
  },
})

const plugin: NexusClawPlugin = {
  name: 'weather',
  version: '1.0.0',
  description: 'Weather lookup tool',
  tools: { get_weather: weatherTool },
  onLoad: async () => console.log('Plugin loaded'),
  onUnload: async () => console.log('Plugin unloaded'),
}

export default plugin
```

```bash
# Load plugin
bun run dev plugin add ./plugins/weather.plugin.ts

# Use it
bun run dev ask "What's the weather in Tokyo?"

# Manage
bun run dev plugin list
bun run dev plugin remove weather
```

---

## 🤖 Remote Control

### Telegram Bot

<table>
<tr>
<td width="50%">

**Setup**

1. Message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` → follow prompts
3. Copy bot token
4. Configure:
   ```bash
   bun run dev config set telegram_bot_token YOUR_TOKEN
   ```
5. Run:
   ```bash
   bun run telegram
   ```

</td>
<td width="50%">

**Commands**

```
/ask <query>        Read-only Q&A
/agent <task>       Full autonomous
/plan <goal>        Generate plan
/review [file]      Code review
/status             Git status
```

**Security**
```bash
# Restrict access by user ID
export TELEGRAM_ALLOWED_USERS=123456,789012
```

</td>
</tr>
</table>

### Discord Bot

<table>
<tr>
<td width="50%">

**Setup**

1. [Developer Portal](https://discord.com/developers/applications)
2. New Application → Bot → Copy token
3. Enable "Message Content Intent"
4. Configure:
   ```bash
   bun run dev config set discord_bot_token YOUR_TOKEN
   bun run dev config set discord_guild_id YOUR_SERVER_ID
   ```
5. Run:
   ```bash
   bun run discord
   ```

</td>
<td width="50%">

**Slash Commands**

```
/ask query:<text>       Read-only Q&A
/agent task:<text>      Full autonomous
/plan goal:<text>       Generate plan
/review file:<path>     Code review
/status                 Git status
```

</td>
</tr>
</table>

---

## 🛡️ Security

```mermaid
flowchart LR
    subgraph Blocked["🚫 BLOCKED COMMANDS"]
        direction TB
        B1["rm -rf /"]
        B2["sudo *"]
        B3["curl | bash"]
        B4["chmod 777"]
        B5["wget | sh"]
    end

    subgraph Protected["🔒 PROTECTIONS"]
        direction TB
        P1["API keys masked\nin config show"]
        P2["Path traversal\nprevention"]
        P3["Staging buffer\nno direct writes"]
        P4["Command blocklist\nregex patterns"]
    end

    subgraph Auth["🔐 ACCESS CONTROL"]
        direction TB
        A1["TELEGRAM_ALLOWED_USERS\nuser ID whitelist"]
        A2["Discord guild\nrestriction"]
    end

    style Blocked fill:#0d1117,stroke:#ff6b6b,stroke-width:3px,color:#fff
    style Protected fill:#0d1117,stroke:#4ade80,stroke-width:3px,color:#fff
    style Auth fill:#0d1117,stroke:#facc15,stroke-width:3px,color:#fff
    style B1 fill:#161b22,stroke:#ff6b6b,color:#fff
    style B2 fill:#161b22,stroke:#ff6b6b,color:#fff
    style B3 fill:#161b22,stroke:#ff6b6b,color:#fff
    style B4 fill:#161b22,stroke:#ff6b6b,color:#fff
    style B5 fill:#161b22,stroke:#ff6b6b,color:#fff
    style P1 fill:#161b22,stroke:#4ade80,color:#fff
    style P2 fill:#161b22,stroke:#4ade80,color:#fff
    style P3 fill:#161b22,stroke:#4ade80,color:#fff
    style P4 fill:#161b22,stroke:#4ade80,color:#fff
    style A1 fill:#161b22,stroke:#facc15,color:#fff
    style A2 fill:#161b22,stroke:#facc15,color:#fff
```

### Security Features

- **Command Blocklist**: Dangerous commands (`rm -rf /`, `sudo`, `curl | bash`) are automatically blocked
- **Path Traversal Prevention**: All file operations validated against workspace root
- **API Key Protection**: Keys stored in `~/.nexusclaw/`, masked in output, never sent to LLM
- **Staging Buffer**: No file mutation hits disk without explicit user approval
- **Access Control**: Telegram/Discord bots support user ID whitelisting

---

## 📊 Cost Tracking

### Supported Models

| Model | Input / 1M tokens | Output / 1M tokens | Best For |
|:------|------------------:|--------------------:|:---------|
| `google/gemini-flash-1.5` | $0.075 | $0.30 | Fast, cheap tasks |
| `google/gemini-pro-1.5` | $1.25 | $5.00 | Balanced |
| `anthropic/claude-3.5-sonnet` | $3.00 | $15.00 | Complex reasoning |
| `anthropic/claude-3-haiku` | $0.25 | $1.25 | Quick responses |
| `openai/gpt-4o` | $2.50 | $10.00 | General purpose |
| `openai/gpt-4o-mini` | $0.15 | $0.60 | Budget friendly |

### Usage Output

```
Tokens: 1,234 in / 567 out
Model: google/gemini-flash-1.5
Cost: $0.0003
```

View usage: `cat .nexusclaw/usage.json`

---

## 🔨 Building & Publishing

### Build Commands

```bash
# Build for Node.js (npm publish)
bun run build

# Build standalone binary
bun run build:binary

# Build both
bun run build:all
```

### npm Publishing

```bash
# 1. Login to npm
npm login

# 2. Build the project
bun run build:all

# 3. Publish
npm publish

# Users can now install with:
npm install -g nexusclaw

# Or run directly:
npx nexusclaw ask "Hello!"
```

### Project Structure (Build)

```
nexusclaw/
├── bin/
│   ├── nexusclaw.js          # npx entry point
│   └── nexusclaw             # Compiled binary (109MB)
├── dist/
│   └── cli/
│       └── index.js          # Node.js bundle (3MB)
└── package.json              # npm configuration
```

---

## 🧪 Tests

```
✅ staging.test.ts   — 12 tests  (StagingBuffer operations)
✅ git.test.ts       —  4 tests  (Git operations)
✅ agent.test.ts     —  2 tests  (ClawError, config shape)
✅ memory.test.ts    —  1 test   (Memory entry shape)
────────────────────────────────────────────────────────────
   19 tests, 39 assertions, 0 failures
```

```bash
# Run tests
bun test

# Run specific file
bun test tests/staging.test.ts

# Verbose output
bun test --verbose
```

---

## 🔧 Troubleshooting

| Error | Solution |
|:------|:---------|
| `OpenRouter API key not configured` | `bun run dev config set openrouter_api_key sk-or-...` |
| `Memory store not initialized` | `bun run dev memory init` |
| `OpenAI API key required` | `bun run dev config set openai_api_key sk-...` |
| TypeScript errors | `bun install && bun run lint` |
| Tests failing | `bun install && bun test` |

---

## 🤝 Contributing

```bash
# 1. Fork and clone
git clone https://github.com/soumyachk101/NexusClaw.git
cd nexusclaw

# 2. Create feature branch
bun run dev git branch my-feature

# 3. Make changes
# ... edit files ...

# 4. Run tests
bun test
bun run lint

# 5. Commit
bun run dev git commit

# 6. Push and create PR
bun run dev git pr
```

### Development Guidelines

- TypeScript strict mode (`noUncheckedIndexedAccess: true`)
- No `any` types (except for LLM SDK compatibility)
- All tool returns must be serializable
- Tests required for new features
- Conventional commits (`feat:`, `fix:`, `refactor:`, etc.)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:6e40c9,100:0d1117&height=120&section=footer" width="100%"/>
</p>

<p align="center">
  <strong>Built with ❤️ using Bun, TypeScript, and Vercel AI SDK</strong>
</p>
