import { useState, useEffect, useCallback } from 'react'
import { FlashCard, FSRSData } from '../types'
import { useUserStore } from '../stores/userStore'
import { useSessionStore } from '../stores/sessionStore'
import { scheduleCard, updateCard, getDueCards } from '../services/fsrs'
import { error as logError } from '../utils/logger'

const SESSION_SIZE = 10

interface DrillState {
  cards: FlashCard[]
  currentIndex: number
  currentCard: FlashCard | null
  isFlipped: boolean
  isLoading: boolean
  isSessionComplete: boolean
  error: string | null
  gotRate: number
  flip: () => void
  rate: (rating: NonNullable<FSRSData['lastRating']>) => Promise<void>
  markHeardAtHome: () => Promise<void>
}

export function useDrill(allCards: FlashCard[]): DrillState {
  const { profile } = useUserStore()
  const sessionStore = useSessionStore()
  const [cards, setCards] = useState<FlashCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gotCount, setGotCount] = useState(0)

  const buildQueue = useCallback(async () => {
    if (!profile) return
    setIsLoading(true)
    setError(null)
    try {
      const dueIds = await getDueCards(profile.id, profile.selectedLanguage, SESSION_SIZE)
      const dueSet = new Set(dueIds.map((d) => d.flashcardId))

      let queue = allCards.filter((c) => dueSet.has(c.id))

      // Merge persisted FSRS data from DB into cards
      queue = queue.map((card) => {
        const persisted = dueIds.find((d) => d.flashcardId === card.id)
        return persisted ? { ...card, fsrsData: persisted.fsrsData } : card
      })

      // Pad with new cards if queue is short
      if (queue.length < SESSION_SIZE) {
        const seen = new Set(queue.map((c) => c.id))
        const newCards = allCards.filter((c) => !seen.has(c.id))
        queue = [...queue, ...newCards.slice(0, SESSION_SIZE - queue.length)]
      }

      setCards(queue.slice(0, SESSION_SIZE))
      sessionStore.startSession('flashcard', profile.selectedLanguage)
    } catch (err) {
      logError('Failed to build drill queue', err)
      setError('Could not load flashcards')
    } finally {
      setIsLoading(false)
    }
  }, [profile, allCards]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { buildQueue() }, [buildQueue])

  function flip() {
    setIsFlipped(true)
  }

  async function rate(rating: NonNullable<FSRSData['lastRating']>) {
    if (!profile || !cards[currentIndex]) return

    const card = cards[currentIndex]
    const updatedFsrs = scheduleCard(rating, card.fsrsData)

    if (rating === 'good' || rating === 'easy') {
      sessionStore.incrementWordsGot()
      setGotCount((n) => n + 1)
    }
    sessionStore.incrementWordsEncountered()

    try {
      await updateCard(profile.id, card.id, card.language, updatedFsrs)
    } catch (err) {
      logError('Failed to save card rating', err)
    }

    const next = currentIndex + 1
    if (next >= cards.length) {
      setIsSessionComplete(true)
    } else {
      setCurrentIndex(next)
      setIsFlipped(false)
    }
  }

  async function markHeardAtHome() {
    if (!profile || !cards[currentIndex]) return
    try {
      const { getSupabaseClient } = await import('../services/supabase')
      const supabase = await getSupabaseClient()
      await supabase.from('flashcard_progress').upsert({
        user_id: profile.id,
        flashcard_id: cards[currentIndex].id,
        language: cards[currentIndex].language,
        heard_at_home: true,
      })
    } catch (err) {
      logError('Failed to mark heard at home', err)
    }
  }

  const gotRate = cards.length > 0 ? gotCount / cards.length : 0

  return {
    cards,
    currentIndex,
    currentCard: cards[currentIndex] ?? null,
    isFlipped,
    isLoading,
    isSessionComplete,
    error,
    gotRate,
    flip,
    rate,
    markHeardAtHome,
  }
}
