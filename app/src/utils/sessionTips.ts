import { SessionMetrics, SupportedLanguage } from '../types'

// Rule-based tip generator — no AI, pure logic.
export function getSessionTip(metrics: SessionMetrics, language: SupportedLanguage): string {
  if (metrics.sessionType === 'flashcard') {
    const gotRate = metrics.wordsEncountered > 0
      ? metrics.wordsMarkedGot / metrics.wordsEncountered
      : 0

    if (gotRate >= 0.8) {
      return languageTip('strong-recall', language)
    }
    if (gotRate <= 0.3) {
      return languageTip('low-recall', language)
    }
    return languageTip('mid-recall', language)
  }

  if (metrics.sessionType === 'listening') {
    if (metrics.listeningAccuracy >= 80) return languageTip('strong-listening', language)
    if (metrics.listeningAccuracy === 0) return 'This clip was a stretch — that\'s exactly what builds your ear. Try it again tomorrow.'
    return languageTip('mid-listening', language)
  }

  if (metrics.sessionType === 'roleplay') {
    return languageTip('roleplay-done', language)
  }

  return 'Every session brings you closer. See you tomorrow.'
}

function languageTip(tipKey: string, _language: SupportedLanguage): string {
  const tips: Record<string, string> = {
    'strong-recall': 'Your memory is sharp today. These words are becoming part of you.',
    'low-recall': 'Some of these words are new territory — that\'s exactly where learning happens. Keep coming back.',
    'mid-recall': 'A solid session. The words you flagged will show up again soon.',
    'strong-listening': 'Your ear is tuning in. Try a slightly faster playback speed next time.',
    'mid-listening': 'Comprehension grows with exposure. Replaying a clip is always a good move.',
    'roleplay-done': 'Real conversation is the hardest practice — and you just did it.',
  }
  return tips[tipKey] ?? 'Every session brings you closer. See you tomorrow.'
}
