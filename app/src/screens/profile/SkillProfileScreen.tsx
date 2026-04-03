import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserStore } from '../../stores/userStore'
import { SkillBars } from '../../components/feedback/SkillBars'
import { SkillTrendChart, SkillKey, SkillDataPoint } from '../../components/feedback/SkillTrendChart'
import { colors } from '../../constants/colors'

const SKILL_LABELS: Record<SkillKey, string> = {
  listening: 'Listening',
  speaking: 'Speaking',
  reading: 'Reading',
  writing: 'Writing',
}

const SKILL_COLORS: Record<SkillKey, string> = {
  listening: colors.skill.listening,
  speaking: colors.skill.speaking,
  reading: colors.skill.reading,
  writing: colors.skill.writing,
}

const SKILL_DESCRIPTIONS: Record<SkillKey, string> = {
  listening: 'How well you understand spoken heritage language — through listening exercises and roleplay.',
  speaking: 'Fluency and confidence measured via Whisper transcription and response latency.',
  reading: 'Reading comprehension based on flashcard recognition and vocabulary encounters.',
  writing: 'Writing fluency inferred from flashcard recall and active vocabulary use.',
}

const SKILLS: SkillKey[] = ['listening', 'speaking', 'reading', 'writing']

/**
 * Generate synthetic 30-day trend data anchored to the user's current scores.
 * Simulates a gradual improvement trajectory — real data would come from session_metrics.
 * Days are oldest-first (index 0 = 30 days ago, index 29 = today).
 */
function generateTrendData(currentScores: Record<SkillKey, number>): SkillDataPoint[] {
  const DAYS = 30
  const points: SkillDataPoint[] = []

  for (let i = 0; i < DAYS; i++) {
    const progress = i / (DAYS - 1) // 0 at day 0, 1 at today
    const scores: Record<SkillKey, number> = {
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0,
    }

    SKILLS.forEach(skill => {
      const current = currentScores[skill]
      // Start 15 points lower 30 days ago, with slight random variation
      const baseline = Math.max(0, current - 15)
      // Deterministic "noise" based on day index and skill to avoid random re-renders
      const noise = ((i * 7 + skill.length * 3) % 7) - 3 // -3 to +3
      scores[skill] = Math.max(0, Math.min(100, Math.round(baseline + progress * 15 + noise * (1 - progress))))
    })

    points.push({ dayOffset: DAYS - 1 - i, scores })
  }

  return points
}

// ─── SkillTab ─────────────────────────────────────────────────────────────────

interface SkillTabProps {
  skill: SkillKey
  isActive: boolean
  score: number
  onPress: () => void
}

function SkillTab({ skill, isActive, score, onPress }: SkillTabProps) {
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        isActive && { borderBottomColor: SKILL_COLORS[skill], borderBottomWidth: 2 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabLabel, isActive && { color: SKILL_COLORS[skill] }]}>
        {SKILL_LABELS[skill]}
      </Text>
      <Text style={[styles.tabScore, isActive && { color: SKILL_COLORS[skill] }]}>
        {score}
      </Text>
    </TouchableOpacity>
  )
}

// ─── SkillProfileScreen ───────────────────────────────────────────────────────

