import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { SupportedLanguage } from '../../types'
import { getAppSubtitle } from '../../utils/appName'

interface LanguageCardProps {
  language: SupportedLanguage
  nativeName: string
  isSelected: boolean
  onPress: () => void
}

export function LanguageCard({ language, nativeName, isSelected, onPress }: LanguageCardProps) {
  const subtitle = getAppSubtitle(language)
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.nativeName, isSelected && styles.textSelected]}>{nativeName}</Text>
      <View style={styles.subtitleRow}>
        <Text style={[styles.subtitleScript, isSelected && styles.subtitleSelected]}>
          {subtitle.script}
        </Text>
        <Text style={[styles.subtitleRoman, isSelected && styles.subtitleSelected]}>
          {' · '}{subtitle.romanization}
        </Text>
      </View>
      <Text style={[styles.meaning, isSelected && styles.subtitleSelected]}>
        "{subtitle.meaning}"
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    padding: 20,
    gap: 4,
    backgroundColor: '#FAFAFA',
  },
  cardSelected: {
    borderColor: '#1A1A1A',
    backgroundColor: '#1A1A1A',
  },
  nativeName: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  textSelected: { color: '#FFFFFF' },
  subtitleRow: { flexDirection: 'row', alignItems: 'center' },
  subtitleScript: { fontSize: 15, color: '#444444' },
  subtitleRoman: { fontSize: 15, color: '#666666' },
  subtitleSelected: { color: '#CCCCCC' },
  meaning: { fontSize: 13, color: '#888888', fontStyle: 'italic' },
})
