import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { getConfig } from '@/config'
import { gitDiff, gitLog } from '@/git/operations'

export async function generateCommitMessage(workspaceRoot?: string): Promise<string> {
  const config = getConfig()

  if (!config.openrouter_api_key) {
    throw new Error('OpenRouter API key not configured')
  }

  const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.openrouter_api_key,
  })

  const diff = await gitDiff(true, workspaceRoot)

  if (!diff.trim()) {
    throw new Error('No staged changes found. Stage files first with: git add .')
  }

  const result = streamText({
    model: openrouter(config.model),
    system: `You are a commit message generator. Write a concise, conventional commit message for the given diff.
Use the format: type(scope): description
Types: feat, fix, refactor, docs, test, chore
Keep the first line under 72 characters. Add a blank line and bullet points for details if needed.
Output ONLY the commit message, nothing else.`,
    messages: [{ role: 'user', content: `Generate a commit message for this diff:\n\n${diff}` }],
  })

  let message = ''
  for await (const delta of result.textStream) {
    message += delta
  }
  return message.trim()
}

export async function generatePRDescription(workspaceRoot?: string): Promise<{ title: string; body: string }> {
  const config = getConfig()

  if (!config.openrouter_api_key) {
    throw new Error('OpenRouter API key not configured')
  }

  const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.openrouter_api_key,
  })

  const diff = await gitDiff(false, workspaceRoot)
  const log = await gitLog(20, workspaceRoot)

  const result = streamText({
    model: openrouter(config.model),
    system: `You are a PR description generator. Given a diff and recent commit history, generate a PR title and body.
Respond in JSON format: {"title": "...", "body": "..."}
Title: under 72 characters, descriptive.
Body: Include a summary section and a "Changes" section with bullet points.
Output ONLY valid JSON.`,
    messages: [{
      role: 'user',
      content: `Diff:\n${diff}\n\nRecent commits:\n${log.all.map(c => `- ${c.message}`).join('\n')}`,
    }],
  })

  let json = ''
  for await (const delta of result.textStream) {
    json += delta
  }

  try {
    return JSON.parse(json) as { title: string; body: string }
  } catch {
    return { title: 'PR Update', body: json }
  }
}

export async function generateChangelog(workspaceRoot?: string): Promise<string> {
  const config = getConfig()

  if (!config.openrouter_api_key) {
    throw new Error('OpenRouter API key not configured')
  }

  const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.openrouter_api_key,
  })

  const log = await gitLog(50, workspaceRoot)

  const result = streamText({
    model: openrouter(config.model),
    system: `You are a changelog generator. Given a list of commit messages, generate a CHANGELOG.md-style output.
Group by type: Features, Bug Fixes, Refactoring, Documentation, etc.
Use ## for section headers. Each entry should be a bullet point.
Output ONLY the changelog content.`,
    messages: [{
      role: 'user',
      content: `Commits:\n${log.all.map(c => `- ${c.message}`).join('\n')}`,
    }],
  })

  let changelog = ''
  for await (const delta of result.textStream) {
    changelog += delta
  }
  return changelog.trim()
}
