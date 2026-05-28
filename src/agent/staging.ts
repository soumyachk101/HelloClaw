import { writeFileSync, mkdirSync, unlinkSync, existsSync } from 'fs'
import { dirname, resolve } from 'path'
import { createTwoFilesPatch } from 'diff'
import { logger } from '@/utils/logger'

export interface StagedChange {
  type: 'write' | 'create' | 'delete'
  path: string
  originalContent?: string
  newContent?: string
  approved?: boolean
}

export class StagingBuffer {
  private changes: Map<string, StagedChange> = new Map()
  private workspaceRoot: string

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot
  }

  stage(change: StagedChange): void {
    this.changes.set(change.path, { ...change, approved: undefined })
  }

  getAll(): StagedChange[] {
    return Array.from(this.changes.values())
  }

  get(path: string): StagedChange | undefined {
    return this.changes.get(path)
  }

  getDiff(): string {
    const diffs: string[] = []
    for (const change of this.changes.values()) {
      if (change.type === 'delete') {
        diffs.push(createTwoFilesPatch(
          change.path,
          change.path,
          change.originalContent ?? '',
          '',
          'original',
          'deleted',
        ))
      } else if (change.type === 'create') {
        diffs.push(createTwoFilesPatch(
          change.path,
          change.path,
          '',
          change.newContent ?? '',
          '/dev/null',
          change.path,
        ))
      } else {
        diffs.push(createTwoFilesPatch(
          change.path,
          change.path,
          change.originalContent ?? '',
          change.newContent ?? '',
          'original',
          'modified',
        ))
      }
    }
    return diffs.join('\n')
  }

  approve(path?: string): void {
    if (path) {
      const change = this.changes.get(path)
      if (change) change.approved = true
    } else {
      for (const change of this.changes.values()) {
        change.approved = true
      }
    }
  }

  reject(path?: string): void {
    if (path) {
      const change = this.changes.get(path)
      if (change) change.approved = false
    } else {
      for (const change of this.changes.values()) {
        change.approved = false
      }
    }
  }

  async apply(): Promise<void> {
    const approved = this.getAll().filter(c => c.approved === true)
    for (const change of approved) {
      const fullPath = resolve(this.workspaceRoot, change.path)
      try {
        if (change.type === 'delete') {
          if (existsSync(fullPath)) unlinkSync(fullPath)
        } else {
          mkdirSync(dirname(fullPath), { recursive: true })
          writeFileSync(fullPath, change.newContent ?? '', 'utf-8')
        }
        logger.success(`${change.type}: ${change.path}`)
      } catch (err) {
        logger.error(`Failed to apply ${change.path}: ${err}`)
      }
    }
    this.clear()
  }

  clear(): void {
    this.changes.clear()
  }

  get size(): number {
    return this.changes.size
  }
}
