import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { X, Clock, Trophy } from 'lucide-react-native';

import ScreenWrapper from '../../components/ScreenWrapper';
import QuestionCard, { Question } from '../../components/QuestionCard';
import { Colors } from '../../constants/Colors';
import questionsData from '../../data/questions.json';
import { saveProgress } from '../../utils/storage';
import AnimatedScaleButton from '../../components/AnimatedScaleButton';
import ProgressBar from '../../components/ProgressBar';
import CircularTimer from '../../components/CircularTimer';

export default function QuizScreen() {
  const { id, score } = useLocalSearchParams<{ id: string; score: string }>();
  const router = useRouter();

  const questionIndex = typeof id === 'string' ? parseInt(id, 10) - 1 : 0;
  const question = questionsData[questionIndex] as unknown as Question;

  // State
  const incomingScore = score ? parseInt(score, 10) : 0;
  const [currentScore, setCurrentScore] = useState(incomingScore);
  const [timeLeft, setTimeLeft] = useState(question.duration || 10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [feedback, setFeedback] = useState<{
    visible: boolean;
    isCorrect: boolean;
    message: string;
    earnedPoints: number;
  }>({
    visible: false,
    isCorrect: false,
    message: '',
    earnedPoints: 0,
  });

  // Reset state on new question
  useEffect(() => {
    setFeedback({ visible: false, isCorrect: false, message: '', earnedPoints: 0 });
    setCurrentScore(incomingScore);
    setTimeLeft(question.duration || 10);
    startTimer();

    return () => stopTimer();
  }, [id]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          // handleTimeout(); // Optional: Auto-submit or just stop
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Sound placeholders
  const playSound = async (correct: boolean) => {
    // console.log(correct ? 'Sound: DING!' : 'Sound: BUZZ!');
  };

  const handleAnswer = async (answer: any) => {
    if (feedback.visible) return;

    let isCorrect = false;

    // Determine correctness based on answer type
    if (Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
      // Multi-select comparison
      // Sort both to ensure order doesn't matter
      const sortedAnswer = [...answer].sort();
      const sortedCorrect = [...question.correctAnswer].sort();

      isCorrect =
        sortedAnswer.length === sortedCorrect.length &&
        sortedAnswer.every((value, index) => value === sortedCorrect[index]);
    } else {
      // Simple equality for MCQ and True/False
      isCorrect = answer === question.correctAnswer;
    }

    stopTimer();
    await playSound(isCorrect);

    let earnedPoints = 0;
    if (isCorrect) {
      const currentLevel = questionIndex + 1;
      await saveProgress(currentLevel + 1);

      // Score Calculation
      const basePoints = question.points || 100;
      const timeBonus = timeLeft * 10; // Simple bonus: 10 points per second left
      earnedPoints = basePoints + timeBonus;

      setCurrentScore((prev) => prev + earnedPoints);

      setFeedback({
        visible: true,
        isCorrect: true,
        message: 'Correct! Great job!',
        earnedPoints,
      });
    } else {
      setFeedback({
        visible: true,
        isCorrect: false,
        message: 'Oops! Try again.',
        earnedPoints: 0,
      });
    }
  };

  const handleNext = () => {
    setFeedback({ ...feedback, visible: false });

    // ALWAYS move to next question regardless of correctness
    const nextIndex = questionIndex + 1;
    if (nextIndex < questionsData.length) {
      // Pass score to next question
      router.replace({
        pathname: `/quiz/${nextIndex + 1}`,
        params: { score: currentScore },
      });
    } else {
      // Finish quiz - go to results
      router.replace({
        pathname: '/quiz/results',
        params: { score: currentScore },
      });
    }
  };

  const handleExit = () => {
    const exitAction = () => {
      stopTimer();
      router.replace('/');
    };

    if (Platform.OS === 'web') {
      const confirm = window.confirm(
        'Are you sure you want to quit? Your progress will only be saved up to the last completed level.'
      );
      if (confirm) {
        exitAction();
      }
    } else {
      Alert.alert(
        'Quit Quiz?',
        'Are you sure you want to quit? Your progress will only be saved up to the last completed level.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Quit', style: 'destructive', onPress: exitAction },
        ]
      );
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
        <View style={styles.headerLeft}>{/* Back button removed for linear flow */}</View>

        <View style={styles.statsContainer}>
          <CircularTimer duration={question.duration || 10} remaining={timeLeft} size={40} />
          <View style={styles.statChip}>
            <Trophy size={16} color={Colors.primary} />
            <Text style={styles.statText}>{currentScore}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <AnimatedScaleButton onPress={handleExit} style={styles.navButton} testID="exit-button">
            <X size={28} color={Colors.secondary} />
          </AnimatedScaleButton>
        </View>
      </View>

      <ProgressBar current={questionIndex + 1} total={questionsData.length} />

      <Text style={styles.levelText}>Question {questionIndex + 1}</Text>

      <QuestionCard question={question} onAnswer={handleAnswer} disabled={feedback.visible} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={feedback.visible}
        onRequestClose={handleNext}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              feedback.isCorrect ? styles.modalCorrect : styles.modalWrong,
            ]}
          >
            <Text style={styles.modalTitle}>{feedback.isCorrect ? 'SUCCESS!' : 'UH OH'}</Text>
            <Text style={styles.modalMessage}>{feedback.message}</Text>
            {feedback.isCorrect && (
              <Text style={styles.pointsText}>+{feedback.earnedPoints} Points!</Text>
            )}
            <Pressable style={styles.modalButton} onPress={handleNext} testID="modal-next-button">
              <Text style={styles.modalButtonText}>
                {feedback.isCorrect ? 'NEXT LEVEL' : 'NEXT QUESTION'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  headerLeft: {
    width: 48,
    alignItems: 'flex-start',
  },
  headerRight: {
    width: 48,
    alignItems: 'flex-end',
  },
  navButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  levelText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 28,
    color: Colors.primary,
  },
  errorText: {
    fontFamily: 'Fredoka_500Medium',
    fontSize: 20,
    color: Colors.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 400,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 5,
  },
  modalCorrect: {
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.success,
  },
  modalWrong: {
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.secondary,
  },
  modalTitle: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 32,
    marginBottom: 8,
    color: Colors.text,
  },
  modalMessage: {
    fontFamily: 'Fredoka_500Medium',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 99,
  },
  modalButtonText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 18,
    color: Colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 99,
    gap: 6,
  },
  statText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  urgentText: {
    color: '#EF4444',
  },
  pointsText: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 32,
    color: Colors.success,
    marginBottom: 24,
  },
});
