import { expect, test, describe, beforeEach } from 'bun:test'
import { StagingBuffer, type StagedChange } from '@/agent/staging'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

describe('StagingBuffer', () => {
  let tmpDir: string
  let buffer: StagingBuffer

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'nexusclaw-test-'))
    buffer = new StagingBuffer(tmpDir)
  })

  test('should stage a write without applying to disk', () => {
    buffer.stage({ type: 'write', path: 'test.ts', newContent: 'hello' })
    expect(buffer.getAll()).toHaveLength(1)
    expect(existsSync(resolve(tmpDir, 'test.ts'))).toBe(false)
  })

  test('should stage a create', () => {
    buffer.stage({ type: 'create', path: 'new.ts', newContent: 'new file' })
    const all = buffer.getAll()
    expect(all).toHaveLength(1)
    expect(all[0]!.type).toBe('create')
  })

  test('should stage a delete', () => {
    buffer.stage({ type: 'delete', path: 'old.ts', originalContent: 'old content' })
    const all = buffer.getAll()
    expect(all).toHaveLength(1)
    expect(all[0]!.type).toBe('delete')
  })

  test('should generate unified diff', () => {
    buffer.stage({ type: 'write', path: 'test.ts', originalContent: 'old', newContent: 'new' })
    const diff = buffer.getDiff()
    expect(diff).toContain('-old')
    expect(diff).toContain('+new')
  })

  test('should approve all changes', () => {
    buffer.stage({ type: 'write', path: 'a.ts', newContent: 'a' })
    buffer.stage({ type: 'write', path: 'b.ts', newContent: 'b' })
    buffer.approve()
    const all = buffer.getAll()
    expect(all.every(c => c.approved === true)).toBe(true)
  })

  test('should reject all changes', () => {
    buffer.stage({ type: 'write', path: 'a.ts', newContent: 'a' })
    buffer.reject()
    const all = buffer.getAll()
    expect(all.every(c => c.approved === false)).toBe(true)
  })

  test('should approve specific change', () => {
    buffer.stage({ type: 'write', path: 'a.ts', newContent: 'a' })
    buffer.stage({ type: 'write', path: 'b.ts', newContent: 'b' })
    buffer.approve('a.ts')
    const all = buffer.getAll()
    expect(all.find(c => c.path === 'a.ts')?.approved).toBe(true)
    expect(all.find(c => c.path === 'b.ts')?.approved).toBeUndefined()
  })

  test('should apply approved changes to disk', async () => {
    buffer.stage({ type: 'create', path: 'test.ts', newContent: 'hello world' })
    buffer.approve()
    await buffer.apply()

    const fullPath = resolve(tmpDir, 'test.ts')
    expect(existsSync(fullPath)).toBe(true)
    expect(readFileSync(fullPath, 'utf-8')).toBe('hello world')
  })

  test('should not apply rejected changes', async () => {
    buffer.stage({ type: 'create', path: 'test.ts', newContent: 'hello world' })
    buffer.reject()
    await buffer.apply()

    expect(existsSync(resolve(tmpDir, 'test.ts'))).toBe(false)
  })

  test('should clear buffer', () => {
    buffer.stage({ type: 'write', path: 'a.ts', newContent: 'a' })
    buffer.clear()
    expect(buffer.getAll()).toHaveLength(0)
    expect(buffer.size).toBe(0)
  })

  test('should overwrite same path', () => {
    buffer.stage({ type: 'write', path: 'test.ts', newContent: 'first' })
    buffer.stage({ type: 'write', path: 'test.ts', newContent: 'second' })
    expect(buffer.getAll()).toHaveLength(1)
    expect(buffer.get('test.ts')?.newContent).toBe('second')
  })
})
