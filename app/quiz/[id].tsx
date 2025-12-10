import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';

import ScreenWrapper from '../../components/ScreenWrapper';
import QuestionCard from '../../components/QuestionCard';
import { Colors } from '../../constants/Colors';
import questionsData from '../../data/questions.json';

export default function QuizScreen() {
    const { id } = useLocalSearchParams(); // Treat id as "Question Index" + 1 for now
    const router = useRouter();

    const questionIndex = typeof id === 'string' ? parseInt(id, 10) - 1 : 0;
    const question = questionsData[questionIndex];

    const [isProcessing, setIsProcessing] = useState(false);

    // Sound placeholders
    const playSound = async (correct: boolean) => {
        // In a real app, load and play sound files here
        // const { sound } = await Audio.Sound.createAsync(
        //   correct ? require('../../assets/correct.mp3') : require('../../assets/wrong.mp3')
        // );
        // await sound.playAsync();
        console.log(correct ? 'Sound: DING!' : 'Sound: BUZZ!');
    };

    const handleAnswer = async (selectedIndex: number) => {
        if (isProcessing) return;
        setIsProcessing(true);

        const isCorrect = selectedIndex === question.correctAnswer;
        await playSound(isCorrect);

        if (isCorrect) {
            // Correct! Move to next
            Alert.alert('Correct!', 'Great job!', [
                {
                    text: 'Next',
                    onPress: () => {
                        const nextIndex = questionIndex + 1;
                        if (nextIndex < questionsData.length) {
                            router.replace(`/quiz/${nextIndex + 1}`);
                        } else {
                            Alert.alert('You Won!', 'You finished all questions!');
                            router.replace('/');
                        }
                    }
                }
            ]);
        } else {
            // Wrong! Shake or retry (Simple Alert for MVP)
            Alert.alert('Oops!', 'Try again!');
            setIsProcessing(false);
        }
    };

    if (!question) {
        return (
            <ScreenWrapper style={styles.centered}>
                <Text style={styles.errorText}>Question not found!</Text>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.levelText}>Question {questionIndex + 1}</Text>
            </View>

            <QuestionCard
                question={question}
                onAnswer={handleAnswer}
                disabled={isProcessing}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingTop: 40,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    levelText: {
        fontFamily: 'Fredoka_700Bold',
        fontSize: 32,
        color: Colors.primary,
    },
    errorText: {
        fontFamily: 'Fredoka_500Medium',
        fontSize: 20,
        color: Colors.secondary,
    },
});
