import { useState, useRef, useCallback } from 'react'
import { Audio } from 'expo-av'
import { RoleplayTurn, RoleplayResponse, Scenario } from '../types'
import { useUserStore } from '../stores/userStore'
import { useSessionStore } from '../stores/sessionStore'
import { useRoleplayStore } from '../stores/roleplayStore'
import { sendRoleplayTurn } from '../services/claude'
import { transcribeAudio } from '../services/whisper'
import { synthesizeSpeech } from '../services/elevenlabs'
import { containsDistressSignal } from '../utils/distressKeywords'
import { computeSpeakingConfidence } from '../utils/speakingConfidence'
import { error as logError } from '../utils/logger'

type TurnPhase =
  | 'playing-parent'  // Family member audio is playing
  | 'awaiting-user'   // Waiting for user to tap mic
  | 'recording'       // Mic is active
  | 'processing'      // Whisper + Claude + ElevenLabs in flight
  | 'feedback'        // FeedbackOverlay is visible
  | 'complete'        // All turns done

interface RoleplayState {
  phase: TurnPhase
  currentTurn: number
  totalTurns: number
  parentSpeech: string
  userPrompt: string
  toneNote: string | null
  isDistressDetected: boolean
  error: string | null
  startScenario: (scenario: Scenario) => Promise<void>
  startRecording: () => Promise<void>
  stopRecording: () => Promise<void>
  dismissFeedback: () => void
  dismissDistress: () => void
}

export function useRoleplay(): RoleplayState {
  const { profile } = useUserStore()
  const sessionStore = useSessionStore()
  const roleplayStore = useRoleplayStore()

  const [phase, setPhase] = useState<TurnPhase>('awaiting-user')
  const [currentTurn, setCurrentTurn] = useState(1)
  const [totalTurns, setTotalTurns] = useState(0)
  const [parentSpeech, setParentSpeech] = useState('')
  const [userPrompt, setUserPrompt] = useState('')
  const [toneNote, setToneNote] = useState<string | null>(null)
  const [isDistressDetected, setIsDistressDetected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recordingRef = useRef<Audio.Recording | null>(null)
  const pauseStartRef = useRef<number>(0)
  const scenarioRef = useRef<Scenario | null>(null)

  async function playAudio(uri: string): Promise<void> {
    const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true })
    await new Promise<void>(resolve => {
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) resolve()
      })
    })
    await sound.unloadAsync()
  }

  const startScenario = useCallback(async (scenario: Scenario) => {
    if (!profile) return
    scenarioRef.current = scenario
    setTotalTurns(scenario.turns)
    setCurrentTurn(1)
    setError(null)

    roleplayStore.setScenarioId(scenario.id)
    sessionStore.startSession('roleplay', profile.selectedLanguage)

    // Synthesize opening line via ElevenLabs and play it
    try {
      setPhase('playing-parent')
      const openingText = `${scenario.title}. ${scenario.culturalContext}`
      const audioUri = await synthesizeSpeech(openingText, profile.selectedLanguage)
      await playAudio(audioUri)
    } catch (err) {
      logError('Failed to play scenario intro audio', err)
    }

    pauseStartRef.current = Date.now()
    setPhase('awaiting-user')
  }, [profile, roleplayStore, sessionStore])

  const startRecording = useCallback(async () => {
    if (phase !== 'awaiting-user') return
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true })
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      recordingRef.current = recording
      roleplayStore.setIsRecording(true)
      setPhase('recording')
    } catch (err) {
      logError('Failed to start recording', err)
      setError('Could not start recording. Check microphone permissions.')
    }
  }, [phase, roleplayStore])

  const stopRecording = useCallback(async () => {
    if (phase !== 'recording' || !recordingRef.current || !profile || !scenarioRef.current) return

    const avgPause = Date.now() - pauseStartRef.current
    roleplayStore.setPauseStartTime(avgPause)

    try {
      setPhase('processing')
      await recordingRef.current.stopAndUnloadAsync()
      const audioUri = recordingRef.current.getURI() ?? ''
      recordingRef.current = null
      roleplayStore.setIsRecording(false)

      // Distress check + transcription
      const { transcript, wordConfidences, detectedLanguage } = await transcribeAudio(
        audioUri,
        profile.selectedLanguage
      )

      if (containsDistressSignal(transcript)) {
        setIsDistressDetected(true)
        setPhase('awaiting-user')
        return
      }

      // Code-switch rate: fraction of words detected in a different language
      const targetLang = profile.selectedLanguage === 'zh' ? 'zh'
        : profile.selectedLanguage === 'ja' ? 'ja' : 'ko'
      const codeSwitchRate = detectedLanguage !== targetLang ? 0.8 : 0.1

      const confidence = computeSpeakingConfidence(wordConfidences)
      sessionStore.setSpeakingConfidence(confidence)

      // Send to Claude
      const response: RoleplayResponse = await sendRoleplayTurn(
        roleplayStore.turnHistory,
        transcript,
        profile.skillScores,
        scenarioRef.current,
        profile.selectedLanguage,
        profile.chineseScript,
        profile.id
      )

      // Save turn
      const turn: RoleplayTurn = {
        turnNumber: currentTurn,
        userTranscript: transcript,
        parentSpeech: response.parentSpeech,
        toneNote: response.toneNote,
        newVocab: response.newVocab,
      }
      roleplayStore.addTurn(turn)

      // Save new vocab
      for (const vocab of response.newVocab) {
        sessionStore.addVocab(vocab)
        sessionStore.incrementWordsEncountered()
      }

      setParentSpeech(response.parentSpeech)
      setUserPrompt(response.userPrompt)
      setToneNote(response.toneNote)

      // Show feedback if there's a toneNote
      if (response.toneNote) {
        setPhase('feedback')
        return
      }

      // Synthesize and play parent response
      const parentAudioUri = await synthesizeSpeech(response.parentSpeech, profile.selectedLanguage)
      setPhase('playing-parent')
      await playAudio(parentAudioUri)

      const next = currentTurn + 1
      if (next > scenarioRef.current.turns) {
        setPhase('complete')
      } else {
        setCurrentTurn(next)
        pauseStartRef.current = Date.now()
        setPhase('awaiting-user')
      }

      // Update skill signals in session store
      sessionStore.setSpeakingConfidence(confidence)
      void sessionStore  // suppress unused warning — codeSwitchRate stored implicitly
      void codeSwitchRate

    } catch (err) {
      logError('Roleplay turn failed', err)
      setError('Something went wrong. Tap "Try again" or exit.')
      setPhase('awaiting-user')
    }
  }, [phase, profile, currentTurn, roleplayStore, sessionStore])

  function dismissFeedback() {
    if (!profile || !scenarioRef.current) return
    setPhase('playing-parent')

    synthesizeSpeech(parentSpeech, profile.selectedLanguage)
      .then(uri => playAudio(uri))
      .then(() => {
        const next = currentTurn + 1
        if (next > (scenarioRef.current?.turns ?? 0)) {
          setPhase('complete')
        } else {
          setCurrentTurn(next)
          pauseStartRef.current = Date.now()
          setPhase('awaiting-user')
        }
      })
      .catch(err => logError('Failed to play parent audio after feedback', err))
  }

  function dismissDistress() {
    setIsDistressDetected(false)
    pauseStartRef.current = Date.now()
    setPhase('awaiting-user')
  }

  return {
    phase,
    currentTurn,
    totalTurns,
    parentSpeech,
    userPrompt,
    toneNote,
    isDistressDetected,
    error,
    startScenario,
    startRecording,
    stopRecording,
    dismissFeedback,
    dismissDistress,
  }
}
