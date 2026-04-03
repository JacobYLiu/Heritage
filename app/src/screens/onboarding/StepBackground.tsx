import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { UserProfile, SupportedLanguage } from '../../types'
import { getAppSubtitle } from '../../utils/appName'

type Background = UserProfile['heritageBackground']

interface StepBackgroundProps {
  language: SupportedLanguage
  selected: Background | null
  onSelect: (value: Background) => void
}

const OPTIONS: { value: Background; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'somewhat', label: 'Somewhat' },
  { value: 'no', label: 'No' },
]

export function StepBackground({ language, selected, onSelect }: StepBackgroundProps) {
  const subtitle = getAppSubtitle(language)
  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        Have you grown up hearing {subtitle.meaning} at home?
      </Text>
      <View style={styles.options}>
        {OPTIONS.map(({ value, label }) => (
          <TouchableOpacity
            key={value}
            style={[styles.option, selected === value && styles.optionSelected]}
            onPress={() => onSelect(value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionLabel, selected === value && styles.optionLabelSelected]}>
              {label}
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
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
  },
  optionSelected: { borderColor: '#1A1A1A', backgroundColor: '#1A1A1A' },
  optionLabel: { fontSize: 17, color: '#1A1A1A', fontWeight: '500' },
  optionLabelSelected: { color: '#FFFFFF' },
})
