import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface Question {
    id: string;
    text: string;
    options: string[];
}

interface QuestionCardProps {
    question: Question;
    onAnswer: (index: number) => void;
    disabled?: boolean;
}

export default function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.questionText}>{question.text}</Text>

            <View style={styles.optionsContainer}>
                {question.options.map((option, index) => (
                    <Pressable
                        key={index}
                        style={({ pressed }) => [
                            styles.optionButton,
                            pressed && styles.optionPressed,
                            disabled && styles.optionDisabled
                        ]}
                        onPress={() => onAnswer(index)}
                        disabled={disabled}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    questionText: {
        fontFamily: 'Fredoka_600SemiBold',
        fontSize: 24,
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 32,
    },
    optionsContainer: {
        gap: 16,
    },
    optionButton: {
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        alignItems: 'center',
    },
    optionPressed: {
        backgroundColor: '#E2E8F0', // Slight darken on press
        transform: [{ scale: 0.98 }], // Micro-animation
    },
    optionDisabled: {
        opacity: 0.7,
    },
    optionText: {
        fontFamily: 'Fredoka_500Medium',
        fontSize: 18,
        color: Colors.text,
    },
});
