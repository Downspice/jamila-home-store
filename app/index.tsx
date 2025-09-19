import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AnimatedSplashScreen from "@/components/shared/AnimatedSplashScreen";

export default function Index() {
  const [splashFinished, setSplashFinished] = useState(false);
  const router = useRouter();

  
  useEffect(() => {
      console.log('Index: useEffect start');
    if (splashFinished) {
        console.log('Index: useEffect start 3');
      // ⏱ Navigate AFTER splash completes
      const timeout = setTimeout(() => {
        router.replace("/(onboarding)/screen1");
      }, 200); // small delay to let fade finish
      return () => clearTimeout(timeout);
    }
  }, [splashFinished]);

  return (
    <View style={styles.container}>
      {!splashFinished && (
        <AnimatedSplashScreen onFinish={() => setSplashFinished(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
