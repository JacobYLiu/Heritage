import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FlashCard, FSRSData } from '../../types'
import { ScriptText } from '../../components/display/ScriptText'
import { RomanizationText } from '../../components/display/RomanizationText'

interface CardBackProps {
  card: FlashCard
  onRate: (rating: NonNullable<FSRSData['lastRating']>) => void
  onHeardAtHome: () => void
  onPlayAudio: () => void
}

export function CardBack({ card, onRate, onHeardAtHome, onPlayAudio }: CardBackProps) {
  return (
    <View style={styles.card}>
      <View style={styles.center}>
        <TouchableOpacity onPress={onPlayAudio}>
          <ScriptText
            simplified={card.scriptSimplified}
            traditional={card.scriptTraditional}
            style={styles.script}
          />
        </TouchableOpacity>
        <RomanizationText text={card.romanization} style={styles.romanization} />
        <Text style={styles.meaning}>{card.meaning}</Text>

        <View style={styles.exampleBlock}>
          <ScriptText
            simplified={card.exampleSentenceSimplified}
            traditional={card.exampleSentenceTraditional}
            style={styles.exampleScript}
          />
          <Text style={styles.exampleTranslation}>{card.exampleTranslation}</Text>
        </View>

        <TouchableOpacity onPress={onHeardAtHome} style={styles.heardButton}>
          <Text style={styles.heardLabel}>🏠 Heard this at home</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.ratingRow}>
        <TouchableOpacity style={[styles.ratingButton, styles.again]} onPress={() => onRate('again')}>
          <Text style={styles.ratingLabel}>Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ratingButton, styles.hard]} onPress={() => onRate('hard')}>
          <Text style={styles.ratingLabel}>Hard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ratingButton, styles.got]} onPress={() => onRate('good')}>
          <Text style={[styles.ratingLabel, styles.gotLabel]}>Got it</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { flex: 1, justifyContent: 'space-between', padding: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  script: { fontSize: 52, color: '#1A1A1A', fontWeight: '600', textAlign: 'center' },
  romanization: { fontSize: 20, color: '#666666' },
  meaning: { fontSize: 18, color: '#444444', textAlign: 'center' },
  exampleBlock: { gap: 4, alignItems: 'center', paddingTop: 8 },
  exampleScript: { fontSize: 16, color: '#444444', textAlign: 'center' },
  exampleTranslation: { fontSize: 14, color: '#888888', textAlign: 'center', fontStyle: 'italic' },
  heardButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 8,
  },
  heardLabel: { fontSize: 13, color: '#666666' },
  ratingRow: { flexDirection: 'row', gap: 10 },
  ratingButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  again: { backgroundColor: '#FDE8E8' },
  hard: { backgroundColor: '#FFF3E0' },
  got: { backgroundColor: '#1A1A1A' },
  ratingLabel: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  gotLabel: { color: '#FFFFFF' },
})
