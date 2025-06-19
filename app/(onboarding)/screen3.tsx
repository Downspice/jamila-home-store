import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Screen3() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You're All Set!</Text>
      <Button title="Get Started" onPress={() => router.replace('/(tabs)')} />
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
