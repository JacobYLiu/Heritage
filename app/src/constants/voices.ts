import { SupportedLanguage } from '../types'

// ElevenLabs voice IDs keyed by language.
// Replace placeholder values with real voice IDs before shipping.
export const VOICE_IDS: Record<SupportedLanguage, string> = {
  zh: 'ELEVENLABS_ZH_VOICE_ID', // CULTURAL_REVIEW_NEEDED
  ja: 'ELEVENLABS_JA_VOICE_ID', // CULTURAL_REVIEW_NEEDED
  ko: 'ELEVENLABS_KO_VOICE_ID', // CULTURAL_REVIEW_NEEDED
}

// Cantonese (yue) scaffolding — voice ID reserved for Phase 4+.
// Audio assets live in src/assets/audio/yue/. Do not enable until cultural review is complete.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const YUE_VOICE_ID_PLACEHOLDER = 'ELEVENLABS_YUE_VOICE_ID' // CULTURAL_REVIEW_NEEDED
