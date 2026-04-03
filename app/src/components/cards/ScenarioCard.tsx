import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { Scenario } from '../../types'
import { TierBadge } from '../primitives/TierBadge'

interface ScenarioCardProps {
  scenario: Scenario
  onPress: () => void
}

export function ScenarioCard({ scenario, onPress }: ScenarioCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <TierBadge tier={scenario.tier} />
        <Text style={styles.turns}>{scenario.turns} turns</Text>
      </View>
      <Text style={styles.title}>{scenario.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{scenario.description}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  turns: { fontSize: 12, color: '#888888' },
  title: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
  description: { fontSize: 13, color: '#666666', lineHeight: 18 },
})
