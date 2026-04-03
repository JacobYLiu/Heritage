import { SupportedLanguage } from '../types'

interface AppSubtitle {
  script: string
  romanization: string
  meaning: string
}

export function getAppSubtitle(language: SupportedLanguage): AppSubtitle {
  const subtitles: Record<SupportedLanguage, AppSubtitle> = {
    zh: { script: '根语', romanization: 'Gēn Yǔ', meaning: 'root language' },
    ja: { script: '継承語', romanization: 'Keishōgo', meaning: 'inherited language' },
    ko: { script: '유산어', romanization: 'Yusan-eo', meaning: 'heritage language' },
  }
  return subtitles[language]
}
