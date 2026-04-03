import { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { getSupabaseClient } from './supabase'
import { AppError } from '../types/errors'

export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<void> {
  try {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw new AppError('AUTH_FAILED', error.message)
  } catch (err) {
    if (err instanceof AppError) throw err
    throw new AppError('AUTH_FAILED', 'Sign up failed')
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  try {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new AppError('AUTH_FAILED', error.message)
  } catch (err) {
    if (err instanceof AppError) throw err
    throw new AppError('AUTH_FAILED', 'Sign in failed')
  }
}

export async function signOut(): Promise<void> {
  try {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new AppError('AUTH_FAILED', error.message)
  } catch (err) {
    if (err instanceof AppError) throw err
    throw new AppError('AUTH_FAILED', 'Sign out failed')
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.auth.getSession()
    if (error) throw new AppError('AUTH_SESSION_EXPIRED', error.message)
    return data.session
  } catch (err) {
    if (err instanceof AppError) throw err
    throw new AppError('AUTH_SESSION_EXPIRED', 'Could not retrieve session')
  }
}

export async function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): Promise<() => void> {
  const supabase = await getSupabaseClient()
  const { data } = supabase.auth.onAuthStateChange(callback)
  return () => data.subscription.unsubscribe()
}
