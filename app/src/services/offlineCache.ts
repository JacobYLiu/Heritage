// Offline cache service — pre-downloads flashcard decks and audio files for
// use without an internet connection. Uses expo-file-system/legacy for all
// local file operations (same API surface as synthesizeSpeech uses).
import * as FileSystem from 'expo-file-system/legacy'
import { SupportedLanguage, FlashCard } from '../types'
import { AppError } from '../types/errors'
import { getSupabaseClient } from './supabase'

const CACHE_ROOT = `${FileSystem.cacheDirectory}offline/`
const DECK_DIR = `${CACHE_ROOT}decks/`
const AUDIO_DIR = `${CACHE_ROOT}audio/`

// Manifest stored locally so we can check staleness without network.
const MANIFEST_PATH = `${CACHE_ROOT}manifest.json`

interface OfflineManifest {
  language: SupportedLanguage
  cachedAt: string // ISO string
  cardIds: string[]
  audioUris: string[] // remote URIs that were successfully cached
}

// ─── Directory helpers ────────────────────────────────────────────────────────

async function ensureDirs(): Promise<void> {
  for (const dir of [CACHE_ROOT, DECK_DIR, AUDIO_DIR]) {
    const info = await FileSystem.getInfoAsync(dir)
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true })
    }
  }
}

// ─── Manifest ─────────────────────────────────────────────────────────────────

async function readManifest(): Promise<OfflineManifest | null> {
  const info = await FileSystem.getInfoAsync(MANIFEST_PATH)
  if (!info.exists) return null
  try {
    const raw = await FileSystem.readAsStringAsync(MANIFEST_PATH)
    return JSON.parse(raw) as OfflineManifest
  } catch {
    return null
  }
}

async function writeManifest(manifest: OfflineManifest): Promise<void> {
  await FileSystem.writeAsStringAsync(MANIFEST_PATH, JSON.stringify(manifest))
}

// ─── Deck caching ─────────────────────────────────────────────────────────────

function deckPath(language: SupportedLanguage): string {
  return `${DECK_DIR}${language}.json`
}

async function saveDeckLocally(language: SupportedLanguage, cards: FlashCard[]): Promise<void> {
  await FileSystem.writeAsStringAsync(deckPath(language), JSON.stringify(cards))
}

/**
 * Load the cached flashcard deck for a language. Returns null if not cached.
 */
export async function loadCachedDeck(language: SupportedLanguage): Promise<FlashCard[] | null> {
  const path = deckPath(language)
  const info = await FileSystem.getInfoAsync(path)
  if (!info.exists) return null
  try {
    const raw = await FileSystem.readAsStringAsync(path)
    const parsed = JSON.parse(raw) as FlashCard[]
    // Rehydrate Date fields
    return parsed.map(card => ({
      ...card,
      fsrsData: {
        ...card.fsrsData,
        nextReviewDate: new Date(card.fsrsData.nextReviewDate),
      },
    }))
  } catch {
    return null
  }
}

// ─── Audio caching ────────────────────────────────────────────────────────────

function audioFilename(remoteUri: string): string {
  // Use a simple hash of the URI as filename to avoid path collisions
  let hash = 5381
  for (let i = 0; i < remoteUri.length; i++) {
    hash = ((hash << 5) + hash) + remoteUri.charCodeAt(i)
    hash = hash & hash
  }
  return `${Math.abs(hash).toString(36)}.mp3`
}

function localAudioPath(remoteUri: string): string {
  return `${AUDIO_DIR}${audioFilename(remoteUri)}`
}

/**
 * Download a single audio file to local cache. Returns local URI on success.
 * Skips download if already cached.
 */
async function cacheAudioFile(remoteUri: string): Promise<string | null> {
  const local = localAudioPath(remoteUri)
  const info = await FileSystem.getInfoAsync(local)
  if (info.exists) return local

  try {
    const result = await FileSystem.downloadAsync(remoteUri, local)
    if (result.status === 200) return local
    // Non-200 — remove partial file if any
    const partialInfo = await FileSystem.getInfoAsync(local)
    if (partialInfo.exists) await FileSystem.deleteAsync(local, { idempotent: true })
    return null
  } catch {
    return null
  }
}

/**
 * Return the local cached path for an audio URI, or the original URI if not cached.
 * Use this at playback time so audio works offline when available.
 */
export async function resolveAudioUri(remoteUri: string): Promise<string> {
  if (!remoteUri) return remoteUri
  const local = localAudioPath(remoteUri)
  const info = await FileSystem.getInfoAsync(local)
  return info.exists ? local : remoteUri
}

