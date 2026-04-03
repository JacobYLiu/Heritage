import { SkillScore, UserProfile } from '../types'

type HeritageBackground = UserProfile['heritageBackground']
type SelfReportedLevel = UserProfile['selfReportedLevel']

export function seedSkillScore(
  background: HeritageBackground,
  confidence: SelfReportedLevel
): SkillScore {
  // Listening: driven by heritage background (years of passive exposure)
  const listeningBase: Record<HeritageBackground, number> = {
    yes: 55,
    somewhat: 35,
    no: 15,
  }

  // Speaking: driven by self-reported comfort
  const speakingBase: Record<SelfReportedLevel, number> = {
    very: 50,
    'a-little': 25,
    'not-at-all': 10,
  }

  // Reading: heritage background + moderate confidence boost
  const readingBase: Record<HeritageBackground, number> = {
    yes: 30,
    somewhat: 20,
    no: 10,
  }

  // Writing: lowest starting point — rarely practiced at home
  const writingBase: Record<HeritageBackground, number> = {
    yes: 20,
    somewhat: 12,
    no: 5,
  }

  return {
    listening: listeningBase[background],
    speaking: speakingBase[confidence],
    reading: readingBase[background],
    writing: writingBase[background],
    lastUpdated: new Date(),
  }
}
