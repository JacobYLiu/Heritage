import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface OnboardingTemplateProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  showNext?: boolean
}

export function OnboardingTemplate({
  children,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  nextLabel = 'Next',
  nextDisabled = false,
  showNext = true,
}: OnboardingTemplateProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        <View style={styles.dots}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentStep - 1 && styles.dotActive]}
            />
          ))}
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>{children}</View>

      {showNext && onNext && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, nextDisabled && styles.nextButtonDisabled]}
            onPress={onNext}
            disabled={nextDisabled}
          >
            <Text style={[styles.nextLabel, nextDisabled && styles.nextLabelDisabled]}>
              {nextLabel}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: { fontSize: 24, color: '#1A1A1A' },
  placeholder: { width: 32 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' },
  dotActive: { backgroundColor: '#1A1A1A' },
  content: { flex: 1, paddingHorizontal: 20 },
  footer: { paddingHorizontal: 20, paddingBottom: 20 },
  nextButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: { backgroundColor: '#E0E0E0' },
  nextLabel: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  nextLabelDisabled: { color: '#A0A0A0' },
})
