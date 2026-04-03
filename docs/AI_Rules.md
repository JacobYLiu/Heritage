# AI Rules & Non-Negotiables
## Heritage — Guardrails for Claude Code

> These rules are non-negotiable. Claude Code must follow every rule in this file without exception. If implementing a feature would require violating any rule here, stop and flag the conflict rather than proceeding.

---

## 1. The App's Core Identity — Never Compromise This

Heritage is a **learning experience**, not a translation tool and not an entertainment app. Every AI interaction must leave the user more capable than before. The Claude API is used to teach, encourage, and simulate — never to do the language work *for* the user.

**The test for every AI feature:** After this interaction, does the user know something they didn't know before? If the answer is no, the feature is wrong.

The app supports three languages at launch: Mandarin Chinese (`zh`), Japanese (`ja`), and Korean (`ko`). Every AI rule in this file applies equally to all three languages. No language receives less care than another.

### 1.1 What Claude API must always do in roleplay
- Stay in character as a warm, authentic family member from the chosen language's culture
- Adapt character personality to be culturally accurate per language (Chinese parent warmth, Japanese family formality, Korean honorific expectations)
- Model correct grammar naturally — never correct the user explicitly mid-conversation
- Introduce 1–3 new vocabulary words per turn, embedded naturally in speech
- Adapt speech difficulty based on the user's current `skillScore.speaking` from `userStore`
- Return valid JSON matching `RoleplayResponse` type every single turn — no exceptions

### 1.2 What Claude API must never do
- Translate entire sentences for the user on demand
- Complete the user's sentences or speak for them
- Give harsh, clinical, or grade-like feedback ("Incorrect." "Wrong tone." "3/5 stars.")
- Break character to give meta-commentary about the app or the AI
- Generate content that mocks, stereotypes, or caricatures any Asian culture, family structure, or immigrant experience
- Discuss topics unrelated to the active scenario (politics, other AI systems, current events, app development)
- Produce content inappropriate for users aged 13+
- Treat any form of code-switching (English mixed in) as an error — it is expected and valid

### 1.3 Language-specific roleplay rules

**Mandarin Chinese (`zh`):**
- All Claude responses must return Chinese text in **both** Simplified and Traditional simultaneously, in separate JSON fields: `parentSpeechSimplified` and `parentSpeechTraditional`. The app renders whichever matches `userStore.chineseScript`. Claude Code must never return only one script variant.
- Always include pinyin alongside characters in the `parentSpeech` fields for the app to display
- Tones are identified by number (1–4 + neutral) in `toneNote` — e.g., "妈 (mā, tone 1)"
- Family character speaks with warmth and indirect affection (Chinese families rarely say 我爱你 directly)

**Japanese (`ja`):**
- Use appropriate politeness level (丁寧語 for formal family situations, casual for close family)
- Include furigana in parentheses for any kanji in `parentSpeech`: e.g., "家族(かぞく)"
- Pitch accent corrections in `toneNote` are informational only — never penalizing
- Japanese family scenarios involve more indirect communication — the character does not directly state emotions

**Korean (`ko`):**
- Always use 존댓말 (formal speech) in scenarios where the user speaks to parents or elders
- Use 반말 only in scenarios explicitly between peers or younger family members
- Include romanization alongside Hangul in `parentSpeech`
- Honorific mistakes are the highest-priority `toneNote` — getting 존댓말/반말 wrong is the most socially significant error for Korean heritage speakers

---

## 2. The Passive Skill Model — Claude Code Must Never Circumvent This

The app does not use assessments, quizzes, or lock gates. The skill model is the only mechanism that adapts content difficulty. Claude Code must protect this architecture.

### 2.1 The skill model is invisible machinery
- Users never see a raw number that says "your score is 34/100"
- Users see 4 progress bars (Listening, Speaking, Reading, Writing) and session deltas ("Your listening improved today")
- The bars are normalized visual representations — not raw scores
- No screen may display the internal 0–100 scores as absolute numbers

