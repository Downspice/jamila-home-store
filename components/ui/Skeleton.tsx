import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@/constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  style?: any;
  borderRadius?: number;
}

export default function Skeleton({ width, height, style, borderRadius = 4 }: SkeletonProps) {
  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View 
        style={[
          styles.shimmer,
          {
            width: '100%',
            height: '100%',
            borderRadius,
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white50,
    overflow: 'hidden',
  },
  shimmer: {
    backgroundColor: COLORS.white10,
  },
}); 