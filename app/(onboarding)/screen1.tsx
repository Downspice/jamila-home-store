import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import OnboardingScreen from '@/components/screenDisplays/Onboarding';

export default function Screen1() {
  return (
    <OnboardingScreen/>
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
