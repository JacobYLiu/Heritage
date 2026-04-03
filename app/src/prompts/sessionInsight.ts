import { SessionMetrics, VocabEntry, SupportedLanguage } from '../types'

export function buildSessionInsightPrompt(
  metrics: SessionMetrics,
  vocabEncountered: VocabEntry[],
  language: SupportedLanguage
): string {
  const vocabList = vocabEncountered.map(v => `${v.script} (${v.romanization}) — ${v.meaning}`).join(', ')
  const sessionSummary = buildSessionSummary(metrics)

  return `
You are writing a brief, encouraging end-of-session observation for a heritage language learner.

SESSION DATA:
${sessionSummary}
VOCABULARY ENCOUNTERED: ${vocabList || 'none recorded'}
LANGUAGE: ${language}

RULES:
- Write exactly 1–2 sentences. No more.
- Be specific to what actually happened in the session — not generic.
- Focus on strength and forward momentum, not gaps.
- Do not mention scores, percentages, or numbers from the session data.
- Do not use words like "great job", "amazing", or "fantastic" — be specific instead.
- Tone: warm, like a mentor who watched the session and noticed something real.
- Write in plain English only.
- If vocab was encountered, reference one specific word naturally.

OUTPUT FORMAT — respond ONLY with valid JSON:
{
  "insight": "<1–2 sentence encouraging observation>"
}
`.trim()
}

function buildSessionSummary(metrics: SessionMetrics): string {
  const lines: string[] = [
    `Session type: ${metrics.sessionType}`,
    `Duration: ${metrics.durationSeconds} seconds`,
    `Words encountered: ${metrics.wordsEncountered}`,
  ]
  if (metrics.sessionType === 'flashcard') {
    lines.push(`Words marked familiar: ${metrics.wordsMarkedGot} of ${metrics.wordsEncountered}`)
  }
  if (metrics.sessionType === 'listening') {
    lines.push(`Comprehension accuracy: ${metrics.listeningAccuracy}%`)
  }
  if (metrics.sessionType === 'roleplay') {
    lines.push(`Speaking confidence score: ${metrics.speakingConfidence}`)
  }
  return lines.join('\n')
}
