import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SessionTemplate } from '../../templates/SessionTemplate'
import { MicButton } from '../../components/inputs/MicButton'
import { VocabChip } from '../../components/primitives/VocabChip'
import { FeedbackOverlay } from './FeedbackOverlay'
import { useRoleplay } from '../../hooks/useRoleplay'
import { useSessionMetrics } from '../../hooks/useSessionMetrics'
import { useSessionStore } from '../../stores/sessionStore'
import { getScenarioById } from '../../constants/scenarios'
import { Scenario } from '../../types'

interface RoleplaySessionProps {
  scenarioId: string
}

export function RoleplaySession({ scenarioId }: RoleplaySessionProps) {
  const scenario = getScenarioById(scenarioId) as Scenario
  const rp = useRoleplay()
  const { finalizeSession } = useSessionMetrics()
  const sessionStore = useSessionStore()

  const [visibleVocab, setVisibleVocab] = React.useState<string | null>(null)
  const vocabQueueRef = React.useRef<string[]>([])

  useEffect(() => {
    if (scenario) rp.startScenario(scenario)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rp.phase === 'complete') handleExit()
  }, [rp.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Drain vocab queue one chip at a time
  useEffect(() => {
    const latestVocab = sessionStore.vocabEncountered.slice(-3).map(v => v.script)
    vocabQueueRef.current = latestVocab
    if (!visibleVocab && latestVocab.length > 0) {
      setVisibleVocab(latestVocab[0])
    }
  }, [sessionStore.vocabEncountered.length]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleExit() {
    await finalizeSession({
      whisperConfidenceScore: sessionStore.speakingConfidence,
      codeSwitchRate: 0.1,
    })
    router.replace('/(modal)/session-summary')
  }

  if (!scenario) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Scenario not found.</Text>
      </View>
    )
  }

  const micState = rp.phase === 'recording' ? 'recording'
    : rp.phase === 'processing' ? 'processing'
    : 'idle'

  return (
    <SessionTemplate
      currentTurn={rp.currentTurn}
      totalTurns={rp.totalTurns}
      onExit={handleExit}
    >
      <View style={styles.container}>
        {/* Vocab chip — non-blocking, auto-dismisses */}
        {visibleVocab && (
          <VocabChip
            word={visibleVocab}
            onDismiss={() => setVisibleVocab(null)}
          />
        )}

        {/* Parent speech bubble */}
        <View style={styles.speechBubble}>
          {rp.phase === 'playing-parent' || rp.phase === 'processing' ? (
            <ActivityIndicator size="small" color="#888888" />
          ) : rp.parentSpeech ? (
            <Text style={styles.parentSpeech}>{rp.parentSpeech}</Text>
          ) : (
            <Text style={styles.startingText}>Starting conversation…</Text>
          )}
        </View>

        {/* User prompt hint */}
        {rp.userPrompt ? (
          <Text style={styles.userPrompt}>Try saying: "{rp.userPrompt}"</Text>
        ) : null}

        {/* Distress message */}
        {rp.isDistressDetected && (
          <View style={styles.distressCard}>
            <Text style={styles.distressText}>Take your time. You can exit anytime.</Text>
            <TouchableOpacity onPress={rp.dismissDistress} style={styles.continueBtn}>
              <Text style={styles.continueBtnLabel}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Error */}
        {rp.error ? (
          <Text style={styles.errorText}>{rp.error}</Text>
        ) : null}

        {/* Mic */}
        <View style={styles.micArea}>
          {rp.phase === 'awaiting-user' && (
            <Text style={styles.yourTurn}>Your turn</Text>
          )}
          <MicButton
            state={micState}
            onPressIn={rp.startRecording}
            onPressOut={rp.stopRecording}
          />
        </View>
      </View>

      {/* Feedback overlay */}
      {rp.phase === 'feedback' && rp.toneNote && (
        <FeedbackOverlay toneNote={rp.toneNote} onDismiss={rp.dismissFeedback} />
      )}
    </SessionTemplate>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between' },
  speechBubble: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  parentSpeech: { fontSize: 20, color: '#1A1A1A', textAlign: 'center', lineHeight: 30 },
  startingText: { fontSize: 16, color: '#888888' },
  userPrompt: { fontSize: 14, color: '#888888', textAlign: 'center', marginBottom: 16, fontStyle: 'italic' },
  distressCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  distressText: { fontSize: 16, color: '#444444', textAlign: 'center' },
  continueBtn: { backgroundColor: '#1A1A1A', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  continueBtnLabel: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  micArea: { alignItems: 'center', gap: 12, paddingBottom: 12 },
  yourTurn: { fontSize: 14, color: '#888888', fontWeight: '500' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 14, color: '#E05252', textAlign: 'center' },
})
