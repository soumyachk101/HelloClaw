import { type Tool } from 'ai'

export interface NexusClawTool {
  name: string
  description: string
  parameters: unknown
  execute: (args: unknown) => Promise<unknown>
}

export interface NexusClawPlugin {
  name: string
  version: string
  description: string
  tools: Record<string, Tool>
  onLoad?: () => Promise<void>
  onUnload?: () => Promise<void>
}
