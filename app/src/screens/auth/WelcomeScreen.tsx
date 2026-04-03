import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { BaseTemplate } from '../../templates/BaseTemplate'

export function WelcomeScreen() {
  return (
    <BaseTemplate>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.appName}>Heritage</Text>
          <Text style={styles.tagline}>Connect with the language{'\n'}of your family</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={styles.primaryLabel}>Get started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)/sign-in')}>
            <Text style={styles.secondaryLabel}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseTemplate>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 48 },
  hero: { flex: 1, justifyContent: 'center', gap: 16 },
  appName: { fontSize: 48, fontWeight: '700', color: '#1A1A1A', letterSpacing: -1 },
  tagline: { fontSize: 22, color: '#444444', lineHeight: 30 },
  actions: { gap: 12 },
  primaryButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryLabel: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryLabel: { fontSize: 16, color: '#666666' },
})
