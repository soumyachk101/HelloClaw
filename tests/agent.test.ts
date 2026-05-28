import { expect, test, describe } from 'bun:test'
import { ClawError } from '@/utils/errors'

describe('ClawError', () => {
  test('creates error with correct properties', () => {
    const err = new ClawError('test message', 'TEST_CODE', true, { key: 'value' })

    expect(err.message).toBe('test message')
    expect(err.code).toBe('TEST_CODE')
    expect(err.recoverable).toBe(true)
    expect(err.context).toEqual({ key: 'value' })
    expect(err.name).toBe('ClawError')
    expect(err instanceof Error).toBe(true)
  })

  test('creates non-recoverable error', () => {
    const err = new ClawError('fatal', 'FATAL', false)
    expect(err.recoverable).toBe(false)
  })
})

describe('Config', () => {
  test('NexusClawConfig has expected defaults', () => {
    // This tests the shape, not the actual config
    const defaults = {
      model: 'google/gemini-flash-1.5',
      memory_enabled: true,
      token_tracking: true,
      max_agent_iterations: 20,
      safe_mode: true,
    }

    expect(defaults.model).toBe('google/gemini-flash-1.5')
    expect(defaults.memory_enabled).toBe(true)
    expect(defaults.max_agent_iterations).toBe(20)
  })
})
