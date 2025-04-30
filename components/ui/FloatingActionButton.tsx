import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import { BlurView } from 'expo-blur';

type FloatingActionButtonProps = {
  onPress: () => void;
  icon: React.ReactNode;
  style?: any;
};

export default function FloatingActionButton({ onPress, icon, style }: FloatingActionButtonProps) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <BlurView intensity={0} tint="light" style={styles.button}>
          <View style={styles.iconContainer}>{icon}</View>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    zIndex: 1000,
    marginBottom: 70,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 