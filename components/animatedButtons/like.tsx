import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native'; // or use any icon library

type Props = {
  liked: boolean;
  onToggle: () => void ;
  disabled?: boolean;
};

export const LikeButton: React.FC<Props> = ({ liked, onToggle, disabled }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.3, undefined, () => {
      scale.value = withSpring(1);
    });
    onToggle();
  };

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View style={animatedStyle}>
        <Heart
          size={28}
          color={liked ? '#f87171' : '#a1a1aa'}
          fill={liked ? '#f87171' : 'none'}
        />
      </Animated.View>
    </Pressable>
  );
};
