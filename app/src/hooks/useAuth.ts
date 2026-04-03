import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { getSession, signOut, onAuthStateChange } from '../services/auth'
import { useUserStore } from '../stores/userStore'

interface AuthState {
  session: Session | null
  isLoading: boolean
  error: string | null
  logout: () => Promise<void>
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { clearProfile } = useUserStore()

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    async function init() {
      try {
        const initial = await getSession()
        setSession(initial)
      } catch {
        setError('Could not load session')
      } finally {
        setIsLoading(false)
      }

      try {
        unsubscribe = await onAuthStateChange((_event, newSession) => {
          setSession(newSession)
        })
      } catch {
        // Auth listener setup failed — non-fatal
      }
    }

    init()
    return () => { unsubscribe?.() }
  }, [])

  async function logout() {
    try {
      await signOut()
      await clearProfile()
    } catch {
      setError('Could not sign out')
    }
  }

  return { session, isLoading, error, logout }
}
