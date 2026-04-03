import React from 'react'
import { Text, TextStyle } from 'react-native'

interface RomanizationTextProps {
  text: string
  style?: TextStyle
}

export function RomanizationText({ text, style }: RomanizationTextProps) {
  return <Text style={style}>{text}</Text>
}
