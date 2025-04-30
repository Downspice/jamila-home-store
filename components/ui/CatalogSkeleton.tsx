import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import Animated, { FadeInRight } from 'react-native-reanimated';
import GlassmorphicCard from './GlassmorphicCard';

type CatalogSkeletonProps = {
  count?: number;
};

export default function CatalogSkeleton({ count = 3 }: CatalogSkeletonProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          entering={FadeInRight.delay(index * 100).springify()}
          style={styles.skeletonContainer}
        >
          <GlassmorphicCard 
            style={styles.card}
            tint="light"
            intensity={20}
            containerStyle={styles.cardContainer}
          >
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <View style={styles.iconSkeleton} />
              </View>
              <View style={styles.textContainer}>
                <View style={styles.nameSkeleton} />
                <View style={styles.countSkeleton} />
              </View>
              <View style={styles.chevronSkeleton} />
            </View>
          </GlassmorphicCard>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  skeletonContainer: {
    marginBottom: SPACING.md,
  },
  card: {
    width: '100%',
    padding: SPACING.md,
  },
  cardContainer: {
    borderRadius: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.black10,
  },
  textContainer: {
    flex: 1,
  },
  nameSkeleton: {
    width: '60%',
    height: 16,
    backgroundColor: COLORS.black10,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
  countSkeleton: {
    width: '40%',
    height: 14,
    backgroundColor: COLORS.black10,
    borderRadius: 7,
  },
  chevronSkeleton: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.black10,
    borderRadius: 10,
    marginLeft: SPACING.md,
  },
}); 