import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SkillScore } from '../../types'

interface SkillBarsProps {
  skillScore: SkillScore
}

const SKILL_LABELS: Record<keyof Omit<SkillScore, 'lastUpdated'>, string> = {
  listening: 'Listening',
  speaking: 'Speaking',
  reading: 'Reading',
  writing: 'Writing',
}

const SKILL_COLORS: Record<keyof Omit<SkillScore, 'lastUpdated'>, string> = {
  listening: '#4A90D9',
  speaking: '#E87C5E',
  reading: '#6ABF87',
  writing: '#B07FD4',
}

type SkillKey = keyof Omit<SkillScore, 'lastUpdated'>

export function SkillBars({ skillScore }: SkillBarsProps) {
  const skills: SkillKey[] = ['listening', 'speaking', 'reading', 'writing']

  // Lead with highest score
  const sorted = [...skills].sort((a, b) => skillScore[b] - skillScore[a])

  return (
    <View style={styles.container}>
      {sorted.map((skill) => (
        <View key={skill} style={styles.row}>
          <Text style={styles.label}>{SKILL_LABELS[skill]}</Text>
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${skillScore[skill]}%` as `${number}%`,
                  backgroundColor: SKILL_COLORS[skill],
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { width: 72, fontSize: 13, color: '#444444' },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 4 },
})
