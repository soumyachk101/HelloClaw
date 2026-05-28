import { AgentCore } from '@/agent/core'
import { StagingBuffer } from '@/agent/staging'
import { logger } from '@/utils/logger'

export interface AgentModeResult {
  response: string
  staging: StagingBuffer
}

export async function runAgentMode(task: string, workspaceRoot?: string): Promise<AgentModeResult> {
  const agent = new AgentCore(workspaceRoot)
  const response = await agent.run({ task, mode: 'agent' })

  const staging = agent.getStaging()
  if (staging.size > 0) {
    logger.info(`\n${staging.size} change(s) staged. Review with diff, then approve or reject.`)
  }

  return { response, staging }
}
