import { useLocalSearchParams } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { RoleplaySession } from '../../src/screens/roleplay/RoleplaySession'

export default function RoleplaySessionModal() {
  const { scenarioId } = useLocalSearchParams<{ scenarioId: string }>()

  if (!scenarioId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No scenario selected.</Text>
      </View>
    )
  }

  return <RoleplaySession scenarioId={scenarioId} />
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  errorText: { fontSize: 16, color: '#888888' },
})
