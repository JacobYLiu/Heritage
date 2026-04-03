import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUserStore } from '../../stores/userStore'
import { signOut } from '../../services/auth'
import { getSupabaseClient } from '../../services/supabase'
import {
  getOfflineCacheStatus,
  preDownloadForOffline,
  clearOfflineCache,
  OfflineCacheStatus,
} from '../../services/offlineCache'
import { colors } from '../../constants/colors'
import { SupportedLanguage } from '../../types'

// ─── Row helpers ─────────────────────────────────────────────────────────────

interface SettingsRowProps {
  label: string
  sublabel?: string
  onPress?: () => void
  right?: React.ReactNode
  destructive?: boolean
}

function SettingsRow({ label, sublabel, onPress, right, destructive }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View style={styles.rowLeft}>
        <Text style={[styles.rowLabel, destructive && styles.destructiveLabel]}>{label}</Text>
        {sublabel ? <Text style={styles.rowSublabel}>{sublabel}</Text> : null}
      </View>
      {right ? <View style={styles.rowRight}>{right}</View> : null}
    </TouchableOpacity>
  )
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>
}

function Divider() {
  return <View style={styles.divider} />
}

// ─── Language selector ────────────────────────────────────────────────────────

const LANGUAGE_OPTIONS: { value: SupportedLanguage; label: string }[] = [
  { value: 'zh', label: 'Chinese (Mandarin)' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
]

interface LanguageSelectorProps {
  current: SupportedLanguage
  onChange: (lang: SupportedLanguage) => void
}

function LanguageSelector({ current, onChange }: LanguageSelectorProps) {
  return (
    <View style={styles.langSelector}>
      {LANGUAGE_OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.langOption, current === opt.value && styles.langOptionActive]}
          onPress={() => onChange(opt.value)}
          activeOpacity={0.7}
        >
          <Text style={[styles.langOptionLabel, current === opt.value && styles.langOptionLabelActive]}>
            {opt.label}
          </Text>
          {current === opt.value && (
            <Text style={styles.langOptionCheck}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  )
}

// ─── Playback speed selector ──────────────────────────────────────────────────

const SPEEDS = [0.75, 1.0, 1.25] as const
type PlaybackSpeed = typeof SPEEDS[number]

interface SpeedSelectorProps {
  current: PlaybackSpeed
  onChange: (speed: PlaybackSpeed) => void
}

function SpeedSelector({ current, onChange }: SpeedSelectorProps) {
  return (
    <View style={styles.speedRow}>
      {SPEEDS.map(s => (
        <TouchableOpacity
          key={s}
          style={[styles.speedChip, current === s && styles.speedChipActive]}
          onPress={() => onChange(s)}
          activeOpacity={0.7}
        >
          <Text style={[styles.speedLabel, current === s && styles.speedLabelActive]}>
            {s}×
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

// ─── Reminder time picker ─────────────────────────────────────────────────────

const REMINDER_TIMES = ['Off', '08:00', '12:00', '18:00', '20:00', '21:00'] as const
type ReminderTime = typeof REMINDER_TIMES[number]

interface ReminderSelectorProps {
  current: ReminderTime
  onChange: (time: ReminderTime) => void
}

function ReminderSelector({ current, onChange }: ReminderSelectorProps) {
  return (
    <View style={styles.reminderGrid}>
      {REMINDER_TIMES.map(t => (
        <TouchableOpacity
          key={t}
          style={[styles.reminderChip, current === t && styles.reminderChipActive]}
          onPress={() => onChange(t)}
          activeOpacity={0.7}
        >
          <Text style={[styles.reminderLabel, current === t && styles.reminderLabelActive]}>
            {t}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

// ─── SettingsScreen ───────────────────────────────────────────────────────────

export function SettingsScreen() {
  const { profile, setProfile, clearProfile } = useUserStore()

  // Local preferences (not persisted to Supabase — just in-memory for now)
  const [reminderTime, setReminderTime] = useState<ReminderTime>('Off')
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1.0)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [cacheStatus, setCacheStatus] = useState<OfflineCacheStatus | null>(null)
  const [isDownloadingCache, setIsDownloadingCache] = useState(false)
  const [cacheProgress, setCacheProgress] = useState(0)

  useEffect(() => {
    getOfflineCacheStatus().then(setCacheStatus)
  }, [])

  if (!profile) return null

  const isZh = profile.selectedLanguage === 'zh'

  async function handleLanguageChange(lang: SupportedLanguage) {
    if (lang === profile!.selectedLanguage) return
    const updated = { ...profile!, selectedLanguage: lang }
    await setProfile(updated)
  }

  async function handleScriptToggle(value: boolean) {
    const script = value ? 'traditional' : 'simplified'
    const updated = { ...profile!, chineseScript: script as 'simplified' | 'traditional' }
    await setProfile(updated)
  }

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          setIsSigningOut(true)
          try {
            await signOut()
            await clearProfile()
            router.replace('/(auth)/welcome')
          } catch {
            setIsSigningOut(false)
            Alert.alert('Error', 'Could not sign out. Please try again.')
          }
        },
      },
    ])
  }

  async function handleDownloadOffline() {
    const supabase = await getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setIsDownloadingCache(true)
    setCacheProgress(0)
    try {
      await preDownloadForOffline(user.id, profile!.selectedLanguage, setCacheProgress)
      const status = await getOfflineCacheStatus()
      setCacheStatus(status)
      Alert.alert('Downloaded', `${status.cardCount} cards and ${status.audioCount} audio files saved for offline use.`)
    } catch {
      Alert.alert('Download failed', 'Could not download offline data. Check your connection and try again.')
    } finally {
      setIsDownloadingCache(false)
      setCacheProgress(0)
    }
  }

  async function handleClearCache() {
    Alert.alert('Clear offline data', 'Remove all locally cached cards and audio?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearOfflineCache()
          const status = await getOfflineCacheStatus()
          setCacheStatus(status)
        },
      },
    ])
  }

  async function handleDeleteAccount() {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'All your progress, flashcards, and session history will be lost.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, delete my account',
                  style: 'destructive',
                  onPress: async () => {
                    setIsDeletingAccount(true)
                    try {
                      const supabase = await getSupabaseClient()
                      const { data: { user } } = await supabase.auth.getUser()
                      if (user) {
                        // Delete all user data via RLS-protected tables
                        await supabase.from('session_metrics').delete().eq('user_id', user.id)
                        await supabase.from('flashcard_progress').delete().eq('user_id', user.id)
                        await supabase.from('vocab_entries').delete().eq('user_id', user.id)
                        await supabase.from('skill_scores').delete().eq('user_id', user.id)
                        await supabase.from('profiles').delete().eq('id', user.id)
                        await supabase.auth.admin.deleteUser(user.id)
                      }
                      await signOut()
                      await clearProfile()
                      router.replace('/(auth)/welcome')
                    } catch {
                      setIsDeletingAccount(false)
                      Alert.alert('Error', 'Could not delete account. Please contact support.')
                    }
                  },
                },
              ]
            )
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.screenTitle}>Settings</Text>

        {/* Language */}
        <SectionHeader title="Language" />
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Heritage language</Text>
          <LanguageSelector
            current={profile.selectedLanguage}
            onChange={handleLanguageChange}
          />
        </View>

        {/* Chinese script — only visible when zh is selected */}
        {isZh && (
          <>
            <SectionHeader title="Chinese Script" />
            <View style={styles.card}>
              <SettingsRow
                label="Use Traditional characters"
                sublabel="繁體字 — switches all Chinese text in the app"
                right={
                  <Switch
                    value={profile.chineseScript === 'traditional'}
                    onValueChange={handleScriptToggle}
                    trackColor={{ false: colors.border, true: colors.text.primary }}
                    thumbColor="#FFFFFF"
                  />
                }
              />
            </View>
          </>
        )}

        {/* Daily reminder */}
        <SectionHeader title="Daily Reminder" />
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Reminder time</Text>
          <ReminderSelector current={reminderTime} onChange={setReminderTime} />
          <Text style={styles.cardHint}>
            Push notification reminders require notification permissions. "Off" disables them.
          </Text>
        </View>

        {/* Audio playback speed */}
        <SectionHeader title="Audio" />
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Default playback speed</Text>
          <SpeedSelector current={playbackSpeed} onChange={setPlaybackSpeed} />
        </View>

        {/* Account */}
        <SectionHeader title="Account" />
        <View style={styles.card}>
          <SettingsRow
            label="Name"
            sublabel={profile.name}
          />
          <Divider />
          <SettingsRow
            label={isSigningOut ? 'Signing out…' : 'Sign out'}
            onPress={isSigningOut ? undefined : handleSignOut}
            right={isSigningOut ? <ActivityIndicator size="small" color={colors.text.muted} /> : undefined}
          />
        </View>

        {/* Offline */}
        <SectionHeader title="Offline Mode" />
        <View style={styles.card}>
          {cacheStatus?.isCached ? (
            <>
              <SettingsRow
                label={`${cacheStatus.cardCount} cards cached`}
                sublabel={
                  cacheStatus.isStale
                    ? 'Cache is stale — tap Download to refresh'
                    : `Updated ${cacheStatus.cachedAt?.toLocaleDateString() ?? ''}`
                }
              />
              <Divider />
              <SettingsRow
                label={isDownloadingCache
                  ? `Downloading… ${Math.round(cacheProgress * 100)}%`
                  : 'Refresh offline data'}
                onPress={isDownloadingCache ? undefined : handleDownloadOffline}
                right={isDownloadingCache ? <ActivityIndicator size="small" color={colors.text.muted} /> : undefined}
              />
              <Divider />
              <SettingsRow
                label="Clear offline data"
                onPress={handleClearCache}
                destructive
              />
            </>
          ) : (
            <SettingsRow
              label={isDownloadingCache
                ? `Downloading… ${Math.round(cacheProgress * 100)}%`
                : 'Download for offline use'}
              sublabel="Save flashcards and audio to use without Wi-Fi"
              onPress={isDownloadingCache ? undefined : handleDownloadOffline}
              right={isDownloadingCache ? <ActivityIndicator size="small" color={colors.text.muted} /> : undefined}
            />
          )}
        </View>

        {/* Danger zone */}
        <SectionHeader title="Danger Zone" />
        <View style={styles.card}>
          <SettingsRow
            label={isDeletingAccount ? 'Deleting account…' : 'Delete account'}
            sublabel="Permanently deletes all your data"
            onPress={isDeletingAccount ? undefined : handleDeleteAccount}
            right={isDeletingAccount ? <ActivityIndicator size="small" color={colors.error} /> : undefined}
            destructive
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Heritage v1.0.0</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 48, gap: 8 },

  screenTitle: { fontSize: 28, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },

  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 4,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    paddingHorizontal: 16,
    gap: 0,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.muted,
    paddingTop: 14,
    paddingBottom: 10,
  },
  cardHint: {
    fontSize: 11,
    color: colors.text.subtle,
    lineHeight: 15,
    paddingBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowLeft: { flex: 1, gap: 2 },
  rowRight: {},
  rowLabel: { fontSize: 15, color: colors.text.primary },
  rowSublabel: { fontSize: 12, color: colors.text.muted },
  destructiveLabel: { color: colors.error },

  divider: { height: 1, backgroundColor: colors.border, marginLeft: 0 },

  langSelector: { gap: 2, paddingBottom: 12 },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langOptionActive: {
    borderColor: colors.text.primary,
    backgroundColor: '#F2F2F2',
  },
  langOptionLabel: { fontSize: 14, color: colors.text.secondary },
  langOptionLabelActive: { color: colors.text.primary, fontWeight: '600' },
  langOptionCheck: { fontSize: 14, color: colors.text.primary, fontWeight: '700' },

  speedRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  speedChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  speedChipActive: {
    backgroundColor: colors.text.primary,
    borderColor: colors.text.primary,
  },
  speedLabel: { fontSize: 14, color: colors.text.secondary, fontWeight: '500' },
  speedLabelActive: { color: '#FFFFFF', fontWeight: '700' },

  reminderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 10,
  },
  reminderChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderChipActive: {
    backgroundColor: colors.text.primary,
    borderColor: colors.text.primary,
  },
  reminderLabel: { fontSize: 13, color: colors.text.secondary },
  reminderLabelActive: { color: '#FFFFFF', fontWeight: '600' },

  footer: { alignItems: 'center', paddingTop: 24 },
  footerText: { fontSize: 12, color: colors.text.subtle },
})
