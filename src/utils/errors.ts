export class ClawError extends Error {
  public code: string
  public recoverable: boolean
  public context?: Record<string, unknown>

  constructor(
    message: string,
    code: string,
    recoverable: boolean,
    context?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'ClawError'
    this.code = code
    this.recoverable = recoverable
    this.context = context
  }
}
