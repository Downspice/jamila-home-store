import { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import AnimatedSplashScreen from "@/components/shared/AnimatedSplashScreen";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // For demo purposes, we'll show the splash screen for a minimum time
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  // useEffect(() => {
  //   router.replace("/(onboarding)/screen1");
  // }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AnimatedSplashScreen onFinish={() => setIsLoading(false)} />
      </View>
    );
  }

  return <Redirect href="/(onboarding)/screen1" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});