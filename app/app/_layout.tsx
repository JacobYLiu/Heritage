import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useUserStore } from '../src/stores/userStore'
import { initSentry } from '../src/services/sentry'

// Initialize Sentry before the component tree mounts.
// No-op if EXPO_PUBLIC_SENTRY_DSN is not set or @sentry/react-native is not installed.
initSentry()

export default function RootLayout() {
  const { loadProfile } = useUserStore()

  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(modal)" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
