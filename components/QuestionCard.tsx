import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import NumericKeypad from './NumericKeypad';
import { QuestionAssets } from '../constants/AssetMap';
import AnimatedScaleButton from './AnimatedScaleButton';

export type QuestionType = 'mcq' | 'true-false' | 'multi-select' | 'numeric' | 'visual-selection';

export interface BaseQuestion {
  id: string;
  text: string;
  type?: QuestionType;
  hint?: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  correctAnswer: number;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: 'multi-select';
  options: string[];
  correctAnswer: number[];
}

export interface NumericQuestion extends BaseQuestion {
  type: 'numeric';
  correctAnswer: number;
}

export type VisualZone = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface VisualQuestion extends BaseQuestion {
  type: 'visual-selection';
  imageUrl: string;
  correctAnswer: VisualZone;
}

export type Question =
  | MCQQuestion
  | TrueFalseQuestion
  | MultiSelectQuestion
  | NumericQuestion
  | VisualQuestion;

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: any) => void;
  disabled?: boolean;
}

export default function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  const [multiSelection, setMultiSelection] = useState<number[]>([]);
  const [numericInput, setNumericInput] = useState<string>('');

  // Reset states when question changes
  useEffect(() => {
    setMultiSelection([]);
    setNumericInput('');
  }, [question.id]);

  const handleMultiSelect = (index: number) => {
    setMultiSelection((current) => {
      if (current.includes(index)) {
        return current.filter((i) => i !== index);
      } else {
        return [...current, index];
      }
    });
  };

  const submitMultiSelect = () => {
    onAnswer(multiSelection);
  };

  const handleNumericPress = (key: string) => {
    if (numericInput.length < 8) {
      // Limit length
      setNumericInput((prev) => prev + key);
    }
  };

  const handleNumericDelete = () => {
    setNumericInput((prev) => prev.slice(0, -1));
  };

  const submitNumeric = () => {
    if (numericInput.length > 0) {
      onAnswer(parseInt(numericInput, 10));
    }
  };

  const renderMCQ = (q: MCQQuestion) => (
    <View style={styles.optionsContainer}>
      {q.options.map((option, index) => (
        <AnimatedScaleButton
          key={index}
          style={[styles.optionButton, disabled && styles.optionDisabled]}
          onPress={() => onAnswer(index)}
          disabled={disabled}
        >
          <Text style={styles.optionText}>{option}</Text>
        </AnimatedScaleButton>
      ))}
    </View>
  );

  const renderTrueFalse = (q: TrueFalseQuestion) => (
    <View style={styles.trueFalseContainer}>
      <View style={{ flex: 1 }}>
        <AnimatedScaleButton
          containerStyle={{ height: '100%' }}
          style={[styles.tfButton, styles.trueButton, disabled && styles.optionDisabled]}
          onPress={() => onAnswer(true)}
          disabled={disabled}
        >
          <Text style={styles.tfText}>True</Text>
        </AnimatedScaleButton>
      </View>
      <View style={{ flex: 1 }}>
        <AnimatedScaleButton
          containerStyle={{ height: '100%' }}
          style={[styles.tfButton, styles.falseButton, disabled && styles.optionDisabled]}
          onPress={() => onAnswer(false)}
          disabled={disabled}
        >
          <Text style={styles.tfText}>False</Text>
        </AnimatedScaleButton>
      </View>
    </View>
  );

  const renderMultiSelect = (q: MultiSelectQuestion) => (
    <View style={styles.optionsContainer}>
      <Text style={styles.hintText}>Select all that apply:</Text>
      {q.options.map((option, index) => {
        const isSelected = multiSelection.includes(index);
        return (
          <AnimatedScaleButton
            key={index}
            style={[
              styles.optionButton,
              isSelected && styles.optionSelected,
              disabled && styles.optionDisabled,
            ]}
            onPress={() => handleMultiSelect(index)}
            disabled={disabled}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
              {option}
            </Text>
            {isSelected && <View style={styles.checkmark} />}
          </AnimatedScaleButton>
        );
      })}
      <TouchableOpacity
        style={[styles.submitButton, multiSelection.length === 0 && styles.submitButtonDisabled]}
        onPress={submitMultiSelect}
        disabled={disabled || multiSelection.length === 0}
      >
        <Text style={styles.submitButtonText}>Confirm Answer</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNumeric = (q: NumericQuestion) => (
    <View style={styles.numericContainer}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{numericInput || '?'}</Text>
      </View>
      <NumericKeypad
        onPress={handleNumericPress}
        onDelete={handleNumericDelete}
        onSubmit={submitNumeric}
        disabled={disabled}
      />
    </View>
  );

  const renderVisualSelection = (q: VisualQuestion) => {
    const imageSource = QuestionAssets[q.imageUrl]; // Expecting key from AssetMap

    if (!imageSource) {
      return <Text style={styles.errorText}>Image not found</Text>;
    }

    return (
      <View style={styles.visualContainer}>
        <Text style={styles.hintText}>Tap the correct area:</Text>
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.visualImage} resizeMode="contain" />

          <View style={styles.zonesOverlay}>
            <View style={styles.zoneRow}>
              <Pressable
                style={styles.zone}
                onPress={() => onAnswer('top-left')}
                disabled={disabled}
              />
              <Pressable
                style={styles.zone}
                onPress={() => onAnswer('top-right')}
                disabled={disabled}
              />
            </View>
            <View style={styles.zoneRow}>
              <Pressable
                style={styles.zone}
                onPress={() => onAnswer('bottom-left')}
                disabled={disabled}
              />
              <Pressable
                style={styles.zone}
                onPress={() => onAnswer('bottom-right')}
                disabled={disabled}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Default to MCQ if type is missing for backward compatibility
  const questionType = question.type || 'mcq';

  return (
    <View style={styles.card}>
      <Text style={styles.questionText}>{question.text}</Text>

      {questionType === 'mcq' && renderMCQ(question as MCQQuestion)}
      {questionType === 'true-false' && renderTrueFalse(question as TrueFalseQuestion)}
      {questionType === 'multi-select' && renderMultiSelect(question as MultiSelectQuestion)}
      {questionType === 'numeric' && renderNumeric(question as NumericQuestion)}
      {questionType === 'visual-selection' && renderVisualSelection(question as VisualQuestion)}
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
    backgroundColor: Colors.background, // Normal background
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // Removed optionPressed style as animation handles scaling now.
  optionSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0EA5E9',
  },
  optionDisabled: {
    opacity: 0.7,
  },
  optionText: {
    fontFamily: 'Fredoka_500Medium',
    fontSize: 18,
    color: Colors.text,
  },
  optionTextSelected: {
    color: '#0284C7',
    fontWeight: 'bold',
  },
  trueFalseContainer: {
    flexDirection: 'row',
    gap: 16,
    height: 120,
  },
  tfButton: {
    width: '100%', // Fill wrapper
    height: '100%', // Fill wrapper
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trueButton: {
    backgroundColor: '#DCFCE7', // Light green
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  falseButton: {
    backgroundColor: '#FEE2E2', // Light red
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  tfText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 24,
    color: Colors.text,
  },
  hintText: {
    fontFamily: 'Fredoka_400Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 18,
    color: 'white',
  },
  checkmark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0EA5E9',
    position: 'absolute',
    right: 16,
  },
  // Numeric Styles
  numericContainer: {
    alignItems: 'center',
  },
  displayContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    width: 200,
    alignItems: 'center',
    marginBottom: 16,
  },
  displayText: {
    fontFamily: 'Fredoka_600SemiBold',
    fontSize: 32,
    color: Colors.text,
  },
  // Visual Selection Styles
  visualContainer: {
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontFamily: 'Fredoka_400Regular',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1, // Square for now, or adjustable
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  visualImage: {
    width: '100%',
    height: '100%',
  },
  zonesOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  zoneRow: {
    flex: 1,
    flexDirection: 'row',
  },
  zone: {
    flex: 1,
    // borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', // Debug borders
  },
});
