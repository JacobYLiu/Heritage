import React, { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Audio } from 'expo-av'
import { error as logError } from '../../utils/logger'

type PlaybackSpeed = 0.75 | 1 | 1.25

interface AudioPlayerProps {
  audioUri: string
  onSpeedChange?: (speed: PlaybackSpeed) => void
}

const SPEEDS: PlaybackSpeed[] = [0.75, 1, 1.25]

export function AudioPlayer({ audioUri, onSpeedChange }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState<PlaybackSpeed>(1)
  const soundRef = useRef<Audio.Sound | null>(null)

  async function togglePlayback() {
    try {
      if (isPlaying) {
        await soundRef.current?.pauseAsync()
        setIsPlaying(false)
        return
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync()
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, rate: speed, shouldCorrectPitch: true }
      )
      soundRef.current = sound
      setIsPlaying(true)

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false)
        }
      })
    } catch (err) {
      logError('Audio playback failed', err)
    }
  }

  async function changeSpeed(newSpeed: PlaybackSpeed) {
    setSpeed(newSpeed)
    onSpeedChange?.(newSpeed)
    if (soundRef.current) {
      await soundRef.current.setRateAsync(newSpeed, true)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
        <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
      <View style={styles.speeds}>
        {SPEEDS.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.speedChip, speed === s && styles.speedChipActive]}
            onPress={() => changeSpeed(s)}
          >
            <Text style={[styles.speedLabel, speed === s && styles.speedLabelActive]}>
              {s}×
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { fontSize: 16, color: '#FFFFFF' },
  speeds: { flexDirection: 'row', gap: 6 },
  speedChip: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  speedChipActive: { borderColor: '#1A1A1A', backgroundColor: '#1A1A1A' },
  speedLabel: { fontSize: 12, color: '#666666', fontWeight: '500' },
  speedLabelActive: { color: '#FFFFFF' },
})
