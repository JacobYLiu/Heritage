# Heritage — Build Progress Checklist

> Tracks completion of every step in `Plan.md`. Check off each step as it is fully done (TypeScript passes, file in correct location, all imports resolve).
>
> **Note on folder paths:** The Expo app lives at `Heritage/app/` (renamed from `Heritage/heritage/`), while `docs/` lives at the repo root (`Heritage/docs/`). Architecture.md describes paths relative to the Expo project root (`app/`), not the repo root. Keep this distinction in mind when creating files — e.g. `src/config/secrets.ts` is at `Heritage/app/src/config/secrets.ts`.

---

## Pre-Phase: Project Bootstrap

- [x] **Step 0.1** — Initialize Expo project (`npx create-expo-app heritage --template blank-typescript`)
- [x] **Step 0.2** — Install core dependencies (expo-router, expo-secure-store, expo-av, expo-file-system, @supabase/supabase-js, react-navigation, zustand, react-query, reanimated, gesture-handler)
- [x] **Step 0.3** — Create root folder structure (`app/`, `src/` subdirs, `supabase/migrations/`, audio dirs, Cantonese README)
- [x] **Step 0.4** — Configure secrets loader (`src/config/secrets.ts` — SecureStore getters only)
- [x] **Step 0.5** — Initialize Supabase client (`src/services/supabase.ts`)

---

## Phase 1 — Foundation: Language Selection, Skill Model, Flashcards

- [ ] **Step 1.1** — TypeScript types (`src/types/index.ts` — all domain interfaces, no `any`)
- [ ] **Step 1.2** — Supabase database migrations (`001_initial_schema.sql`, `002_rls_policies.sql`, `003_indexes.sql`)
- [ ] **Step 1.3** — Auth screens (WelcomeScreen, SignUpScreen, SignInScreen + `src/services/auth.ts`)
- [ ] **Step 1.4** — Onboarding: language selection & skill model seed (StepLanguage, StepBackground, StepConfidence, StepWelcome + `useOnboarding.ts` + `skillModelSeed.ts`)
- [ ] **Step 1.5** — Global state stores (`userStore.ts` persisted to SecureStore, `sessionStore.ts` in-memory)
- [ ] **Step 1.6** — App name localization utility (`src/utils/appName.ts`)
- [ ] **Step 1.7** — Home dashboard screen (HomeScreen + StreakDots, LessonCard, SkillBars, AppHeader components)
- [ ] **Step 1.8** — Passive skill model engine (`src/utils/skillModel.ts` — `updateSkillScore`, `getRecommendedContent`)
- [ ] **Step 1.9** — Flashcard drill (DrillScreen, CardFront, CardBack + `src/services/fsrs.ts` + `useDrill.ts`)
- [ ] **Step 1.10** — Vocabulary list screen (VocabScreen, VocabDetail, VocabRow + `useVocab.ts`)
- [ ] **Step 1.11** — Session summary screen (`SessionSummary.tsx`, MetricCard, `sessionTips.ts`)

---

## Phase 2 — AI Features: Roleplay, Speaking, Full Skill Model

- [ ] **Step 2.1** — Add AI service secrets (update `src/config/secrets.ts` with Claude, Whisper, ElevenLabs getters)
- [ ] **Step 2.2** — Claude API service (`src/services/claude.ts` — `sendRoleplayTurn`)
- [ ] **Step 2.3** — All Claude system prompts (`roleplayFamilyCharacter.ts`, `pronunciationTip.ts`, `sessionInsight.ts`)
- [ ] **Step 2.4** — Whisper speech-to-text service (`src/services/whisper.ts`)
- [ ] **Step 2.5** — ElevenLabs TTS service (`src/services/elevenlabs.ts` with audio cache)
- [ ] **Step 2.6** — Scenario definitions — all 27 (`src/constants/scenarios.ts`)
- [ ] **Step 2.7** — Roleplay scenario screens (ScenarioList, ScenarioIntro, RoleplaySession, FeedbackOverlay, ScenarioSummary + `useRoleplay.ts`)
- [ ] **Step 2.8** — Upgrade passive skill model with real speech signals (update `src/utils/skillModel.ts`)
- [ ] **Step 2.9** — Dedicated listening practice screen (ListeningScreen, AudioPlayer + `useListening.ts`)

---

## Phase 3 — Depth, Polish & Production

- [ ] **Step 3.1** — Honorifics & family address term module (HonorificsScreen + `src/constants/familyTerms.ts`)
- [ ] **Step 3.2** — Skill trend chart & full profile screen (SkillProfileScreen + SkillTrendChart SVG)
- [ ] **Step 3.3** — Cantonese scaffolding — structure only (`src/assets/audio/yue/`, voice ID placeholder)
- [ ] **Step 3.4** — Settings screen (SettingsScreen — language switch, Chinese script toggle, reminders, delete account)
- [ ] **Step 3.5** — Offline mode (`src/services/offlineCache.ts` — flashcard deck + audio pre-download)
- [ ] **Step 3.6** — Production hardening (Sentry, App Store metadata, accessibility audit, performance audit, security audit)
