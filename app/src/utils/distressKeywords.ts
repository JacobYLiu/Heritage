// Keywords that may indicate the user is in emotional distress during roleplay.
// If detected, the scenario pauses and shows a supportive message.
const DISTRESS_KEYWORDS = [
  'help', 'stop', 'quit', 'exit', 'leave me alone',
  'i hate this', 'i can\'t do this', 'i give up', 'this is too hard',
  'i\'m crying', 'i\'m upset', 'i\'m angry', 'i\'m sad',
  'overwhelmed', 'triggered', 'anxious', 'panic',
]

export function containsDistressSignal(transcript: string): boolean {
  const lower = transcript.toLowerCase()
  return DISTRESS_KEYWORDS.some(keyword => lower.includes(keyword))
}