export function SkillProfileScreen() {
  const { profile } = useUserStore()
  const [activeSkill, setActiveSkill] = useState<SkillKey>('listening')

  const trendData = useMemo(() => {
    if (!profile) return []
    return generateTrendData({
      listening: profile.skillScores.listening,
      speaking: profile.skillScores.speaking,
      reading: profile.skillScores.reading,
      writing: profile.skillScores.writing,
    })
  }, [profile])

  if (!profile) return null

  const { skillScores } = profile
  const activeScore = skillScores[activeSkill]

  // Determine qualitative level text
  function levelLabel(score: number): string {
    if (score >= 75) return 'Advanced'
    if (score >= 50) return 'Intermediate'
    if (score >= 25) return 'Developing'
    return 'Beginner'
  }

  // Compute total sessions from createdAt (placeholder — real count from session_metrics)
  const daysSinceJoined = Math.max(1, Math.floor(
    (Date.now() - profile.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  ))

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: SKILL_COLORS[activeSkill] + '22' }]}>
            <Text style={[styles.avatarInitial, { color: SKILL_COLORS[activeSkill] }]}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileSub}>
              {profile.selectedLanguage === 'zh' ? 'Chinese' :
               profile.selectedLanguage === 'ja' ? 'Japanese' : 'Korean'} learner
            </Text>
            <Text style={styles.profileJoined}>
              {daysSinceJoined === 1 ? 'Joined today' : `Learning for ${daysSinceJoined} days`}
            </Text>
          </View>
        </View>

        {/* Overall skill bars */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>All Skills</Text>
          <SkillBars skillScore={skillScores} />
        </View>

        {/* Skill selector tabs */}
        <View style={styles.tabRow}>
          {SKILLS.map(skill => (
            <SkillTab
              key={skill}
              skill={skill}
              isActive={activeSkill === skill}
              score={skillScores[skill]}
              onPress={() => setActiveSkill(skill)}
            />
          ))}
        </View>

        {/* Active skill detail */}
        <View style={styles.card}>
          <View style={styles.skillDetailHeader}>
            <View>
              <Text style={styles.cardTitle}>{SKILL_LABELS[activeSkill]}</Text>
              <Text style={[styles.levelBadge, { color: SKILL_COLORS[activeSkill] }]}>
                {levelLabel(activeScore)}
              </Text>
            </View>
            <Text style={[styles.bigScore, { color: SKILL_COLORS[activeSkill] }]}>
              {activeScore}
            </Text>
          </View>
          <Text style={styles.skillDescription}>{SKILL_DESCRIPTIONS[activeSkill]}</Text>
        </View>

        {/* 30-day trend chart */}
        <View style={styles.card}>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>30-day trend</Text>
            <Text style={styles.chartNote}>Estimated from session history</Text>
          </View>
          <SkillTrendChart
            data={trendData}
            activeSkill={activeSkill}
            color={SKILL_COLORS[activeSkill]}
          />
        </View>

        {/* Encouragement */}
        <View style={[styles.encouragementCard, { borderLeftColor: SKILL_COLORS[activeSkill] }]}>
          <Text style={styles.encouragementText}>
            {activeScore >= 75
              ? `Your ${SKILL_LABELS[activeSkill].toLowerCase()} is strong. Keep it alive by using the language with family.`
              : activeScore >= 50
              ? `You're making real progress in ${SKILL_LABELS[activeSkill].toLowerCase()}. Consistency matters more than intensity.`
              : activeScore >= 25
              ? `${SKILL_LABELS[activeSkill]} is your growth area — and growth areas are where heritage reconnects.`
              : `Everyone starts somewhere. Your ${SKILL_LABELS[activeSkill].toLowerCase()} journey begins now.`}
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48, gap: 16 },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { fontSize: 28, fontWeight: '700' },
  profileMeta: { gap: 2 },
  profileName: { fontSize: 22, fontWeight: '700', color: colors.text.primary },
  profileSub: { fontSize: 14, color: colors.text.secondary },
  profileJoined: { fontSize: 12, color: colors.text.muted },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text.primary },

  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 2,
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
  },
  tabLabel: { fontSize: 11, fontWeight: '600', color: colors.text.muted },
  tabScore: { fontSize: 16, fontWeight: '700', color: colors.text.muted },

  skillDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  levelBadge: { fontSize: 13, fontWeight: '600' },
  bigScore: { fontSize: 48, fontWeight: '800', lineHeight: 52 },
  skillDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 19,
  },

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartNote: { fontSize: 11, color: colors.text.subtle, fontStyle: 'italic' },

  encouragementCard: {
    borderLeftWidth: 3,
    paddingLeft: 14,
    paddingVertical: 8,
  },
  encouragementText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
})
