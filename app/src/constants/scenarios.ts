import { Scenario } from '../types'

// All 27 approved scenarios per AI_Rules.md §7.
// 9 per language × 3 languages = 27 total.
// Do not add, remove, or rename without updating AI_Rules.md.

const ZH_SCENARIOS: Scenario[] = [
  {
    id: 'zh-S01',
    language: 'zh',
    title: 'Dinner table with mom',
    tier: 1,
    turns: 8,
    description: 'A weeknight dinner at home. Mom is curious about your day and wants to make sure you\'ve eaten enough.',
    culturalContext: 'Chinese family meals are a central moment of connection. Questions about food and eating are expressions of care, not just conversation.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['吃饭', '好吃', '今天', '饿', '谢谢'],
  },
  {
    id: 'zh-S02',
    language: 'zh',
    title: 'Grocery run',
    tier: 1,
    turns: 6,
    description: 'You\'re at the market with a family member picking up ingredients for dinner.',
    culturalContext: 'Chinese wet markets and grocery stores are social spaces. Haggling and asking about freshness are normal and expected.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['买', '多少钱', '新鲜', '蔬菜', '水果'],
  },
  {
    id: 'zh-S03',
    language: 'zh',
    title: 'Phone call with 外婆',
    tier: 1,
    turns: 6,
    description: 'Your maternal grandmother calls to check in. She asks about your life and shares news from home.',
    culturalContext: '外婆 (maternal grandmother) relationships are often particularly warm. Long-distance calls are rituals of family continuity.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['外婆', '想你', '身体', '健康', '打电话'],
  },
  {
    id: 'zh-S04',
    language: 'zh',
    title: 'Lunar New Year gathering',
    tier: 2,
    turns: 10,
    description: 'The extended family is gathered for New Year. Relatives you rarely see want to catch up and ask about your life.',
    culturalContext: 'Chinese New Year gatherings involve 拜年 greetings, red envelopes, and questions about work and relationships that can feel intrusive but come from care.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['新年快乐', '恭喜发财', '红包', '拜年', '亲戚'],
  },
  {
    id: 'zh-S05',
    language: 'zh',
    title: 'Introducing your partner',
    tier: 2,
    turns: 10,
    description: 'You\'re bringing your partner home to meet your parents for the first time.',
    culturalContext: 'Meeting the parents is a significant milestone in Chinese families. Parents may ask direct questions about career, family background, and future plans.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['介绍', '男朋友', '女朋友', '家庭', '未来'],
  },
  {
    id: 'zh-S06',
    language: 'zh',
    title: 'Parent\'s doctor visit',
    tier: 2,
    turns: 8,
    description: 'You\'re accompanying a parent to a medical appointment and helping bridge communication.',
    culturalContext: 'Adult children often take on healthcare navigation for parents. This requires both emotional and practical language.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['医生', '症状', '药', '检查', '担心'],
  },
  {
    id: 'zh-S07',
    language: 'zh',
    title: 'Career choices talk',
    tier: 3,
    turns: 12,
    description: 'A serious conversation with a parent about your career direction — whether to change jobs, pursue further education, or follow a less traditional path.',
    culturalContext: 'Career conversations in Chinese families carry weight around filial duty, stability, and face. Parents may express concern through practical questions rather than direct opposition.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['工作', '前途', '压力', '梦想', '理解'],
  },
  {
    id: 'zh-S08',
    language: 'zh',
    title: 'Talking about feelings',
    tier: 3,
    turns: 10,
    description: 'Sharing something emotionally difficult with a family member — loneliness, stress, or feeling caught between two cultures.',
    culturalContext: 'Emotional disclosure is less common in traditional Chinese family communication. This conversation requires navigating indirect emotional language.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['感受', '孤独', '压力', '两边', '理解'],
  },
  {
    id: 'zh-S09',
    language: 'zh',
    title: 'Saying "I love you"',
    tier: 3,
    turns: 8,
    description: 'Finding ways to express love and gratitude to a parent or grandparent — directly or through actions.',
    culturalContext: '我爱你 is rarely said directly in traditional Chinese families. Love is expressed through acts of service, concern for health, and being present. This scenario explores that cultural gap.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['爱', '感谢', '陪伴', '心里', '表达'],
  },
]

