# Product Requirements Document
## Heritage — Asian Language Learning App

**Version:** 2.0  
**Last Updated:** 2026  
**Status:** Active Development  

---

## 1. Product Vision

Heritage is a language learning app that helps anyone reconnect with — or discover for the first time — the languages of Asian culture and family. It is built first for heritage speakers: second-generation Asian Americans who grew up hearing a language at home but never became fluent. But it is open to everyone — non-Asian learners, adoptees, partners of Asian families, or anyone motivated by genuine cultural connection.

The app name translates with the user's chosen language and is displayed as a subtitle on the home screen:
- **Chinese (Mandarin):** 根语 *(Gēn Yǔ — "root language")*
- **Japanese:** 継承語 *(Keishōgo — "inherited language")*
- **Korean:** 유산어 *(Yusan-eo — "heritage language")*

Unlike general-purpose language apps that treat every user as a tourist starting from zero, Heritage understands that learners arrive with different starting points. The app observes how each user naturally communicates and adapts content to them — rather than making them pass a test to unlock the next level.

**The core promise: help users have real conversations with the people and culture they care about** — not pass an exam, not order food on vacation.

---

## 2. The Problem We Solve

Heritage learners and culturally motivated learners share a common frustration:

- Existing apps treat all users as absolute beginners, ignoring what heritage speakers already know from years of listening at home
- Placement tests and level-gating feel like school — the opposite of motivated, emotional learning
- No app adapts to how a specific user actually communicates (their vocabulary gaps, code-switching habits, pronunciation weaknesses)
- Real-time AI translation tools create visible dependence in front of family — humiliating, not helpful
- The emotional dimension is completely ignored: shame around language ability, cultural identity questions, the desire to connect with grandparents before it's too late

**The gap we fill:** A platform that observes how users engage naturally — through conversations, flashcards, and listening — and builds a picture of their ability over time. No quizzes. No gates. Just progressively appropriate content that meets users exactly where they are.

---

## 3. Target Users

**Primary — Heritage speakers (any background):**
- Second-generation Asian Americans (Chinese, Japanese, Korean, and future languages)
- Grew up hearing the language but never became conversationally fluent
- Understand spoken language at a moderate level but struggle to respond
- Motivated by family connection, cultural identity, and not losing the language before it's too late

**Secondary — Culturally motivated learners (any background):**
- Partners or spouses of Asian families wanting to connect with their partner's family
- Adoptees reconnecting with birth culture and language
- Non-Asian learners drawn by culture (K-pop, anime, C-drama, food, travel)
- Anyone seeking conversational fluency in a real-world family context, not textbook fluency

**Also welcome, not primary focus:**
- Casual language learners curious about Asian languages
- People who want to learn as a hobby or creative interest

**Not our audience:**
- Academic learners preparing for JLPT, TOPIK, or HSK exams (no exam prep content will be built)
- Native speakers seeking advanced literacy or writing instruction
- Business / professional language learners (no workplace scenarios in Phase 1–2)

---

## 4. Supported Languages at Launch

**Phase 1–2 (build now):**
- **Mandarin Chinese** — Hanyu Pinyin, Mandarin tones. Users can switch between Simplified (简体) and Traditional (繁體) characters in Settings at any time. Default is Simplified. All flashcard content, roleplay display, and vocabulary entries must respect the user's active script preference and update immediately on toggle.
- **Japanese** — Hiragana, Katakana, Kanji with furigana, romaji fallback
- **Korean** — Hangul, Revised Romanization, honorific system (존댓말/반말)

**Phase 3+ (do not build yet):**
- Cantonese (separate audio corpus, Jyutping romanization, dialect-aware prompting)
- Vietnamese, Tagalog, and other Southeast Asian languages

Language is selected at onboarding. All screens must use a `selectedLanguage` field — never hardcode language-specific strings or assume only one language will exist.

---

## 5. How the App Learns the User (No Assessment, No Gating)

**This is the most important product decision in this document.**

Heritage does not require users to take a placement test or pass quizzes to unlock content. This is what Duolingo does. We are explicitly not doing this.

Instead, the app builds a skill model passively by observing how the user naturally engages with content.

