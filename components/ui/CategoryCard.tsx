import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS, FONTS, SHADOWS, SPACING } from '@/constants/theme';

interface CategoryCardProps {
  id: string;
  name: string;
  image?: string | null;
  onPress: () => void;
  style?: any;
  index?: number;
}

export default function CategoryCard({
  id,
  name,
  image,
  onPress,
  style,
  index = 0,
}: CategoryCardProps) {
  const imageUrl = image || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';

  return (
    <Animated.View 
      entering={FadeIn.delay(index * 100).springify()}
      style={[styles.container, style]}
    >
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.touchable}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.name}>{name.toUpperCase()}</Text>
        </LinearGradient>
      </TouchableOpacity>  
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.large,
    margin: SPACING.sm,
    height: 180,
    width: 160,
    backgroundColor: COLORS.white,
  },
  touchable: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    justifyContent: 'flex-end',
    padding: SPACING.md,
  },
  name: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 18,
    letterSpacing: 1,
  },
});
