import React, { useRef } from 'react';
import { Pressable, Animated, ViewStyle, StyleProp } from 'react-native';

interface AnimatedScaleButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  activeScale?: number;
  disabled?: boolean;
  disabledOpacity?: number;
  testID?: string;
}

export default function AnimatedScaleButton({
  onPress,
  style,
  containerStyle,
  children,
  activeScale = 0.95,
  disabled = false,
  disabledOpacity = 0.7,
  testID,
}: AnimatedScaleButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: activeScale,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[containerStyle, disabled && { opacity: disabledOpacity }]}
      testID={testID}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}
