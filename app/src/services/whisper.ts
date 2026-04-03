import { SupportedLanguage } from '../types'
import { AppError } from '../types/errors'
import { getWhisperApiKey } from '../config/secrets'

const WHISPER_URL = 'https://api.openai.com/v1/audio/transcriptions'

const LANGUAGE_HINT: Record<SupportedLanguage, string> = {
  zh: 'zh',
  ja: 'ja',
  ko: 'ko',
}

interface WhisperWord {
  word: string
  probability: number
}

interface WhisperResponse {
  text: string
  words?: WhisperWord[]
  language?: string
}

export async function transcribeAudio(
  audioUri: string,
  languageHint: SupportedLanguage
): Promise<{ transcript: string; wordConfidences: number[]; detectedLanguage: string }> {
  const apiKey = await getWhisperApiKey()

  // Build multipart form — React Native FormData accepts file URIs
  const formData = new FormData()
  formData.append('file', {
    uri: audioUri,
    name: 'audio.m4a',
    type: 'audio/m4a',
  } as unknown as Blob)
  formData.append('model', 'whisper-1')
  formData.append('language', LANGUAGE_HINT[languageHint])
  formData.append('response_format', 'verbose_json')
  formData.append('timestamp_granularities[]', 'word')

  let response: Response
  try {
    response = await fetch(WHISPER_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    })
  } catch (err) {
    throw new AppError('WHISPER_TRANSCRIPTION_FAILED', `Network error calling Whisper: ${err}`)
  }

  if (!response.ok) {
    const body = await response.text()
    throw new AppError('WHISPER_TRANSCRIPTION_FAILED', `Whisper API ${response.status}: ${body}`)
  }

  const data = await response.json() as WhisperResponse
  const wordConfidences = (data.words ?? []).map(w => w.probability)

  return {
    transcript: data.text.trim(),
    wordConfidences,
    detectedLanguage: data.language ?? LANGUAGE_HINT[languageHint],
  }
}
