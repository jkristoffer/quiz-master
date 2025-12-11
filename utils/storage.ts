import AsyncStorage from '@react-native-async-storage/async-storage';

const LEVEL_KEY = 'BRAINSPARK_LEVEL_V1';

export const saveProgress = async (level: number) => {
  try {
    const current = await getProgress();
    if (level > current) {
      await AsyncStorage.setItem(LEVEL_KEY, level.toString());
    }
  } catch (e) {
    // console.error('Failed to save progress', e);
  }
};

export const getProgress = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(LEVEL_KEY);
    return value ? parseInt(value, 10) : 1;
  } catch (e) {
    // console.error('Failed to load progress', e);
    return 1;
  }
};

export const resetProgress = async () => {
  try {
    await AsyncStorage.removeItem(LEVEL_KEY);
  } catch (e) {
    // console.error('Failed to reset progress', e);
  }
};

const SCORES_KEY = 'BRAINSPARK_SCORES_V1';

export interface HighScore {
  name: string;
  score: number;
  date: string;
}

export const saveHighScore = async (name: string, score: number) => {
  try {
    const scores = await getHighScores();
    const newScore = { name, score, date: new Date().toISOString() };
    const updatedScores = [...scores, newScore].sort((a, b) => b.score - a.score).slice(0, 10); // Keep top 10

    await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(updatedScores));
  } catch (e) {
    // console.error('Failed to save score', e);
  }
};

export const getHighScores = async (): Promise<HighScore[]> => {
  try {
    const value = await AsyncStorage.getItem(SCORES_KEY);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    return [];
  }
};
