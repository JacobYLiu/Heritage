import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'

type MicState = 'idle' | 'recording' | 'processing'

interface MicButtonProps {
  state: MicState
  onPressIn: () => void
  onPressOut: () => void
}

const STATE_LABELS: Record<MicState, string> = {
  idle: '🎙',
  recording: '⏹',
  processing: '',
}

const STATE_COLORS: Record<MicState, string> = {
  idle: '#1A1A1A',
  recording: '#E05252',
  processing: '#888888',
}

export function MicButton({ state, onPressIn, onPressOut }: MicButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: STATE_COLORS[state] }]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={state === 'processing'}
      activeOpacity={0.8}
    >
      {state === 'processing'
        ? <ActivityIndicator color="#FFFFFF" />
        : <Text style={styles.icon}>{STATE_LABELS[state]}</Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  icon: { fontSize: 28 },
})
