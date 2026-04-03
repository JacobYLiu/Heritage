import { SupportedLanguage } from '../types'

export interface FamilyTerm {
  id: string
  scriptSimplified: string    // Simplified Chinese or standard script for ja/ko
  scriptTraditional: string   // Traditional Chinese; same as simplified for ja/ko
  romanization: string
  meaning: string             // English meaning
  usageNote: string           // When / who uses this term
}

export interface FamilyTermGroup {
  groupId: string
  groupLabel: string          // e.g. "Paternal Grandparents"
  culturalNote: string
  terms: FamilyTerm[]
}

export interface HonorificsSection {
  sectionId: string
  sectionTitle: string        // e.g. "Family Address Terms" | "Honorific Suffixes"
  groups: FamilyTermGroup[]
}

// ─── Chinese ─────────────────────────────────────────────────────────────────
// Mandarin family address terms. Maternal/paternal distinctions are a core
// feature of Chinese — e.g. you address your maternal grandmother differently
// from your paternal grandmother. Both simplified and traditional forms provided.

const zhSections: HonorificsSection[] = [
  {
    sectionId: 'zh-grandparents',
    sectionTitle: 'Grandparents',
    groups: [
      {
        groupId: 'zh-paternal-grandparents',
        groupLabel: 'Paternal Grandparents (爸爸那边)',
        culturalNote: 'Your father\'s parents. In traditional households, paternal grandparents often live with or near the family.',
        terms: [
          {
            id: 'zh-nainai',
            scriptSimplified: '奶奶',
            scriptTraditional: '奶奶',
            romanization: 'nǎi nai',
            meaning: 'Paternal grandmother',
            usageNote: 'Your father\'s mother. Used directly as an address term.',
          },
          {
            id: 'zh-yeye',
            scriptSimplified: '爷爷',
            scriptTraditional: '爺爺',
            romanization: 'yé ye',
            meaning: 'Paternal grandfather',
            usageNote: 'Your father\'s father. Used directly as an address term.',
          },
        ],
      },
      {
        groupId: 'zh-maternal-grandparents',
        groupLabel: 'Maternal Grandparents (妈妈那边)',
        culturalNote: 'Your mother\'s parents. Maternal grandparents are addressed with entirely different terms — a key distinction in Chinese.',
        terms: [
          {
            id: 'zh-waipo',
            scriptSimplified: '外婆',
            scriptTraditional: '外婆',
            romanization: 'wài pó',
            meaning: 'Maternal grandmother',
            usageNote: 'Your mother\'s mother. "外" means "outside/external" — reflects traditional family structure.',
          },
          {
            id: 'zh-waigong',
            scriptSimplified: '外公',
            scriptTraditional: '外公',
            romanization: 'wài gōng',
            meaning: 'Maternal grandfather',
            usageNote: 'Your mother\'s father.',
          },
        ],
      },
    ],
  },
  {
    sectionId: 'zh-parents-siblings',
    sectionTitle: 'Parents & Their Siblings',
    groups: [
      {
        groupId: 'zh-parents',
        groupLabel: 'Parents',
        culturalNote: 'Direct address terms for parents.',
        terms: [
          {
            id: 'zh-baba',
            scriptSimplified: '爸爸',
            scriptTraditional: '爸爸',
            romanization: 'bà ba',
            meaning: 'Father',
            usageNote: 'Informal. More formal: 父亲 (fù qīn).',
          },
          {
            id: 'zh-mama',
            scriptSimplified: '妈妈',
            scriptTraditional: '媽媽',
            romanization: 'mā ma',
            meaning: 'Mother',
            usageNote: 'Informal. More formal: 母亲 (mǔ qīn).',
          },
        ],
      },
      {
        groupId: 'zh-paternal-aunts-uncles',
        groupLabel: 'Paternal Aunts & Uncles (爸爸那边)',
        culturalNote: 'Your father\'s siblings. Each position in the family birth order has a distinct term.',
        terms: [
          {
            id: 'zh-bobo',
            scriptSimplified: '伯伯',
            scriptTraditional: '伯伯',
            romanization: 'bó bo',
            meaning: 'Father\'s elder brother',
            usageNote: 'Your father\'s older brother — distinct from 叔叔 who is younger.',
          },
          {
            id: 'zh-shushu',
            scriptSimplified: '叔叔',
            scriptTraditional: '叔叔',
            romanization: 'shū shu',
            meaning: 'Father\'s younger brother',
            usageNote: 'Your father\'s younger brother. Also used informally for unrelated adult men.',
          },
          {
            id: 'zh-gugu',
            scriptSimplified: '姑姑',
            scriptTraditional: '姑姑',
            romanization: 'gū gu',
            meaning: 'Father\'s sister',
            usageNote: 'Your father\'s sister, regardless of age relative to father.',
          },
        ],
      },
      {
        groupId: 'zh-maternal-aunts-uncles',
        groupLabel: 'Maternal Aunts & Uncles (妈妈那边)',
        culturalNote: 'Your mother\'s siblings. These are completely different terms from paternal equivalents.',
        terms: [
          {
            id: 'zh-jiujiu',
            scriptSimplified: '舅舅',
            scriptTraditional: '舅舅',
            romanization: 'jiù jiu',
            meaning: 'Mother\'s brother',
            usageNote: 'Your mother\'s brother. Contrast with 叔叔/伯伯 on your father\'s side.',
          },
          {
            id: 'zh-yima',
            scriptSimplified: '姨妈',
            scriptTraditional: '姨媽',
            romanization: 'yí mā',
            meaning: 'Mother\'s sister',
            usageNote: 'Your mother\'s sister. Also 阿姨 (ā yí) in informal speech.',
          },
        ],
      },
    ],
  },
  {
    sectionId: 'zh-siblings',
    sectionTitle: 'Siblings & Cousins',
    groups: [
      {
        groupId: 'zh-siblings',
        groupLabel: 'Siblings',
        culturalNote: 'Chinese distinguishes older and younger siblings by different words entirely.',
        terms: [
          {
            id: 'zh-gege',
            scriptSimplified: '哥哥',
            scriptTraditional: '哥哥',
            romanization: 'gē ge',
            meaning: 'Older brother',
            usageNote: 'Address your older brother directly as 哥哥 or just 哥.',
          },
          {
            id: 'zh-didi',
            scriptSimplified: '弟弟',
            scriptTraditional: '弟弟',
            romanization: 'dì di',
            meaning: 'Younger brother',
            usageNote: 'You would use his name directly, not 弟弟, to address him.',
          },
          {
            id: 'zh-jiejie',
            scriptSimplified: '姐姐',
            scriptTraditional: '姐姐',
            romanization: 'jiě jie',
            meaning: 'Older sister',
            usageNote: 'Address your older sister as 姐姐 or just 姐.',
          },
          {
            id: 'zh-meimei',
            scriptSimplified: '妹妹',
            scriptTraditional: '妹妹',
            romanization: 'mèi mei',
            meaning: 'Younger sister',
            usageNote: 'As with younger brother, you\'d use her name directly.',
          },
        ],
      },
    ],
  },
]

