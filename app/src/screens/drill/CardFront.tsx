import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FlashCard } from '../../types'
import { RomanizationText } from '../../components/display/RomanizationText'

interface CardFrontProps {
  card: FlashCard
  onShowBack: () => void
  onPlayAudio: () => void
}

export function CardFront({ card, onShowBack, onPlayAudio }: CardFrontProps) {
  useEffect(() => {
    onPlayAudio()
  }, [card.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.card}>
      <View style={styles.center}>
        <TouchableOpacity onPress={onPlayAudio} style={styles.audioHint}>
          <Text style={styles.audioIcon}>🔊</Text>
        </TouchableOpacity>
        <RomanizationText text={card.romanization} style={styles.romanization} />
        <Text style={styles.scriptHidden}>— tap to reveal —</Text>
      </View>
      <TouchableOpacity style={styles.revealButton} onPress={onShowBack}>
        <Text style={styles.revealLabel}>Show character</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  audioIcon: { fontSize: 36 },
  audioHint: { alignItems: 'center' },
  romanization: { fontSize: 32, color: '#1A1A1A', fontWeight: '500', textAlign: 'center' },
  scriptHidden: { fontSize: 14, color: '#AAAAAA' },
  revealButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  revealLabel: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
})
