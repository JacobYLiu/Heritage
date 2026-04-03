import { FSRSData, FlashCard } from '../types'
import { AppError } from '../types/errors'
import { getSupabaseClient } from './supabase'

// FSRS-4 simplified implementation.
// Stability (S): days until 90% retention. Difficulty (D): 0–1.

const INITIAL_STABILITY: Record<FSRSData['lastRating'] & string, number> = {
  again: 0.4,
  hard: 1.0,
  good: 2.5,
  easy: 6.0,
}

const DIFFICULTY_DELTA: Record<FSRSData['lastRating'] & string, number> = {
  again: 0.2,
  hard: 0.1,
  good: 0,
  easy: -0.1,
}

function nextInterval(stability: number): number {
  // I = S × ln(0.9) / ln(R) where target R = 0.9
  return Math.max(1, Math.round(stability))
}

export function scheduleCard(rating: NonNullable<FSRSData['lastRating']>, current: FSRSData): FSRSData {
  const isNew = current.lastRating === null
  const newDifficulty = Math.max(0.1, Math.min(1, current.difficulty + DIFFICULTY_DELTA[rating]))

  let newStability: number
  if (isNew) {
    newStability = INITIAL_STABILITY[rating]
  } else {
    if (rating === 'again') {
      newStability = current.stability * 0.2
    } else {
      const multiplier = rating === 'hard' ? 1.2 : rating === 'good' ? 2.0 : 3.0
      newStability = current.stability * multiplier * (1 - newDifficulty * 0.3)
    }
  }

  newStability = Math.max(0.1, newStability)
  const intervalDays = nextInterval(newStability)
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays)

  return {
    stability: newStability,
    difficulty: newDifficulty,
    nextReviewDate,
    lastRating: rating,
  }
}

export async function updateCard(
  userId: string,
  flashcardId: string,
  language: FlashCard['language'],
  fsrsData: FSRSData
): Promise<void> {
  try {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.from('flashcard_progress').upsert({
      user_id: userId,
      flashcard_id: flashcardId,
      language,
      stability: fsrsData.stability,
      difficulty: fsrsData.difficulty,
      next_review_date: fsrsData.nextReviewDate,
      last_rating: fsrsData.lastRating,
    })
    if (error) throw error
  } catch (err) {
    throw new AppError('SUPABASE_WRITE_FAILED', `Failed to update flashcard progress: ${err}`)
  }
}

export async function getDueCards(
  userId: string,
  language: FlashCard['language'],
  limit = 10
): Promise<{ flashcardId: string; fsrsData: FSRSData }[]> {
  try {
    const supabase = await getSupabaseClient()
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('flashcard_progress')
      .select('flashcard_id, stability, difficulty, next_review_date, last_rating')
      .eq('user_id', userId)
      .eq('language', language)
      .lte('next_review_date', now)
      .order('next_review_date', { ascending: true })
      .limit(limit)

    if (error) throw error

    return (data ?? []).map((row) => ({
      flashcardId: row.flashcard_id as string,
      fsrsData: {
        stability: row.stability as number,
        difficulty: row.difficulty as number,
        nextReviewDate: new Date(row.next_review_date as string),
        lastRating: row.last_rating as FSRSData['lastRating'],
      },
    }))
  } catch (err) {
    throw new AppError('SUPABASE_QUERY_FAILED', `Failed to fetch due cards: ${err}`)
  }
}
