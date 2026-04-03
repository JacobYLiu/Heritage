# Architecture
## Heritage — Project Structure & File Location Guide

> This file is the single source of truth for where every file in the project lives. Claude Code must consult this document before creating any new file. If a file's location is not defined here, add it to this document before creating it.

---

## Project Root

```
heritage/
├── app/                        # Expo Router — file-based routing (thin wrappers only)
├── src/                        # All application logic, components, services
├── supabase/                   # Database migrations and seed data
├── docs/                       # PRD.md, Plan.md, AI_Rules.md, Architecture.md
├── assets/                     # Static assets referenced by app.json (icon, splash)
├── app.json
├── tsconfig.json               # strict: true
├── babel.config.js
└── package.json
```

---

## `app/` — Expo Router Pages

File-based routing. Every file here maps to a screen URL. **No business logic** — pages import from `src/screens/` and render them. Thin wrappers only.

```
app/
├── _layout.tsx                 # Root layout: auth guard, global providers, navigation shell
├── index.tsx                   # Redirect: authenticated → (tabs)/index, else → (auth)/welcome
│
├── (auth)/                     # Unauthenticated screens — no tab bar
│   ├── _layout.tsx
│   ├── welcome.tsx             # → src/screens/auth/WelcomeScreen.tsx
│   ├── sign-up.tsx             # → src/screens/auth/SignUpScreen.tsx
│   └── sign-in.tsx             # → src/screens/auth/SignInScreen.tsx
│
├── (onboarding)/               # Post-signup, pre-home — language selection + 3 questions
│   ├── _layout.tsx
│   └── setup.tsx               # → src/screens/onboarding/OnboardingFlow.tsx
│
├── (tabs)/                     # Main app — tab bar visible
│   ├── _layout.tsx             # Tab bar: Home, Drill, Roleplay, Vocab, Settings
│   ├── index.tsx               # Tab: Home → src/screens/home/HomeScreen.tsx
│   ├── drill.tsx               # Tab: Drill → src/screens/drill/DrillScreen.tsx
│   ├── roleplay.tsx            # Tab: Roleplay → src/screens/roleplay/ScenarioList.tsx
│   ├── vocab.tsx               # Tab: Vocab → src/screens/vocab/VocabScreen.tsx
│   └── settings.tsx            # Tab: Settings → src/screens/settings/SettingsScreen.tsx
│
└── (modal)/                    # Full-screen modals pushed over tabs
    ├── vocab-detail.tsx        # → src/screens/vocab/VocabDetail.tsx
    ├── scenario-intro.tsx      # → src/screens/roleplay/ScenarioIntro.tsx
    ├── roleplay-session.tsx    # → src/screens/roleplay/RoleplaySession.tsx
    └── session-summary.tsx     # → src/screens/shared/SessionSummary.tsx
```

---

## `src/screens/` — Full-Page Screen Components

Screen components own the UI for one full page. They receive data from hooks, dispatch to stores, render components. They do not call services directly — hooks handle that.

```
src/screens/
│
├── auth/
│   ├── WelcomeScreen.tsx       # Splash + tagline + CTA
│   ├── SignUpScreen.tsx        # Name, email, password, date of birth
│   └── SignInScreen.tsx        # Email + password login
│
├── onboarding/
│   ├── OnboardingFlow.tsx      # Orchestrator — step state machine
│   ├── StepLanguage.tsx        # Q1: Choose language (Chinese / Japanese / Korean)
│   ├── StepBackground.tsx      # Q2: Grew up hearing it? (Yes / Somewhat / No)
│   ├── StepConfidence.tsx      # Q3: Comfortable speaking? (Very / A little / Not at all)
│   └── StepWelcome.tsx         # Personalized welcome + initial 4-bar skill profile
│
├── home/
│   └── HomeScreen.tsx          # Dashboard: app header, greeting, dots, lesson cards, skill bars
│
├── drill/
│   ├── DrillScreen.tsx         # Flashcard session orchestrator
│   ├── CardFront.tsx           # Audio plays, romanization shown, script hidden
│   └── CardBack.tsx            # Script + meaning + example sentence revealed
│
├── listening/
│   ├── ListeningScreen.tsx     # Audio clip + comprehension questions
│   └── AudioPlayer.tsx         # Play/pause + speed selector (0.75x, 1x, 1.25x)
│
├── roleplay/
│   ├── ScenarioList.tsx        # Grid of scenario cards by tier — all accessible
│   ├── ScenarioIntro.tsx       # Pre-scenario: context, family character, learning goal
│   ├── RoleplaySession.tsx     # Active conversation: mic, playback, turn indicator
│   ├── FeedbackOverlay.tsx     # 3-second non-blocking post-turn tip
│   └── ScenarioSummary.tsx     # End: vocab learned, skill delta, next step
│
├── vocab/
│   ├── VocabScreen.tsx         # Personal vocab list — searchable, filtered by language
│   └── VocabDetail.tsx         # Full entry: script, romanization, meaning, audio, example, note
│
├── honorifics/
│   └── HonorificsScreen.tsx    # Language-specific honorific/family-term drill (Phase 3)
│
├── profile/
│   └── SkillProfileScreen.tsx  # Full 4-bar profile + 30-day trend chart (Phase 3)
│
├── settings/
│   └── SettingsScreen.tsx      # Language switch, reminder time, playback speed, delete account
│
└── shared/
    └── SessionSummary.tsx      # Reusable end-of-session metrics (used by all session types)
```

