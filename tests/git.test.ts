import { expect, test, describe, beforeEach, afterEach } from 'bun:test'
import simpleGit from 'simple-git'
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { gitStatus, gitCommit, gitBranch, gitDiff } from '@/git/operations'

describe('Git Operations', () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = mkdtempSync(join(tmpdir(), 'nexusclaw-git-'))
    const git = simpleGit(tmpDir)
    await git.init()
    await git.addConfig('user.email', 'test@test.com')
    await git.addConfig('user.name', 'Test')
  })

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true })
  })

  test('gitStatus returns status object', async () => {
    writeFileSync(join(tmpDir, 'test.ts'), 'hello')
    const status = await gitStatus(tmpDir)
    expect(status.not_added).toContain('test.ts')
  })

  test('gitBranch creates feature branch', async () => {
    writeFileSync(join(tmpDir, 'test.ts'), 'hello')
    const git = simpleGit(tmpDir)
    await git.add('.')
    await git.commit('initial')

    const branch = await gitBranch('add auth', tmpDir)
    expect(branch).toBe('feat/add-auth')

    const currentBranch = await (await gitStatus(tmpDir)).current
    expect(currentBranch).toBe(branch)
  })

  test('gitCommit creates commit', async () => {
    writeFileSync(join(tmpDir, 'test.ts'), 'hello')
    const result = await gitCommit('test commit', tmpDir)
    expect(result.commit).toBeTruthy()

    const git = simpleGit(tmpDir)
    const log = await git.log()
    expect(log.latest?.message).toBe('test commit')
  })

  test('gitDiff returns diff string', async () => {
    writeFileSync(join(tmpDir, 'test.ts'), 'hello')
    const git = simpleGit(tmpDir)
    await git.add('.')
    await git.commit('initial')

    writeFileSync(join(tmpDir, 'test.ts'), 'world')
    const diff = await gitDiff(false, tmpDir)
    expect(diff).toContain('-hello')
    expect(diff).toContain('+world')
  })
})
