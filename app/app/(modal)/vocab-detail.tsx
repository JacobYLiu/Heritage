import { useLocalSearchParams, router } from 'expo-router'
import { useVocab } from '../../src/hooks/useVocab'
import { VocabDetail } from '../../src/screens/vocab/VocabDetail'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

export default function VocabDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { entries, isLoading, updatePersonalNote } = useVocab()

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </View>
    )
  }

  const entry = entries.find((e) => e.id === id)
  if (!entry) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Word not found.</Text>
      </View>
    )
  }

  return (
    <VocabDetail
      entry={entry}
      onClose={() => router.back()}
      onSaveNote={(note) => updatePersonalNote(entry.id, note)}
    />
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  errorText: { fontSize: 16, color: '#888888' },
})
