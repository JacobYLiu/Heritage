# Development Plan
## Heritage — Phased Build Instructions for Claude Code

> **How to read this plan:** Each phase is a self-contained milestone. Complete every step in a phase before moving to the next. Steps within a phase are ordered — do not reorder them. File paths are relative to the project root unless stated otherwise.

---

## Pre-Phase: Project Bootstrap

Before writing any feature code, scaffold the project structure. Every directory below must exist before any files are created inside them.

### Step 0.1 — Initialize Expo project
```bash
npx create-expo-app heritage --template blank-typescript
cd heritage
```

### Step 0.2 — Install core dependencies
```bash
npx expo install expo-router expo-secure-store expo-av expo-file-system
npx expo install @supabase/supabase-js
npm install @react-navigation/native react-native-screens react-native-safe-area-context
npm install zustand @tanstack/react-query
npm install react-native-reanimated react-native-gesture-handler
```

### Step 0.3 — Create the root folder structure
```
heritage/
├── app/                        # Expo Router pages (file-based routing — thin wrappers only)
├── src/
│   ├── components/             # Reusable UI components
│   ├── screens/                # Full-page screen components
│   ├── templates/              # Layout shells (SafeAreaView, scroll containers, modal frames)
│   ├── prompts/                # All Claude API system prompts (.ts builder functions)
│   ├── services/               # One file per external API dependency
│   ├── stores/                 # Zustand global state
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Pure utility functions (no side effects)
│   ├── types/                  # TypeScript interfaces and types
│   ├── constants/              # Static data: scenarios, voices, colors, spacing
│   ├── config/                 # Secrets loader (SecureStore only)
│   └── assets/
│       ├── audio/              # Native speaker recordings by language and category
│       │   ├── zh/             # Mandarin audio
│       │   ├── ja/             # Japanese audio
│       │   └── ko/             # Korean audio
│       └── images/
├── supabase/
│   ├── migrations/             # SQL files numbered sequentially
│   └── seed.sql
└── docs/                       # PRD.md, Plan.md, AI_Rules.md, Architecture.md
```

### Step 0.4 — Configure secrets loader
```
Location: src/config/secrets.ts
```
Export async getters only: `getSupabaseUrl()`, `getSupabaseAnonKey()`, `getClaudeApiKey()`, `getWhisperApiKey()`, `getElevenLabsApiKey()`. Each reads from `expo-secure-store`. No other file in the project may read from SecureStore. See AI_Rules.md §4 for full policy.

### Step 0.5 — Initialize Supabase client
```
Location: src/services/supabase.ts
```
Import keys from `src/config/secrets.ts` only. Initialize and export the Supabase client. No other file initializes a Supabase client.

---

## Phase 1 — Foundation: Language Selection, Skill Model, Flashcards (Weeks 1–6)

**Goal:** A working app where users select their language, answer 3 onboarding questions, see their initial skill profile, and complete flashcard drills. The passive skill model begins updating from the first session. No AI features yet.

---

### Step 1.1 — TypeScript types (all other files depend on this — do it first)
```
Location: src/types/index.ts
```
Define all of these interfaces. Do not use `any`. Add to this file as new types are needed — do not scatter types across feature files.

