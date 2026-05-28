import { tool } from 'ai'
import { z } from 'zod'
import { readFile, readdir, stat } from 'fs/promises'
import { resolve, relative } from 'path'
import { ClawError } from '@/utils/errors'

export const readFileTool = tool({
  description: 'Read the contents of a file at the given path',
  parameters: z.object({
    path: z.string().describe('Relative path to the file from workspace root'),
  }),
  execute: async ({ path }) => {
    try {
      const fullPath = resolve(process.cwd(), path)
      const content = await readFile(fullPath, 'utf-8')
      return { success: true, content, lines: content.split('\n').length }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      throw new ClawError(`Failed to read file: ${message}`, 'READ_FAILED', true, { path })
    }
  },
})

export const listDirectoryTool = tool({
  description: 'List files and directories at the given path',
  parameters: z.object({
    path: z.string().optional().describe('Relative path to directory (defaults to workspace root)'),
  }),
  execute: async ({ path = '.' }) => {
    try {
      const fullPath = resolve(process.cwd(), path)
      const entries = await readdir(fullPath, { withFileTypes: true })
      const items = await Promise.all(
        entries.map(async (entry) => {
          const entryPath = resolve(fullPath, entry.name)
          const stats = await stat(entryPath)
          return {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            size: stats.size,
          }
        }),
      )
      return { success: true, path, items }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      throw new ClawError(`Failed to list directory: ${message}`, 'LIST_FAILED', true, { path })
    }
  },
})

export const writeFileTool = tool({
  description: 'Stage a file write (will not be applied until approved by user)',
  parameters: z.object({
    path: z.string().describe('Relative path to the file'),
    content: z.string().describe('Content to write'),
  }),
  execute: async ({ path, content }) => {
    return {
      success: true,
      staged: true,
      type: 'write' as const,
      path,
      newContent: content,
    }
  },
})

export const createFileTool = tool({
  description: 'Stage creation of a new file (will not be applied until approved)',
  parameters: z.object({
    path: z.string().describe('Relative path for the new file'),
    content: z.string().describe('Content for the new file'),
  }),
  execute: async ({ path, content }) => {
    return {
      success: true,
      staged: true,
      type: 'create' as const,
      path,
      newContent: content,
    }
  },
})

export const deleteFileTool = tool({
  description: 'Stage deletion of a file (will not be applied until approved)',
  parameters: z.object({
    path: z.string().describe('Relative path to the file to delete'),
  }),
  execute: async ({ path }) => {
    try {
      const fullPath = resolve(process.cwd(), path)
      const content = await readFile(fullPath, 'utf-8')
      return {
        success: true,
        staged: true,
        type: 'delete' as const,
        path,
        originalContent: content,
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      throw new ClawError(`Failed to read file for deletion: ${message}`, 'DELETE_FAILED', true, { path })
    }
  },
})
