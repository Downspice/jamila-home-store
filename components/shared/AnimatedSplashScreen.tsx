import React, { useEffect } from 'react';
import { View, StyleSheet, Text,Image } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing, 
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export default function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textPosition = useSharedValue(20);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Animate logo scale
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

    // Animate logo opacity
    logoOpacity.value = withTiming(1, { duration: 800 });

    // Animate text
    textPosition.value = withDelay(
      500, 
      withTiming(0, { 
        duration: 600, 
        easing: Easing.out(Easing.cubic) 
      })
    );
    textOpacity.value = withDelay(
      500, 
      withTiming(1, { duration: 800 })
    );

    // Fade out the entire splash screen
    const timeout = setTimeout(() => {
      containerOpacity.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      }, () => {
        runOnJS(onFinish)();
      });
    }, 2300);

    return () => clearTimeout(timeout);
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
    };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textPosition.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LinearGradient
        colors={['#000000', '#000000']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animated.View style={[ logoAnimatedStyle]}> 
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
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
    width: 300,
    height: 300,
  },
  title: {
    fontFamily: 'Playfair-Bold',
    fontSize: 32,
    color: COLORS.white,
    letterSpacing: 1,
  },
});