import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { ModalTemplate } from '../../templates/ModalTemplate'
import { VocabEntry } from '../../types'

interface VocabDetailProps {
  entry: VocabEntry
  onClose: () => void
  onSaveNote: (note: string) => Promise<void>
}

export function VocabDetail({ entry, onClose, onSaveNote }: VocabDetailProps) {
  const [note, setNote] = useState(entry.personalNote ?? '')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    await onSaveNote(note)
    setIsSaving(false)
  }

  return (
    <ModalTemplate title={entry.script} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.primaryBlock}>
          <Text style={styles.script}>{entry.script}</Text>
          <Text style={styles.romanization}>{entry.romanization}</Text>
          <Text style={styles.meaning}>{entry.meaning}</Text>
        </View>

        <TouchableOpacity style={styles.audioButton}>
          <Text style={styles.audioLabel}>🔊 Play pronunciation</Text>
        </TouchableOpacity>

        <View style={styles.exampleBlock}>
          <Text style={styles.sectionLabel}>Example</Text>
          <Text style={styles.exampleScript}>{entry.exampleSentence}</Text>
          <Text style={styles.exampleTranslation}>{entry.exampleTranslation}</Text>
        </View>

        {entry.contextNote ? (
          <View style={styles.contextBlock}>
            <Text style={styles.sectionLabel}>Context</Text>
            <Text style={styles.contextNote}>{entry.contextNote}</Text>
          </View>
        ) : null}

        <View style={styles.noteBlock}>
          <Text style={styles.sectionLabel}>Personal note</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a personal note…"
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveLabel}>{isSaving ? 'Saving…' : 'Save note'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.meta}>
          Added from {entry.source} · {entry.seenAt.toLocaleDateString()}
        </Text>
      </View>
    </ModalTemplate>
  )
}

const styles = StyleSheet.create({
  container: { gap: 24 },
  primaryBlock: { alignItems: 'center', gap: 8 },
  script: { fontSize: 48, fontWeight: '600', color: '#1A1A1A' },
  romanization: { fontSize: 20, color: '#666666' },
  meaning: { fontSize: 18, color: '#444444' },
  audioButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  audioLabel: { fontSize: 15, color: '#444444' },
  exampleBlock: { gap: 6 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: '#888888', textTransform: 'uppercase', letterSpacing: 0.5 },
  exampleScript: { fontSize: 17, color: '#1A1A1A' },
  exampleTranslation: { fontSize: 14, color: '#666666', fontStyle: 'italic' },
  contextBlock: { gap: 6 },
  contextNote: { fontSize: 14, color: '#666666', lineHeight: 20 },
  noteBlock: { gap: 8 },
  noteInput: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1A1A1A',
    minHeight: 72,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: { backgroundColor: '#AAAAAA' },
  saveLabel: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  meta: { fontSize: 12, color: '#AAAAAA', textAlign: 'center' },
})
