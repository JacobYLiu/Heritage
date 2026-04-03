import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { ScrollTemplate } from '../../templates/ScrollTemplate'
import { signUp } from '../../services/auth'
import { isValidEmail, isValidAge, isStrongPassword } from '../../utils/validators'

export function SignUpScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignUp() {
    setError(null)

    if (!name.trim()) { setError('Please enter your name'); return }
    if (!isValidEmail(email)) { setError('Please enter a valid email'); return }
    if (!isStrongPassword(password)) { setError('Password must be at least 8 characters'); return }

    const dob = new Date(dateOfBirth)
    if (isNaN(dob.getTime())) { setError('Please enter a valid date of birth (YYYY-MM-DD)'); return }
    if (!isValidAge(dob)) { setError('You must be at least 13 years old to use Heritage'); return }

    setIsLoading(true)
    try {
      await signUp(email, password, name.trim())
      router.replace('/(onboarding)/setup')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.')
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

        <Text style={styles.title}>Create account</Text>

        <View style={styles.fields}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your first name"
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

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
              placeholder="At least 8 characters"
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Date of birth</Text>
            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
            />
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.buttonLabel}>Create account</Text>
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
