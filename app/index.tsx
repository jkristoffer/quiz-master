import { useState, useCallback } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import LevelButton from '../components/LevelButton';
import { Colors } from '../constants/Colors';
import { getProgress } from '../utils/storage';
import questionsData from '../data/questions.json';

export default function Index() {
  const router = useRouter();
  const [highestLevel, setHighestLevel] = useState(1);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const loadProgress = async () => {
    const level = await getProgress();
    setHighestLevel(level);
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Text style={styles.title}>BrainSpark</Text>
      <Text style={styles.subtitle}>Logic Puzzles for Kids</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {questionsData.map((_, index) => {
          const level = index + 1;
          const isLocked = level > highestLevel;

          return (
            <LevelButton
              key={level}
              level={level}
              isLocked={isLocked}
              onPress={() => router.push(`/quiz/${level}`)}
            />
          );
        })}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 48,
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Fredoka_500Medium',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
});
