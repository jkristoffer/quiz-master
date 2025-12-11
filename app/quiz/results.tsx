import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/ScreenWrapper';
import { Colors } from '../../constants/Colors';
import { saveHighScore, getHighScores, HighScore } from '../../utils/storage';
import AnimatedScaleButton from '../../components/AnimatedScaleButton';

export default function ResultsScreen() {
  const router = useRouter();
  const { score } = useLocalSearchParams<{ score: string }>();
  const finalScore = score ? parseInt(score, 10) : 0;

  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);

  useEffect(() => {
    loadHighScores();
  }, []);

  const loadHighScores = async () => {
    const scores = await getHighScores();
    setHighScores(scores);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await saveHighScore(name.trim(), finalScore);
    await loadHighScores();
    setSubmitted(true);
  };

  const handleHome = () => {
    router.replace('/');
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Quiz Completed!</Text>
        <Text style={styles.scoreLabel}>Final Score</Text>
        <Text style={styles.scoreValue}>{finalScore}</Text>

        {!submitted ? (
          <View style={styles.inputContainer}>
            <Text style={styles.subtitle}>Enter your name to save score:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              placeholderTextColor="#94A3B8"
              maxLength={15}
            />
            <AnimatedScaleButton
              style={[styles.button, !name.trim() && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!name.trim()}
            >
              <Text style={styles.buttonText}>Submit Score</Text>
            </AnimatedScaleButton>
            <Pressable onPress={handleHome} style={{ marginTop: 16 }}>
              <Text style={styles.skipText}>Skip & Return Home</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.subtitle}>High Scores</Text>
            <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 20 }}>
              {highScores.map((s, index) => (
                <View
                  key={index}
                  style={[
                    styles.scoreRow,
                    s.name === name && s.score === finalScore && styles.currentRow,
                  ]}
                >
                  <Text style={styles.rank}>#{index + 1}</Text>
                  <Text style={styles.rowName}>{s.name}</Text>
                  <Text style={styles.rowScore}>{s.score}</Text>
                </View>
              ))}
            </ScrollView>
            <AnimatedScaleButton style={styles.button} onPress={handleHome}>
              <Text style={styles.buttonText}>Return Home</Text>
            </AnimatedScaleButton>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: '90%',
  },
  title: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 32,
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreLabel: {
    fontFamily: 'Fredoka_500Medium',
    fontSize: 18,
    color: '#64748B',
    marginBottom: 4,
  },
  scoreValue: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 64,
    color: Colors.primary,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  successContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1, // Allow list to grow
    minHeight: 200,
  },
  subtitle: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontFamily: 'Fredoka_500Medium',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 99,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 18,
    color: 'white',
  },
  skipText: {
    fontFamily: 'Fredoka_500Medium',
    fontSize: 16,
    color: '#64748B',
  },
  list: {
    width: '100%',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  currentRow: {
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  rank: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 18,
    color: '#94A3B8',
    width: 40,
  },
  rowName: {
    fontFamily: 'Fredoka_500Medium',
    fontSize: 18,
    color: Colors.text,
    flex: 1,
  },
  rowScore: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 18,
    color: Colors.primary,
  },
});
