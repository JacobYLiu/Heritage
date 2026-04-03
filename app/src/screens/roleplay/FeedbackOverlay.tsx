import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface FeedbackOverlayProps {
  toneNote: string
  onDismiss: () => void
}

// Non-blocking 3-second overlay shown after a turn if Claude returned a toneNote.
// Follows AI_Rules.md §8: one positive + one suggestion, max 2 sentences, no harsh language.
export function FeedbackOverlay({ toneNote, onDismiss }: FeedbackOverlayProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.note}>{toneNote}</Text>
        <TouchableOpacity onPress={onDismiss} style={styles.continueButton}>
          <Text style={styles.continueLabel}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  note: { fontSize: 16, color: '#1A1A1A', lineHeight: 24 },
  continueButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueLabel: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
})
