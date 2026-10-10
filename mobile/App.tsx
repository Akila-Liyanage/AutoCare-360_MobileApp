import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AutoCare 360</Text>
      <Text style={styles.subtitle}>Mobile App Environment Ready</Text>
      <Text style={styles.info}>Expo & TypeScript configured successfully.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#f8fafc',
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
