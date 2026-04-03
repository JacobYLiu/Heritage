import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useListening } from '../../hooks/useListening'
import { useSessionMetrics } from '../../hooks/useSessionMetrics'
import { AudioPlayer } from './AudioPlayer'

// Listening screen receives a clip URI and questions via navigation params.
// Content clips live in src/assets/audio/[lang]/listening/.
export function ListeningScreen({ clipUri, language }: { clipUri: string; language: string }) {
  const listening = useListening()
  const { finalizeSession } = useSessionMetrics()

  if (listening.isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1A1A1A" />
        </View>
      </SafeAreaView>
    )
  }

  if (!listening.clip) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No clip loaded.</Text>
        </View>
      </SafeAreaView>
    )
  }

  const clip = listening.clip
  const currentQ = clip.questions[listening.questionIndex]

  async function handleFinish() {
    await finalizeSession({ comprehensionAccuracy: listening.accuracy / 100 })
    router.push('/(modal)/session-summary')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Listening</Text>

        {/* Audio player */}
        <View style={styles.playerBlock}>
          <AudioPlayer
            audioUri={clipUri}
            onSpeedChange={listening.setPlaybackSpeed}
          />
          <Text style={styles.speedNote}>Speed: {listening.playbackSpeed}×</Text>
        </View>

        {/* Questions */}
        {!listening.isComplete ? (
          <View style={styles.questionBlock}>
            <Text style={styles.questionCounter}>
              Question {listening.questionIndex + 1} of {clip.questions.length}
            </Text>
            <Text style={styles.question}>{currentQ.question}</Text>
            <View style={styles.options}>
              {currentQ.options.map((option, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.option}
                  onPress={() => listening.answerQuestion(i)}
                >
                  <Text style={styles.optionLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.resultBlock}>
            <Text style={styles.resultText}>
              {listening.accuracy === 0
                ? 'This clip was a stretch — that\'s exactly what builds your ear. Try it again tomorrow.'
                : `You got ${listening.accuracy}% — solid listening work.`
              }
            </Text>
            <TouchableOpacity style={styles.doneButton} onPress={handleFinish}>
              <Text style={styles.doneLabel}>See session summary</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8, gap: 24 },
  back: { marginBottom: 4 },
  backText: { fontSize: 24, color: '#1A1A1A' },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A' },
  playerBlock: { gap: 8 },
  speedNote: { fontSize: 12, color: '#AAAAAA' },
  questionBlock: { flex: 1, gap: 16 },
  questionCounter: { fontSize: 12, color: '#888888', textTransform: 'uppercase', letterSpacing: 0.5 },
  question: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', lineHeight: 26 },
  options: { gap: 10 },
  option: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
  },
  optionLabel: { fontSize: 16, color: '#1A1A1A' },
  resultBlock: { flex: 1, justifyContent: 'center', gap: 24 },
  resultText: { fontSize: 18, color: '#444444', lineHeight: 26, textAlign: 'center' },
  doneButton: { backgroundColor: '#1A1A1A', borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  doneLabel: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#888888' },
})
