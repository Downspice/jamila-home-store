import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Screen2() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Features</Text>
      <Button title="Next" onPress={() => router.push('/(onboarding)/screen3')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
