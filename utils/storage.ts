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
