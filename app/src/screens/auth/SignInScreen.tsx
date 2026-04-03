import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { ScrollTemplate } from '../../templates/ScrollTemplate'
import { signIn } from '../../services/auth'
import { isValidEmail } from '../../utils/validators'

export function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignIn() {
    setError(null)
    if (!isValidEmail(email)) { setError('Please enter a valid email'); return }
    if (!password) { setError('Please enter your password'); return }

    setIsLoading(true)
    try {
      await signIn(email, password)
      router.replace('/(tabs)')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollTemplate>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Welcome back</Text>

        <View style={styles.fields}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry
              autoComplete="current-password"
            />
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.buttonLabel}>Sign in</Text>
          }
        </TouchableOpacity>
      </View>
    </ScrollTemplate>
  )
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  back: { marginBottom: 4 },
  backText: { fontSize: 24, color: '#1A1A1A' },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A' },
  fields: { gap: 16 },
  field: { gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: '#444444' },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
  },
  error: { fontSize: 14, color: '#E05252', textAlign: 'center' },
  button: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#AAAAAA' },
  buttonLabel: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
})
