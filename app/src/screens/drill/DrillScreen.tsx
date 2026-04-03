import React, { useCallback } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SessionTemplate } from '../../templates/SessionTemplate'
import { CardFront } from './CardFront'
import { CardBack } from './CardBack'
import { useDrill } from '../../hooks/useDrill'
import { useSessionMetrics } from '../../hooks/useSessionMetrics'
import { FlashCard, FSRSData } from '../../types'

// Placeholder card set — real cards come from the content database.
// These demonstrate the card structure for the drill screen.
const SAMPLE_CARDS: FlashCard[] = []

export function DrillScreen() {
  const drill = useDrill(SAMPLE_CARDS)
  const { finalizeSession } = useSessionMetrics()

  const handleExit = useCallback(async () => {
    await finalizeSession({ flashcardGotRate: drill.gotRate })
    router.push('/(modal)/session-summary')
  }, [drill.gotRate, finalizeSession])

  const handleRate = useCallback(async (rating: NonNullable<FSRSData['lastRating']>) => {
    await drill.rate(rating)
    if (drill.isSessionComplete) {
      await finalizeSession({ flashcardGotRate: drill.gotRate })
      router.push('/(modal)/session-summary')
    }
  }, [drill, finalizeSession])

  const handlePlayAudio = useCallback(() => {
    // Audio playback via expo-av — wired in Phase 1.9
    // drill.currentCard?.audioUrl contains the file path
  }, [])

  if (drill.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </View>
    )
  }

  if (drill.error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{drill.error}</Text>
      </View>
    )
  }

  if (!drill.currentCard) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No cards due for review. Come back tomorrow!</Text>
      </View>
    )
  }

  return (
    <SessionTemplate
      currentTurn={drill.currentIndex + 1}
      totalTurns={drill.cards.length}
      onExit={handleExit}
    >
      {drill.isFlipped ? (
        <CardBack
          card={drill.currentCard}
          onRate={handleRate}
          onHeardAtHome={drill.markHeardAtHome}
          onPlayAudio={handlePlayAudio}
        />
      ) : (
        <CardFront
          card={drill.currentCard}
          onShowBack={drill.flip}
          onPlayAudio={handlePlayAudio}
        />
      )}
    </SessionTemplate>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 16, color: '#E05252', textAlign: 'center' },
  emptyText: { fontSize: 16, color: '#666666', textAlign: 'center' },
})
