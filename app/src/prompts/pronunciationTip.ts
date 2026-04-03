import { SupportedLanguage } from '../types'

export function buildPronunciationTipPrompt(
  word: string,
  userAttempt: string,
  language: SupportedLanguage
): string {
  const languageContext = getPronunciationContext(language)

  return `
You are giving a brief, encouraging pronunciation tip to a heritage language learner.

TARGET WORD: ${word}
USER'S ATTEMPT: ${userAttempt}
LANGUAGE: ${language}

${languageContext}

RULES:
- Give exactly ONE positive observation and ONE specific suggestion (if needed).
- Maximum 2 sentences total.
- If the attempt is good, show only the positive — no suggestion needed.
- Never compare to a native speaker.
- Never use grades, scores, or words like "incorrect" or "wrong".
- Tone is warm and specific, like a supportive older sibling.
- Respond in plain English only.

OUTPUT FORMAT — respond ONLY with valid JSON:
{
  "positive": "<one specific positive observation>",
  "suggestion": "<one specific suggestion, or null if none needed>"
}
`.trim()
}

function getPronunciationContext(language: SupportedLanguage): string {
  const contexts: Record<SupportedLanguage, string> = {
    zh: 'Focus on Mandarin tones (tone 1–4 + neutral). Identify the specific tone contour. Reference the tone number and the syllable.',
    ja: 'Focus on pitch accent if relevant. Reference mora length and vowel clarity. Pitch notes are informational — never penalizing.',
    ko: 'Focus on vowel and consonant accuracy. Reference aspirated vs unaspirated consonants if relevant. Mention 받침 (final consonant) clarity where appropriate.',
  }
  return contexts[language]
}
