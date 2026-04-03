import React, { useEffect, useRef } from 'react'
import { Animated, Text, StyleSheet } from 'react-native'

interface VocabChipProps {
  word: string
  onDismiss: () => void
  durationMs?: number
}

export function VocabChip({ word, onDismiss, durationMs = 3000 }: VocabChipProps) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(durationMs - 400),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onDismiss())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View style={[styles.chip, { opacity }]}>
      <Text style={styles.label}>New word: {word}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  chip: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(26,26,26,0.85)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: { color: '#FFFFFF', fontSize: 14, fontWeight: '500' },
})
