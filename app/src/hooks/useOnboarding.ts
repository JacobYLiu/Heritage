import { useState } from 'react'
import { UserProfile, SupportedLanguage } from '../types'
import { seedSkillScore } from '../utils/skillModelSeed'
import { useUserStore } from '../stores/userStore'
import { getSupabaseClient } from '../services/supabase'
import { getSession } from '../services/auth'

type Step = 'language' | 'background' | 'confidence' | 'welcome'

interface OnboardingState {
  step: Step
  selectedLanguage: SupportedLanguage | null
  heritageBackground: UserProfile['heritageBackground'] | null
  selfReportedLevel: UserProfile['selfReportedLevel'] | null
  isSubmitting: boolean
  error: string | null
  goToBackground: (language: SupportedLanguage) => void
  goToConfidence: (background: UserProfile['heritageBackground']) => void
  goToWelcome: (level: UserProfile['selfReportedLevel']) => void
  submitOnboarding: (name: string) => Promise<void>
}

export function useOnboarding(): OnboardingState {
  const [step, setStep] = useState<Step>('language')
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage | null>(null)
  const [heritageBackground, setHeritageBackground] = useState<UserProfile['heritageBackground'] | null>(null)
  const [selfReportedLevel, setSelfReportedLevel] = useState<UserProfile['selfReportedLevel'] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setProfile } = useUserStore()

  function goToBackground(language: SupportedLanguage) {
    setSelectedLanguage(language)
    setStep('background')
  }

  function goToConfidence(background: UserProfile['heritageBackground']) {
    setHeritageBackground(background)
    setStep('confidence')
  }

  function goToWelcome(level: UserProfile['selfReportedLevel']) {
    setSelfReportedLevel(level)
    setStep('welcome')
  }

  async function submitOnboarding(name: string) {
    if (!selectedLanguage || !heritageBackground || !selfReportedLevel) return

    setIsSubmitting(true)
    setError(null)

    try {
      const session = await getSession()
      if (!session) throw new Error('Not authenticated')

      const skillScores = seedSkillScore(heritageBackground, selfReportedLevel)

      const profile: UserProfile = {
        id: session.user.id,
        name,
        selectedLanguage,
        chineseScript: 'simplified',
        heritageBackground,
        selfReportedLevel,
        skillScores,
        isPremium: false,
        createdAt: new Date(),
      }

      const supabase = await getSupabaseClient()
      const { error: dbError } = await supabase.from('profiles').upsert({
        id: profile.id,
        name: profile.name,
        selected_language: profile.selectedLanguage,
        chinese_script: profile.chineseScript,
        heritage_background: profile.heritageBackground,
        self_reported_level: profile.selfReportedLevel,
        is_premium: profile.isPremium,
      })
      if (dbError) throw dbError

      const { error: skillError } = await supabase.from('skill_scores').upsert({
        user_id: profile.id,
        listening: skillScores.listening,
        speaking: skillScores.speaking,
        reading: skillScores.reading,
        writing: skillScores.writing,
      })
      if (skillError) throw skillError

      await setProfile(profile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    step,
    selectedLanguage,
    heritageBackground,
    selfReportedLevel,
    isSubmitting,
    error,
    goToBackground,
    goToConfidence,
    goToWelcome,
    submitOnboarding,
  }
}
