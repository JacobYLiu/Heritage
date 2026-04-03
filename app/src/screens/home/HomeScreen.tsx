import React, { useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserStore } from '../../stores/userStore'
import { AppHeader } from '../../components/display/AppHeader'
import { StreakDots } from '../../components/navigation/StreakDots'
import { LessonCard } from '../../components/cards/LessonCard'
import { SkillBars } from '../../components/feedback/SkillBars'
import { getRecommendedContent } from '../../utils/skillModel'

const LANGUAGE_GREETINGS: Record<string, string> = {
  zh: '你好',
  ja: 'こんにちは',
  ko: '안녕하세요',
}

function getAffirmingSubtitle(skillScore: { listening: number; speaking: number; reading: number; writing: number }): string {
  const max = Math.max(skillScore.listening, skillScore.speaking, skillScore.reading, skillScore.writing)
  if (max === skillScore.listening) return 'Your ear is your strength.'
  if (max === skillScore.speaking) return 'You speak with confidence.'
  if (max === skillScore.reading) return 'You read well in this language.'
  return 'Your foundation is solid.'
}

// Build a Set of active day indices (0=Mon…6=Sun) based on session history.
// For now this returns a placeholder — real data comes from session_metrics.
function getActiveDays(): Set<number> {
  const today = new Date().getDay() // 0=Sun…6=Sat
  // Shift to Mon-indexed: Mon=0, Sun=6
  const monIndex = today === 0 ? 6 : today - 1
  return new Set([monIndex])
}

export function HomeScreen() {
  const { profile } = useUserStore()

  const recommendations = useMemo(() => {
    if (!profile) return []
    return getRecommendedContent(profile.skillScores, profile.selectedLanguage)
  }, [profile])

  if (!profile) return null

  const greeting = LANGUAGE_GREETINGS[profile.selectedLanguage]
  const activeDays = getActiveDays()

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <AppHeader language={profile.selectedLanguage} />

        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>{greeting}, {profile.name}</Text>
          <Text style={styles.affirmation}>{getAffirmingSubtitle(profile.skillScores)}</Text>
        </View>

        <StreakDots activeDays={activeDays} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <View style={styles.cards}>
            {recommendations.map((rec) => (
              <LessonCard
                key={rec.id}
                title={rec.title}
                type={rec.type}
                estimatedDurationSeconds={rec.estimatedDurationSeconds}
                language={rec.language}
                onPress={() => {
                  if (rec.type === 'flashcard') router.push('/(tabs)/drill')
                  else if (rec.type === 'listening') router.push('/(tabs)/drill')
                  else router.push('/(tabs)/roleplay')
                }}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.skillSection} onPress={() => router.push('/(modal)/skill-profile')} activeOpacity={0.8}>
          <View style={styles.skillSectionHeader}>
            <Text style={styles.sectionTitle}>Your skills</Text>
            <Text style={styles.seeAll}>View profile ›</Text>
          </View>
          <SkillBars skillScore={profile.skillScores} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.honorificsRow}
          onPress={() => router.push('/(modal)/honorifics')}
          activeOpacity={0.7}
        >
          <View style={styles.honorificsText}>
            <Text style={styles.honorificsTitle}>Honorifics & Family Terms</Text>
            <Text style={styles.honorificsSubtitle}>Address terms, suffixes & speech levels</Text>
          </View>
          <Text style={styles.honorificsArrow}>›</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40, gap: 24 },
  greetingBlock: { gap: 4 },
  greeting: { fontSize: 26, fontWeight: '700', color: '#1A1A1A' },
  affirmation: { fontSize: 16, color: '#666666' },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  cards: { gap: 10 },
  skillSection: { gap: 12 },
  skillSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { fontSize: 13, color: '#888888' },
  honorificsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  honorificsText: { flex: 1, gap: 2 },
  honorificsTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  honorificsSubtitle: { fontSize: 13, color: '#888888' },
  honorificsArrow: { fontSize: 22, color: '#AAAAAA', fontWeight: '300' },
})
