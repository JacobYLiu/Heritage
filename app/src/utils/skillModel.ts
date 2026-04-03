import { SkillScore, SkillDelta, SkillSignals, ContentRecommendation, SupportedLanguage } from '../types'

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value))
}

export function updateSkillScore(
  current: SkillScore,
  signals: SkillSignals
): { updated: SkillScore; delta: SkillDelta } {
  let listeningDelta = 0
  let speakingDelta = 0
  let readingDelta = 0
  let writingDelta = 0

  // Flashcard got rate → reading + writing
  if (signals.flashcardGotRate !== undefined) {
    const gotBoost = (signals.flashcardGotRate - 0.5) * 4
    readingDelta += gotBoost
    writingDelta += gotBoost * 0.5
  }

  // Whisper confidence → speaking
  if (signals.whisperConfidenceScore !== undefined) {
    const confNorm = signals.whisperConfidenceScore / 100
    speakingDelta += (confNorm - 0.5) * 6
  }

  // Comprehension accuracy → listening
  if (signals.comprehensionAccuracy !== undefined) {
    const accBoost = (signals.comprehensionAccuracy - 0.5) * 6
    listeningDelta += accBoost
  }

  // Pause before response → speaking fluency (shorter pause = better)
  if (signals.avgPauseBeforeResponse !== undefined) {
    const pauseSeconds = signals.avgPauseBeforeResponse / 1000
    // < 2s is fluent, > 8s is very hesitant
    const pauseScore = clamp(1 - (pauseSeconds - 2) / 6, 0, 1)
    speakingDelta += (pauseScore - 0.5) * 2
  }

  // Code-switch rate → speaking breadth (lower rate = more target-language use)
  if (signals.codeSwitchRate !== undefined) {
    speakingDelta += (0.5 - signals.codeSwitchRate) * 2
  }

  const delta: SkillDelta = {
    listening: Math.round(listeningDelta * 10) / 10,
    speaking: Math.round(speakingDelta * 10) / 10,
    reading: Math.round(readingDelta * 10) / 10,
    writing: Math.round(writingDelta * 10) / 10,
  }

  const updated: SkillScore = {
    listening: clamp(current.listening + delta.listening),
    speaking: clamp(current.speaking + delta.speaking),
    reading: clamp(current.reading + delta.reading),
    writing: clamp(current.writing + delta.writing),
    lastUpdated: new Date(),
  }

  return { updated, delta }
}

export function getRecommendedContent(
  skillScore: SkillScore,
  language: SupportedLanguage
): ContentRecommendation[] {
  const scores = [
    { skill: 'listening' as const, value: skillScore.listening },
    { skill: 'speaking' as const, value: skillScore.speaking },
    { skill: 'reading' as const, value: skillScore.reading },
    { skill: 'writing' as const, value: skillScore.writing },
  ]

  scores.sort((a, b) => a.value - b.value)
  const weakest = scores[0].skill
  const secondWeakest = scores[1].skill

  const recommendations: ContentRecommendation[] = []

  // Recommend content that targets the two weakest skills
  if (weakest === 'listening' || secondWeakest === 'listening') {
    recommendations.push({
      type: 'listening',
      id: `listening-${language}-recommended`,
      title: 'Listening practice',
      language,
      reason: 'Builds your listening comprehension',
      estimatedDurationSeconds: 300,
    })
  }

  if (weakest === 'speaking' || secondWeakest === 'speaking') {
    recommendations.push({
      type: 'roleplay',
      id: `${language}-S01`,
      title: 'Family conversation',
      language,
      reason: 'Builds your speaking confidence',
      estimatedDurationSeconds: 480,
    })
  }

  if (weakest === 'reading' || weakest === 'writing') {
    recommendations.push({
      type: 'flashcard',
      id: `flashcard-${language}-recommended`,
      title: 'Vocabulary drill',
      language,
      reason: 'Strengthens your reading and vocabulary',
      estimatedDurationSeconds: 300,
    })
  }

  // Always include a flashcard recommendation
  if (!recommendations.some(r => r.type === 'flashcard')) {
    recommendations.push({
      type: 'flashcard',
      id: `flashcard-${language}-daily`,
      title: 'Daily vocabulary drill',
      language,
      reason: 'Keep your vocabulary sharp',
      estimatedDurationSeconds: 300,
    })
  }

  return recommendations.slice(0, 3)
}
