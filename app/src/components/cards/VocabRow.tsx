import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { VocabEntry } from '../../types'

interface VocabRowProps {
  entry: VocabEntry
  onPress: () => void
  onAudioPress: () => void
}

export function VocabRow({ entry, onPress, onAudioPress }: VocabRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.textGroup}>
        <Text style={styles.script}>{entry.script}</Text>
        <Text style={styles.romanization}>{entry.romanization}</Text>
        <Text style={styles.meaning} numberOfLines={1}>{entry.meaning}</Text>
      </View>
      <TouchableOpacity
        style={styles.audioButton}
        onPress={onAudioPress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.audioIcon}>▶</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  textGroup: { flex: 1, gap: 2 },
  script: { fontSize: 20, color: '#1A1A1A', fontWeight: '500' },
  romanization: { fontSize: 13, color: '#666666' },
  meaning: { fontSize: 13, color: '#888888' },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIcon: { fontSize: 12, color: '#444444' },
})
