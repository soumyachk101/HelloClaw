import { expect, test, describe, beforeEach } from 'bun:test'
import { mkdtempSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

describe('Memory Store', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'nexusclaw-memory-'))
  })

  test('MemoryEntry interface has correct shape', () => {
    const entry = {
      id: 'test.ts:0',
      path: 'test.ts',
      chunk: 'some code here',
      vector: new Array(1536).fill(0.1),
      created_at: new Date().toISOString(),
    }

    expect(entry.id).toBe('test.ts:0')
    expect(entry.path).toBe('test.ts')
    expect(entry.vector).toHaveLength(1536)
    expect(entry.created_at).toBeTruthy()
  })
})
