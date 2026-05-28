import { getConfig, setConfig } from '@/config'
import { logger } from '@/utils/logger'
import type { NexusClawPlugin } from '@/plugins/types'

const loadedPlugins: Map<string, NexusClawPlugin> = new Map()

export async function loadPlugin(pluginPath: string): Promise<NexusClawPlugin | null> {
  try {
    const mod = await import(pluginPath)
    const plugin: NexusClawPlugin = mod.default ?? mod[Object.keys(mod)[0] ?? '']

    if (!plugin?.name || !plugin?.tools) {
      logger.error(`Invalid plugin at ${pluginPath}: missing name or tools`)
      return null
    }

    if (plugin.onLoad) await plugin.onLoad()

    loadedPlugins.set(plugin.name, plugin)
    logger.success(`Loaded plugin: ${plugin.name} v${plugin.version}`)

    const config = getConfig()
    if (!config.plugins.includes(pluginPath)) {
      setConfig({ plugins: [...config.plugins, pluginPath] })
    }

    return plugin
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    logger.error(`Failed to load plugin ${pluginPath}: ${message}`)
    return null
  }
}

export async function unloadPlugin(name: string): Promise<boolean> {
  const plugin = loadedPlugins.get(name)
  if (!plugin) return false

  if (plugin.onUnload) await plugin.onUnload()
  loadedPlugins.delete(name)

  const config = getConfig()
  setConfig({ plugins: config.plugins.filter(p => !p.includes(name)) })

  logger.success(`Unloaded plugin: ${name}`)
  return true
}

export async function loadAllPlugins(): Promise<void> {
  const config = getConfig()
  for (const path of config.plugins) {
    await loadPlugin(path)
  }
}

export function getLoadedPlugins(): NexusClawPlugin[] {
  return Array.from(loadedPlugins.values())
}

export function getPluginTools(): Record<string, unknown> {
  const tools: Record<string, unknown> = {}
  for (const plugin of loadedPlugins.values()) {
    Object.assign(tools, plugin.tools)
  }
  return tools
}
