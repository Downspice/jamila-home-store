import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SHADOWS, SPACING } from '@/constants/theme';
import { Bookmark } from 'lucide-react-native';
import GlassmorphicCard from './GlassmorphicCard';

type CatalogCardProps = {
  id: string;
  name: string;
  productCount: number;
  onPress: () => void;
  style?: any;
};

export default function CatalogCard({
  id,
  name,
  productCount,
  onPress,
  style,
}: CatalogCardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <GlassmorphicCard 
        style={styles.card}
        tint="light"
        intensity={20}
        containerStyle={styles.cardContainer}
      >
        <View style={styles.content}>
          <Bookmark 
            size={24} 
            color={COLORS.primary} 
            style={styles.icon} 
          />
          <View style={styles.textContainer}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <Text style={styles.count}>
              {productCount} {productCount === 1 ? 'item' : 'items'}
            </Text>
          </View>
        </View>
      </GlassmorphicCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
    ...SHADOWS.small,
  },
  cardContainer: {
    backgroundColor: COLORS.primaryLight,
  },
  card: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  count: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});