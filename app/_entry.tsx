// app/_entry.tsx
import { useState, useEffect } from "react";
import { Slot } from "expo-router";
import OnboardingScreen from "@/components/screenDisplays/Onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppEntry() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      setShowOnboarding(seen !== "true");
    };
    checkOnboarding();
  }, []);

  if (showOnboarding === null) return null;
console.log("showOnboarding:", showOnboarding);

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onFinish={async () => {
          await AsyncStorage.setItem("hasSeenOnboarding", "true");
          setShowOnboarding(false);
        }}
      />
    );
  }

  return <Slot />;
}
