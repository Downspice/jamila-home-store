import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
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
  // Default image if none provided
  const imageUrl = image || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';

  return (
    <Animated.View 
      entering={FadeIn.delay(index * 100).springify()}
      style={[styles.container, style]}
    >
      <TouchableOpacity 
        activeOpacity={0.8}
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
          colors={['transparent', COLORS.black70]}
          style={styles.gradient}
        >
          <Text style={styles.name}>{name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
    margin: SPACING.xs,
    height: 120,
    width: 160,
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 16,
  },
  name: {
    color: COLORS.white,
    fontFamily: 'Playfair-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
});