// ─── Japanese ─────────────────────────────────────────────────────────────────
// Japanese honorific suffixes and basic keigo distinctions.
// All terms use standard script (no simplified/traditional distinction needed).

const jaSections: HonorificsSection[] = [
  {
    sectionId: 'ja-suffixes',
    sectionTitle: 'Honorific Suffixes (敬称)',
    groups: [
      {
        groupId: 'ja-common-suffixes',
        groupLabel: 'Common Name Suffixes',
        culturalNote: 'Japanese names are rarely used bare outside of very close friends or children. Using the right suffix signals your relationship.',
        terms: [
          {
            id: 'ja-san',
            scriptSimplified: 'さん',
            scriptTraditional: 'さん',
            romanization: '-san',
            meaning: 'Mr. / Ms. / Mrs.',
            usageNote: 'Default polite suffix for adults. Safe in almost all contexts — workplaces, neighbors, teachers.',
          },
          {
            id: 'ja-kun',
            scriptSimplified: 'くん',
            scriptTraditional: 'くん',
            romanization: '-kun',
            meaning: 'Familiar (usually male)',
            usageNote: 'Used by seniors to juniors, or among male friends. A teacher calling a student by -kun.',
          },
          {
            id: 'ja-chan',
            scriptSimplified: 'ちゃん',
            scriptTraditional: 'ちゃん',
            romanization: '-chan',
            meaning: 'Affectionate / cute',
            usageNote: 'Used for children, close female friends, or pets. Also used for babies regardless of gender.',
          },
          {
            id: 'ja-sama',
            scriptSimplified: 'さま',
            scriptTraditional: 'さま',
            romanization: '-sama',
            meaning: 'Highly respectful',
            usageNote: 'Formal contexts: addressing customers (お客様), royalty, or very high-status individuals.',
          },
          {
            id: 'ja-senpai',
            scriptSimplified: '先輩',
            scriptTraditional: '先輩',
            romanization: 'senpai',
            meaning: 'Senior (school / workplace)',
            usageNote: 'Used as a suffix (田中先輩) or standalone to address someone more senior in your group.',
          },
          {
            id: 'ja-sensei',
            scriptSimplified: '先生',
            scriptTraditional: '先生',
            romanization: 'sensei',
            meaning: 'Teacher / expert',
            usageNote: 'Used for teachers, doctors, lawyers, politicians. Never use for yourself.',
          },
        ],
      },
      {
        groupId: 'ja-family-address',
        groupLabel: 'Family Address Terms',
        culturalNote: 'Japanese uses different words when speaking about your family (humble) vs. addressing them or referring to someone else\'s family (respectful).',
        terms: [
          {
            id: 'ja-okaasan',
            scriptSimplified: 'お母さん',
            scriptTraditional: 'お母さん',
            romanization: 'okāsan',
            meaning: 'Mother (address / polite reference)',
            usageNote: 'Use when talking to or about your own mother, or referring to someone else\'s. Humble form when speaking to outsiders: 母 (haha).',
          },
          {
            id: 'ja-otousan',
            scriptSimplified: 'お父さん',
            scriptTraditional: 'お父さん',
            romanization: 'otōsan',
            meaning: 'Father (address / polite reference)',
            usageNote: 'Use when talking to or about your father politely. Humble form: 父 (chichi).',
          },
          {
            id: 'ja-ojiisan',
            scriptSimplified: 'おじいさん',
            scriptTraditional: 'おじいさん',
            romanization: 'ojīsan',
            meaning: 'Grandfather',
            usageNote: 'Also used to refer to elderly men in general. Own grandfather (humble): 祖父 (sofu).',
          },
          {
            id: 'ja-obaasan',
            scriptSimplified: 'おばあさん',
            scriptTraditional: 'おばあさん',
            romanization: 'obāsan',
            meaning: 'Grandmother',
            usageNote: 'Also used for elderly women in general. Own grandmother (humble): 祖母 (sobo).',
          },
        ],
      },
    ],
  },
  {
    sectionId: 'ja-keigo-intro',
    sectionTitle: 'Keigo Basics (敬語)',
    groups: [
      {
        groupId: 'ja-keigo-levels',
        groupLabel: 'Levels of Politeness',
        culturalNote: 'Keigo (formal speech) is essential in workplaces, with elders, and with strangers. There are three levels: polite (丁寧語), respectful (尊敬語), and humble (謙譲語).',
        terms: [
          {
            id: 'ja-teineigo',
            scriptSimplified: '丁寧語',
            scriptTraditional: '丁寧語',
            romanization: 'teineigo',
            meaning: 'Polite language',
            usageNote: 'Uses です (desu) and ます (masu) endings. The baseline level for non-casual speech.',
          },
          {
            id: 'ja-sonkeigo',
            scriptSimplified: '尊敬語',
            scriptTraditional: '尊敬語',
            romanization: 'sonkeigo',
            meaning: 'Respectful language',
            usageNote: 'Raises the status of the listener\'s actions. E.g. いらっしゃる (irassharu) for "to be/go/come".',
          },
          {
            id: 'ja-kenjougo',
            scriptSimplified: '謙譲語',
            scriptTraditional: '謙譲語',
            romanization: 'kenjōgo',
            meaning: 'Humble language',
            usageNote: 'Lowers the speaker\'s own actions to elevate the listener. E.g. 参る (mairu) for "to go/come".',
          },
        ],
      },
    ],
  },
]