// ─── Pre-download orchestration ───────────────────────────────────────────────

/**
 * Pre-download the flashcard deck and all audio for the given language.
 * Fetches cards from Supabase (requires auth), then downloads each audio file.
 *
 * This is intended to be called in the background (e.g. when the user opens
 * the app on Wi-Fi) and is tolerant of partial failures — individual audio
 * download failures are skipped, not fatal.
 *
 * @param userId  The authenticated user's ID
 * @param language  Which language deck to cache
 * @param onProgress  Optional progress callback (0–1)
 */
export async function preDownloadForOffline(
  userId: string,
  language: SupportedLanguage,
  onProgress?: (progress: number) => void
): Promise<void> {
  await ensureDirs()

  // 1. Fetch due + near-due cards from Supabase
  let cards: FlashCard[]
  try {
    const supabase = await getSupabaseClient()
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() + 7) // cache cards due in next 7 days

    // Pull flashcard_progress joined with the card data
    const { data, error } = await supabase
      .from('flashcard_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('language', language)
      .lte('next_review_date', cutoff.toISOString())
      .limit(100)

    if (error) throw new AppError('DATABASE_ERROR', error.message)

    // Map raw DB rows to FlashCard shape
    cards = (data ?? []).map((row: Record<string, unknown>) => ({
      id: row.flashcard_id as string,
      language: row.language as SupportedLanguage,
      scriptSimplified: (row.script_simplified as string) ?? '',
      scriptTraditional: (row.script_traditional as string) ?? '',
      romanization: (row.romanization as string) ?? '',
      meaning: (row.meaning as string) ?? '',
      audioUrl: (row.audio_url as string) ?? '',
      exampleSentenceSimplified: (row.example_simplified as string) ?? '',
      exampleSentenceTraditional: (row.example_traditional as string) ?? '',
      exampleTranslation: (row.example_translation as string) ?? '',
      category: (row.category as FlashCard['category']) ?? 'family-terms',
      fsrsData: {
        stability: (row.stability as number) ?? 2.5,
        difficulty: (row.difficulty as number) ?? 0.3,
        nextReviewDate: new Date((row.next_review_date as string) ?? new Date().toISOString()),
        lastRating: (row.last_rating as FlashCard['fsrsData']['lastRating']) ?? null,
      },
    }))
  } catch (err) {
    if (err instanceof AppError) throw err
    throw new AppError('DATABASE_ERROR', `Failed to fetch cards for offline cache: ${err}`)
  }

  // 2. Save deck JSON locally
  await saveDeckLocally(language, cards)
  onProgress?.(0.2)

  // 3. Download audio files — skip failures
  const audioUris = cards.map(c => c.audioUrl).filter(Boolean)
  const successfulUris: string[] = []
  let downloaded = 0

  for (const uri of audioUris) {
    const result = await cacheAudioFile(uri)
    if (result) successfulUris.push(uri)
    downloaded++
    onProgress?.(0.2 + (downloaded / Math.max(audioUris.length, 1)) * 0.8)
  }

  // 4. Write manifest
  await writeManifest({
    language,
    cachedAt: new Date().toISOString(),
    cardIds: cards.map(c => c.id),
    audioUris: successfulUris,
  })
}

// ─── Cache status ─────────────────────────────────────────────────────────────

export interface OfflineCacheStatus {
  isCached: boolean
  language: SupportedLanguage | null
  cachedAt: Date | null
  cardCount: number
  audioCount: number
  /** True if cache is older than 24 hours */
  isStale: boolean
}

/**
 * Returns the current offline cache status for informational display in Settings.
 */
export async function getOfflineCacheStatus(): Promise<OfflineCacheStatus> {
  const manifest = await readManifest()
  if (!manifest) {
    return { isCached: false, language: null, cachedAt: null, cardCount: 0, audioCount: 0, isStale: true }
  }

  const cachedAt = new Date(manifest.cachedAt)
  const ageMs = Date.now() - cachedAt.getTime()
  const isStale = ageMs > 24 * 60 * 60 * 1000

  return {
    isCached: true,
    language: manifest.language,
    cachedAt,
    cardCount: manifest.cardIds.length,
    audioCount: manifest.audioUris.length,
    isStale,
  }
}

/**
 * Clear all offline cache files and the manifest.
 */
export async function clearOfflineCache(): Promise<void> {
  const info = await FileSystem.getInfoAsync(CACHE_ROOT)
  if (info.exists) {
    await FileSystem.deleteAsync(CACHE_ROOT, { idempotent: true })
  }
}
