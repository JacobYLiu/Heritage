import { FlashCardCategory, SupportedLanguage } from '../types'

export const CATEGORY_DISPLAY: Record<FlashCardCategory, Record<SupportedLanguage, string>> = {
  'family-terms': { zh: '家庭称呼', ja: '家族の呼び方', ko: '가족 호칭' },
  'daily-home':   { zh: '日常家居', ja: '日常生活',     ko: '일상 생활' },
  'emotional-expression': { zh: '情感表达', ja: '感情表現', ko: '감정 표현' },
  'food-meals':   { zh: '饮食',     ja: '食事',         ko: '음식' },
  'health-body':  { zh: '健康身体', ja: '健康・体',     ko: '건강과 몸' },
}

export const ALL_CATEGORIES: FlashCardCategory[] = [
  'family-terms',
  'daily-home',
  'emotional-expression',
  'food-meals',
  'health-body',
]
