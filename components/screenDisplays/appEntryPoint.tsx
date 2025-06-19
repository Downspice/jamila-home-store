import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "@/components/screenDisplays/Onboarding";
import RootLayout from "@/app/_layout";
 
export default function AppEntryPoint() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
  const debugCheck = async () => {
    const seen = await AsyncStorage.getItem("hasSeenOnboarding");
    console.log("hasSeenOnboarding:", seen);
  };
  debugCheck();
}, []);

  useEffect(() => {
  /**
   * Checks if the user has seen the onboarding screen by checking if the key "hasSeenOnboarding" exists in AsyncStorage.
   * If the key does not exist, sets showOnboarding to true. If it does exist, sets showOnboarding to false.
   */
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      setShowOnboarding(seen !== "true");
    };
    checkOnboarding();
  }, []);

  if (showOnboarding === null) return null;
console.log("showOnboarding:", showOnboarding);

  if (showOnboarding) {
    return <OnboardingScreen onFinish={() => setShowOnboarding(false)} />;
  }

  return <RootLayout />;
}
