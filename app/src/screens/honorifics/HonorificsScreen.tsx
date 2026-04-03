import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SectionList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserStore } from '../../stores/userStore'
import { getSectionsForLanguage, FamilyTermGroup, FamilyTerm, HonorificsSection } from '../../constants/familyTerms'
import { ScriptText } from '../../components/display/ScriptText'
import { colors } from '../../constants/colors'

// ─── TermCard ─────────────────────────────────────────────────────────────────

interface TermCardProps {
  term: FamilyTerm
  isZh: boolean
}

function TermCard({ term, isZh }: TermCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <TouchableOpacity
      style={styles.termCard}
      onPress={() => setExpanded(prev => !prev)}
      activeOpacity={0.7}
    >
      <View style={styles.termRow}>
        <View style={styles.termScript}>
          {isZh ? (
            <ScriptText
              simplified={term.scriptSimplified}
              traditional={term.scriptTraditional}
              style={styles.termScriptText}
            />
          ) : (
            <Text style={styles.termScriptText}>{term.scriptSimplified}</Text>
          )}
          <Text style={styles.termRomanization}>{term.romanization}</Text>
        </View>
        <Text style={styles.termMeaning} numberOfLines={expanded ? undefined : 1}>
          {term.meaning}
        </Text>
      </View>

      {expanded && (
        <View style={styles.usageNoteContainer}>
          <Text style={styles.usageNoteLabel}>Usage</Text>
          <Text style={styles.usageNoteText}>{term.usageNote}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

// ─── GroupCard ────────────────────────────────────────────────────────────────

interface GroupCardProps {
  group: FamilyTermGroup
  isZh: boolean
}

function GroupCard({ group, isZh }: GroupCardProps) {
  return (
    <View style={styles.groupCard}>
      <Text style={styles.groupLabel}>{group.groupLabel}</Text>
      <Text style={styles.culturalNote}>{group.culturalNote}</Text>
      {group.terms.map(term => (
        <TermCard key={term.id} term={term} isZh={isZh} />
      ))}
    </View>
  )
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  )
}

// ─── HonorificsScreen ────────────────────────────────────────────────────────

export function HonorificsScreen() {
  const { profile } = useUserStore()
  const language = profile?.selectedLanguage ?? 'zh'
  const isZh = language === 'zh'

  const sections = getSectionsForLanguage(language)

  const langLabel: Record<typeof language, string> = {
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
  }

  const subtitle: Record<typeof language, string> = {
    zh: 'Family address terms — maternal & paternal distinctions',
    ja: 'Honorific suffixes & keigo basics',
    ko: '존댓말 & 반말 — when and how to use each register',
  }

  // Convert sections → SectionList data format
  type ListSection = { title: string; data: FamilyTermGroup[] }
  const listSections: ListSection[] = sections.map((section: HonorificsSection) => ({
    title: section.sectionTitle,
    data: section.groups,
  }))

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Honorifics</Text>
        <Text style={styles.screenSubtitle}>{langLabel[language]}</Text>
        <Text style={styles.screenDescription}>{subtitle[language]}</Text>
      </View>

      <SectionList
        sections={listSections}
        keyExtractor={(group) => group.groupId}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} />
        )}
        renderItem={({ item: group }) => (
          <GroupCard group={group} isZh={isZh} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  screenSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  screenDescription: {
    fontSize: 13,
    color: colors.text.muted,
    lineHeight: 18,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 8,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  culturalNote: {
    fontSize: 13,
    color: colors.text.muted,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  termCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  termScript: {
    minWidth: 80,
    gap: 2,
  },
  termScriptText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  termRomanization: {
    fontSize: 12,
    color: colors.text.muted,
  },
  termMeaning: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    paddingTop: 2,
  },
  usageNoteContainer: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 10,
    gap: 4,
  },
  usageNoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  usageNoteText: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
})
