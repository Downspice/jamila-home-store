import React, { useState, useRef } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  withTiming 
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { COLORS, SPACING } from '@/constants/theme';

interface ImageCarouselProps {
  images: string[];
  height?: number;
  onImagePress?: (index: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ImageCarousel({
  images,
  height = 350,
  onImagePress,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  // Ensure we have at least one image
  const imageUrls = images?.length > 0 
    ? images 
    : ['https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'];

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleDotPress = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: index * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Pressable 
      style={[styles.imageContainer, { width: SCREEN_WIDTH, height }]}
      onPress={() => onImagePress?.(index)}
    >
      <Image
        source={{ uri: item }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
    </Pressable>
  );

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={imageUrls}
        renderItem={renderItem}
        keyExtractor={(_, index) => `image-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      
      {imageUrls.length > 1 && (
        <View style={styles.pagination}>
          {imageUrls.map((_, index) => (
            <Dot 
              key={`dot-${index}`} 
              index={index} 
              activeIndex={activeIndex}
              scrollX={scrollX}
              onPress={() => handleDotPress(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

interface DotProps {
  index: number;
  activeIndex: number;
  scrollX: Animated.SharedValue<number>;
  onPress: () => void;
}

function Dot({ index, activeIndex, scrollX, onPress }: DotProps) {
  const animatedDotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];
    
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    
    return {
      width: withTiming(width, { duration: 250 }),
      opacity: withTiming(opacity, { duration: 250 }),
    };
  });
  
  return (
    <Pressable onPress={onPress}>
      <Animated.View 
        style={[
          styles.dot,
          animatedDotStyle,
          index === activeIndex && styles.activeDot,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white80,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.white,
  },
});