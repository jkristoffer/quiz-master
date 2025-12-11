import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, CircleProps } from 'react-native-svg';
import { Colors } from '../constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularTimerProps {
  duration: number;
  remaining: number;
  size?: number;
  strokeWidth?: number;
}

export default function CircularTimer({
  duration,
  remaining,
  size = 40,
  strokeWidth = 4,
}: CircularTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Determine target progress (0 to 1)
    const progress = Math.max(0, remaining / duration);

    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000, // Animate over 1 second to the next value
      easing: Easing.linear,
      useNativeDriver: true, // Requires react-native-reanimated for SVG props usually, but let's try standard Animated or fallback
    }).start();
  }, [remaining, duration]);

  // Interpolate for dashoffset
  // dashoffset: 0 = full, circumference = empty
  // We want: progress 1 -> offset 0
  //          progress 0 -> offset circumference
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  // Color interpolation
  // Green -> Yellow -> Red
  // 1 -> 0.5 -> 0

  // Note: Color interpolation on SVG props via Animated isn't always supported flawlessly without Reanimated.
  // We'll stick to simple conditional color or non-animated color for MVP to avoid complexity.
  let color = Colors.success;
  const percentage = remaining / duration;
  if (percentage <= 0.3) {
    color = '#EF4444'; // Red
  } else if (percentage <= 0.6) {
    color = '#F59E0B'; // Yellow/Orange
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.text, { fontSize: size * 0.4, color }]}>{Math.ceil(remaining)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Fredoka_600SemiBold',
  },
});
