import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Lock, Play } from 'lucide-react-native';

interface LevelButtonProps {
    level: number;
    isLocked: boolean;
    onPress: () => void;
}

export default function LevelButton({ level, isLocked, onPress }: LevelButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                isLocked ? styles.locked : styles.unlocked,
                pressed && !isLocked && styles.pressed
            ]}
            onPress={onPress}
            disabled={isLocked}
        >
            <View style={styles.iconContainer}>
                {isLocked ? (
                    <Lock size={24} color={Colors.text} opacity={0.5} />
                ) : (
                    <Play size={24} color={Colors.white} fill={Colors.white} />
                )}
            </View>
            <Text style={[styles.text, isLocked && styles.textLocked]}>
                Level {level}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 2,
        width: '100%',
    },
    unlocked: {
        backgroundColor: Colors.white,
        borderColor: Colors.primary,
    },
    locked: {
        backgroundColor: '#E2E8F0',
        borderColor: '#CBD5E0',
    },
    pressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        opacity: 1,
    },
    text: {
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 20,
        color: Colors.text,
    },
    textLocked: {
        color: '#A0AEC0',
    },
});
