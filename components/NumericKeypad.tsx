import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import AnimatedScaleButton from './AnimatedScaleButton';

interface NumericKeypadProps {
  onPress: (value: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function NumericKeypad({
  onPress,
  onDelete,
  onSubmit,
  disabled,
}: NumericKeypadProps) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'DEL'];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {keys.map((key, index) => {
          if (key === '') return <View key={index} style={styles.emptyKey} />;

          if (key === 'DEL') {
            return (
              <View key={index} style={styles.keyWrapper}>
                <AnimatedScaleButton
                  containerStyle={{ width: '100%', height: '100%' }}
                  style={[styles.key, styles.actionKey, disabled && styles.keyDisabled]}
                  onPress={onDelete}
                  disabled={disabled}
                >
                  <Text style={[styles.keyText, styles.actionKeyText]}>⌫</Text>
                </AnimatedScaleButton>
              </View>
            );
          }

          return (
            <View key={index} style={styles.keyWrapper}>
              <AnimatedScaleButton
                containerStyle={{ width: '100%', height: '100%' }}
                style={[styles.key, disabled && styles.keyDisabled]}
                onPress={() => onPress(key)}
                disabled={disabled}
              >
                <Text style={styles.keyText}>{key}</Text>
              </AnimatedScaleButton>
            </View>
          );
        })}
      </View>
      <AnimatedScaleButton
        style={[styles.submitButton, disabled && styles.keyDisabled]}
        onPress={onSubmit}
        disabled={disabled}
      >
        <Text style={styles.submitText}>Submit</Text>
      </AnimatedScaleButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    marginTop: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  emptyKey: {
    width: '30%',
    height: 60,
  },
  keyWrapper: {
    width: '30%',
    height: 60,
  },
  key: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionKey: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  keyDisabled: {
    opacity: 0.5,
  },
  keyText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 24,
    color: Colors.text,
  },
  actionKeyText: {
    color: '#DC2626',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  submitText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 18,
    color: 'white',
  },
});
