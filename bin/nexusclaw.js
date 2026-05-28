#!/usr/bin/env node

/**
 * NexusClaw CLI Entry Point
 *
 * This script serves as the main entry point for npx and global installations.
 * It will:
 * 1. Try to run the compiled binary if available
 * 2. Fall back to running via Bun if installed
 * 3. Fall back to running via Node.js with the compiled JS
 */

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import { execSync, spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Try to find the binary
const binaryPath = join(__dirname, '..', 'bin', 'nexusclaw')
const compiledPath = join(__dirname, '..', 'dist', 'cli', 'index.js')
const sourcePath = join(__dirname, '..', 'src', 'cli', 'index.ts')

// Check if Bun is available
function hasBun() {
  try {
    execSync('bun --version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

// Run with Bun
function runWithBun(scriptPath, args) {
  const child = spawn('bun', ['run', scriptPath, ...args], {
    stdio: 'inherit',
    cwd: process.cwd()
  })

  child.on('exit', (code) => {
    process.exit(code || 0)
  })

  child.on('error', (err) => {
    console.error('Failed to start Bun:', err.message)
    process.exit(1)
  })
}

// Run compiled Node.js script
function runWithNode(scriptPath, args) {
  const child = spawn('node', [scriptPath, ...args], {
    stdio: 'inherit',
    cwd: process.cwd()
  })

  child.on('exit', (code) => {
    process.exit(code || 0)
  })

  child.on('error', (err) => {
    console.error('Failed to start Node.js:', err.message)
    process.exit(1)
  })
}

// Main execution
const args = process.argv.slice(2)

// Priority 1: Try compiled binary
if (existsSync(binaryPath)) {
  const child = spawn(binaryPath, args, {
    stdio: 'inherit',
    cwd: process.cwd()
  })

  child.on('exit', (code) => {
    process.exit(code || 0)
  })

  child.on('error', (err) => {
    console.error('Failed to run binary:', err.message)
    process.exit(1)
  })
}
// Priority 2: Try Bun with source
else if (hasBun() && existsSync(sourcePath)) {
  runWithBun(sourcePath, args)
}
// Priority 3: Try compiled JS with Node
else if (existsSync(compiledPath)) {
  runWithNode(compiledPath, args)
}
// Priority 4: Try Bun with compiled JS
else if (hasBun() && existsSync(compiledPath)) {
  runWithBun(compiledPath, args)
}
// Fallback: Show error
else {
  console.error('Error: Could not find NexusClaw executable.')
  console.error('')
  console.error('Please ensure you have installed dependencies:')
  console.error('  npm install')
  console.error('')
  console.error('Or if using Bun:')
  console.error('  bun install')
  console.error('')
  console.error('Then build the project:')
  console.error('  npm run build')
  console.error('')
  process.exit(1)
}
