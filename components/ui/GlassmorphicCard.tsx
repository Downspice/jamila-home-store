import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SHADOWS, SPACING } from '@/constants/theme';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  containerStyle?: StyleProp<ViewStyle>;
}

export default function GlassmorphicCard({
  children,
  style,
  intensity = 40,
  tint = 'light',
  containerStyle,
}: GlassmorphicCardProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <BlurView intensity={intensity} tint={tint} style={[styles.blurView, style]}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
    ...SHADOWS.medium,
  },
  blurView: {
    padding: 16,
    borderRadius: 16,
    borderColor: COLORS.white20,
    borderWidth: 1,
    backgroundColor: COLORS.white10,
    overflow: 'hidden', 
  },
});