---

## `src/components/` — Reusable UI Components

Stateless or locally stateful UI pieces. Receive all data and callbacks as props. Do not read from global stores or call services directly.

```
src/components/
│
├── cards/
│   ├── LessonCard.tsx          # Title, type badge, duration, language indicator
│   ├── ScenarioCard.tsx        # Scenario title, tier badge, turn count, language
│   └── VocabRow.tsx            # Script + romanization + meaning + audio icon
│
├── feedback/
│   ├── MetricCard.tsx          # Single metric: label + value + optional context
│   ├── SkillBars.tsx           # 4-bar profile: Listening, Speaking, Reading, Writing
│   ├── SkillTrendChart.tsx     # 30-day SVG trend line per skill (Phase 3, no library)
│   └── FeedbackBanner.tsx      # 1 positive + 1 suggestion, auto-dismisses in 4 seconds
│
├── inputs/
│   ├── MicButton.tsx           # Record: idle / recording / processing states
│   ├── AudioPlayer.tsx         # Playback: play/pause + speed selector
│   └── LanguageCard.tsx        # Large tappable card for language selection in onboarding
│
├── navigation/
│   ├── StreakDots.tsx           # 7-day Mon–Sun dots — filled = active day, no counter
│   └── ProgressPill.tsx        # "Turn 3 of 8" shown during roleplay
│
├── display/
│   ├── AppHeader.tsx           # "Heritage" title + localized subtitle in chosen language script
│   ├── ScriptText.tsx          # Renders target language script. For Chinese: reads userStore.chineseScript and renders Simplified or Traditional. All Chinese text must route through this component.
│   └── RomanizationText.tsx    # Romanization line below script (pinyin / romaji / revised-romanization)
│
└── primitives/
    ├── Chip.tsx                # Small label with optional color variant
    ├── TierBadge.tsx           # "Tier 1" / "Tier 2" / "Tier 3" pill
    └── VocabChip.tsx           # Non-blocking "New word: X" chip (3-second auto-dismiss)
```

---

## `src/templates/` — Layout Templates

Structural shells. Every screen uses exactly one template as its outermost wrapper. Templates own SafeAreaView, StatusBar, KeyboardAvoidingView — screens do not implement these themselves.

```
src/templates/
├── BaseTemplate.tsx            # SafeAreaView + StatusBar + standard background
├── ScrollTemplate.tsx          # BaseTemplate + ScrollView with standard padding
├── ModalTemplate.tsx           # Full-screen modal: close button, title, scrollable content
├── SessionTemplate.tsx         # Active session: progress pill, exit button, content area
└── OnboardingTemplate.tsx      # Step indicator dots, back button, content, next CTA
```

---

## `src/prompts/` — Claude API System Prompts

All Claude system prompts live here. No prompt string may appear anywhere else in the codebase. Each file exports a single builder function that takes typed parameters and returns a string.

