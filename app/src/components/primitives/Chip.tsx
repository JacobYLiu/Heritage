import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'

interface ChipProps {
  label: string
  color?: string
  style?: ViewStyle
}

export function Chip({ label, color = '#666666', style }: ChipProps) {
  return (
    <View style={[styles.chip, { borderColor: color + '40', backgroundColor: color + '15' }, style]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: { fontSize: 12, fontWeight: '500' },
})
