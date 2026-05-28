import simpleGit, { type SimpleGit } from 'simple-git'
import { getConfig } from '@/config'
import { logger } from '@/utils/logger'

function getGit(workspaceRoot?: string): SimpleGit {
  const config = getConfig()
  return simpleGit(workspaceRoot ?? config.workspace_root)
}

export async function gitStatus(workspaceRoot?: string) {
  const git = getGit(workspaceRoot)
  return git.status()
}

export async function gitBranch(name: string, workspaceRoot?: string) {
  const git = getGit(workspaceRoot)
  const branchName = name.startsWith('feat/') || name.startsWith('fix/')
    ? name
    : `feat/${name.toLowerCase().replace(/\s+/g, '-')}`
  await git.checkoutLocalBranch(branchName)
  logger.success(`Created branch: ${branchName}`)
  return branchName
}

export async function gitCommit(message: string, workspaceRoot?: string) {
  const git = getGit(workspaceRoot)
  const result = await git.commit(message)
  logger.success(`Committed: ${result.commit}`)
  return result
}

export async function gitAdd(files: string[], workspaceRoot?: string) {
  const git = getGit(workspaceRoot)
  await git.add(files)
}

export async function gitPush(remote = 'origin', branch?: string, workspaceRoot?: string) {
  const git = getGit(workspaceRoot)
  const currentBranch = branch ?? (await git.status()).current ?? 'main'
  await git.push(remote, currentBranch)
  logger.success(`Pushed to ${remote}/${currentBranch}`)
}

export async function gitDiff(staged = false, workspaceRoot?: string): Promise<string> {
  const git = getGit(workspaceRoot)
  if (staged) return git.diff(['--cached'])
  return git.diff()
}

export async function gitLog(count = 10, workspaceRoot?: string) {
  const git = getGit(workspaceRoot)
  return git.log({ maxCount: count })
}
