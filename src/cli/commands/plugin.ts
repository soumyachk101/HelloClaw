import { Command } from 'commander'
import { loadPlugin, unloadPlugin, getLoadedPlugins } from '@/plugins/loader'
import { logger } from '@/utils/logger'

export const pluginCommand = new Command('plugin')
  .description('Manage plugins')

pluginCommand
  .command('add <path>')
  .description('Load a plugin from a .ts file')
  .action(async (pluginPath: string) => {
    const plugin = await loadPlugin(pluginPath)
    if (plugin) {
      logger.success(`Plugin "${plugin.name}" loaded with ${Object.keys(plugin.tools).length} tools`)
    }
  })

pluginCommand
  .command('remove <name>')
  .description('Unload a plugin by name')
  .action(async (name: string) => {
    const removed = await unloadPlugin(name)
    if (!removed) {
      logger.warn(`Plugin "${name}" not found`)
    }
  })

pluginCommand
  .command('list')
  .description('List loaded plugins')
  .action(() => {
    const plugins = getLoadedPlugins()
    if (plugins.length === 0) {
      logger.info('No plugins loaded')
    } else {
      for (const p of plugins) {
        console.log(`  ${p.name} v${p.version} — ${p.description}`)
      }
    }
  })
