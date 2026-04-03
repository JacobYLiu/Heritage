import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface StreakDotsProps {
  activeDays: Set<number> // 0 = Mon, 6 = Sun — day indices with activity
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function StreakDots({ activeDays }: StreakDotsProps) {
  return (
    <View style={styles.container}>
      {DAY_LABELS.map((label, i) => (
        <View key={i} style={styles.dayColumn}>
          <View style={[styles.dot, activeDays.has(i) && styles.dotActive]} />
          <Text style={styles.dayLabel}>{label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  dayColumn: { alignItems: 'center', gap: 4 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  dotActive: { backgroundColor: '#1A1A1A' },
  dayLabel: { fontSize: 11, color: '#AAAAAA' },
})
