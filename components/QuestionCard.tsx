import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

export type QuestionType = 'mcq' | 'true-false' | 'multi-select';

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

export type Question = MCQQuestion | TrueFalseQuestion | MultiSelectQuestion;

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: any) => void;
  disabled?: boolean;
}

export default function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  const [multiSelection, setMultiSelection] = useState<number[]>([]);

  // Reset multi-selection when question changes
  useEffect(() => {
    setMultiSelection([]);
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

  const renderMCQ = (q: MCQQuestion) => (
    <View style={styles.optionsContainer}>
      {q.options.map((option, index) => (
        <Pressable
          key={index}
          style={({ pressed }) => [
            styles.optionButton,
            pressed && styles.optionPressed,
            disabled && styles.optionDisabled,
          ]}
          onPress={() => onAnswer(index)}
          disabled={disabled}
        >
          <Text style={styles.optionText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderTrueFalse = (q: TrueFalseQuestion) => (
    <View style={styles.trueFalseContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.tfButton,
          styles.trueButton,
          pressed && styles.optionPressed,
          disabled && styles.optionDisabled,
        ]}
        onPress={() => onAnswer(true)}
        disabled={disabled}
      >
        <Text style={styles.tfText}>True</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.tfButton,
          styles.falseButton,
          pressed && styles.optionPressed,
          disabled && styles.optionDisabled,
        ]}
        onPress={() => onAnswer(false)}
        disabled={disabled}
      >
        <Text style={styles.tfText}>False</Text>
      </Pressable>
    </View>
  );

  const renderMultiSelect = (q: MultiSelectQuestion) => (
    <View style={styles.optionsContainer}>
      <Text style={styles.hintText}>Select all that apply:</Text>
      {q.options.map((option, index) => {
        const isSelected = multiSelection.includes(index);
        return (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.optionButton,
              isSelected && styles.optionSelected,
              pressed && styles.optionPressed,
              disabled && styles.optionDisabled,
            ]}
            onPress={() => handleMultiSelect(index)}
            disabled={disabled}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
              {option}
            </Text>
            {isSelected && <View style={styles.checkmark} />}
          </Pressable>
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

  // Default to MCQ if type is missing for backward compatibility
  const questionType = question.type || 'mcq';

  return (
    <View style={styles.card}>
      <Text style={styles.questionText}>{question.text}</Text>

      {questionType === 'mcq' && renderMCQ(question as MCQQuestion)}
      {questionType === 'true-false' && renderTrueFalse(question as TrueFalseQuestion)}
      {questionType === 'multi-select' && renderMultiSelect(question as MultiSelectQuestion)}
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optionPressed: {
    backgroundColor: '#E2E8F0',
    transform: [{ scale: 0.98 }],
  },
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
    flex: 1,
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
});