// ─── Korean ───────────────────────────────────────────────────────────────────
// Korean speech levels: 존댓말 (formal/polite) vs 반말 (informal).
// All terms use standard Hangul script.

const koSections: HonorificsSection[] = [
  {
    sectionId: 'ko-speech-levels',
    sectionTitle: 'Speech Levels (경어법)',
    groups: [
      {
        groupId: 'ko-formal-informal',
        groupLabel: '존댓말 vs 반말',
        culturalNote: 'Korean has two major registers: 존댓말 (jondaemal) used with elders, strangers, and in formal settings; and 반말 (banmal) used with close friends, younger people, and family.',
        terms: [
          {
            id: 'ko-jondaemal',
            scriptSimplified: '존댓말',
            scriptTraditional: '존댓말',
            romanization: 'jondaemal',
            meaning: 'Formal / honorific speech',
            usageNote: 'Use with elders, teachers, colleagues, strangers. Verbs end in -요 (-yo) or -습니다 (-seumnida).',
          },
          {
            id: 'ko-banmal',
            scriptSimplified: '반말',
            scriptTraditional: '반말',
            romanization: 'banmal',
            meaning: 'Informal / casual speech',
            usageNote: 'Use with close friends your age, younger siblings, or when invited to speak casually. Using 반말 with an elder without permission is rude.',
          },
          {
            id: 'ko-haeyoche',
            scriptSimplified: '해요체',
            scriptTraditional: '해요체',
            romanization: 'haeyoche',
            meaning: 'Polite informal (-요 form)',
            usageNote: 'The most common everyday register. Polite but not stiff — used with acquaintances and in service interactions.',
          },
          {
            id: 'ko-hapshoche',
            scriptSimplified: '합쇼체',
            scriptTraditional: '합쇼체',
            romanization: 'hapshoche',
            meaning: 'Formal formal (-습니다 form)',
            usageNote: 'Very formal — used in news broadcasts, official presentations, first meetings in professional settings.',
          },
        ],
      },
      {
        groupId: 'ko-when-to-switch',
        groupLabel: 'When to Switch Registers',
        culturalNote: 'Switching to 반말 without consent is one of the most common social missteps for heritage speakers. Always start with 존댓말 and wait for the other person to suggest switching.',
        terms: [
          {
            id: 'ko-banmal-invite',
            scriptSimplified: '말 놓으세요',
            scriptTraditional: '말 놓으세요',
            romanization: 'mal no eu se yo',
            meaning: '"Please speak casually" (invitation)',
            usageNote: 'An elder or peer may say this to invite you to use 반말. Only switch after this invitation.',
          },
          {
            id: 'ko-age-first',
            scriptSimplified: '나이가 어떻게 되세요?',
            scriptTraditional: '나이가 어떻게 되세요?',
            romanization: 'na i ga eo tteo ke doe se yo?',
            meaning: 'How old are you? (polite)',
            usageNote: 'Koreans often establish ages early in conversation to determine the appropriate speech level.',
          },
        ],
      },
    ],
  },
  {
    sectionId: 'ko-family-address',
    sectionTitle: 'Family Address Terms',
    groups: [
      {
        groupId: 'ko-immediate-family',
        groupLabel: 'Immediate Family',
        culturalNote: 'Korean family terms also vary by the speaker\'s gender in some cases (e.g. 오빠 vs 형 for "older brother").',
        terms: [
          {
            id: 'ko-abeoji',
            scriptSimplified: '아버지',
            scriptTraditional: '아버지',
            romanization: 'abeoji',
            meaning: 'Father (formal)',
            usageNote: 'Formal address. Informal: 아빠 (appa).',
          },
          {
            id: 'ko-eomeoni',
            scriptSimplified: '어머니',
            scriptTraditional: '어머니',
            romanization: 'eomeoni',
            meaning: 'Mother (formal)',
            usageNote: 'Formal address. Informal: 엄마 (omma).',
          },
          {
            id: 'ko-oppa',
            scriptSimplified: '오빠',
            scriptTraditional: '오빠',
            romanization: 'oppa',
            meaning: 'Older brother (said by females)',
            usageNote: 'A female speaker\'s older brother. Male speakers use 형 (hyeong) instead.',
          },
          {
            id: 'ko-hyeong',
            scriptSimplified: '형',
            scriptTraditional: '형',
            romanization: 'hyeong',
            meaning: 'Older brother (said by males)',
            usageNote: 'A male speaker\'s older brother. Female speakers use 오빠 instead.',
          },
          {
            id: 'ko-unni',
            scriptSimplified: '언니',
            scriptTraditional: '언니',
            romanization: 'eonni',
            meaning: 'Older sister (said by females)',
            usageNote: 'A female speaker\'s older sister. Male speakers use 누나 (nuna) instead.',
          },
          {
            id: 'ko-nuna',
            scriptSimplified: '누나',
            scriptTraditional: '누나',
            romanization: 'nuna',
            meaning: 'Older sister (said by males)',
            usageNote: 'A male speaker\'s older sister. Female speakers use 언니 instead.',
          },
        ],
      },
      {
        groupId: 'ko-grandparents',
        groupLabel: 'Grandparents',
        culturalNote: 'Korean grandparent terms do not distinguish maternal vs. paternal in the address term itself, but context and additional words clarify.',
        terms: [
          {
            id: 'ko-halmeoni',
            scriptSimplified: '할머니',
            scriptTraditional: '할머니',
            romanization: 'halmeoni',
            meaning: 'Grandmother',
            usageNote: 'Maternal: 외할머니 (oe-halmeoni). Paternal: 친할머니 (chin-halmeoni) or just 할머니.',
          },
          {
            id: 'ko-harabeoji',
            scriptSimplified: '할아버지',
            scriptTraditional: '할아버지',
            romanization: 'harabeoji',
            meaning: 'Grandfather',
            usageNote: 'Maternal: 외할아버지 (oe-harabeoji). Paternal: 친할아버지 (chin-harabeoji) or just 할아버지.',
          },
        ],
      },
    ],
  },
]

// ─── Public API ───────────────────────────────────────────────────────────────

export const FAMILY_TERMS: Record<SupportedLanguage, HonorificsSection[]> = {
  zh: zhSections,
  ja: jaSections,
  ko: koSections,
}

export function getSectionsForLanguage(language: SupportedLanguage): HonorificsSection[] {
  return FAMILY_TERMS[language]
}

export function getAllTermsForLanguage(language: SupportedLanguage): FamilyTerm[] {
  return getSectionsForLanguage(language).flatMap(section =>
    section.groups.flatMap(group => group.terms)
  )
}