### 5.1 Passive skill inference signals

The app watches these signals across every session and silently updates the skill model in the background:

| Signal | What it infers |
|---|---|
| "Got it" vs "Again" rate on flashcards | Vocabulary recognition breadth |
| Whisper transcription of recorded speech | Pronunciation accuracy, speaking confidence |
| Comprehension question accuracy on audio clips | Listening level |
| Words marked "heard this at home" | Heritage vs textbook vocabulary gap |
| Pause length before responding in roleplay | Fluency and retrieval speed |
| English code-switching in speech | Active vocabulary range |
| Which roleplay turns the user replays | Where comprehension breaks down |

### 5.2 How the skill model is used

- Content difficulty adjusts silently — harder audio, more complex roleplay — as the model grows
- A 4-bar skill profile (Listening, Speaking, Reading, Writing) is shown on the dashboard and updated after every session
- All content is always accessible — nothing is locked behind a score
- Content is *recommended* based on the skill model, but users can freely choose anything at any time
- If a user selects content above their inferred level, the AI adapts its responses to be more supportive — the content does not refuse to load

### 5.3 Onboarding in place of assessment

On first launch, ask three lightweight self-report questions:
1. Which language are you learning? *(Chinese / Japanese / Korean)*
2. Have you grown up hearing this language at home? *(Yes / Somewhat / No)*
3. How comfortable do you feel speaking it today? *(Very / A little / Not at all)*

These three answers set the starting point for the skill model. The model then refines itself from the very first session onward. No test. No right or wrong answers. No content locked.

---

## 6. Core Features (In Scope)

### 6.1 Language selection & app name localization (Phase 1)
- Onboarding selects language (Chinese / Japanese / Korean)
- Home screen subtitle shows the localized Heritage translation in chosen language script
- All content, audio, flashcard decks, and roleplay scenarios are scoped to selected language
- Language-specific romanization used throughout (Pinyin / Romaji / Revised Romanization)
- Language can be changed in Settings
- **Chinese script preference:** Users who select Chinese can toggle between Simplified (简体) and Traditional (繁體) in Settings. The toggle is always visible in Settings when the selected language is Chinese. Switching updates all displayed content immediately — no restart required.

### 6.2 Passive skill profiling (Phase 1, ongoing)
- Skill model runs silently after every session — no user action required
- 4-skill profile: Listening, Speaking, Reading, Writing (each 0–100)
- Profile shown on home dashboard and dedicated Skill screen
- Profile always leads with the user's strongest skill
- After each session: "Your listening improved today" — visible, affirming, never alarming

