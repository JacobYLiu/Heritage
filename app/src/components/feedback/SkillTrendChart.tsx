// SkillTrendChart — 30-day skill progress chart built with pure React Native Views.
// No SVG or charting library required. Upgrade to react-native-svg for smoother paths if needed.
import React, { useState } from 'react'
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native'

export type SkillKey = 'listening' | 'speaking' | 'reading' | 'writing'

export interface SkillDataPoint {
  /** Day offset from today: 0 = today, 29 = 30 days ago */
  dayOffset: number
  scores: Record<SkillKey, number>
}

interface SkillTrendChartProps {
  data: SkillDataPoint[]          // Must have at least 2 points, oldest first
  activeSkill: SkillKey
  color: string
}

const CHART_HEIGHT = 120
const DOT_RADIUS = 3
const LINE_THICKNESS = 2

/**
 * Render a single line segment between two pixel coordinates.
 * Uses center-based positioning so the default transform origin (center) is correct.
 * This avoids needing transformOrigin which is not in React Native's ViewStyle type.
 */
function LineSegment({
  x1, y1, x2, y2, color,
}: {
  x1: number; y1: number; x2: number; y2: number
  color: string
}) {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * (180 / Math.PI)

  // Position the center of the segment at the midpoint of (x1,y1)–(x2,y2).
  // React Native rotates around the center by default, so we don't need transformOrigin.
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2

  return (
    <View
      style={{
        position: 'absolute',
        left: cx - length / 2,
        top: cy - LINE_THICKNESS / 2,
        width: length,
        height: LINE_THICKNESS,
        backgroundColor: color,
        borderRadius: LINE_THICKNESS / 2,
        transform: [{ rotate: `${angle}deg` }],
        opacity: 0.85,
      }}
    />
  )
}

export function SkillTrendChart({ data, activeSkill, color }: SkillTrendChartProps) {
  const [chartWidth, setChartWidth] = useState(0)

  if (data.length < 2) return null

  function onLayout(event: LayoutChangeEvent) {
    setChartWidth(event.nativeEvent.layout.width)
  }

  // Normalise score (0–100) → pixel y (high score = low y)
  function toY(score: number): number {
    const clamped = Math.max(0, Math.min(100, score))
    // Add 8px padding top/bottom so dots don't clip
    return (CHART_HEIGHT - 16) * (1 - clamped / 100) + 8
  }

  function toX(index: number): number {
    if (data.length <= 1) return chartWidth / 2
    return (index / (data.length - 1)) * chartWidth
  }

  const scores = data.map(d => d.scores[activeSkill])

  // Week labels — show at 0%, 33%, 66%, 100% of chart width
  const weekMarkers = [
    { label: '30d ago', frac: 0 },
    { label: '20d', frac: 0.33 },
    { label: '10d', frac: 0.66 },
    { label: 'Today', frac: 1 },
  ]

  return (
    <View style={styles.wrapper}>
      <View style={styles.canvas} onLayout={onLayout}>
        {chartWidth > 0 && (
          <>
            {/* Grid lines at 25%, 50%, 75% */}
            {[25, 50, 75].map(tick => (
              <View
                key={tick}
                style={[styles.gridLine, { top: toY(tick) }]}
              />
            ))}

            {/* Line segments */}
            {scores.slice(0, -1).map((score, i) => (
              <LineSegment
                key={i}
                x1={toX(i)}
                y1={toY(score)}
                x2={toX(i + 1)}
                y2={toY(scores[i + 1])}
                color={color}
              />
            ))}

            {/* Data dots — render only first, last, and any inflection points to avoid clutter */}
            {scores.map((score, i) => {
              const isEdge = i === 0 || i === scores.length - 1
              const isInflection = i > 0 && i < scores.length - 1 &&
                ((scores[i] > scores[i - 1] && scores[i] > scores[i + 1]) ||
                 (scores[i] < scores[i - 1] && scores[i] < scores[i + 1]))
              if (!isEdge && !isInflection) return null
              return (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left: toX(i) - DOT_RADIUS,
                    top: toY(score) - DOT_RADIUS,
                    width: DOT_RADIUS * 2,
                    height: DOT_RADIUS * 2,
                    borderRadius: DOT_RADIUS,
                    backgroundColor: color,
                  }}
                />
              )
            })}
          </>
        )}
      </View>

      {/* X-axis week labels */}
      <View style={styles.axisRow}>
        {weekMarkers.map(m => (
          <Text
            key={m.label}
            style={[styles.axisLabel, { position: 'absolute', left: `${m.frac * 100}%` as `${number}%` }]}
          >
            {m.label}
          </Text>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { gap: 4 },
  canvas: {
    height: CHART_HEIGHT,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#EBEBEB',
  },
  axisRow: {
    height: 16,
    position: 'relative',
  },
  axisLabel: {
    fontSize: 10,
    color: '#AAAAAA',
    transform: [{ translateX: -16 }],
  },
})
