import { useLocalSearchParams, router } from 'expo-router'
import { useSessionStore } from '../../src/stores/sessionStore'
import { SessionSummary } from '../../src/screens/shared/SessionSummary'
import { SessionMetrics, VocabEntry } from '../../src/types'

export default function SessionSummaryModal() {
  const sessionStore = useSessionStore()
  const params = useLocalSearchParams<{
    sessionId: string
    sessionType: string
    language: string
    wordsEncountered: string
    wordsMarkedGot: string
    listeningAccuracy: string
    speakingConfidence: string
    newVocabCount: string
    durationSeconds: string
    skillDeltaLabel: string
  }>()

  // Build a SessionMetrics object from route params (passed by useSessionMetrics after finalize)
  const metrics: SessionMetrics = {
    sessionId: params.sessionId ?? '',
    userId: '',
    language: (params.language ?? 'zh') as SessionMetrics['language'],
    sessionType: (params.sessionType ?? 'flashcard') as SessionMetrics['sessionType'],
    wordsEncountered: Number(params.wordsEncountered ?? 0),
    wordsMarkedGot: Number(params.wordsMarkedGot ?? 0),
    listeningAccuracy: Number(params.listeningAccuracy ?? 0),
    speakingConfidence: Number(params.speakingConfidence ?? 0),
    newVocabCount: Number(params.newVocabCount ?? 0),
    durationSeconds: Number(params.durationSeconds ?? 0),
    skillDelta: { listening: 0, speaking: 0, reading: 0, writing: 0 },
    completedAt: new Date(),
  }

  return (
    <SessionSummary
      metrics={metrics}
      vocabEncountered={sessionStore.vocabEncountered}
      skillDeltaLabel={params.skillDeltaLabel}
      onVocabPress={(entry: VocabEntry) =>
        router.push({ pathname: '/(modal)/vocab-detail', params: { id: entry.id } })
      }
    />
  )
}
