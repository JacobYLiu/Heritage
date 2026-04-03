import * as FileSystem from 'expo-file-system/legacy'
import { SupportedLanguage } from '../types'
import { AppError } from '../types/errors'
import { getElevenLabsApiKey } from '../config/secrets'
import { VOICE_IDS } from '../constants/voices'

const ELEVENLABS_URL = 'https://api.elevenlabs.io/v1/text-to-speech'
const CACHE_DIR = `${FileSystem.cacheDirectory}tts/`

// Simple deterministic hash for cache key — not cryptographic, just unique per text+lang.
function cacheKey(text: string, language: SupportedLanguage): string {
  let hash = 5381
  const str = text + language
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
    hash = hash & hash // 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

async function ensureCacheDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(CACHE_DIR)
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true })
  }
}

export async function synthesizeSpeech(
  text: string,
  language: SupportedLanguage
): Promise<string> {
  await ensureCacheDir()

  const key = cacheKey(text, language)
  const cachedPath = `${CACHE_DIR}${key}.mp3`

  // Return cached file if it exists
  const cached = await FileSystem.getInfoAsync(cachedPath)
  if (cached.exists) return cachedPath

  const apiKey = await getElevenLabsApiKey()
  const voiceId = VOICE_IDS[language]

  let response: Response
  try {
    response = await fetch(`${ELEVENLABS_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    })
  } catch (err) {
    throw new AppError('ELEVENLABS_SYNTHESIS_FAILED', `Network error calling ElevenLabs: ${err}`)
  }

  if (!response.ok) {
    const body = await response.text()
    throw new AppError('ELEVENLABS_SYNTHESIS_FAILED', `ElevenLabs API ${response.status}: ${body}`)
  }

  // Write audio bytes to local cache
  const arrayBuffer = await response.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  const binary = Array.from(bytes).map(b => String.fromCharCode(b)).join('')
  const base64 = btoa(binary)

  await FileSystem.writeAsStringAsync(cachedPath, base64, {
    encoding: FileSystem.EncodingType.Base64,
  })

  return cachedPath
}
