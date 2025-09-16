import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

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
  const imageUrl =
    image || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100).springify()}
      style={[styles.container, style]}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.touchable}>
        <View style={styles.inner}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
          <Text style={styles.name}>{name}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const IMAGE_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: SPACING.sm,
    width: 120,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2, // makes it a perfect circle
    backgroundColor: COLORS.lightGray, // fallback background
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    textAlign: 'center',
  },
});
