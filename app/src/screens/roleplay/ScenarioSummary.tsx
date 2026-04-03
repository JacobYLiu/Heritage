import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VocabEntry, SessionMetrics } from '../../types'
import { MetricCard } from '../../components/feedback/MetricCard'
import { VocabRow } from '../../components/cards/VocabRow'
import { generateSessionInsight } from '../../services/claude'

interface ScenarioSummaryProps {
  metrics: SessionMetrics
  turnsCompleted: number
  totalTurns: number
  vocabEncountered: VocabEntry[]
  onVocabPress: (entry: VocabEntry) => void
}

export function ScenarioSummary({
  metrics,
  turnsCompleted,
  totalTurns,
  vocabEncountered,
  onVocabPress,
}: ScenarioSummaryProps) {
  const [insight, setInsight] = useState<string | null>(null)

  useEffect(() => {
    generateSessionInsight(metrics, vocabEncountered, metrics.language)
      .then(setInsight)
      .catch(() => setInsight('Every conversation brings you closer. You did something real today.'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const confidenceLabel =
    metrics.speakingConfidence >= 70 ? 'Strong session'
    : metrics.speakingConfidence >= 40 ? 'Building confidence'
    : 'Keep going — every turn counts'

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Conversation done</Text>
        {/* Never penalize early exit */}
        <Text style={styles.turnsLabel}>
          {turnsCompleted} of {totalTurns} turns completed
        </Text>

        <View style={styles.metricsGrid}>
          <MetricCard label="Speaking confidence" value={confidenceLabel} />
          {metrics.newVocabCount > 0 && (
            <MetricCard
              label="New vocabulary"
              value={String(metrics.newVocabCount)}
              context="Added to your vocab list"
            />
          )}
          <MetricCard label="Time" value={`${Math.round(metrics.durationSeconds / 60)} min`} />
        </View>

        {/* Claude insight */}
        <View style={styles.insightBlock}>
          {insight
            ? <Text style={styles.insightText}>{insight}</Text>
            : <ActivityIndicator size="small" color="#888888" />
          }
        </View>

        {/* Vocab list */}
        {vocabEncountered.length > 0 && (
          <View style={styles.vocabSection}>
            <Text style={styles.sectionTitle}>Words from this conversation</Text>
            {vocabEncountered.map(entry => (
              <VocabRow
                key={entry.id}
                entry={entry}
                onPress={() => onVocabPress(entry)}
                onAudioPress={() => {/* audio playback */}}
              />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.doneButton} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.doneLabel}>Done</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 20 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A' },
  turnsLabel: { fontSize: 15, color: '#666666' },
  metricsGrid: { gap: 10 },
  insightBlock: { backgroundColor: '#F8F8F8', borderRadius: 14, padding: 18, minHeight: 64, justifyContent: 'center' },
  insightText: { fontSize: 15, color: '#444444', lineHeight: 22, fontStyle: 'italic' },
  vocabSection: { gap: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  doneButton: { backgroundColor: '#1A1A1A', borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  doneLabel: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
})
