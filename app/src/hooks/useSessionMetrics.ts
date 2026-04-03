import { useSessionStore } from '../stores/sessionStore'
import { useUserStore } from '../stores/userStore'
import { updateSkillScore } from '../utils/skillModel'
import { SkillSignals, SessionMetrics } from '../types'
import { getSupabaseClient } from '../services/supabase'
import { getSession } from '../services/auth'
import { error as logError } from '../utils/logger'
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

interface SessionMetricsHook {
  finalizeSession: (signals: SkillSignals) => Promise<SessionMetrics | null>
}

export function useSessionMetrics(): SessionMetricsHook {
  const session = useSessionStore()
  const { profile, updateSkillScore: storeUpdateSkillScore } = useUserStore()

  async function finalizeSession(signals: SkillSignals): Promise<SessionMetrics | null> {
    if (!session.sessionType || !session.language || !session.startTime || !profile) return null

    const now = new Date()
    const durationSeconds = Math.round((now.getTime() - session.startTime.getTime()) / 1000)

    const { updated, delta } = updateSkillScore(profile.skillScores, signals)

    const metrics: SessionMetrics = {
      sessionId: generateId(),
      userId: profile.id,
      language: session.language,
      sessionType: session.sessionType,
      wordsEncountered: session.wordsEncountered,
      wordsMarkedGot: session.wordsMarkedGot,
      listeningAccuracy: session.listeningAccuracy,
      speakingConfidence: session.speakingConfidence,
      newVocabCount: session.vocabEncountered.length,
      durationSeconds,
      skillDelta: delta,
      completedAt: now,
    }

    try {
      const authSession = await getSession()
      if (authSession) {
        const supabase = await getSupabaseClient()
        await supabase.from('session_metrics').insert({
          id: metrics.sessionId,
          user_id: metrics.userId,
          language: metrics.language,
          session_type: metrics.sessionType,
          words_encountered: metrics.wordsEncountered,
          words_marked_got: metrics.wordsMarkedGot,
          listening_accuracy: metrics.listeningAccuracy,
          speaking_confidence: metrics.speakingConfidence,
          new_vocab_count: metrics.newVocabCount,
          duration_seconds: metrics.durationSeconds,
          skill_delta_listening: delta.listening,
          skill_delta_speaking: delta.speaking,
          skill_delta_reading: delta.reading,
          skill_delta_writing: delta.writing,
          completed_at: metrics.completedAt,
        })
      }
    } catch (err) {
      logError('Failed to save session metrics', err)
    }

    await storeUpdateSkillScore(updated)
    session.clearSession()

    return metrics
  }

  return { finalizeSession }
}
