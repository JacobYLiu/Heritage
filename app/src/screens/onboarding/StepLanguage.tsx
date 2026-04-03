import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SupportedLanguage } from '../../types'
import { LanguageCard } from '../../components/inputs/LanguageCard'

interface StepLanguageProps {
  selected: SupportedLanguage | null
  onSelect: (language: SupportedLanguage) => void
}

const LANGUAGES: { language: SupportedLanguage; nativeName: string }[] = [
  { language: 'zh', nativeName: 'Chinese' },
  { language: 'ja', nativeName: 'Japanese' },
  { language: 'ko', nativeName: 'Korean' },
]

export function StepLanguage({ selected, onSelect }: StepLanguageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>Which language are you learning?</Text>
      <View style={styles.cards}>
        {LANGUAGES.map(({ language, nativeName }) => (
          <LanguageCard
            key={language}
            language={language}
            nativeName={nativeName}
            isSelected={selected === language}
            onPress={() => onSelect(language)}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 24, paddingTop: 16 },
  question: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', lineHeight: 32 },
  cards: { gap: 12 },
})
