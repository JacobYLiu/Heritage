import { RoleplayTurn, RoleplayResponse, SkillScore, Scenario, SupportedLanguage, VocabEntry, SessionMetrics } from '../types'
import { AppError } from '../types/errors'
import { getClaudeApiKey } from '../config/secrets'
import { buildRoleplayFamilyCharacterPrompt } from '../prompts/roleplayFamilyCharacter'
import { buildSessionInsightPrompt } from '../prompts/sessionInsight'
import { error as logError } from '../utils/logger'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'
const MAX_RETRIES = 3

// Raw Claude JSON for zh (has separate Simplified/Traditional fields)
interface ClaudeZhRaw {
  parentSpeechSimplified: string
  parentSpeechTraditional: string
  parentSpeechPinyin?: string
  userPrompt: string
  toneNote: string | null
  newVocab: RawVocabItem[]
}

// Raw Claude JSON for ja/ko
interface ClaudeJaKoRaw {
  parentSpeech: string
  userPrompt: string
  toneNote: string | null
  newVocab: RawVocabItem[]
}

interface RawVocabItem {
  script: string
  scriptTraditional?: string
  romanization: string
  meaning: string
  exampleSentence?: string
  exampleSentenceSimplified?: string
  exampleSentenceTraditional?: string
  exampleTranslation: string
  contextNote: string
}

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = await getClaudeApiKey()

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new AppError('CLAUDE_API_FAILED', `Claude API ${response.status}: ${body}`)
  }

  const data = await response.json() as { content: { type: string; text: string }[] }
  const text = data.content.find(c => c.type === 'text')?.text ?? ''
  return text
}

function normalizeVocab(
  raw: RawVocabItem[],
  language: SupportedLanguage,
  userId: string
): VocabEntry[] {
  return raw.map((item, i) => ({
    id: `claude-vocab-${Date.now()}-${i}`,
    userId,
    language,
    script: item.script,
    romanization: item.romanization,
    meaning: item.meaning,
    audioUrl: '',  // populated by ElevenLabs or vocab DB lookup
    exampleSentence: item.exampleSentence ?? item.exampleSentenceSimplified ?? '',
    exampleTranslation: item.exampleTranslation,
    contextNote: item.contextNote,
    personalNote: null,
    seenAt: new Date(),
    source: 'roleplay',
  }))
}

export async function sendRoleplayTurn(
  history: RoleplayTurn[],
  userTranscript: string,
  skillScore: SkillScore,
  scenario: Scenario,
  language: SupportedLanguage,
  chineseScript: 'simplified' | 'traditional',
  userId: string
): Promise<RoleplayResponse> {
  const systemPrompt = buildRoleplayFamilyCharacterPrompt(scenario, skillScore, language)

  // Build conversation context for Claude
  const historyText = history.map(t =>
    `Turn ${t.turnNumber}:\nFamily member: ${t.parentSpeech}\nLearner: ${t.userTranscript}`
  ).join('\n\n')

  const userMessage = historyText
    ? `${historyText}\n\nTurn ${history.length + 1}:\nLearner: ${userTranscript}`
    : `Turn 1:\nLearner: ${userTranscript}`

  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const rawText = await callClaude(
        attempt > 0 ? `${systemPrompt}\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY the JSON object, no other text.` : systemPrompt,
        userMessage
      )

      // Strip potential markdown code fences
      const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
      const parsed = JSON.parse(jsonText) as ClaudeZhRaw | ClaudeJaKoRaw

      if (language === 'zh') {
        const zhParsed = parsed as ClaudeZhRaw
        const parentSpeech = chineseScript === 'traditional'
          ? zhParsed.parentSpeechTraditional
          : zhParsed.parentSpeechSimplified

        return {
          parentSpeech,
          userPrompt: zhParsed.userPrompt,
          toneNote: zhParsed.toneNote,
          newVocab: normalizeVocab(zhParsed.newVocab ?? [], language, userId),
        }
      } else {
        const jkParsed = parsed as ClaudeJaKoRaw
        return {
          parentSpeech: jkParsed.parentSpeech,
          userPrompt: jkParsed.userPrompt,
          toneNote: jkParsed.toneNote,
          newVocab: normalizeVocab(jkParsed.newVocab ?? [], language, userId),
        }
      }
    } catch (err) {
      logError(`Claude attempt ${attempt + 1} failed`, err)
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }

  throw new AppError('CLAUDE_INVALID_RESPONSE', `Claude failed after ${MAX_RETRIES} attempts: ${lastError?.message}`)
}

export async function generateSessionInsight(
  metrics: SessionMetrics,
  vocabEncountered: VocabEntry[],
  language: SupportedLanguage
): Promise<string> {
  const systemPrompt = buildSessionInsightPrompt(metrics, vocabEncountered, language)

  try {
    const rawText = await callClaude(systemPrompt, 'Generate the session insight.')
    const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(jsonText) as { insight: string }
    return parsed.insight
  } catch (err) {
    logError('Failed to generate session insight', err)
    return 'Every session builds on the last. You\'re making real progress.'
  }
}
