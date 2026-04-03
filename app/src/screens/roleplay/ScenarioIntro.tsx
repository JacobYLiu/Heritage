import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Scenario } from '../../types'
import { TierBadge } from '../../components/primitives/TierBadge'

interface ScenarioIntroProps {
  scenario: Scenario
}

export function ScenarioIntro({ scenario }: ScenarioIntroProps) {
  const isTier3 = scenario.tier === 3

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <TierBadge tier={scenario.tier} />
          <Text style={styles.turns}>{scenario.turns} turns</Text>
        </View>

        <Text style={styles.title}>{scenario.title}</Text>
        <Text style={styles.description}>{scenario.description}</Text>

        <View style={styles.contextBlock}>
          <Text style={styles.contextLabel}>Cultural context</Text>
          <Text style={styles.contextText}>{scenario.culturalContext}</Text>
        </View>

        <View style={styles.vocabBlock}>
          <Text style={styles.contextLabel}>You might encounter</Text>
          <Text style={styles.vocabList}>{scenario.vocabTargets.join(' · ')}</Text>
        </View>

        {isTier3 && (
          <View style={styles.noticeBanner}>
            <Text style={styles.noticeText}>
              This scenario can touch on personal topics. Go at your own pace.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.startButton}
          onPress={() =>
            router.replace({ pathname: '/(modal)/roleplay-session', params: { scenarioId: scenario.id } })
          }
        >
          <Text style={styles.startLabel}>Start conversation</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, gap: 20 },
  back: { marginBottom: 4 },
  backText: { fontSize: 24, color: '#1A1A1A' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  turns: { fontSize: 13, color: '#888888' },
  title: { fontSize: 26, fontWeight: '700', color: '#1A1A1A' },
  description: { fontSize: 16, color: '#444444', lineHeight: 24 },
  contextBlock: { backgroundColor: '#F8F8F8', borderRadius: 12, padding: 16, gap: 6 },
  contextLabel: { fontSize: 12, fontWeight: '600', color: '#888888', textTransform: 'uppercase', letterSpacing: 0.5 },
  contextText: { fontSize: 14, color: '#444444', lineHeight: 20 },
  vocabBlock: { gap: 6 },
  vocabList: { fontSize: 16, color: '#1A1A1A', lineHeight: 24 },
  noticeBanner: { backgroundColor: '#FFF8E8', borderRadius: 12, padding: 14, borderLeftWidth: 3, borderLeftColor: '#E8C05E' },
  noticeText: { fontSize: 14, color: '#666600', lineHeight: 20 },
  startButton: { backgroundColor: '#1A1A1A', borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginTop: 8 },
  startLabel: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
})
