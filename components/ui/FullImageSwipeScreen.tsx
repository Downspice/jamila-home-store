import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

const images = [
  'https://placekitten.com/800/800',
  'https://placekitten.com/801/800',
  'https://placekitten.com/802/800',
  'https://placekitten.com/803/800',
];

const FullImageSwipeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      {/* Top Main Image Carousel (70%) */}
      <View style={styles.imageContainer}>
        <Carousel
          loop
          width={width}
          height={height * 0.7}
          data={images}
          scrollAnimationDuration={400}
          onSnapToItem={(index) => setActiveIndex(index)}
          defaultIndex={activeIndex}
          renderItem={({ item }) => (
            <FastImage
              source={{ uri: item }}
              style={styles.mainImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
        />
      </View>

      {/* Bottom Carousel (30%) */}
      <View style={styles.bottomContainer}>
        <Carousel
          loop
          width={width * 0.5}
          height={height * 0.25}
          data={images}
          style={{ alignSelf: 'center' }}
          defaultIndex={activeIndex}
          onSnapToItem={(index) => setActiveIndex(index)}
          mode="parallax"
          modeConfig={{ parallaxScrollingScale: 0.9, parallaxScrollingOffset: 60 }}
          renderItem={({ item }) => (
            <FastImage
              source={{ uri: item }}
              style={styles.thumbnailImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.7,
    backgroundColor: 'black',
  },
  bottomContainer: {
    height: height * 0.3,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  mainImage: {
    width: width,
    height: '100%',
  },
  thumbnailImage: {
    width: width * 0.5,
    height: height * 0.25,
    borderRadius: 20,
  },
});

export default FullImageSwipeScreen;