### 2.2 The skill model never locks content
- No `if (skillScore.speaking < threshold) return null` anywhere in the codebase
- No content is hidden, disabled, or grayed out based on skill score
- Scenarios and drills are *recommended* — the recommendation algorithm uses skill score, but the user can override freely
- If a user selects content above their inferred level, Claude adapts its responses to be more supportive — the screen does not refuse to render

### 2.3 Skill updates are always silent and affirming
- Skill updates happen in the background at session end — no notification mid-session
- If a skill went up: show it ("Your speaking confidence grew today")
- If a skill went down or held flat: do not show it as a negative. Show the session as positive regardless.
- Never show two skills declining in the same session summary

---

## 3. Session Metrics — Mandatory After Every Session

Every learning session (flashcard drill, listening practice, roleplay scenario) must end with a SessionSummary screen. This screen is not optional and cannot be skipped.

### 3.1 Required metrics per session type

**Flashcard drill:**
- Cards practiced (count)
- "Got it" ratio — shown as positive (e.g., "7 of 10 cards felt familiar")
- New vocabulary added (count, tappable)
- Estimated next review for hardest card ("Come back to 外婆 in 2 days")
- One rule-based tip from `src/utils/sessionTips.ts`

**Listening practice:**
- Clips listened to (count)
- Comprehension accuracy (%) — framed positively even at low scores
- Playback speed used
- New vocabulary encountered (count, tappable)

**Roleplay scenario:**
- Turns completed out of total (shown even if partial — exit is never penalized)
- New vocabulary introduced (full list with romanization, meaning, audio)
- Speaking confidence score for this session (0–100 internal, shown as a bar or qualitative label)
- Language-specific pronunciation note: tone accuracy (Chinese), pitch note (Japanese), honorific note (Korean)
- One encouraging observation generated by Claude from `src/prompts/sessionInsight.ts`

### 3.2 Metric display rules
- Always frame positively: "8 cards felt familiar" not "2 cards need work"
- If comprehension was 0%: "This clip was a stretch — that's exactly what builds your ear. Try it again tomorrow."
- Metrics are private and personal — never shown to other users, never compared
- Skill delta displayed only if positive — flat or negative deltas are silently omitted from the summary

---

## 4. Vocabulary Return — Mandatory for Every AI Interaction

Every word the user encounters during AI-powered features must be captured, enriched, and returned to them. This is a core learning mechanism, not optional behavior.

### 4.1 Required fields on every VocabEntry (no exceptions)

```typescript
{
  scriptSimplified: string,      // e.g. "外婆" — always Simplified for zh; standard script for ja/ko
  scriptTraditional: string,     // e.g. "外婆" — Traditional variant for zh; same as Simplified for ja/ko
  romanization: string,          // e.g. "wài pó" / "kazoku" / "halmeoni"
  meaning: string,               // English — e.g. "maternal grandmother (mother's mother)"
  audioUrl: string,              // pronunciation audio — required, not optional
  exampleSentenceSimplified: string,    // target language, Simplified (or standard for ja/ko)
  exampleSentenceTraditional: string,   // Traditional variant (zh only); same as Simplified for ja/ko
  exampleTranslation: string,    // English translation of the example sentence
  contextNote: string,           // cultural/usage context
  seenAt: Date,
  source: 'flashcard' | 'roleplay' | 'listening',
  language: SupportedLanguage
}
```

If the Claude API returns a word without all required fields, fetch missing data from the app's vocabulary database before saving. Never persist an incomplete VocabEntry.

### 4.2 How vocabulary is shown to users
- During roleplay: a subtle non-blocking chip appears at top of screen when a new word is introduced ("New word: 外婆") — disappears after 3 seconds, never interrupts the conversation
- In SessionSummary: scrollable list of all new words, each row shows script + romanization + meaning + audio button
- Tapping any word opens VocabDetail
- All vocabulary is auto-saved to the user's personal Vocab List — no user action required

### 4.3 Language-specific romanization in vocabulary
- Chinese: Hanyu Pinyin with tone marks (ā á ǎ à) — not tone numbers
- Japanese: Romaji using Hepburn romanization + furigana in parentheses for kanji
- Korean: Revised Romanization of Korean (국어의 로마자 표기법)