```typescript
type SupportedLanguage = 'zh' | 'ja' | 'ko'

type RomanizationSystem = 'pinyin' | 'romaji' | 'revised-romanization'

interface UserProfile {
  id: string
  name: string
  selectedLanguage: SupportedLanguage
  chineseScript: 'simplified' | 'traditional'   // only relevant when selectedLanguage === 'zh', default 'simplified'
  heritageBackground: 'yes' | 'somewhat' | 'no'   // from onboarding question 2
  selfReportedLevel: 'very' | 'a-little' | 'not-at-all' // from onboarding question 3
  skillScores: SkillScore
  isPremium: boolean
  createdAt: Date
}

interface SkillScore {
  listening: number   // 0–100
  speaking: number    // 0–100
  reading: number     // 0–100
  writing: number     // 0–100
  lastUpdated: Date
}

interface SkillDelta {
  listening: number   // positive or negative change this session
  speaking: number
  reading: number
  writing: number
}

interface FlashCard {
  id: string
  language: SupportedLanguage
  scriptSimplified: string        // Simplified Chinese characters — always present for zh cards
  scriptTraditional: string       // Traditional Chinese characters — always present for zh cards; same as scriptSimplified for ja/ko
  romanization: string            // pinyin / romaji / revised romanization
  meaning: string                 // English
  audioUrl: string
  exampleSentenceSimplified: string   // example in Simplified (zh) or standard script (ja/ko)
  exampleSentenceTraditional: string  // example in Traditional (zh only); same as Simplified for ja/ko
  exampleTranslation: string      // English
  category: FlashCardCategory
  fsrsData: FSRSData
}

type FlashCardCategory = 
  | 'family-terms' 
  | 'daily-home' 
  | 'emotional-expression' 
  | 'food-meals' 
  | 'health-body'

interface FSRSData {
  stability: number
  difficulty: number
  nextReviewDate: Date
  lastRating: 'again' | 'hard' | 'good' | 'easy' | null
}

interface VocabEntry {
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

interface Scenario {
  id: string
  language: SupportedLanguage
  title: string
  tier: 1 | 2 | 3
  turns: number
  description: string
  culturalContext: string
  vocabTargets: string[]   // script forms of target vocabulary for this scenario
}

interface SessionMetrics {
  sessionId: string
  userId: string
  language: SupportedLanguage
  sessionType: 'flashcard' | 'listening' | 'roleplay'
  wordsEncountered: number
  wordsMarkedGot: number
  listeningAccuracy: number   // 0–100, null for non-listening sessions
  speakingConfidence: number  // 0–100, null for non-speaking sessions
  newVocabCount: number
  durationSeconds: number
  skillDelta: SkillDelta
  completedAt: Date
}

interface RoleplayTurn {
  turnNumber: number
  userTranscript: string
  parentSpeech: string
  toneNote: string | null
  newVocab: VocabEntry[]
}

interface RoleplayResponse {
  parentSpeech: string
  userPrompt: string
  toneNote: string | null
  newVocab: VocabEntry[]
}
```

### Step 1.2 — Supabase database migrations
```
Location: supabase/migrations/001_initial_schema.sql
Location: supabase/migrations/002_rls_policies.sql
Location: supabase/migrations/003_indexes.sql
```

`001`: Create tables `profiles`, `skill_scores`, `vocab_entries`, `session_metrics`, `flashcard_progress`. Add `updated_at` auto-trigger on all tables. Include `language` column on all content tables.

`002`: Enable RLS on every table. Default policy: deny all. Grant SELECT/INSERT/UPDATE/DELETE only where `auth.uid() = user_id`. No exceptions.

`003`: Add indexes on `user_id`, `language`, `updated_at`, `next_review_date` (for FSRS queries).

### Step 1.3 — Auth screens
```
Location: app/(auth)/welcome.tsx        → renders src/screens/auth/WelcomeScreen.tsx
Location: app/(auth)/sign-up.tsx        → renders src/screens/auth/SignUpScreen.tsx
Location: app/(auth)/sign-in.tsx        → renders src/screens/auth/SignInScreen.tsx
Location: src/services/auth.ts          # signUp(), signIn(), signOut(), getSession()
```
Sign-up collects: name, email, password, date of birth (for age check — minimum 13). Language selection and heritage questions happen in the next step (onboarding), not here. Do not add dialect sub-selection (Mandarin/Cantonese) — Cantonese is Phase 3+.

### Step 1.4 — Onboarding: language selection & skill model seed
This is NOT an assessment. It is a 3-question conversation that seeds the passive skill model.

