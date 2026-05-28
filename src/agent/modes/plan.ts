import { AgentCore } from '@/agent/core'

export async function runPlanMode(goal: string, workspaceRoot?: string): Promise<string> {
  const agent = new AgentCore(workspaceRoot)
  return agent.run({ task: goal, mode: 'plan' })
}