---

## 5. Security — All Secrets in Keychain

Zero exceptions. Violating this ships user data at risk.

### 5.1 Forbidden storage locations for secrets
- Source code (any `.ts`, `.tsx`, `.js` file) — hardcoded or as constants
- `.env` files committed to the repo
- `AsyncStorage`
- `localStorage` / `sessionStorage`
- Any file in the app bundle
- Redux, Zustand, or any store that serializes to disk via AsyncStorage

### 5.2 Required storage location
All secrets use `expo-secure-store` (iOS Keychain / Android Keystore):

```typescript
// src/config/secrets.ts — the ONLY file that reads from SecureStore
import * as SecureStore from 'expo-secure-store';

export async function getClaudeApiKey(): Promise<string> {
  const key = await SecureStore.getItemAsync('CLAUDE_API_KEY');
  if (!key) throw new Error('Claude API key not configured');
  return key;
}
// Same pattern for: SUPABASE_URL, SUPABASE_ANON_KEY, WHISPER_API_KEY, ELEVENLABS_API_KEY
```

### 5.3 Supabase Row Level Security
Every table: RLS enabled. Default policy: deny all. Explicit policies: SELECT/INSERT/UPDATE/DELETE only where `auth.uid() = user_id`. No service role key in client code. No cross-user data access.

---

## 6. User Safety & Wellbeing

### 6.1 Emotional safety in roleplay
Family conversations can be emotionally charged. These safeguards are mandatory:

- **Escape hatch always visible:** Every roleplay screen has an "Exit scenario" button. One tap exits — no confirmation. Goes to ScenarioSummary showing what was accomplished. No guilt messaging.
- **No penalty language:** Never show "You left early," "Scenario incomplete," or any framing that implies failure. Show what was completed.
- **Distress detection:** If the user's Whisper transcript contains keywords from `src/utils/distressKeywords.ts`, pause the scenario immediately. Show: "Take your time. You can exit anytime." Do not continue until the user explicitly taps "Continue."
- **Tier 3 content notice:** Before Tier 3 scenarios (deep conversations), display: "This scenario can touch on personal topics. Go at your own pace." — single acknowledgment screen, not a barrier.

### 6.2 Age safety
- Minimum age: 13 at sign-up (date of birth collected, enforced)
- Users under 18: Tier 3 scenarios are accessible but marked as emotionally mature — no hard lock
- No collection of sensitive personal data beyond what is in the Privacy Policy

### 6.3 Content moderation for AI responses
- All scenario scripts are pre-defined and culturally reviewed
- Claude API is constrained to the scenario context by the system prompt
- If Claude returns content outside the scenario (off-topic, culturally inaccurate, inappropriate): `src/services/claude.ts` discards it and retries with an added constraint
- Maximum 3 retries before graceful error: "Let's try that again" + retry button
- Claude must never generate content that stereotypes, mocks, or diminishes any Asian cultural group

### 6.4 No manipulative design patterns (ever)
- No notifications that imply streak loss or lost progress
- No urgency language ("Your progress will disappear!")
- No cancellation dark patterns
- No messages implying the user is failing or disappointing their family

---

## 7. Roleplay Scenario Library — 27 Approved Scenarios

Claude Code must implement exactly these scenarios. Do not add, remove, or rename scenarios without updating this document. Each language has its own culturally specific versions of the same emotional tiers.

### Chinese (`zh`) — 9 scenarios

| ID | Title | Tier | Turns | Emotional Focus |
|---|---|---|---|---|
| `zh-S01` | Dinner table with mom | 1 | 8 | Daily connection |
| `zh-S02` | Grocery run | 1 | 6 | Practical vocabulary |
| `zh-S03` | Phone call with 外婆 | 1 | 6 | Long-distance family |
| `zh-S04` | Lunar New Year gathering | 2 | 10 | Social navigation |
| `zh-S05` | Introducing your partner | 2 | 10 | Family expectations |
| `zh-S06` | Parent's doctor visit | 2 | 8 | Real-world bridge |
| `zh-S07` | Career choices talk | 3 | 12 | Expressing yourself |
| `zh-S08` | Talking about feelings | 3 | 10 | Emotional vocabulary |
| `zh-S09` | Saying "I love you" | 3 | 8 | Cultural intimacy |

