import React, { useState } from 'react'
import { router } from 'expo-router'
import { OnboardingTemplate } from '../../templates/OnboardingTemplate'
import { StepLanguage } from './StepLanguage'
import { StepBackground } from './StepBackground'
import { StepConfidence } from './StepConfidence'
import { StepWelcome } from './StepWelcome'
import { useOnboarding } from '../../hooks/useOnboarding'

export function OnboardingFlow() {
  const [name] = useState('') // name is collected at sign-up, passed in from auth user
  const {
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
  } = useOnboarding()

  const STEP_MAP = { language: 1, background: 2, confidence: 3, welcome: 4 }
  const currentStep = STEP_MAP[step]

  async function handleFinish() {
    await submitOnboarding(name)
    if (!error) router.replace('/(tabs)')
  }

  return (
    <OnboardingTemplate
      currentStep={currentStep}
      totalSteps={4}
      onNext={
        step === 'language' ? (selectedLanguage ? () => goToBackground(selectedLanguage) : undefined)
        : step === 'background' ? (heritageBackground ? () => goToConfidence(heritageBackground) : undefined)
        : step === 'confidence' ? (selfReportedLevel ? () => goToWelcome(selfReportedLevel) : undefined)
        : handleFinish
      }
      nextDisabled={
        (step === 'language' && !selectedLanguage) ||
        (step === 'background' && !heritageBackground) ||
        (step === 'confidence' && !selfReportedLevel) ||
        isSubmitting
      }
      nextLabel={step === 'welcome' ? "Let's go" : 'Next'}
      showNext
    >
      {step === 'language' && (
        <StepLanguage
          selected={selectedLanguage}
          onSelect={goToBackground}
        />
      )}
      {step === 'background' && selectedLanguage && (
        <StepBackground
          language={selectedLanguage}
          selected={heritageBackground}
          onSelect={goToConfidence}
        />
      )}
      {step === 'confidence' && (
        <StepConfidence
          selected={selfReportedLevel}
          onSelect={goToWelcome}
        />
      )}
      {step === 'welcome' && heritageBackground && selfReportedLevel && (
        <StepWelcome
          name={name}
          background={heritageBackground}
          level={selfReportedLevel}
          isSubmitting={isSubmitting}
          error={error}
        />
      )}
    </OnboardingTemplate>
  )
}