```
Location: app/(onboarding)/setup.tsx          # Orchestrator — manages step state
Location: src/screens/onboarding/StepLanguage.tsx   # Q1: Which language? (Chinese / Japanese / Korean)
Location: src/screens/onboarding/StepBackground.tsx # Q2: Grew up hearing it? (Yes / Somewhat / No)
Location: src/screens/onboarding/StepConfidence.tsx # Q3: How comfortable speaking? (Very / A little / Not at all)
Location: src/screens/onboarding/StepWelcome.tsx    # Personalized welcome + show initial skill profile
Location: src/hooks/useOnboarding.ts                # Step state and seed score computation
Location: src/utils/skillModelSeed.ts               # seedSkillScore(background, confidence) → SkillScore
```

**StepLanguage:** Three large tappable cards — Chinese (中文), Japanese (日本語), Korean (한국어). Show the Heritage translated subtitle for each language beneath its name. Selection stored in `userStore.selectedLanguage`.

**StepBackground:** "Have you grown up hearing [language] at home?" — Yes / Somewhat / No. Plain tappable options, no slider.

**StepConfidence:** "How comfortable are you speaking it today?" — Very comfortable / A little / Not at all. Same pattern.

**StepWelcome:** Use `skillModelSeed.ts` to compute starting scores from the two answers. Show the 4-bar skill profile. Lead with the highest bar. Display a personalized message:
- Heritage background + Very comfortable → "You already carry so much of this language. Let's help you bring it out."
- Heritage background + Not at all → "You understand more than you think. We'll find it together."  
- No heritage + Not at all → "You're starting something new. We'll go at your pace."

Save profile to Supabase. Navigate to home screen.

### Step 1.5 — Global state stores
```
Location: src/stores/userStore.ts       # UserProfile + SkillScore. Persisted to SecureStore.
Location: src/stores/sessionStore.ts   # Active session metrics + vocab encountered. In-memory only.
```
`userStore` is the only store persisted across launches. Use `expo-secure-store` for persistence, not AsyncStorage.

### Step 1.6 — App name localization utility
```
Location: src/utils/appName.ts
```
Export `getAppSubtitle(language: SupportedLanguage): { script: string, romanization: string, meaning: string }`
- `zh` → `{ script: '根语', romanization: 'Gēn Yǔ', meaning: 'root language' }`
- `ja` → `{ script: '継承語', romanization: 'Keishōgo', meaning: 'inherited language' }`
- `ko` → `{ script: '유산어', romanization: 'Yusan-eo', meaning: 'heritage language' }`

This is used on the home screen header and the onboarding language cards. No other file should hardcode these strings.

### Step 1.7 — Home dashboard screen
```
Location: app/(tabs)/index.tsx              → renders src/screens/home/HomeScreen.tsx
Location: src/screens/home/HomeScreen.tsx
Location: src/components/StreakDots.tsx     # 7-day Mon–Sun dot row. No streak number.
Location: src/components/LessonCard.tsx     # Tappable: title, type badge, estimated duration
Location: src/components/SkillBars.tsx      # 4-bar mini skill profile
Location: src/components/AppHeader.tsx      # "Heritage" + language subtitle from appName.ts
```

Home screen layout (top to bottom):
1. AppHeader — "Heritage" + localized subtitle in chosen language script
2. Greeting — "你好 [name]" / "こんにちは [name]" / "안녕하세요 [name]" based on selected language
3. Affirming subtitle — based on highest skill score
4. StreakDots — 7-day activity view
5. "Pick up where you left off" — most recent incomplete lesson card
6. "Recommended for you" — 3 lesson cards chosen by skill model (lowest scoring skill)
7. SkillBars mini-view — tap to open full Skill screen

### Step 1.8 — Passive skill model engine
```
Location: src/utils/skillModel.ts
```
Export:
- `updateSkillScore(current: SkillScore, signals: SkillSignals) → { updated: SkillScore, delta: SkillDelta }`
- `getRecommendedContent(skillScore: SkillScore, language: SupportedLanguage) → ContentRecommendation[]`

`SkillSignals` interface:
```typescript
interface SkillSignals {
  flashcardGotRate?: number        // 0–1: fraction of cards marked "Got it"
  whisperConfidenceScore?: number  // 0–100 from Whisper word confidence
  comprehensionAccuracy?: number   // 0–1: fraction of listening questions correct
  avgPauseBeforeResponse?: number  // milliseconds
  codeSwitchRate?: number          // 0–1: fraction of turns with English mixing
}
```