```
src/prompts/
├── roleplayFamilyCharacter.ts  # buildRoleplayFamilyCharacterPrompt(scenario, skillScore, language)
├── pronunciationTip.ts         # buildPronunciationTipPrompt(word, userAttempt, language)
└── sessionInsight.ts           # buildSessionInsightPrompt(metrics, vocabEncountered, language)
```

**Required builder function signature pattern:**
```typescript
// Every prompt file follows this pattern exactly
export function build[Name]Prompt(
  param1: TypedParam,
  param2: TypedParam,
  language: SupportedLanguage
): string {
  return `...full prompt string...`.trim();
}
```

---

## `src/services/` — External API Services

One file per external dependency. The only files that make network requests. No UI logic. No imports from components or screens. No state management.

```
src/services/
├── supabase.ts                 # Supabase client init (keys from config/secrets.ts)
├── auth.ts                     # signUp(), signIn(), signOut(), getSession(), onAuthStateChange()
├── claude.ts                   # sendRoleplayTurn(), generateSessionInsight()
├── whisper.ts                  # transcribeAudio(audioUri, languageHint) → transcript + wordConfidences
├── elevenlabs.ts               # synthesizeSpeech(text, language) → localAudioUri (with cache)
├── fsrs.ts                     # scheduleCard(), updateCard(), getDueCards()
└── offlineCache.ts             # Pre-download flashcard decks + audio (Phase 3)
```

**Service rules:**
- Every function is async and returns a typed result
- Every function has try/catch that throws a typed `AppError` from `src/types/errors.ts`
- No `console.log` in production — use `src/utils/logger.ts`
- `claude.ts`, `whisper.ts`, `elevenlabs.ts` call `src/config/secrets.ts` getters for keys — never import keys directly

---

## `src/stores/` — Global State (Zustand)

```
src/stores/
├── userStore.ts                # UserProfile + SkillScore + selectedLanguage + chineseScript + isPremium
│                               # chineseScript: 'simplified' | 'traditional' — only used when selectedLanguage === 'zh'
│                               # Persisted to SecureStore (NOT AsyncStorage)
├── sessionStore.ts             # Current session: type, startTime, vocabEncountered[], metrics
│                               # In-memory only — cleared at session end after Supabase save
└── roleplayStore.ts            # Active roleplay: scenarioId, turnHistory, isRecording, pauseStartTime
│                               # In-memory only
```

`userStore` is the only store persisted across app launches. `sessionStore` and `roleplayStore` are never persisted.

---

## `src/hooks/` — Custom React Hooks

The coordination layer between screens, stores, and services.

```
src/hooks/
├── useAuth.ts                  # Session state, login/logout, auth listener
├── useOnboarding.ts            # Onboarding step state, seed score computation, submission
├── useDrill.ts                 # Flashcard queue, answer recording, FSRS update, skill signal emit
├── useRoleplay.ts              # Roleplay turn loop: record → transcribe → Claude → ElevenLabs → play
├── useListening.ts             # Clip playback, question state, comprehension accuracy, skill signal emit
├── useVocab.ts                 # Vocab list fetch, search, add personal note
└── useSessionMetrics.ts        # Accumulate session signals, compute skill delta, save to Supabase
```

---

## `src/utils/` — Pure Utility Functions

No side effects. No imports from services, stores, or components. Input → output only.

```
src/utils/
├── skillModel.ts               # updateSkillScore(current, signals) → {updated, delta}
│                               # getRecommendedContent(skillScore, language) → ContentRecommendation[]
├── skillModelSeed.ts           # seedSkillScore(background, confidence) → SkillScore (onboarding only)
├── appName.ts                  # getAppSubtitle(language) → {script, romanization, meaning}
├── speakingConfidence.ts       # computeSpeakingConfidence(wordConfidences) → number (0–100)
├── sessionTips.ts              # getSessionTip(metrics, language) → string (rule-based, no AI)
├── distressKeywords.ts         # containsDistressSignal(transcript) → boolean
├── formatters.ts               # formatRomanization(), formatDuration(), formatDate()
├── validators.ts               # isValidEmail(), isValidAge(), isStrongPassword()
└── logger.ts                   # log(), warn(), error() — no-op in production unless Sentry configured
```

---

## `src/types/` — TypeScript Type Definitions

