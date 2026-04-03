import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SupportedLanguage } from '../../types'
import { formatDuration } from '../../utils/formatters'

interface LessonCardProps {
  title: string
  type: 'flashcard' | 'listening' | 'roleplay'
  estimatedDurationSeconds: number
  language: SupportedLanguage
  onPress: () => void
}

const TYPE_LABELS: Record<LessonCardProps['type'], string> = {
  flashcard: 'Drill',
  listening: 'Listen',
  roleplay: 'Roleplay',
}

const TYPE_COLORS: Record<LessonCardProps['type'], string> = {
  flashcard: '#4A90D9',
  listening: '#6ABF87',
  roleplay: '#E87C5E',
}

export function LessonCard({ title, type, estimatedDurationSeconds, language, onPress }: LessonCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[type] + '20' }]}>
          <Text style={[styles.typeLabel, { color: TYPE_COLORS[type] }]}>{TYPE_LABELS[type]}</Text>
        </View>
        <Text style={styles.duration}>{formatDuration(estimatedDurationSeconds)}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.language}>{language.toUpperCase()}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  typeLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  duration: { fontSize: 12, color: '#888888' },
  title: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  language: { fontSize: 11, color: '#AAAAAA', letterSpacing: 0.5 },
})