This function is called at the end of every session by `useSessionMetrics.ts`. It writes the updated score to `userStore` and saves a `session_metrics` row to Supabase with the delta.

### Step 1.9 — Flashcard drill (Phase 1 — no Whisper yet)
```
Location: app/(tabs)/drill.tsx              → renders src/screens/drill/DrillScreen.tsx
Location: src/screens/drill/DrillScreen.tsx # Session orchestrator: load queue, advance cards
Location: src/screens/drill/CardFront.tsx   # Audio auto-plays, romanization shown, script hidden
Location: src/screens/drill/CardBack.tsx    # Script revealed, meaning, example sentence + translation
Location: src/services/fsrs.ts             # FSRS: scheduleCard(), updateCard(), getDueCards()
Location: src/hooks/useDrill.ts            # Session state: queue, current card, answer, advance
```

Card interaction sequence:
1. Card loads → audio plays automatically from `src/assets/audio/[lang]/vocab/[id].mp3`
2. Romanization shown, script hidden
3. User taps "Show [character/kana/hangul]"
4. Script + English meaning + example sentence (with translation) revealed
5. User taps: "Again" / "Hard" / "Got it"
6. FSRS updates card's next review date
7. Advance to next card

Session ends after 10 cards. Navigate to SessionSummary. Pass `gotRate` signal to `skillModel.ts`.

"Heard this at home" button visible on card back — tapping it flags the card in Supabase and prioritizes it in future sessions.

### Step 1.10 — Vocabulary list screen
```
Location: app/(tabs)/vocab.tsx              → renders src/screens/vocab/VocabScreen.tsx
Location: src/screens/vocab/VocabScreen.tsx # Searchable list filtered by selected language
Location: src/screens/vocab/VocabDetail.tsx # Full entry: script, romanization, meaning, audio, example, note
Location: src/components/VocabRow.tsx       # List row: script + romanization + meaning + audio icon
Location: src/hooks/useVocab.ts
```

### Step 1.11 — Session summary screen (shared across all session types)
```
Location: src/screens/shared/SessionSummary.tsx
Location: src/components/MetricCard.tsx     # Label + value + optional context line
Location: src/utils/sessionTips.ts          # Rule-based tip generator — no AI, pure logic
```

Required content for every session summary:
- Metrics appropriate to session type (see AI_Rules.md §2.1 for full list)
- Skill delta: "Your listening moved up today" if delta > 0
- New vocabulary list — tappable, each opens VocabDetail
- One rule-based tip from `sessionTips.ts`
- "Keep going" or "Come back tomorrow" CTA depending on session length

---

## Phase 2 — AI Features: Roleplay, Speaking, Full Skill Model (Weeks 7–16)

**Goal:** Full roleplay engine with Claude API + Whisper + ElevenLabs. Passive skill model now uses real speech signals. All three languages have active roleplay scenarios.

---

### Step 2.1 — Add AI service secrets
Update `src/config/secrets.ts` to include getters for: `getClaudeApiKey()`, `getWhisperApiKey()`, `getElevenLabsApiKey()`. Each reads from SecureStore. Never hardcode.

### Step 2.2 — Claude API service
```
Location: src/services/claude.ts
```
Export: `sendRoleplayTurn(history: RoleplayTurn[], userTranscript: string, skillScore: SkillScore, scenario: Scenario) → Promise<RoleplayResponse>`

Import system prompt from `src/prompts/roleplayFamilyCharacter.ts`. Never inline prompt strings in the service file.

### Step 2.3 — All Claude system prompts
```
Location: src/prompts/roleplayFamilyCharacter.ts  # Family character builder (language-aware)
Location: src/prompts/pronunciationTip.ts          # Gentle tone/pronunciation correction
Location: src/prompts/sessionInsight.ts            # End-of-session encouraging observation
```

