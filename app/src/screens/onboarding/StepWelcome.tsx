import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { UserProfile } from '../../types'
import { SkillBars } from '../../components/feedback/SkillBars'
import { seedSkillScore } from '../../utils/skillModelSeed'

interface StepWelcomeProps {
  name: string
  background: UserProfile['heritageBackground']
  level: UserProfile['selfReportedLevel']
  isSubmitting: boolean
  error: string | null
}

function getWelcomeMessage(
  background: UserProfile['heritageBackground'],
  level: UserProfile['selfReportedLevel']
): string {
  if (background === 'yes' && level === 'very') {
    return 'You already carry so much of this language. Let\'s help you bring it out.'
  }
  if (background === 'yes' && level === 'not-at-all') {
    return 'You understand more than you think. We\'ll find it together.'
  }
  if (background === 'no' && level === 'not-at-all') {
    return 'You\'re starting something new. We\'ll go at your pace.'
  }
  if (background === 'somewhat') {
    return 'You have more foundation than you realize. Let\'s build on it.'
  }
  return 'Your journey starts here. We\'ll meet you exactly where you are.'
}

export function StepWelcome({ name, background, level, isSubmitting, error }: StepWelcomeProps) {
  const skillScore = seedSkillScore(background, level)

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi, {name} 👋</Text>
      <Text style={styles.message}>{getWelcomeMessage(background, level)}</Text>

      <View style={styles.skillSection}>
        <Text style={styles.skillTitle}>Your starting profile</Text>
        <SkillBars skillScore={skillScore} />
        <Text style={styles.skillNote}>This will update automatically as you practice.</Text>
      </View>

      {isSubmitting && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#1A1A1A" />
          <Text style={styles.loadingText}>Setting up your profile…</Text>
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 24, paddingTop: 16 },
  greeting: { fontSize: 30, fontWeight: '700', color: '#1A1A1A' },
  message: { fontSize: 18, color: '#444444', lineHeight: 26 },
  skillSection: { gap: 12, backgroundColor: '#F8F8F8', borderRadius: 16, padding: 20 },
  skillTitle: { fontSize: 14, fontWeight: '600', color: '#888888', textTransform: 'uppercase', letterSpacing: 0.5 },
  skillNote: { fontSize: 12, color: '#AAAAAA', textAlign: 'center' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' },
  loadingText: { fontSize: 14, color: '#666666' },
  error: { fontSize: 14, color: '#E05252', textAlign: 'center' },
})
