# PRD — NexusClaw (OpenClaw Extended Clone)
> Product Requirements Document · v1.0 · Author: Soumya · Status: Draft

---

## 1. Overview

### 1.1 Product Summary
NexusClaw is a fully local, CLI-first autonomous AI coding agent that can read, write, plan, review, and deploy code — controllable both from the terminal and remotely via Telegram (and optionally Discord/Slack). It extends the OpenClaw foundation with persistent memory, multi-agent orchestration, Git-native workflows, and a plugin system.

### 1.2 Problem Statement
Existing AI coding tools (Cursor, Claude Code, GitHub Copilot) are either:
- Cloud-locked with no local-first control
- Expensive with no free-tier LLM routing
- Not extensible via custom modes or remote control
- Stateless — no memory of past sessions or project context

NexusClaw solves all four.

### 1.3 Target Users
| Persona | Need |
|---|---|
| Solo developer | Fast, autonomous coding help without leaving terminal |
| Hackathon builder | Plan → code → commit in one agent session |
| Remote dev on mobile | Control local machine via Telegram from anywhere |
| Open-source contributor | Review PRs, generate changelogs, manage issues via CLI |

---

## 2. Goals & Non-Goals

### Goals
- Build a fully working OpenClaw clone with all 3 core modes (Agent, Ask, Plan)
- Add 6+ extended features on top of base OpenClaw
- Maintain a Staging & Approval flow for all file mutations
- Support multi-platform remote control (Telegram + Discord)
- Ship a persistent project memory layer (vector store)
- Enable Git-native workflows (branch, commit, PR creation)

### Non-Goals
- No GUI/web dashboard (CLI + Telegram only)
- No cloud hosting of the agent itself
- No fine-tuning or custom model training
- Not a replacement for full IDEs

---

## 3. Core Modes (Base OpenClaw)

### 3.1 Agent Mode
The AI is granted tool access to autonomously execute tasks on the local workspace.

**Tools available to agent:**
- `read_file` — Read any file by path
- `write_file` — Stage a file write (not applied until approved)
- `create_file` — Stage a new file creation
- `delete_file` — Stage a deletion
- `list_directory` — List files/folders
- `run_command` — Execute safe shell commands (sandboxed)
- `search_web` — Firecrawl-powered web search

**Staging & Approval Flow:**
1. Agent proposes changes → held in memory as `StagingBuffer`
2. User sees unified diff of all staged changes
3. User can `approve all`, `reject all`, or toggle individual changes
4. Only on explicit approval do changes hit disk

**Acceptance Criteria:**
- [ ] Agent can complete a multi-step task (e.g., "add auth to my Express app") end-to-end
- [ ] Staging buffer correctly holds all mutations before approval
- [ ] Diff view is readable and accurate
- [ ] Rejected changes are cleanly discarded

---

### 3.2 Ask Mode
Read-only Q&A mode. Agent reads files/web and returns analysis.

**Capabilities:**
- Analyze single or multiple files
- Search web via Firecrawl and summarize
- Save output as `.md` file optionally
- Answer architecture/code quality questions

**Acceptance Criteria:**
- [ ] Can answer "explain this entire codebase" with correct file tree traversal
- [ ] Web search returns relevant, summarized results
- [ ] Output can be saved with a single `--save` flag

---

### 3.3 Plan Mode
AI acts as a project manager. Breaks a goal into steps.

**Capabilities:**
- Input: a high-level goal ("build a REST API with auth")
- Output: ordered, actionable step list
- User can toggle steps on/off
- Approved plan can be handed to Agent Mode for execution

**Acceptance Criteria:**
- [ ] Plans are granular (not vague)
- [ ] Step toggle works correctly
- [ ] Plan → Agent handoff executes only selected steps

---

## 4. Extended Features (Beyond OpenClaw)

### 4.1 Memory Mode (Project Context Store)
**What:** Persistent vector memory of the current project — file summaries, past agent sessions, decisions made.

**Why:** Agents are stateless by default. Memory lets the agent "know" your project without re-reading every file each session.

**How:**
- On first run, agent indexes project files into a local vector store (ChromaDB or LanceDB)
- Each session, relevant context is retrieved via semantic search
- Past decisions/approved changes are logged to memory

**User Flow:**
```
nexusclaw memory init        # Index current project
nexusclaw memory search "auth logic"  # Manual query
nexusclaw memory clear       # Wipe memory
```

---

### 4.2 Review Mode
**What:** AI code reviewer. Point it at a file or diff and it returns structured review feedback.

**Why:** Async code reviews without needing a teammate.

**Output Format:**
```
[CRITICAL] src/auth.ts:42 — JWT secret hardcoded, use env variable
[WARNING]  src/api.ts:87  — No error handling on DB call
[INFO]     src/utils.ts   — Consider memoizing this function
```

**Flags:**
```
nexusclaw review src/auth.ts
nexusclaw review --diff HEAD~1  # Review last commit
nexusclaw review --pr 42        # Review a GitHub PR (via GH CLI)
```

