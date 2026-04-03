import { useEffect } from 'react'
import { router } from 'expo-router'
import { useUserStore } from '../src/stores/userStore'

export default function Index() {
  const { profile, isLoaded } = useUserStore()

  useEffect(() => {
    if (!isLoaded) return
    if (profile) {
      router.replace('/(tabs)')
    } else {
      router.replace('/(auth)/welcome')
    }
  }, [isLoaded, profile])

  return null
}
