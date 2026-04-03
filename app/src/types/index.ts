export type SupportedLanguage = 'zh' | 'ja' | 'ko'
// 'yue' — Cantonese, Phase 3+

export type RomanizationSystem = 'pinyin' | 'romaji' | 'revised-romanization'

export interface UserProfile {
  id: string
  name: string
  selectedLanguage: SupportedLanguage
  chineseScript: 'simplified' | 'traditional' // only relevant when selectedLanguage === 'zh', default 'simplified'
  heritageBackground: 'yes' | 'somewhat' | 'no' // from onboarding question 2
  selfReportedLevel: 'very' | 'a-little' | 'not-at-all' // from onboarding question 3
  skillScores: SkillScore
  isPremium: boolean
  createdAt: Date
}

export interface SkillScore {
  listening: number  // 0–100
  speaking: number   // 0–100
  reading: number    // 0–100
  writing: number    // 0–100
  lastUpdated: Date
}

export interface SkillDelta {
  listening: number  // positive or negative change this session
  speaking: number
  reading: number
  writing: number
}

export interface FlashCard {
  id: string
  language: SupportedLanguage
  scriptSimplified: string       // Simplified Chinese — always present for zh cards
  scriptTraditional: string      // Traditional Chinese — always present for zh; same as scriptSimplified for ja/ko
  romanization: string           // pinyin / romaji / revised romanization
  meaning: string                // English
  audioUrl: string
  exampleSentenceSimplified: string  // example in Simplified (zh) or standard script (ja/ko)
  exampleSentenceTraditional: string // example in Traditional (zh only); same as Simplified for ja/ko
  exampleTranslation: string     // English
  category: FlashCardCategory
  fsrsData: FSRSData
}

export type FlashCardCategory =
  | 'family-terms'
  | 'daily-home'
  | 'emotional-expression'
  | 'food-meals'
  | 'health-body'

export interface FSRSData {
  stability: number
  difficulty: number
  nextReviewDate: Date
  lastRating: 'again' | 'hard' | 'good' | 'easy' | null
}

export interface VocabEntry {
  id: string
  userId: string
  language: SupportedLanguage
  script: string
  romanization: string
  meaning: string
  audioUrl: string
  exampleSentence: string
  exampleTranslation: string
  contextNote: string
  personalNote: string | null
  seenAt: Date
  source: 'flashcard' | 'roleplay' | 'listening'
}

export interface Scenario {
  id: string
  language: SupportedLanguage
  title: string
  tier: 1 | 2 | 3
  turns: number
  description: string
  culturalContext: string
  vocabTargets: string[] // script forms of target vocabulary for this scenario
}

export interface SessionMetrics {
  sessionId: string
  userId: string
  language: SupportedLanguage
  sessionType: 'flashcard' | 'listening' | 'roleplay'
  wordsEncountered: number
  wordsMarkedGot: number
  listeningAccuracy: number  // 0–100, null for non-listening sessions
  speakingConfidence: number // 0–100, null for non-speaking sessions
  newVocabCount: number
  durationSeconds: number
  skillDelta: SkillDelta
  completedAt: Date
}

export interface RoleplayTurn {
  turnNumber: number
  userTranscript: string
  parentSpeech: string
  toneNote: string | null
  newVocab: VocabEntry[]
}

export interface RoleplayResponse {
  parentSpeech: string
  userPrompt: string
  toneNote: string | null
  newVocab: VocabEntry[]
}

export interface SkillSignals {
  flashcardGotRate?: number       // 0–1: fraction of cards marked "Got it"
  whisperConfidenceScore?: number // 0–100 from Whisper word confidence
  comprehensionAccuracy?: number  // 0–1: fraction of listening questions correct
  avgPauseBeforeResponse?: number // milliseconds
  codeSwitchRate?: number         // 0–1: fraction of turns with English mixing
}

export interface ContentRecommendation {
  type: 'flashcard' | 'listening' | 'roleplay'
  id: string
  title: string
  language: SupportedLanguage
  reason: string
  estimatedDurationSeconds: number
}
