import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '@/components/ui/Skeleton';
import { COLORS } from '@/constants/theme';

export default function ProductDetailSkeleton() {
  return (
    <View style={styles.container}>
      {/* Image Carousel Skeleton */}
      <View style={styles.imageContainer}>
        <Skeleton width="100%" height={400} />
      </View>

      {/* Product Info Skeleton */}
      <View style={styles.contentContainer}>
        <Skeleton width="70%" height={24} style={styles.title} />
        <View style={styles.statsContainer}>
          <Skeleton width={80} height={20} />
          <Skeleton width={100} height={20} />
        </View>

        {/* Description Skeleton */}
        <View style={styles.descriptionContainer}>
          <Skeleton width="100%" height={16} style={styles.descriptionLine} />
          <Skeleton width="90%" height={16} style={styles.descriptionLine} />
          <Skeleton width="80%" height={16} style={styles.descriptionLine} />
        </View>

        {/* Action Buttons Skeleton */}
        <View style={styles.actionsContainer}>
          <Skeleton width={120} height={40} style={styles.actionButton} />
          <Skeleton width={120} height={40} style={styles.actionButton} />
          <Skeleton width={120} height={40} style={styles.actionButton} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  imageContainer: {
    width: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionLine: {
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
  },
}); 