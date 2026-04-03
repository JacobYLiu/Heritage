import { useState, useCallback } from 'react'
import { useUserStore } from '../stores/userStore'
import { useSessionStore } from '../stores/sessionStore'

interface ComprehensionQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

interface AudioClip {
  id: string
  uri: string
  durationSeconds: number
  questions: ComprehensionQuestion[]
}

interface ListeningState {
  clip: AudioClip | null
  isLoading: boolean
  questionIndex: number
  answers: (number | null)[]
  isComplete: boolean
  accuracy: number
  playbackSpeed: 0.75 | 1 | 1.25
  error: string | null
  loadClip: (clip: AudioClip) => void
  answerQuestion: (optionIndex: number) => void
  setPlaybackSpeed: (speed: 0.75 | 1 | 1.25) => void
}

export function useListening(): ListeningState {
  const { profile } = useUserStore()
  const sessionStore = useSessionStore()

  const [clip, setClip] = useState<AudioClip | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [accuracy, setAccuracy] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 1 | 1.25>(1)
  const [error, setError] = useState<string | null>(null)

  const loadClip = useCallback((newClip: AudioClip) => {
    if (!profile) return
    setIsLoading(true)
    setError(null)
    setClip(newClip)
    setQuestionIndex(0)
    setAnswers(new Array(newClip.questions.length).fill(null))
    setIsComplete(false)
    setAccuracy(0)
    sessionStore.startSession('listening', profile.selectedLanguage)
    setIsLoading(false)
  }, [profile, sessionStore])

  function answerQuestion(optionIndex: number) {
    if (!clip || isComplete) return

    const updated = [...answers]
    updated[questionIndex] = optionIndex
    setAnswers(updated)
    sessionStore.incrementWordsEncountered()

    const next = questionIndex + 1
    if (next >= clip.questions.length) {
      // Compute accuracy
      const correct = updated.filter((ans, i) => ans === clip.questions[i].correctIndex).length
      const pct = Math.round((correct / clip.questions.length) * 100)
      setAccuracy(pct)
      sessionStore.setListeningAccuracy(pct)
      setIsComplete(true)
    } else {
      setQuestionIndex(next)
    }
  }

  return {
    clip,
    isLoading,
    questionIndex,
    answers,
    isComplete,
    accuracy,
    playbackSpeed,
    error,
    loadClip,
    answerQuestion,
    setPlaybackSpeed,
  }
}
