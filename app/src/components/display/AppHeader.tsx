import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SupportedLanguage } from '../../types'
import { getAppSubtitle } from '../../utils/appName'

interface AppHeaderProps {
  language: SupportedLanguage
}

export function AppHeader({ language }: AppHeaderProps) {
  const subtitle = getAppSubtitle(language)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heritage</Text>
      <Text style={styles.subtitle}>{subtitle.script}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#666666', marginTop: 2 },
})
