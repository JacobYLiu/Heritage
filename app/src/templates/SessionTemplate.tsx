import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface SessionTemplateProps {
  children: React.ReactNode
  currentTurn?: number
  totalTurns?: number
  onExit: () => void
}

export function SessionTemplate({ children, currentTurn, totalTurns, onExit }: SessionTemplateProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {currentTurn !== undefined && totalTurns !== undefined ? (
          <Text style={styles.progress}>Turn {currentTurn} of {totalTurns}</Text>
        ) : (
          <View />
        )}
        <TouchableOpacity onPress={onExit} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.exitButton}>Exit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  progress: { fontSize: 14, color: '#666666' },
  exitButton: { fontSize: 14, color: '#666666', fontWeight: '500' },
  content: { flex: 1 },
})
