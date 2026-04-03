export type AppErrorCode =
  | 'AUTH_FAILED'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_AGE_REQUIREMENT'
  | 'SUPABASE_QUERY_FAILED'
  | 'SUPABASE_WRITE_FAILED'
  | 'CLAUDE_API_FAILED'
  | 'CLAUDE_INVALID_RESPONSE'
  | 'WHISPER_TRANSCRIPTION_FAILED'
  | 'ELEVENLABS_SYNTHESIS_FAILED'
  | 'SECRET_NOT_CONFIGURED'
  | 'AUDIO_PLAYBACK_FAILED'
  | 'NETWORK_UNAVAILABLE'

export class AppError extends Error {
  readonly code: AppErrorCode

  constructor(code: AppErrorCode, message: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
  }
}
