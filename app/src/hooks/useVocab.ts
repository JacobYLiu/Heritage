import { useState, useEffect, useCallback } from 'react'
import { VocabEntry } from '../types'
import { useUserStore } from '../stores/userStore'
import { getSupabaseClient } from '../services/supabase'
import { error as logError } from '../utils/logger'

interface VocabState {
  entries: VocabEntry[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  setSearchQuery: (q: string) => void
  filteredEntries: VocabEntry[]
  updatePersonalNote: (id: string, note: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useVocab(): VocabState {
  const { profile } = useUserStore()
  const [entries, setEntries] = useState<VocabEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchEntries = useCallback(async () => {
    if (!profile) return
    setIsLoading(true)
    setError(null)
    try {
      const supabase = await getSupabaseClient()
      const { data, error: dbError } = await supabase
        .from('vocab_entries')
        .select('*')
        .eq('user_id', profile.id)
        .eq('language', profile.selectedLanguage)
        .order('seen_at', { ascending: false })

      if (dbError) throw dbError

      type RawRow = {
        id: string; user_id: string; language: string; script: string
        romanization: string; meaning: string; audio_url: string
        example_sentence: string; example_translation: string; context_note: string
        personal_note: string | null; seen_at: string; source: string
      }
      const mapped: VocabEntry[] = ((data ?? []) as RawRow[]).map((row) => ({
        id: row.id,
        userId: row.user_id,
        language: row.language as VocabEntry['language'],
        script: row.script,
        romanization: row.romanization,
        meaning: row.meaning,
        audioUrl: row.audio_url,
        exampleSentence: row.example_sentence,
        exampleTranslation: row.example_translation,
        contextNote: row.context_note,
        personalNote: row.personal_note,
        seenAt: new Date(row.seen_at),
        source: row.source as VocabEntry['source'],
      }))

      setEntries(mapped)
    } catch (err) {
      logError('Failed to fetch vocab entries', err)
      setError('Could not load vocabulary')
    } finally {
      setIsLoading(false)
    }
  }, [profile])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const filteredEntries = entries.filter((e) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      e.script.toLowerCase().includes(q) ||
      e.romanization.toLowerCase().includes(q) ||
      e.meaning.toLowerCase().includes(q)
    )
  })

  async function updatePersonalNote(id: string, note: string) {
    try {
      const supabase = await getSupabaseClient()
      const { error: dbError } = await supabase
        .from('vocab_entries')
        .update({ personal_note: note })
        .eq('id', id)
      if (dbError) throw dbError
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, personalNote: note } : e))
      )
    } catch (err) {
      logError('Failed to update personal note', err)
    }
  }

  return {
    entries,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filteredEntries,
    updatePersonalNote,
    refresh: fetchEntries,
  }
}
