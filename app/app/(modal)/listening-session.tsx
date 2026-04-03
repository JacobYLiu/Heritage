import { useLocalSearchParams } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { ListeningScreen } from '../../src/screens/listening/ListeningScreen'

export default function ListeningSessionModal() {
  const { clipUri, language } = useLocalSearchParams<{ clipUri: string; language: string }>()

  if (!clipUri || !language) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No clip selected.</Text>
      </View>
    )
  }

  return <ListeningScreen clipUri={clipUri} language={language} />
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  errorText: { fontSize: 16, color: '#888888' },
})
