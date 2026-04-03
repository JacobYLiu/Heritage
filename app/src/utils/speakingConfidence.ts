// Computes a speaking confidence score (0–100) from Whisper per-word confidence values.
export function computeSpeakingConfidence(wordConfidences: number[]): number {
  if (wordConfidences.length === 0) return 0
  const avg = wordConfidences.reduce((sum, c) => sum + c, 0) / wordConfidences.length
  return Math.round(Math.max(0, Math.min(100, avg * 100)))
}