```
src/types/
├── index.ts                    # All domain types (see Plan.md Step 1.1 for full list)
└── errors.ts                   # AppError class + typed error codes
```

No `any` types anywhere. All API response shapes defined here.

---

## `src/constants/` — Static Application Data

```
src/constants/
├── scenarios.ts                # All 27 scenario definitions (9 per language)
├── familyTerms.ts              # Family address term trees: Chinese, Japanese, Korean (Phase 3)
├── voices.ts                   # ElevenLabs voice IDs keyed by language (SupportedLanguage → voiceId)
├── colors.ts                   # Design system color tokens
├── spacing.ts                  # Design system spacing scale
└── categories.ts               # FlashCardCategory values + display labels per language
```

---

## `src/config/` — Configuration

```
src/config/
└── secrets.ts                  # SecureStore getters for all API keys — THE ONLY FILE that reads SecureStore
```

No other file imports from `expo-secure-store`. All secrets go through this file.

---

## `src/assets/` — Static Media

Audio files organized by language, then by category. One `.mp3` per vocabulary item, named by romanization.

```
src/assets/
├── audio/
│   ├── zh/                     # Mandarin Chinese audio
│   │   ├── vocab/              # [pinyin-hyphenated].mp3 — e.g. wai-po.mp3, ni-hao.mp3
│   │   └── listening/          # Curated family dialogue clips — clip-01.mp3, clip-02.mp3...
│   ├── ja/                     # Japanese audio
│   │   ├── vocab/              # [romaji-hyphenated].mp3 — e.g. o-baa-chan.mp3, ie.mp3
│   │   └── listening/
│   ├── ko/                     # Korean audio
│   │   ├── vocab/              # [revised-romanization-hyphenated].mp3 — e.g. hal-meo-ni.mp3
│   │   └── listening/
│   └── yue/                    # Cantonese — empty directory, Phase 3+ only
│       └── README.md           # "Cantonese audio assets — do not populate until Phase 3"
└── images/
    ├── icon.png
    └── splash.png
```

**Audio file naming rule:** lowercase, hyphens only, romanization of the word, no tone numbers in filename. Tone and pronunciation data lives in the database, not the filename.

---

## `supabase/` — Database

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql  # All tables with language column
│   ├── 002_rls_policies.sql    # RLS on every table — deny all default
│   └── 003_indexes.sql         # user_id, language, updated_at, next_review_date
└── seed.sql                    # Test user + sample flashcard data for all 3 languages
```

---

## `docs/` — Project Documentation

```
docs/
├── PRD.md          # Product Requirements Document
├── Plan.md         # Phased build instructions for Claude Code
├── AI_Rules.md     # Non-negotiables: safety, metrics, vocabulary, secrets, cultural accuracy
└── Architecture.md # This file — project structure and file location guide
```

---

## Quick Reference — Where Does This File Go?

| What you're building | Where it goes |
|---|---|
| A new page route | `app/(tabs)/[name].tsx` or `app/(modal)/[name].tsx` |
| A full-page screen | `src/screens/[feature]/[Name]Screen.tsx` |
| A reusable UI piece | `src/components/[category]/[Name].tsx` |
| A layout shell | `src/templates/[Name]Template.tsx` |
| A Claude prompt | `src/prompts/[name].ts` |
| An external API call | `src/services/[serviceName].ts` |
| Global state | `src/stores/[name]Store.ts` |
| A React hook | `src/hooks/use[Name].ts` |
| A pure helper function | `src/utils/[name].ts` |
| A TypeScript type | `src/types/index.ts` |
| A constant / static data | `src/constants/[name].ts` |
| Mandarin audio for a vocab word | `src/assets/audio/zh/vocab/[pinyin-hyphenated].mp3` |
| Japanese audio for a vocab word | `src/assets/audio/ja/vocab/[romaji-hyphenated].mp3` |
| Korean audio for a vocab word | `src/assets/audio/ko/vocab/[revised-romanization-hyphenated].mp3` |
| A SQL migration | `supabase/migrations/[NNN]_[description].sql` |

**Decision rule:** Does it call an API? → `services/`. Does it render UI? → `components/` or `screens/`. Does it hold state? → `stores/`. Does it do pure logic? → `utils/`. Does it define a shape? → `types/`. Does it hold static data? → `constants/`.
