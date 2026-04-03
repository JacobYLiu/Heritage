import { create } from 'zustand'
import { VocabEntry, SessionMetrics, SupportedLanguage } from '../types'

interface SessionState {
  sessionType: SessionMetrics['sessionType'] | null
  language: SupportedLanguage | null
  startTime: Date | null
  vocabEncountered: VocabEntry[]
  wordsEncountered: number
  wordsMarkedGot: number
  listeningAccuracy: number
  speakingConfidence: number

  startSession: (type: SessionMetrics['sessionType'], language: SupportedLanguage) => void
  addVocab: (entry: VocabEntry) => void
  incrementWordsEncountered: () => void
  incrementWordsGot: () => void
  setListeningAccuracy: (accuracy: number) => void
  setSpeakingConfidence: (confidence: number) => void
  clearSession: () => void
}

const EMPTY_STATE: Pick<SessionState, 'sessionType' | 'language' | 'startTime' | 'vocabEncountered' | 'wordsEncountered' | 'wordsMarkedGot' | 'listeningAccuracy' | 'speakingConfidence'> = {
  sessionType: null,
  language: null,
  startTime: null,
  vocabEncountered: [],
  wordsEncountered: 0,
  wordsMarkedGot: 0,
  listeningAccuracy: 0,
  speakingConfidence: 0,
}

export const useSessionStore = create<SessionState>((set) => ({
  ...EMPTY_STATE,

  startSession: (type, language) =>
    set({ ...EMPTY_STATE, sessionType: type, language, startTime: new Date() }),

  addVocab: (entry) =>
    set((state) => ({ vocabEncountered: [...state.vocabEncountered, entry] })),

  incrementWordsEncountered: () =>
    set((state) => ({ wordsEncountered: state.wordsEncountered + 1 })),

  incrementWordsGot: () =>
    set((state) => ({ wordsMarkedGot: state.wordsMarkedGot + 1 })),

  setListeningAccuracy: (accuracy) => set({ listeningAccuracy: accuracy }),

  setSpeakingConfidence: (confidence) => set({ speakingConfidence: confidence }),

  clearSession: () => set({ ...EMPTY_STATE }),
}))