const JA_SCENARIOS: Scenario[] = [
  {
    id: 'ja-S01',
    language: 'ja',
    title: 'Dinner with おかあさん',
    tier: 1,
    turns: 8,
    description: 'An evening meal at home with mom. She asks about your day and serves food with quiet care.',
    culturalContext: 'Japanese family meals involve attentiveness to others\' needs. Commenting on food and expressing appreciation are important rituals.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['ご飯', 'おいしい', '今日', 'ありがとう', 'おかあさん'],
  },
  {
    id: 'ja-S02',
    language: 'ja',
    title: 'Shopping with mom',
    tier: 1,
    turns: 6,
    description: 'Running errands with your mother at a neighborhood shop or market.',
    culturalContext: 'Japanese shopping culture involves specific politeness with shopkeepers. Family errands are moments of quiet companionship.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['買い物', '値段', '安い', '高い', 'いくら'],
  },
  {
    id: 'ja-S03',
    language: 'ja',
    title: 'Phone call with おばあちゃん',
    tier: 1,
    turns: 6,
    description: 'A check-in call with your grandmother. She shares local news and asks how you\'re doing.',
    culturalContext: 'Calls with Japanese grandparents often involve careful listening and appropriate responses. おばあちゃん may use older, regional expressions.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['おばあちゃん', '元気', '声', '久しぶり', '心配'],
  },
  {
    id: 'ja-S04',
    language: 'ja',
    title: 'New Year (お正月) gathering',
    tier: 2,
    turns: 10,
    description: 'The family gathers for New Year. You greet relatives and navigate the formal and informal registers of お正月.',
    culturalContext: 'お正月 is Japan\'s most important family holiday. Specific greetings (あけましておめでとうございます) and お年玉 (New Year money) are central traditions.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['あけましておめでとう', 'お正月', 'お年玉', '親戚', 'ご挨拶'],
  },
  {
    id: 'ja-S05',
    language: 'ja',
    title: 'Introducing your partner',
    tier: 2,
    turns: 10,
    description: 'Bringing a partner home to meet the family for the first time — navigating formal greetings and family expectations.',
    culturalContext: 'Japanese family introductions are formal occasions. The partner is expected to show deference and use keigo. Parents assess character through indirect observation.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['紹介', 'よろしくお願いします', '彼氏', '彼女', 'ご家族'],
  },
  {
    id: 'ja-S06',
    language: 'ja',
    title: 'Parent\'s doctor visit',
    tier: 2,
    turns: 8,
    description: 'Accompanying a parent to a medical appointment and helping with communication and understanding.',
    culturalContext: 'Healthcare in Japan involves specific honorific registers with doctors. Adult children often serve as advocates for aging parents.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['病院', '症状', '薬', '先生', '心配'],
  },
  {
    id: 'ja-S07',
    language: 'ja',
    title: 'Career path conversation',
    tier: 3,
    turns: 12,
    description: 'A conversation with a parent about an unconventional career choice or life decision.',
    culturalContext: 'Japanese family discussions about career often involve amae (indulgent dependence) and giri (obligation). Direct disagreement is uncommon — concern is expressed through questions.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['仕事', '将来', '不安', '夢', '理解'],
  },
  {
    id: 'ja-S08',
    language: 'ja',
    title: 'Talking about feelings',
    tier: 3,
    turns: 10,
    description: 'Opening up to a family member about personal struggles — the pressure of identity, belonging, or feeling between two worlds.',
    culturalContext: 'Direct emotional expression is culturally complex in Japanese families. 本音 (true feelings) vs 建前 (public face) is a real tension this scenario explores.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['気持ち', '本音', '寂しい', '辛い', '分かってほしい'],
  },
  {
    id: 'ja-S09',
    language: 'ja',
    title: 'Expressing gratitude and love',
    tier: 3,
    turns: 8,
    description: 'Finding words to express deep appreciation and love to a parent or grandparent.',
    culturalContext: '愛してる is rarely used even in Japanese families. Gratitude (ありがとう) said sincerely and specifically carries enormous emotional weight.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['感謝', 'ありがとう', '大切', '伝える', '親孝行'],
  },
]

