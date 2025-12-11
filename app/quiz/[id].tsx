import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';

import ScreenWrapper from '../../components/ScreenWrapper';
import QuestionCard, { Question } from '../../components/QuestionCard';
import { Colors } from '../../constants/Colors';
import questionsData from '../../data/questions.json';
import { saveProgress } from '../../utils/storage';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const questionIndex = typeof id === 'string' ? parseInt(id, 10) - 1 : 0;
  const question = questionsData[questionIndex] as unknown as Question;

  const [feedback, setFeedback] = useState<{
    visible: boolean;
    isCorrect: boolean;
    message: string;
  }>({
    visible: false,
    isCorrect: false,
    message: '',
  });

  useEffect(() => {
    setFeedback({ visible: false, isCorrect: false, message: '' });
  }, [id]);

  // Sound placeholders
  const playSound = async (correct: boolean) => {
    console.log(correct ? 'Sound: DING!' : 'Sound: BUZZ!');
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

    await playSound(isCorrect);

    if (isCorrect) {
      const currentLevel = questionIndex + 1;
      await saveProgress(currentLevel + 1);
      setFeedback({ visible: true, isCorrect: true, message: 'Correct! Great job!' });
    } else {
      setFeedback({ visible: true, isCorrect: false, message: 'Oops! Try again.' });
    }
  };

  const handleNext = () => {
    setFeedback({ ...feedback, visible: false });

    if (feedback.isCorrect) {
      const nextIndex = questionIndex + 1;
      if (nextIndex < questionsData.length) {
        router.replace(`/quiz/${nextIndex + 1}`);
      } else {
        router.replace('/');
      }
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
            <Pressable style={styles.modalButton} onPress={handleNext}>
              <Text style={styles.modalButtonText}>
                {feedback.isCorrect ? 'NEXT LEVEL' : 'TRY AGAIN'}
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
});
