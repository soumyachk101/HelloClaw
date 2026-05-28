import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { getConfig } from '@/config'
import { gitDiff } from '@/git/operations'

export type ReviewSeverity = 'CRITICAL' | 'WARNING' | 'INFO'

export interface ReviewFinding {
  severity: ReviewSeverity
  file: string
  line?: number
  message: string
}

export async function reviewFile(filePath: string, workspaceRoot?: string): Promise<string> {
  const config = getConfig()
  const root = workspaceRoot ?? config.workspace_root

  if (!config.openrouter_api_key) {
    throw new Error('OpenRouter API key not configured')
  }

  const content = await readFile(resolve(root, filePath), 'utf-8')

  const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.openrouter_api_key,
  })

  const result = await streamText({
    model: openrouter(config.model),
    system: `You are an expert code reviewer. Analyze the provided code for:
- Bugs and logic errors
- Security vulnerabilities
- Performance issues
- Code quality and maintainability

Output format (one per finding):
[SEVERITY] file:line — description

Severity levels: CRITICAL, WARNING, INFO
Be specific and actionable. If no issues found, say so.`,
    messages: [{ role: 'user', content: `Review this file (${filePath}):\n\n${content}` }],
  })

  let review = ''
  for await (const delta of result.textStream) {
    review += delta
  }
  return review
}

export async function reviewDiff(ref?: string, workspaceRoot?: string): Promise<string> {
  const config = getConfig()

  if (!config.openrouter_api_key) {
    throw new Error('OpenRouter API key not configured')
  }

  const diff = ref
    ? await gitDiff(false, workspaceRoot)
    : await gitDiff(true, workspaceRoot)

  if (!diff.trim()) {
    return 'No changes to review.'
  }

  const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.openrouter_api_key,
  })

  const result = await streamText({
    model: openrouter(config.model),
    system: `You are an expert code reviewer. Review the provided diff for issues.
Output format:
[SEVERITY] file:line — description

Focus on: bugs, security, performance, code quality.
Be specific and actionable.`,
    messages: [{ role: 'user', content: `Review this diff:\n\n${diff}` }],
  })

  let review = ''
  for await (const delta of result.textStream) {
    review += delta
  }
  return review
}
