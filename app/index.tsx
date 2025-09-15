import { useEffect, useState } from "react";
import { View, StyleSheet, InteractionManager } from "react-native";
import { useRouter } from "expo-router";
import AnimatedSplashScreen from "@/components/shared/AnimatedSplashScreen";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const runAfterInteractions = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2500)); // splash delay

      InteractionManager.runAfterInteractions(() => {
        router.replace("/(onboarding)/screen1");
      });
    };

    runAfterInteractions();
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedSplashScreen onFinish={() => setIsLoading(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
