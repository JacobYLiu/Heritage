import React from 'react'
import { ScrollView, StyleSheet, ViewStyle } from 'react-native'
import { BaseTemplate } from './BaseTemplate'

interface ScrollTemplateProps {
  children: React.ReactNode
  style?: ViewStyle
  contentStyle?: ViewStyle
}

export function ScrollTemplate({ children, style, contentStyle }: ScrollTemplateProps) {
  return (
    <BaseTemplate style={style}>
      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </BaseTemplate>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
})
