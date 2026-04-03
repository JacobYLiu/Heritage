import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, ViewStyle } from 'react-native'

interface BaseTemplateProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function BaseTemplate({ children, style }: BaseTemplateProps) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
})
