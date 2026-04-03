import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface MetricCardProps {
  label: string
  value: string
  context?: string
}

export function MetricCard({ label, value, context }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {context ? <Text style={styles.context}>{context}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  label: { fontSize: 12, color: '#888888', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 22, fontWeight: '700', color: '#1A1A1A' },
  context: { fontSize: 13, color: '#666666' },
})