Each file exports a single builder function. Builder takes parameters, returns a string. No raw prompt literals outside of these files.

`buildRoleplayFamilyCharacterPrompt(scenario, skillScore, language)` must:
- Adapt character personality and speech to the chosen language's cultural context
- Set difficulty based on `skillScore.speaking` (lower score → simpler sentences, more patience)
- Never correct the user's grammar explicitly — model correct speech naturally in replies
- Return valid JSON matching `RoleplayResponse` type on every turn

### Step 2.4 — Whisper speech-to-text service
```
Location: src/services/whisper.ts
```
Export: `transcribeAudio(audioUri: string, languageHint: SupportedLanguage) → Promise<{ transcript: string, wordConfidences: number[], detectedLanguage: string }>`

Language hint mapping: `zh` → `'zh'`, `ja` → `'ja'`, `ko` → `'ko'`. Always pass the hint — it improves accuracy for code-switching speakers. Word confidence scores feed back into the passive skill model as `whisperConfidenceScore`.

### Step 2.5 — ElevenLabs TTS service
```
Location: src/services/elevenlabs.ts
```
Export: `synthesizeSpeech(text: string, language: SupportedLanguage) → Promise<string>` (returns local audio URI)

Voice IDs per language in `src/constants/voices.ts`. Cache synthesized audio by `sha256(text + language)` hash to avoid re-generating identical phrases. Cache stored in `expo-file-system` temp directory.

### Step 2.6 — Scenario definitions (all 27 scenarios)
```
Location: src/constants/scenarios.ts
```
Define all 9 scenarios × 3 languages = 27 `Scenario` objects. Each has culturally specific titles, descriptions, family character names, and `vocabTargets`.

Scenario tiers (consistent across all three languages):

| Tier | Emotional weight | Examples |
|---|---|---|
| 1 — Daily life | Low stakes, familiar | Dinner table, grocery run, phone call with grandparent |
| 2 — Family events | Medium stakes | New Year gathering, introducing a partner, parent doctor visit |
| 3 — Deep conversations | High stakes | Career talk, talking about feelings, expressing love |

All Tier 1 scenarios are always accessible regardless of skill score. Tier 2 and 3 are also always accessible — content adapts via Claude's difficulty adjustment, not by locking.

### Step 2.7 — Roleplay scenario screens
```
Location: app/(tabs)/roleplay.tsx                 → renders src/screens/roleplay/ScenarioList.tsx
Location: src/screens/roleplay/ScenarioList.tsx   # Grid of scenario cards by tier and language
Location: src/screens/roleplay/ScenarioIntro.tsx  # Context, family character, learning goal
Location: src/screens/roleplay/RoleplaySession.tsx # Active conversation
Location: src/screens/roleplay/FeedbackOverlay.tsx # 3-second non-blocking post-turn tip
Location: src/screens/roleplay/ScenarioSummary.tsx # End: vocab, skill delta, next steps
Location: src/hooks/useRoleplay.ts                 # Turn loop state machine
```

**RoleplaySession turn loop:**
1. Family character audio plays (ElevenLabs)
2. "Your turn" indicator visible
3. User taps mic → `expo-av` records
4. User taps stop → audio sent to `whisper.ts` with language hint
5. Word confidence scores captured for skill model signal
6. Transcript + history sent to `claude.ts`
7. Claude returns `RoleplayResponse`
8. `FeedbackOverlay` shows `toneNote` if present (3 seconds, non-blocking, dismissable)
9. New vocab chips appear briefly (one at a time, 3 seconds each)
10. New vocab saved to `sessionStore.vocabEncountered` and Supabase
11. ElevenLabs synthesizes `parentSpeech`, audio plays
12. Return to step 1 (or go to ScenarioSummary after final turn)

Pause length between step 1 ending and user tapping mic is captured as `avgPauseBeforeResponse` signal for skill model.

Exit button visible at all times. One tap exits — no confirmation dialog. Goes to ScenarioSummary showing what was completed.

