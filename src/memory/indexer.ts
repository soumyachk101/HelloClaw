import { readFile, readdir, stat } from 'fs/promises'
import { resolve, relative, extname } from 'path'
import OpenAI from 'openai'
import { getConfig } from '@/config'
import { insertEntries, type MemoryEntry } from '@/memory/store'
import { logger } from '@/utils/logger'
import { ClawError } from '@/utils/errors'

const CODE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.yaml', '.yml',
  '.py', '.go', '.rs', '.java', '.c', '.cpp', '.h', '.hpp',
  '.css', '.scss', '.html', '.sql', '.sh', '.toml', '.env',
])

const CHUNK_SIZE = 500 // tokens (approximate)
const CHUNK_OVERLAP = 50

function chunkText(text: string): string[] {
  const words = text.split(/\s+/)
  const chunks: string[] = []
  const step = CHUNK_SIZE - CHUNK_OVERLAP

  for (let i = 0; i < words.length; i += step) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(' ')
    if (chunk.trim()) chunks.push(chunk)
  }

  return chunks.length > 0 ? chunks : [text]
}

async function getFiles(dir: string, root: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue

    const fullPath = resolve(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await getFiles(fullPath, root)))
    } else if (CODE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      const stats = await stat(fullPath)
      if (stats.size < 500_000) files.push(fullPath) // skip files > 500KB
    }
  }

  return files
}

export async function indexProject(workspaceRoot?: string): Promise<number> {
  const config = getConfig()
  const root = workspaceRoot ?? config.workspace_root

  if (!config.openai_api_key) {
    throw new ClawError(
      'OpenAI API key required for embeddings. Set it with: nexusclaw config set openai_api_key <key>',
      'CONFIG_MISSING',
      true,
    )
  }

  const openai = new OpenAI({ apiKey: config.openai_api_key })
  const files = await getFiles(root, root)

  logger.info(`Indexing ${files.length} files...`)

  let totalChunks = 0

  for (const filePath of files) {
    try {
      const content = await readFile(filePath, 'utf-8')
      const relPath = relative(root, filePath)
      const chunks = chunkText(content)

      if (chunks.length === 0) continue

      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunks,
      })

      const entries: MemoryEntry[] = chunks.map((chunk, i) => ({
        id: `${relPath}:${i}`,
        path: relPath,
        chunk,
        vector: embeddingResponse.data[i]!.embedding,
        created_at: new Date().toISOString(),
      }))

      await insertEntries(entries)
      totalChunks += entries.length

      if (totalChunks % 50 === 0) {
        logger.info(`  Indexed ${totalChunks} chunks...`)
      }
    } catch {
      // Skip files that can't be read
    }
  }

  logger.success(`Indexed ${totalChunks} chunks from ${files.length} files`)
  return totalChunks
}
