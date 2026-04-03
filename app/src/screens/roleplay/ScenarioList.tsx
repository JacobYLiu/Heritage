import React from 'react'
import { View, Text, SectionList, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserStore } from '../../stores/userStore'
import { getScenariosByLanguage } from '../../constants/scenarios'
import { ScenarioCard } from '../../components/cards/ScenarioCard'
import { Scenario } from '../../types'

const TIER_LABELS = { 1: 'Daily Life', 2: 'Family Events', 3: 'Deep Conversations' }

export function ScenarioList() {
  const { profile } = useUserStore()
  if (!profile) return null

  const scenarios = getScenariosByLanguage(profile.selectedLanguage)

  const sections = ([1, 2, 3] as const).map(tier => ({
    title: `Tier ${tier} — ${TIER_LABELS[tier]}`,
    data: scenarios.filter((s): s is Scenario => s.tier === tier),
  }))

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Roleplay</Text>
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionTitle}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <ScenarioCard
              scenario={item}
              onPress={() =>
                router.push({ pathname: '/(modal)/scenario-intro', params: { scenarioId: item.id } })
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#888888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginTop: 4 },
  separator: { height: 10 },
  sectionSeparator: { height: 20 },
})
