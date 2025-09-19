import { StyleSheet } from "react-native";
import OnboardingScreen from "@/components/screenDisplays/Onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default async function Screen1() {
  const [val, setVal]=useState('');
useEffect(() => {
  const fetchData = async () => {
    const data = await AsyncStorage.getItem("hasSeenOnboarding");
    setVal(data ?? "");
  };

  fetchData();
}, []);
  
  console.log("val.....", val);
  return (
    <>
      {val== "true" ? (
        <>
          <Redirect href="/(auth)/login" />
        </>
      ) : (
        <OnboardingScreen
          onFinish={async () => {
            await AsyncStorage.setItem("hasSeenOnboarding", "true");
          }}
        />
      )}
    </>
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
