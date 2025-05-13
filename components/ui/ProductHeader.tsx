// components/ProductHeader.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Heart, Share2, PhoneCall, ArrowBigLeft, ArrowLeft } from 'lucide-react-native';

interface ProductHeaderProps {
  onBackPress: () => void;
  onLikePress: () => void;
  onSharePress: () => void;
}

const ProductHeader = ({ onBackPress, onLikePress, onSharePress }: ProductHeaderProps) => {
  return (
    <View style={styles.container}>
      <BlurIconButton onPress={onBackPress}>
        <ArrowLeft size={20} color="#000000" strokeWidth={2} />
      </BlurIconButton>

      <View style={styles.rightButtons}>
        <BlurIconButton onPress={onSharePress}>
          <Share2 size={20} color="#000000" strokeWidth={2} />
        </BlurIconButton>
        <BlurIconButton onPress={onLikePress}>
          <Heart size={20} color="#000000" strokeWidth={2} />
        </BlurIconButton>
      </View>
    </View>
  );
};

const BlurIconButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.99} style={styles.touchable}>
    {/* <BlurView
      style={styles.blurContainer}
      blurType="light"
      blurAmount={70}
      reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.65)"
    > */}
      {children}
    {/* </BlurView> */}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  touchable: {
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 10, 
    backgroundColor: 'rgb(255, 255, 255)', 
  },
  blurContainer: {
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductHeader;
