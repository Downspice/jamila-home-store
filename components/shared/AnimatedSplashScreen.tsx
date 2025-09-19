import React, { useEffect } from 'react';
import { View, StyleSheet, Image,Text, } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export default function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  console.log("here>>>>>>>>>")
  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo scale and opacity animation
    logoScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.2, {
        duration: 700,
        easing: Easing.out(Easing.cubic)
      }),
      withTiming(1, {
        duration: 300,
        easing: Easing.inOut(Easing.cubic)
      })
    );

    logoOpacity.value = withTiming(1, { duration: 800 });

    // Fade out the splash screen
      const timeout = setTimeout(() => {
    containerOpacity.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    }, () => {
      onFinish(); 
    });
  }, 2300);

  return () => clearTimeout(timeout);
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  return (
    // <Animated.View style={[styles.container, containerAnimatedStyle]}>
    //   <LinearGradient
    //     colors={['#1A120B', '#000000']} // Deep espresso to black
    //     start={{ x: 0.1, y: 0.1 }}
    //     end={{ x: 1, y: 1 }}
    //     style={styles.gradient}
    //   >
    //     <View style={styles.content}>
    //       <Animated.View style={logoAnimatedStyle}>
    //         <Image
    //           source={require('@/assets/images/logo.png')}
    //           style={styles.logo}
    //           onError={(e) => console.warn("❌ Splash logo failed to load", e.nativeEvent.error)}
    //         />          </Animated.View>
    //     </View>
    //   </LinearGradient>
    // </Animated.View>

      <View style={[styles.container, { backgroundColor: 'red' }]}>
    <Text>Testing Splash</Text>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 260,
    resizeMode: 'contain',
  },
});
