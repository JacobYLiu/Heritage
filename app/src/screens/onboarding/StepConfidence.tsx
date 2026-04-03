import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { UserProfile } from '../../types'

type Level = UserProfile['selfReportedLevel']

interface StepConfidenceProps {
  selected: Level | null
  onSelect: (value: Level) => void
}

const OPTIONS: { value: Level; label: string; sublabel: string }[] = [
  { value: 'very', label: 'Very comfortable', sublabel: 'I can hold a basic conversation' },
  { value: 'a-little', label: 'A little', sublabel: 'I know some words and phrases' },
  { value: 'not-at-all', label: 'Not at all', sublabel: 'I mostly understand but struggle to speak' },
]

export function StepConfidence({ selected, onSelect }: StepConfidenceProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>How comfortable do you feel speaking it today?</Text>
      <View style={styles.options}>
        {OPTIONS.map(({ value, label, sublabel }) => (
          <TouchableOpacity
            key={value}
            style={[styles.option, selected === value && styles.optionSelected]}
            onPress={() => onSelect(value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionLabel, selected === value && styles.optionLabelSelected]}>
              {label}
            </Text>
            <Text style={[styles.sublabel, selected === value && styles.sublabelSelected]}>
              {sublabel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 28, paddingTop: 16 },
  question: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', lineHeight: 32 },
  options: { gap: 12 },
  option: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
    gap: 4,
  },
  optionSelected: { borderColor: '#1A1A1A', backgroundColor: '#1A1A1A' },
  optionLabel: { fontSize: 17, color: '#1A1A1A', fontWeight: '500' },
  optionLabelSelected: { color: '#FFFFFF' },
  sublabel: { fontSize: 13, color: '#888888' },
  sublabelSelected: { color: '#AAAAAA' },
})
