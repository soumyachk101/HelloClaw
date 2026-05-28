import { Command } from 'commander'
import chalk from 'chalk'
import { loadPlugin, unloadPlugin, getLoadedPlugins } from '@/plugins/loader'

export const pluginCommand = new Command('plugin')
  .description('Manage plugins')

pluginCommand
  .command('add <path>')
  .description('Load a plugin from a .ts file')
  .action(async (pluginPath: string) => {
    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Load Plugin'))
    console.log(chalk.gray('  │'))
    console.log(chalk.gray('  ├─ ') + chalk.gray('Path: ') + chalk.white(pluginPath))

    const plugin = await loadPlugin(pluginPath)
    if (plugin) {
      console.log(chalk.gray('  ├─ ') + chalk.gray('Name: ') + chalk.white(plugin.name))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Version: ') + chalk.white(plugin.version))
      console.log(chalk.gray('  ├─ ') + chalk.gray('Tools: ') + chalk.white(String(Object.keys(plugin.tools).length)))
      console.log(chalk.gray('  └─ ') + chalk.green('✔ Plugin loaded'))
    } else {
      console.log(chalk.gray('  └─ ') + chalk.red('✖ Failed to load plugin'))
    }
    console.log('')
  })

pluginCommand
  .command('remove <name>')
  .description('Unload a plugin by name')
  .action(async (name: string) => {
    const removed = await unloadPlugin(name)
    if (removed) {
      console.log('')
      console.log(chalk.green('  ✔ ') + chalk.gray('Plugin unloaded: ') + chalk.white(name))
      console.log('')
    } else {
      console.log('')
      console.log(chalk.yellow('  ⚠ ') + chalk.gray('Plugin not found: ') + chalk.white(name))
      console.log('')
    }
  })

pluginCommand
  .command('list')
  .description('List loaded plugins')
  .action(() => {
    const plugins = getLoadedPlugins()

    console.log('')
    console.log(chalk.cyan('  ◆ ') + chalk.white.bold('Loaded Plugins'))
    console.log(chalk.gray('  │'))

    if (plugins.length === 0) {
      console.log(chalk.gray('  ├─ ') + chalk.gray('No plugins loaded'))
      console.log(chalk.gray('  └─ ') + chalk.gray('Load with: nexusclaw plugin add <path>'))
    } else {
      for (let i = 0; i < plugins.length; i++) {
        const p = plugins[i]!
        const isLast = i === plugins.length - 1
        const prefix = isLast ? '  └─ ' : '  ├─ '

        console.log(chalk.gray(prefix) + chalk.white.bold(p.name) + chalk.gray(` v${p.version}`))
        console.log(chalk.gray(isLast ? '     ' : '  │  ') + chalk.gray(p.description))
        console.log(chalk.gray(isLast ? '     ' : '  │  ') + chalk.gray(`Tools: ${Object.keys(p.tools).join(', ')}`))

        if (!isLast) {
          console.log(chalk.gray('  │'))
        }
      }
    }

    console.log('')
  })
