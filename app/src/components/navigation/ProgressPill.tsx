import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface ProgressPillProps {
  current: number
  total: number
}

export function ProgressPill({ current, total }: ProgressPillProps) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>Turn {current} of {total}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'center',
  },
  text: { fontSize: 13, color: '#444444', fontWeight: '500' },
})
