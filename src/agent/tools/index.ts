import { readFileTool, listDirectoryTool, writeFileTool, createFileTool, deleteFileTool } from '@/agent/tools/fs'
import { runCommandTool } from '@/agent/tools/shell'
import { searchWebTool } from '@/agent/tools/web'
import { memorySearchTool } from '@/agent/tools/memory'

export const coreTools = {
  read_file: readFileTool,
  list_directory: listDirectoryTool,
  write_file: writeFileTool,
  create_file: createFileTool,
  delete_file: deleteFileTool,
  run_command: runCommandTool,
  search_web: searchWebTool,
  memory_search: memorySearchTool,
}

export type ToolName = keyof typeof coreTools
