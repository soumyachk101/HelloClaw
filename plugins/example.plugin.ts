import { tool } from 'ai'
import { z } from 'zod'
import type { NexusClawPlugin } from '../src/plugins/types'

/**
 * Example Plugin for NexusClaw
 *
 * This plugin demonstrates how to create custom tools.
 * To use: nexusclaw plugin add ./plugins/example.plugin.ts
 */

const helloTool = tool({
  description: 'Say hello to someone',
  parameters: z.object({
    name: z.string().describe('Name of the person to greet'),
  }),
  execute: async ({ name }) => {
    return {
      message: `Hello, ${name}! This is NexusClaw with a custom plugin.`,
      timestamp: new Date().toISOString(),
    }
  },
})

const timestampTool = tool({
  description: 'Get the current timestamp',
  parameters: z.object({}),
  execute: async () => {
    return {
      timestamp: new Date().toISOString(),
      unix: Date.now(),
    }
  },
})

const plugin: NexusClawPlugin = {
  name: 'example',
  version: '1.0.0',
  description: 'Example plugin with hello and timestamp tools',
  tools: {
    hello: helloTool,
    get_timestamp: timestampTool,
  },
  onLoad: async () => {
    console.log('Example plugin loaded!')
  },
  onUnload: async () => {
    console.log('Example plugin unloaded!')
  },
}

export default plugin
