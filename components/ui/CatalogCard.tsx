import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { Bookmark, ChevronRight, Edit, Trash2 } from 'lucide-react-native';
import GlassmorphicCard from './GlassmorphicCard';
import Animated, { FadeInRight } from 'react-native-reanimated';

type CatalogCardProps = {
  id: string;
  name: string;
  productCount: number;
  onPress: () => void;
  onRename: () => void;
  onDelete: () => void;
  style?: any;
  index?: number;
};

export default function CatalogCard({
  id,
  name,
  productCount,
  onPress,
  onRename,
  onDelete,
  style,
  index = 0,
}: CatalogCardProps) {
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).springify()}
      style={[styles.container, style]}
    >
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.touchable}
      >
        <GlassmorphicCard 
          style={styles.card}
          tint="light"
          intensity={20}
          containerStyle={styles.cardContainer}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Bookmark 
                size={24} 
                color={COLORS.primary} 
                style={styles.icon} 
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name} numberOfLines={1}>{name}</Text>
              <Text style={styles.count}>
                {productCount} {productCount === 1 ? 'item' : 'items'}
              </Text>
            </View> 
            
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onRename}
              >
                <Edit size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={onDelete}
              >
                <Trash2 size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        </GlassmorphicCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  touchable: {
    width: '100%',
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
  icon: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  count: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginLeft: SPACING.sm,
  },
  deleteButton: {
    backgroundColor: COLORS.error + '10',
  },
});