### Step 2.8 — Upgrade passive skill model with real speech signals
```
Location: src/utils/skillModel.ts  # Update from Phase 1
```
Now that Whisper is live, replace the Phase 1 flashcard-only signals with the full signal set including `whisperConfidenceScore`, `avgPauseBeforeResponse`, and `codeSwitchRate` (computed by comparing Whisper's `detectedLanguage` per word against the target language).

### Step 2.9 — Dedicated listening practice screen
```
Location: src/screens/listening/ListeningScreen.tsx
Location: src/screens/listening/AudioPlayer.tsx    # Play/pause + 0.75x / 1x / 1.25x speed selector
Location: src/hooks/useListening.ts
```
Content: curated native speaker family dialogue clips (30–90 seconds) per language. After each clip: 3 comprehension questions. Accuracy feeds `comprehensionAccuracy` signal into skill model. Speed setting recorded as session context.

---

## Phase 3 — Depth, Polish & Production (Weeks 17+)

**Goal:** Honorifics module, family address term trees per language, Cantonese scaffolding, skill trend charts, offline mode, production hardening.

---

### Step 3.1 — Honorifics & family address term module
```
Location: src/screens/honorifics/HonorificsScreen.tsx
Location: src/constants/familyTerms.ts   # Address term trees for all 3 languages
```
Separate drill deck for each language's family address system. Chinese: maternal/paternal grandparent/aunt/uncle/cousin distinctions. Japanese: honorific suffixes (-さん, -ちゃん, -くん) + keigo intro. Korean: 존댓말/반말 system with situational guidance. This is a standalone drill, not mixed into general vocab.

### Step 3.2 — Skill trend chart & full profile screen
```
Location: src/screens/profile/SkillProfileScreen.tsx
Location: src/components/SkillTrendChart.tsx   # 30-day SVG trend line — no charting library
```

### Step 3.3 — Cantonese scaffolding (do not implement — structure only)
```
Location: src/assets/audio/yue/         # Create empty directory with README
Location: src/constants/voices.ts       # Add placeholder cantonese voice ID slot
```
Add `'yue'` to `SupportedLanguage` type as a comment: `// 'yue' — Cantonese, Phase 3+`. Do not wire up any UI or logic.

### Step 3.4 — Settings screen
```
Location: app/(tabs)/settings.tsx       → renders src/screens/settings/SettingsScreen.tsx
```
Settings: change language, **Chinese script (Simplified/Traditional — visible only when selectedLanguage is 'zh')**, daily reminder time, audio playback speed default, delete account + data.

### Step 3.5 — Offline mode
```
Location: src/services/offlineCache.ts
```
Pre-download today's flashcard deck and audio to device using `expo-file-system`. Flashcard drill must work fully offline.

### Step 3.6 — Production hardening
- Sentry crash reporting (no behavioral analytics)
- App store metadata (screenshots, description, keywords)
- Accessibility audit: VoiceOver iOS, TalkBack Android
- Performance audit: roleplay latency < 2s on 4G
- Security audit: no API keys in bundle, no user audio persisted server-side

---

## Implementation Rules for Claude Code

1. **Complete each numbered step fully before starting the next.** Do not create empty placeholder files for future steps.
2. **`selectedLanguage` is on every piece of content.** Every flashcard, scenario, audio file reference, and vocab entry carries its language. Never hardcode language-specific strings in UI files.
3. **The skill model is never visible to the user as a number that judges them.** Show the 4 bars, show the delta, never show raw score comparisons.
4. **No content is locked behind a score.** `getRecommendedContent()` suggests; it never gatekeeps.
5. **Every screen handles loading, error, and success states.** No screens that assume the happy path.
6. **TypeScript strict mode is on.** No `any`. Define types in `src/types/index.ts`.
7. **One service per external dependency.** Supabase, Claude, Whisper, ElevenLabs — each has exactly one file. They do not import from each other.
8. **All Claude prompts live in `src/prompts/`.** No prompt strings in service files or screens.
9. **After each step:** TypeScript compiler passes, file is in the correct directory per Architecture.md, all imports resolve.
