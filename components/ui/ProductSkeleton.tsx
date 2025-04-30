import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import Animated, { FadeInRight } from 'react-native-reanimated';
import GlassmorphicCard from './GlassmorphicCard';

type ProductSkeletonProps = {
  count?: number;
};

export default function ProductSkeleton({ count = 6 }: ProductSkeletonProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          entering={FadeInRight.delay(index * 100).springify()}
          style={styles.skeletonContainer}
        >
          <View style={styles.imageSkeleton} />
          <GlassmorphicCard style={styles.infoCard}>
            <View style={styles.nameSkeleton} />
            <View style={styles.likeContainer}>
              <View style={styles.heartSkeleton} />
              <View style={styles.countSkeleton} />
            </View>
          </GlassmorphicCard>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  skeletonContainer: {
    flex: 1,
    margin: SPACING.xs,
    width: 150,
    maxWidth: '100%',
  },
  imageSkeleton: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.black10,
    borderRadius: 12,
  },
  infoCard: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
  },
  nameSkeleton: {
    width: '80%',
    height: 16,
    backgroundColor: COLORS.black10,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartSkeleton: {
    width: 18,
    height: 18,
    backgroundColor: COLORS.black10,
    borderRadius: 9,
    marginRight: SPACING.xs,
  },
  countSkeleton: {
    width: 30,
    height: 14,
    backgroundColor: COLORS.black10,
    borderRadius: 7,
  },
}); 