import { AgentCore } from '@/agent/core'

export async function runAskMode(task: string, workspaceRoot?: string): Promise<string> {
  const agent = new AgentCore(workspaceRoot)
  return agent.run({ task, mode: 'ask' })
}
