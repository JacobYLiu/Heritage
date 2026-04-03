import React from 'react'
import { Text, TextStyle } from 'react-native'
import { useUserStore } from '../../stores/userStore'

interface ScriptTextProps {
  simplified: string
  traditional: string
  style?: TextStyle
}

// All Chinese text must route through this component.
// It reads userStore.chineseScript and renders Simplified or Traditional accordingly.
export function ScriptText({ simplified, traditional, style }: ScriptTextProps) {
  const { profile } = useUserStore()
  const script = profile?.selectedLanguage === 'zh' ? (profile?.chineseScript ?? 'simplified') : 'simplified'
  return <Text style={style}>{script === 'traditional' ? traditional : simplified}</Text>
}
