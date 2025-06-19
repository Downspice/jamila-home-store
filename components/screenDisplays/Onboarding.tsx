// OnboardingScreen.tsx
import { COLORS } from "@/constants/theme";
import { Redirect, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageBackground,
} from "react-native";

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "Welcome to Our App",
    description: "Discover timeless furniture that fits your style and space.",
    backgroundColor: "#FF6B6B",
    image: require("@/assets/images/onboarding1.png"),
  },
  {
    id: 2,
    title: "Explore handpicked collections for every room.",
    description: "Save your favorites and build your own catalog.",
    image: require("@/assets/images/onboarding1.png"),
    backgroundColor: "#4ECDC4",
  },
  {
    id: 3,
    title: "Like, share, and vote for what inspires you.",
    description: "Your voice helps shape our next collection.",
    image: require("@/assets/images/onboarding1.png"),
    backgroundColor: "#15535C",
  },
  {
    id: 4,
    title: "Let’s find the perfect piece for your home.",
    description: "Start exploring now.",
    image: require("@/assets/images/onboarding1.png"),
    backgroundColor: "#15535C",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < 4 - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      console.log("Navigating to HomeScreen");
      router.replace("/login");
    }
  };

  return (
    <View style={[styles.container]}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <ImageBackground source={item.image} resizeMode="cover">
            <View style={[styles.pageContainer]}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </ImageBackground>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? "#fff" : "rgba(255,255,255,0.5)",
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentIndex === 4 - 1 ? "Done" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  pageContainer: {
    width: width,
    height: height,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
    bottom: 170,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 60,
    width,
    alignItems: "center",
  },
  dots: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  nextButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  nextButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
});
