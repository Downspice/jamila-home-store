import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';

interface CategorySkeletonProps {
  count?: number;
}

export default function CategorySkeleton({ count = 1 }: CategorySkeletonProps) {
  const skeletons = Array(count).fill(0);

  return (
    <View style={styles.container}>
      {skeletons.map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.skeleton, useAnimatedStyle(() => ({
            opacity: withRepeat(
              withSequence(
                withDelay(index * 200, withTiming(0.3, { duration: 1000 })),
                withTiming(0.7, { duration: 1000 })
              ),
              -1,
              true
            )
          }))]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  skeleton: {
    width: '48%',
    height: 150,
    backgroundColor: COLORS.black10,
    borderRadius: 16,
    marginBottom: SPACING.md,
  },
}); 