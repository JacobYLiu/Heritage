import React, { useEffect, useRef } from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native'

interface FeedbackBannerProps {
  positive: string
  suggestion: string | null
  onDismiss: () => void
  durationMs?: number
}

export function FeedbackBanner({ positive, suggestion, onDismiss, durationMs = 4000 }: FeedbackBannerProps) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(durationMs - 500),
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => onDismiss())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View style={[styles.banner, { opacity }]}>
      <Text style={styles.positive}>{positive}</Text>
      {suggestion ? <Text style={styles.suggestion}>{suggestion}</Text> : null}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(26,26,26,0.90)',
    borderRadius: 14,
    padding: 16,
    gap: 4,
  },
  positive: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  suggestion: { fontSize: 13, color: '#CCCCCC' },
})