### 6.3 Adaptive flashcard drills (Phase 1)
- FSRS spaced repetition algorithm (more accurate than Anki's SM-2)
- Cards show: script + romanization + English meaning + family-context example sentence
- Audio plays automatically before script is revealed (sound-first)
- Deck categories per language: Family address terms, Daily home vocabulary, Emotional expression, Food & meals, Health & body
- "Heard this at home" flag prioritizes real-world vocabulary
- Card selection difficulty adjusts from passive skill model — no user configuration required
- No writing or stroke order practice in Phase 1

### 6.4 Listening & speaking practice (Phase 1)
- Native speaker audio recordings for all primary content
- ElevenLabs TTS for AI-generated roleplay responses only
- Whisper API for speech-to-text of user's spoken input
- Language-appropriate feedback: Mandarin tone errors, Japanese pitch accent notes (informational), Korean vowel/consonant accuracy
- Pronunciation feedback is always a suggestion, never a grade

### 6.5 Family communication roleplay scenarios (Phase 2)
- AI-powered scenarios simulating real family situations, adapted per language and culture
- Each of the three languages has its own scenario set (9 scenarios per language, 27 total)
- Claude API drives the family character and adapts difficulty based on the passive skill model
- 3 emotional tiers per language (Daily life → Family events → Deep conversations)
- One piece of feedback per roleplay turn, always framed positively
- End-of-scenario summary: vocabulary learned, skill model update, what to do next
- No points, stars, scores, or gamification

### 6.6 Session metrics & learning dashboard (Phase 1)
- Every session ends with a SessionSummary screen — mandatory, no exceptions
- Metrics: words practiced, listening accuracy, speaking confidence, new vocabulary added, time spent
- Weekly view: which skills moved, what to focus on
- 7-day activity dot row (not a streak counter)

### 6.7 Personal vocabulary list (Phase 1)
- Every word encountered across all features auto-added to personal vocab list
- Each entry: script + romanization + English meaning + audio + example sentence + translation + context note
- Users can add personal notes
- Exportable for offline review

---

## 7. Out of Scope (Do NOT Build)

| Feature | Reason Excluded |
|---|---|
| Placement tests or unlock quizzes | Core philosophy violation — see Section 5 |
| Leaderboards or user rankings | Shame and competition, antithetical to mission |
| Streak counters with anxiety | Gamification pressure harms consistency |
| Social / community features | Phase 3+; requires moderation |
| Writing / stroke order practice | Phase 3+ only |
| Real-time translation mode | Creates dependency, not fluency |
| JLPT / TOPIK / HSK exam prep | Wrong framing for our audience |
| Cantonese, Vietnamese, Tagalog | Phase 3+ — do not scaffold now |
| Ads or sponsored content | Never |
| Individual lesson purchases | Freemium model only |
| Voice cloning of real family members | Privacy and consent |
| Public sharing of progress | Private by default |
| Business / workplace scenarios | Out of scope for Phase 1–2 |

---

## 8. Non-Functional Requirements

### Performance
- Roleplay turn latency: < 2 seconds end-to-end (speech → family character response audio)
- App cold start: < 3 seconds on mid-range Android
- Flashcard load: < 500ms per card
- Offline mode: Flashcard drills and vocabulary list work without internet

### Privacy & Security
- All API keys in device Keychain (iOS) / Keystore (Android) — never in code or AsyncStorage
- No user audio stored server-side beyond the current session
- Supabase Row Level Security on all tables
- No third-party behavioral analytics SDKs
- COPPA compliant: minimum age 13, parental consent for under-18

### Accessibility
- All audio has text transcripts
- Minimum font size 16sp for body text
- Color contrast ≥ 4.5:1
- VoiceOver and TalkBack compatible for core navigation

### Localization
- App UI is English-only
- All target language content accompanied by romanization and English translation
- No non-English UI

---

## 9. Success Metrics

| Metric | Target | Why It Matters |
|---|---|---|
| Day 7 retention | > 40% | Motivated learners stay — early drop means emotional mismatch |
| Session length | 8–12 minutes | Meaningful but sustainable daily habit |
| Roleplay completion rate | > 70% | Incomplete = difficulty mismatch or emotional overwhelm |
| Vocabulary recall (FSRS) | > 85% at 1-week | Core learning effectiveness |
| Skill score improvement (30 days) | +15 pts on weakest skill | Passive model is adapting correctly |
| User-reported confidence | Surveyed day 14 and day 30 | Qualitative proof of the core promise |
| Language distribution | Track Chinese / Japanese / Korean split | Informs content investment |

---

## 10. Design Principles

1. **Connection first, language second.** Framed around people and culture, not levels and exams.
2. **Strength before weakness.** Lead with what users already know.
3. **No wrong way to communicate.** Code-switching is valid — the app celebrates it.
4. **Shame-free by default.** No public scores, no failure states, no comparisons.
5. **Culturally specific per language.** Chinese, Japanese, and Korean family dynamics are distinct — content must reflect each authentically.
6. **The app adapts to the user, not the other way around.** No tests, no gates, no locked levels.

---

## 11. Monetization (Awareness Only — Not a Build Requirement)

- **Free tier:** Core flashcard drills for one language, 3 roleplay scenarios, basic skill profile
- **Premium ($7.99/month or $59.99/year):** Full scenario library, all languages, unlimited roleplay, advanced metrics, offline mode
- **Family Plan ($99.99/year, up to 6 members):** Phase 3 feature
- **No ads. Ever.**

Implement a `isPremium: boolean` feature flag on the user profile. Payment flows via RevenueCat — not a Phase 1–2 build requirement.
