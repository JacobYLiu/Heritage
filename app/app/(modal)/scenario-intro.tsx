import { useLocalSearchParams } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { ScenarioIntro } from '../../src/screens/roleplay/ScenarioIntro'
import { getScenarioById } from '../../src/constants/scenarios'

export default function ScenarioIntroModal() {
  const { scenarioId } = useLocalSearchParams<{ scenarioId: string }>()
  const scenario = getScenarioById(scenarioId ?? '')

  if (!scenario) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Scenario not found.</Text>
      </View>
    )
  }

  return <ScenarioIntro scenario={scenario} />
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  errorText: { fontSize: 16, color: '#888888' },
})
