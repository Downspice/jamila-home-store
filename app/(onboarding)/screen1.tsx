import { StyleSheet } from "react-native";
import OnboardingScreen from "@/components/screenDisplays/Onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Screen1() {
  return (
    <OnboardingScreen
      onFinish={async () => {
        await AsyncStorage.setItem("hasSeenOnboarding", "true");
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