const KO_SCENARIOS: Scenario[] = [
  {
    id: 'ko-S01',
    language: 'ko',
    title: 'Dinner with 어머니',
    tier: 1,
    turns: 8,
    description: 'Evening dinner at home with mom. She\'s made your favorite dish and asks about your day.',
    culturalContext: 'Korean mothers often express love through food and persistent offers to eat more. Complimenting the food is an important act of appreciation.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['밥', '맛있어요', '오늘', '감사합니다', '어머니'],
  },
  {
    id: 'ko-S02',
    language: 'ko',
    title: 'Market run with mom',
    tier: 1,
    turns: 6,
    description: 'A trip to the Korean market with your mother to buy groceries.',
    culturalContext: 'Korean markets are social and noisy. Vendors and customers interact warmly. Knowing basic transaction vocabulary shows respect and belonging.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['얼마예요', '싸다', '비싸다', '주세요', '시장'],
  },
  {
    id: 'ko-S03',
    language: 'ko',
    title: 'Phone call with 할머니',
    tier: 1,
    turns: 6,
    description: 'A call with your paternal grandmother. She expresses concern and shares family news.',
    culturalContext: '할머니 (paternal grandmother) relationships carry specific address terms and respect registers. Long-distance calls bridge generational and geographic distance.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['할머니', '보고싶어요', '건강', '전화하다', '안녕하세요'],
  },
  {
    id: 'ko-S04',
    language: 'ko',
    title: 'Chuseok gathering',
    tier: 2,
    turns: 10,
    description: 'The extended family is gathered for Chuseok. You greet relatives and participate in family rituals.',
    culturalContext: 'Chuseok is Korea\'s major harvest holiday. 차례 (ancestral rites), 성묘 (visiting graves), and specific foods like 송편 (rice cakes) are central.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['추석', '차례', '성묘', '송편', '친척'],
  },
  {
    id: 'ko-S05',
    language: 'ko',
    title: 'Introducing your partner',
    tier: 2,
    turns: 10,
    description: 'Bringing a partner home for the first time. Parents ask careful questions about family and future.',
    culturalContext: 'Korean parents assess a partner\'s family background (집안) carefully. The partner must demonstrate respectful use of 존댓말 at all times.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['소개하다', '남자친구', '여자친구', '집안', '앞으로'],
  },
  {
    id: 'ko-S06',
    language: 'ko',
    title: 'Parent\'s doctor visit',
    tier: 2,
    turns: 8,
    description: 'Accompanying a parent to a medical appointment and helping navigate the visit.',
    culturalContext: 'Korean adult children routinely accompany parents to medical appointments. Knowing medical vocabulary and honorific registers with doctors is practical and important.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['병원', '증상', '약', '의사 선생님', '걱정'],
  },
  {
    id: 'ko-S07',
    language: 'ko',
    title: 'Career and future talk',
    tier: 3,
    turns: 12,
    description: 'A deep conversation with a parent about career direction — especially one that diverges from expectations.',
    culturalContext: 'Korean family pressure around career is intense, connected to 체면 (face) and social comparison. Parents often express anxiety as advice.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['직업', '미래', '압박', '꿈', '이해하다'],
  },
  {
    id: 'ko-S08',
    language: 'ko',
    title: 'Talking about feelings',
    tier: 3,
    turns: 10,
    description: 'Opening up about personal struggles — identity, belonging, or the weight of living between two cultures.',
    culturalContext: 'Emotional vulnerability in Korean families involves navigating 눈치 (reading the room) and 정 (deep relational bond). Directness about feelings is unusual but powerful.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['마음', '외롭다', '힘들다', '정', '솔직하게'],
  },
  {
    id: 'ko-S09',
    language: 'ko',
    title: '사랑해 (Saying I love you)',
    tier: 3,
    turns: 8,
    description: 'Finding the words to express love and gratitude to a parent or grandparent.',
    culturalContext: '사랑해 is used, though often felt more than spoken in Korean families. 감사합니다 said sincerely, with context, can carry more weight than the word alone.',  // CULTURAL_REVIEW_NEEDED
    vocabTargets: ['사랑해요', '감사합니다', '소중하다', '전하다', '효도'],
  },
]

export const ALL_SCENARIOS: Scenario[] = [...ZH_SCENARIOS, ...JA_SCENARIOS, ...KO_SCENARIOS]

export function getScenariosByLanguage(language: Scenario['language']): Scenario[] {
  return ALL_SCENARIOS.filter(s => s.language === language)
}

export function getScenarioById(id: string): Scenario | undefined {
  return ALL_SCENARIOS.find(s => s.id === id)
}
