import { existsSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'

export function ensureDir(dirPath: string): void {
  const resolved = resolve(dirPath)
  if (!existsSync(resolved)) {
    mkdirSync(resolved, { recursive: true })
  }
}

export function ensureFileDir(filePath: string): void {
  ensureDir(dirname(resolve(filePath)))
}

export function safePath(workspaceRoot: string, relativePath: string): string {
  const resolved = resolve(workspaceRoot, relativePath)
  if (!resolved.startsWith(resolve(workspaceRoot))) {
    throw new Error(`Path traversal detected: ${relativePath}`)
  }
  return resolved
}
