import { connect } from '@lancedb/lancedb'
import { existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { getConfig } from '@/config'

export interface MemoryEntry {
  id: string
  path: string
  chunk: string
  vector: number[]
  created_at: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let table: any = null

const DB_DIR = '.nexusclaw/memory'
const TABLE_NAME = 'chunks'

function getDbPath(workspaceRoot: string): string {
  return resolve(workspaceRoot, DB_DIR)
}

export async function initMemoryStore(workspaceRoot?: string): Promise<void> {
  const config = getConfig()
  const root = workspaceRoot ?? config.workspace_root
  const dbPath = getDbPath(root)

  if (!existsSync(dbPath)) {
    mkdirSync(dbPath, { recursive: true })
  }

  db = await connect(dbPath)
  try {
    table = await db.openTable(TABLE_NAME)
  } catch {
    table = await db.createTable(TABLE_NAME, [{
      id: '',
      path: '',
      chunk: '',
      vector: new Array(1536).fill(0),
      created_at: '',
    }])
  }
}

export async function insertEntries(entries: MemoryEntry[]): Promise<void> {
  if (!table) throw new Error('Memory store not initialized. Run: nexusclaw memory init')
  await table.add(entries)
}

export async function searchEntries(vector: number[], topK: number): Promise<MemoryEntry[]> {
  if (!table) throw new Error('Memory store not initialized. Run: nexusclaw memory init')
  const results = await table
    .search(vector)
    .limit(topK)
    .toArray()

  return results as unknown as MemoryEntry[]
}

export async function clearMemoryStore(): Promise<void> {
  if (!table) throw new Error('Memory store not initialized')
  await table.delete('1=1')
}

export async function getMemoryCount(): Promise<number> {
  if (!table) return 0
  const results = await table.countRows()
  return results
}
