import React, { useRef } from 'react';
import { Pressable, Animated, ViewStyle, StyleProp, GestureResponderEvent } from 'react-native';

interface AnimatedScaleButtonProps {
    children: React.ReactNode;
    onPress: (event: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    scaleTo?: number;
}

export default function AnimatedScaleButton({
    children,
    onPress,
    style,
    containerStyle,
    disabled,
    scaleTo = 0.95,
}: AnimatedScaleButtonProps) {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: scaleTo,
            useNativeDriver: true,
            speed: 20,
            bounciness: 0,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
            bounciness: 12, // Juicy bounce
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={[{ width: '100%' }, containerStyle]}
        >
            <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
                {children}
            </Animated.View>
        </Pressable>
    );
}
