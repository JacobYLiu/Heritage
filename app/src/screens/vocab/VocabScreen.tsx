import React from 'react'
import { View, TextInput, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useVocab } from '../../hooks/useVocab'
import { VocabRow } from '../../components/cards/VocabRow'

export function VocabScreen() {
  const { filteredEntries, isLoading, error, searchQuery, setSearchQuery } = useVocab()

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Vocabulary</Text>

        <TextInput
          style={styles.search}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search words…"
          clearButtonMode="while-editing"
        />

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1A1A1A" />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : filteredEntries.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No words match your search.' : 'Words you encounter will appear here.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredEntries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <VocabRow
                entry={item}
                onPress={() => router.push({ pathname: '/(modal)/vocab-detail', params: { id: item.id } })}
                onAudioPress={() => {
                  // Audio playback via expo-av
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A' },
  search: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#E05252', textAlign: 'center' },
  emptyText: { fontSize: 16, color: '#888888', textAlign: 'center' },
})
