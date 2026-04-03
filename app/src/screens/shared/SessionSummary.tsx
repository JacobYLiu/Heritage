import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SessionMetrics, VocabEntry } from '../../types'
import { MetricCard } from '../../components/feedback/MetricCard'
import { VocabRow } from '../../components/cards/VocabRow'
import { getSessionTip } from '../../utils/sessionTips'
import { formatDuration } from '../../utils/formatters'

interface SessionSummaryProps {
  metrics: SessionMetrics
  vocabEncountered: VocabEntry[]
  skillDeltaLabel?: string // e.g. "Your listening moved up today"
  onVocabPress: (entry: VocabEntry) => void
}

export function SessionSummary({ metrics, vocabEncountered, skillDeltaLabel, onVocabPress }: SessionSummaryProps) {
  const tip = getSessionTip(metrics, metrics.language)

  const isLongSession = metrics.durationSeconds >= 480

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Session done</Text>
        {skillDeltaLabel ? <Text style={styles.delta}>{skillDeltaLabel}</Text> : null}

        {/* Metrics grid */}
        <View style={styles.metricsGrid}>
          {metrics.sessionType === 'flashcard' && (
            <>
              <MetricCard
                label="Cards practiced"
                value={String(metrics.wordsEncountered)}
              />
              <MetricCard
                label="Felt familiar"
                value={`${metrics.wordsMarkedGot} of ${metrics.wordsEncountered}`}
                context={metrics.wordsMarkedGot === metrics.wordsEncountered ? 'All of them 🎉' : undefined}
              />
            </>
          )}

          {metrics.sessionType === 'listening' && (
            <>
              <MetricCard
                label="Comprehension"
                value={
                  metrics.listeningAccuracy === 0
                    ? 'Keep going'
                    : `${Math.round(metrics.listeningAccuracy)}%`
                }
                context={
                  metrics.listeningAccuracy === 0
                    ? 'This clip was a stretch — that\'s exactly what builds your ear.'
                    : undefined
                }
              />
            </>
          )}

          {metrics.sessionType === 'roleplay' && metrics.speakingConfidence > 0 && (
            <MetricCard
              label="Speaking confidence"
              value={
                metrics.speakingConfidence >= 70 ? 'Strong' :
                metrics.speakingConfidence >= 40 ? 'Building' : 'Keep going'
              }
            />
          )}

          <MetricCard
            label="Time spent"
            value={formatDuration(metrics.durationSeconds)}
          />

          {metrics.newVocabCount > 0 && (
            <MetricCard
              label="New vocabulary"
              value={String(metrics.newVocabCount)}
              context="Tap any word below to review"
            />
          )}
        </View>

        {/* Tip */}
        <View style={styles.tipBlock}>
          <Text style={styles.tipText}>{tip}</Text>
        </View>

        {/* New vocab list */}
        {vocabEncountered.length > 0 && (
          <View style={styles.vocabSection}>
            <Text style={styles.sectionTitle}>Words from this session</Text>
            {vocabEncountered.map((entry) => (
              <VocabRow
                key={entry.id}
                entry={entry}
                onPress={() => onVocabPress(entry)}
                onAudioPress={() => {/* audio playback */}}
              />
            ))}
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.ctaLabel}>{isLongSession ? 'Come back tomorrow' : 'Keep going'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A' },
  delta: { fontSize: 16, color: '#4A90D9', fontWeight: '500' },
  metricsGrid: { gap: 10 },
  tipBlock: {
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    padding: 18,
  },
  tipText: { fontSize: 15, color: '#444444', lineHeight: 22, fontStyle: 'italic' },
  vocabSection: { gap: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  ctaButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  ctaLabel: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
})