---

### 4.3 Git Mode
**What:** AI-powered Git workflow automation.

**Capabilities:**
- Auto-generate commit messages from staged diff
- Create feature branches with descriptive names
- Push + open GitHub PR with AI-generated title & description
- Generate CHANGELOG entries

**User Flow:**
```
nexusclaw git commit          # AI writes commit message from staged diff
nexusclaw git branch "add user auth"  # Creates feat/add-user-auth
nexusclaw git pr              # Push + open PR with AI description
nexusclaw git changelog       # Generate CHANGELOG from recent commits
```

---

### 4.4 Multi-Platform Remote (Discord Bot)
**What:** Extend Telegram remote control to Discord.

**Why:** Developers are more often on Discord than Telegram.

**Commands mirrored from Telegram:**
- `/ask` `/agent` `/plan` `/review` `/git`
- Inline diff display in Discord embeds
- Approve/reject via Discord buttons (interactive components)

---

### 4.5 Cost & Token Tracker
**What:** Real-time tracking of token usage and estimated cost per session/command.

**Why:** OpenRouter aggregates many models; devs need visibility on spend.

**Display:**
```
✓ Agent task complete
  └─ Tokens: 4,821 in / 1,203 out
  └─ Model: google/gemini-flash-1.5
  └─ Est. Cost: $0.0012
  └─ Session Total: $0.0048
```

**Stored per session in** `~/.nexusclaw/usage.json`

---

### 4.6 Plugin System
**What:** Allow users to add custom tools to the agent without modifying core code.

**Plugin Format:** A plugin is a `.ts` file exporting a `NexusClawPlugin` interface:

```typescript
export const myPlugin: NexusClawPlugin = {
  name: "linear",
  description: "Create Linear issues from the agent",
  tools: [createIssueTool, listIssuesTool],
}
```

**Commands:**
```
nexusclaw plugin add ./plugins/linear.ts
nexusclaw plugin list
nexusclaw plugin remove linear
```

---

### 4.7 Snapshot Mode
**What:** Capture the current state of a project as a compressed context snapshot — useful for sharing project state with the agent or teammates.

```
nexusclaw snapshot create     # Creates .nexus snapshot file
nexusclaw snapshot load ./project.nexus
```

---

## 5. UX & CLI Design

### 5.1 Command Structure
```
nexusclaw <mode> [options]

Modes:
  agent    Run autonomous agent on workspace
  ask      Read-only Q&A mode
  plan     Generate and execute a step-by-step plan
  review   AI code review
  git      Git workflow automation
  memory   Manage project memory
  plugin   Manage plugins
  snapshot Manage project snapshots
  config   Manage config (model, API keys, etc.)
```

### 5.2 Terminal UI Principles
- Use Clack for interactive prompts (spinners, confirms, selects)
- Figlet for branded ASCII header on startup
- Color-coded output: green = success, red = error, yellow = warning, blue = info
- All destructive actions require explicit confirmation

### 5.3 Config File
Located at `~/.nexusclaw/config.json`:
```json
{
  "model": "google/gemini-flash-1.5",
  "openrouter_api_key": "",
  "telegram_bot_token": "",
  "discord_bot_token": "",
  "firecrawl_api_key": "",
  "memory_enabled": true,
  "token_tracking": true,
  "max_agent_iterations": 20
}
```

---

## 6. Remote Control (Telegram + Discord)

### 6.1 Telegram Commands
| Command | Description |
|---|---|
| `/ask <query>` | Ask mode query |
| `/agent <task>` | Agent mode task |
| `/plan <goal>` | Plan mode |
| `/review <file>` | Review a file |
| `/git commit` | Auto commit |
| `/status` | Current workspace status |
| `/approve` | Approve staged changes |
| `/reject` | Reject staged changes |

### 6.2 Approval via Mobile
When agent stages changes, Telegram sends:
1. A diff message (code block)
2. Two inline buttons: ✅ Approve / ❌ Reject

---

## 7. Success Metrics
| Metric | Target |
|---|---|
| Agent task completion rate | >85% on well-scoped tasks |
| Time to first agent output | <3 seconds |
| Memory retrieval accuracy | Semantically relevant in >90% of queries |
| CLI startup time (Bun) | <200ms |
| Telegram command response time | <5 seconds |

---

## 8. Milestones

| Phase | Scope | Target |
|---|---|---|
| Phase 0 | Project setup, CLI skeleton, config | Week 1 |
| Phase 1 | Base OpenClaw: Agent + Ask + Plan modes | Week 2–3 |
| Phase 2 | Telegram remote control | Week 3 |
| Phase 3 | Git Mode + Review Mode | Week 4 |
| Phase 4 | Memory layer + Token tracker | Week 5 |
| Phase 5 | Discord bot + Plugin system | Week 6 |
| Phase 6 | Snapshot mode + Polish + Docs | Week 7 |

---

*Last updated: May 2026*
