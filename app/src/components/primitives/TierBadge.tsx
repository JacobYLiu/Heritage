import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface TierBadgeProps {
  tier: 1 | 2 | 3
}

const TIER_COLORS = { 1: '#6ABF87', 2: '#E8C05E', 3: '#E87C5E' }
const TIER_LABELS = { 1: 'Tier 1', 2: 'Tier 2', 3: 'Tier 3' }

export function TierBadge({ tier }: TierBadgeProps) {
  const color = TIER_COLORS[tier]
  return (
    <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color + '40' }]}>
      <Text style={[styles.label, { color }]}>{TIER_LABELS[tier]}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },
})