### Japanese (`ja`) — 9 scenarios

| ID | Title | Tier | Turns | Emotional Focus |
|---|---|---|---|---|
| `ja-S01` | Dinner with おかあさん | 1 | 8 | Daily connection |
| `ja-S02` | Shopping with mom | 1 | 6 | Practical vocabulary |
| `ja-S03` | Phone call with おばあちゃん | 1 | 6 | Long-distance family |
| `ja-S04` | New Year (お正月) gathering | 2 | 10 | Social navigation |
| `ja-S05` | Introducing your partner | 2 | 10 | Family expectations |
| `ja-S06` | Parent's doctor visit | 2 | 8 | Real-world bridge |
| `ja-S07` | Career path conversation | 3 | 12 | Expressing yourself |
| `ja-S08` | Talking about feelings | 3 | 10 | Emotional vocabulary |
| `ja-S09` | Expressing gratitude and love | 3 | 8 | Cultural intimacy |

### Korean (`ko`) — 9 scenarios

| ID | Title | Tier | Turns | Emotional Focus |
|---|---|---|---|---|
| `ko-S01` | Dinner with 어머니 | 1 | 8 | Daily connection |
| `ko-S02` | Market run with mom | 1 | 6 | Practical vocabulary |
| `ko-S03` | Phone call with 할머니 | 1 | 6 | Long-distance family |
| `ko-S04` | Chuseok gathering | 2 | 10 | Social navigation |
| `ko-S05` | Introducing your partner | 2 | 10 | Family expectations |
| `ko-S06` | Parent's doctor visit | 2 | 8 | Real-world bridge |
| `ko-S07` | Career and future talk | 3 | 12 | Expressing yourself |
| `ko-S08` | Talking about feelings | 3 | 10 | Emotional vocabulary |
| `ko-S09` | Saying 사랑해 | 3 | 8 | Cultural intimacy |

---

## 8. Feedback Tone — One Positive, One Suggestion

Every piece of feedback — from rules-based logic or Claude — follows this structure:

1. **One positive observation** ("You used 谢谢/ありがとう/고마워요 naturally — that's real progress.")
2. **One specific suggestion** if warranted ("Try the rising tone on 吗 — it signals a question.")

Never:
- Two criticisms in one feedback moment
- Generic praise ("Good job!" without specificity)
- Comparisons to a native speaker
- Feedback implying the user should already know something

Maximum 2 sentences per feedback overlay. If nothing needs correction, show only the positive.

---

## 9. Cultural Accuracy — Per Language

Heritage makes cultural claims about real family dynamics. These must be accurate and reviewed.

**For all languages:**
- Family address terms must be linguistically correct and regionally appropriate
- Example sentences must reflect real family speech patterns, not textbook language
- Content must be reviewed by a heritage speaker of each language before shipping
- The app must never imply that one regional variety or dialect is "correct"
- Add `// CULTURAL_REVIEW_NEEDED` on any string content you are uncertain about

**Chinese specifically:**
- Pinyin must use standard Hanyu Pinyin with correct Unicode tone marks (not numbers)
- Distinguish maternal vs paternal family terms (外婆/奶奶, 舅舅/叔叔) correctly
- Do not conflate Mandarin and Cantonese family terms

**Japanese specifically:**
- Honorific suffixes (さん, ちゃん, くん, 様) must be contextually correct
- Keigo (敬語) vs casual speech distinction must be preserved in all scenario scripts
- Furigana must be provided for all kanji used in user-facing content

**Korean specifically:**
- 존댓말/반말 must be used correctly in every scenario based on relationship and context
- Family address terms must distinguish maternal vs paternal side (외할머니/할머니, 외삼촌/삼촌)
- Honorific particles must be contextually appropriate
