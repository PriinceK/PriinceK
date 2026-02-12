import React, { useState, useLayoutEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, DIFFICULTY_COLORS } from '../theme';
import { DAILY_SCENARIOS } from '../data/scenarios';

export default function DayAsScenarioScreen({ route, navigation }) {
  const { scenarioId } = route.params;
  const scenario = DAILY_SCENARIOS.find((s) => s.id === scenarioId);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  useLayoutEffect(() => {
    if (scenario) {
      navigation.setOptions({ title: scenario.title });
    }
  }, [navigation, scenario]);

  if (!scenario) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={48} color={colors.yellow} />
        <Text style={styles.errorText}>Scenario not found</Text>
      </View>
    );
  }

  const currentTask = currentTaskIndex >= 0 ? scenario.tasks[currentTaskIndex] : null;
  const selectedOption = currentTask ? answers[currentTask.id] : null;
  const totalScore = Object.entries(answers).reduce((acc, [taskId, optionId]) => {
    const task = scenario.tasks.find((t) => t.id === taskId);
    const option = task?.options.find((o) => o.id === optionId);
    return acc + (option?.points || 0);
  }, 0);
  const maxScore = scenario.tasks.length * 10;

  function handleSelect(optionId) {
    if (selectedOption) return;
    setAnswers((prev) => ({ ...prev, [currentTask.id]: optionId }));
    setShowFeedback(true);
  }

  function handleNext() {
    setShowFeedback(false);
    if (currentTaskIndex < scenario.tasks.length - 1) {
      setCurrentTaskIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  }

  function handleRestart() {
    setCurrentTaskIndex(-1);
    setAnswers({});
    setShowFeedback(false);
    setCompleted(false);
  }

  // RESULTS SCREEN
  if (completed) {
    const percentage = Math.round((totalScore / maxScore) * 100);
    let grade, gradeColor, message;
    if (percentage >= 90) { grade = 'A+'; gradeColor = colors.green; message = 'Outstanding! Expert-level GCP architecture knowledge.'; }
    else if (percentage >= 80) { grade = 'A'; gradeColor = colors.green; message = 'Excellent work! Well-reasoned architecture decisions.'; }
    else if (percentage >= 70) { grade = 'B'; gradeColor = colors.blue; message = 'Good job! Solid fundamentals with some areas to refine.'; }
    else if (percentage >= 60) { grade = 'C'; gradeColor = colors.yellow; message = 'Decent effort. Review the feedback to improve.'; }
    else { grade = 'D'; gradeColor = colors.red; message = 'Keep practicing! Review GCP docs and try again.'; }

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Day Complete!</Text>
          <Text style={styles.resultSubtitle}>{scenario.title}</Text>

          <View style={[styles.gradeCircle, { borderColor: gradeColor }]}>
            <Text style={[styles.gradeText, { color: gradeColor }]}>{grade}</Text>
          </View>

          <Text style={styles.scoreText}>{totalScore} / {maxScore}</Text>
          <Text style={styles.percentText}>{percentage}% score</Text>
          <Text style={styles.messageText}>{message}</Text>
        </View>

        <Text style={styles.sectionTitle}>Task Review</Text>
        {scenario.tasks.map((task) => {
          const selected = answers[task.id];
          const option = task.options.find((o) => o.id === selected);
          const best = task.options.reduce((a, b) => (a.points > b.points ? a : b));
          const gotBest = option?.id === best.id;
          const pointColor = option?.points >= 8 ? colors.green : option?.points >= 5 ? colors.yellow : colors.red;

          return (
            <View key={task.id} style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Ionicons
                  name={gotBest ? 'checkmark-circle' : 'close-circle'}
                  size={20}
                  color={gotBest ? colors.green : colors.yellow}
                />
                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewTitle}>{task.title}</Text>
                    <Text style={[styles.reviewScore, { color: pointColor }]}>
                      {option?.points || 0}/10
                    </Text>
                  </View>
                  <Text style={styles.reviewChoice}>You chose: {option?.text}</Text>
                  <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackText}>{option?.feedback}</Text>
                  </View>
                  {!gotBest && (
                    <Text style={styles.bestAnswer}>Best: {best.text}</Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleRestart}>
            <Ionicons name="refresh" size={16} color={colors.text} />
            <Text style={styles.secondaryBtnText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.primaryBtnText}>More Scenarios</Text>
            <Ionicons name="chevron-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  // BRIEFING SCREEN
  if (currentTaskIndex === -1) {
    const diffColor = DIFFICULTY_COLORS[scenario.difficulty] || colors.blue;
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.briefingCard}>
          <View style={styles.briefingHeader}>
            <View style={[styles.briefingIcon, { backgroundColor: colors.blue + '20' }]}>
              <Ionicons name="briefcase" size={24} color={colors.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.briefingTitle}>{scenario.title}</Text>
              <View style={styles.roleRow}>
                <Ionicons name="business-outline" size={13} color={colors.muted} />
                <Text style={styles.roleLabel}>{scenario.role} at {scenario.company}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.diffBadge, { backgroundColor: diffColor + '20', alignSelf: 'flex-start', marginBottom: 16 }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>{scenario.difficulty}</Text>
          </View>

          <View style={styles.morningBriefing}>
            <Text style={styles.morningLabel}>Morning Briefing</Text>
            <Text style={styles.morningText}>{scenario.briefing}</Text>
          </View>

          <Text style={styles.objectivesTitle}>
            <Ionicons name="flag" size={14} color={colors.green} /> Today's Objectives
          </Text>
          {scenario.objectives.map((obj, i) => (
            <View key={i} style={styles.objectiveRow}>
              <View style={styles.objectiveNumber}>
                <Text style={styles.objectiveNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.objectiveText}>{obj}</Text>
            </View>
          ))}

          <Text style={styles.metaInfo}>
            {scenario.tasks.length} tasks  ·  {maxScore} points possible  ·  Scored 1-10 each
          </Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={() => setCurrentTaskIndex(0)}>
          <Text style={styles.startButtonText}>Start Your Day</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // TASK SCREEN
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress bar */}
      <View style={styles.progressRow}>
        {scenario.tasks.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  i < currentTaskIndex ? colors.green
                    : i === currentTaskIndex ? colors.blue
                    : colors.border,
              },
            ]}
          />
        ))}
      </View>

      <Text style={styles.taskMeta}>
        Task {currentTaskIndex + 1} of {scenario.tasks.length}  ·  Score: {totalScore}/{maxScore}
      </Text>

      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>{currentTask.title}</Text>
        <Text style={styles.taskDesc}>{currentTask.description}</Text>
      </View>

      {/* Options */}
      {currentTask.options.map((option) => {
        const isSelected = selectedOption === option.id;
        const best = currentTask.options.reduce((a, b) => (a.points > b.points ? a : b));
        const isBest = showFeedback && option.id === best.id;
        const isWrong = showFeedback && isSelected && option.id !== best.id;

        let borderCol = colors.border;
        let bgCol = 'transparent';
        if (isBest) { borderCol = colors.green; bgCol = colors.green + '10'; }
        else if (isWrong) { borderCol = colors.red; bgCol = colors.red + '10'; }
        else if (isSelected) { borderCol = colors.blue; }

        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionBtn, { borderColor: borderCol, backgroundColor: bgCol }]}
            activeOpacity={selectedOption ? 1 : 0.7}
            onPress={() => handleSelect(option.id)}
            disabled={!!selectedOption}
          >
            <View style={[styles.optionLetter, { borderColor: borderCol }]}>
              <Text style={[
                styles.optionLetterText,
                { color: isBest ? colors.green : isWrong ? colors.red : colors.muted }
              ]}>
                {option.id.toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionText}>{option.text}</Text>

              {showFeedback && isSelected && (
                <View style={styles.feedbackInline}>
                  <Text style={[
                    styles.pointsLabel,
                    { color: option.points >= 8 ? colors.green : option.points >= 5 ? colors.yellow : colors.red }
                  ]}>
                    {option.points}/10 points
                  </Text>
                  <Text style={styles.feedbackInlineText}>{option.feedback}</Text>
                </View>
              )}

              {showFeedback && isBest && !isSelected && (
                <Text style={styles.bestLabel}>Best answer (10/10)</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      {showFeedback && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentTaskIndex < scenario.tasks.length - 1 ? 'Next Task' : 'View Results'}
          </Text>
          <Ionicons
            name={currentTaskIndex < scenario.tasks.length - 1 ? 'chevron-forward' : 'checkmark-circle'}
            size={18}
            color="#fff"
          />
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  errorText: { fontSize: 16, color: colors.text, marginTop: 12 },

  // Briefing
  briefingCard: {
    backgroundColor: colors.card, borderRadius: 18, padding: 20,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16,
  },
  briefingHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  briefingIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  briefingTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4 },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  roleLabel: { fontSize: 12, color: colors.muted },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  diffText: { fontSize: 11, fontWeight: '600' },
  morningBriefing: {
    backgroundColor: colors.darker, borderRadius: 14, padding: 16, marginBottom: 18,
  },
  morningLabel: { fontSize: 13, fontWeight: '700', color: colors.yellow, marginBottom: 6 },
  morningText: { fontSize: 13, color: colors.text, lineHeight: 20 },
  objectivesTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
  objectiveRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  objectiveNumber: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.green + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  objectiveNumberText: { fontSize: 11, fontWeight: '700', color: colors.green },
  objectiveText: { fontSize: 13, color: colors.muted, flex: 1, lineHeight: 19 },
  metaInfo: { fontSize: 11, color: colors.muted, marginTop: 14 },
  startButton: {
    backgroundColor: colors.blue, borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  startButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },

  // Task
  progressRow: { flexDirection: 'row', gap: 4, marginBottom: 12 },
  progressDot: { flex: 1, height: 5, borderRadius: 3 },
  taskMeta: { fontSize: 11, color: colors.muted, marginBottom: 12 },
  taskCard: {
    backgroundColor: colors.card, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: colors.border, marginBottom: 14,
  },
  taskTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6 },
  taskDesc: { fontSize: 13, color: colors.muted, lineHeight: 20 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, borderRadius: 14, borderWidth: 1.5, marginBottom: 10,
  },
  optionLetter: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  optionLetterText: { fontSize: 12, fontWeight: '700' },
  optionText: { fontSize: 13, color: colors.text, lineHeight: 19 },
  feedbackInline: {
    marginTop: 10, padding: 12, backgroundColor: colors.darker, borderRadius: 10,
  },
  pointsLabel: { fontSize: 12, fontWeight: '700', marginBottom: 4 },
  feedbackInlineText: { fontSize: 12, color: colors.text, lineHeight: 18 },
  bestLabel: { marginTop: 6, fontSize: 12, fontWeight: '600', color: colors.green },
  nextButton: {
    backgroundColor: colors.blue, borderRadius: 14, padding: 16, marginTop: 4,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },

  // Results
  resultCard: {
    backgroundColor: colors.card, borderRadius: 18, padding: 24,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', marginBottom: 20,
  },
  resultTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 4 },
  resultSubtitle: { fontSize: 14, color: colors.muted, marginBottom: 20 },
  gradeCircle: {
    width: 100, height: 100, borderRadius: 50, borderWidth: 4,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  gradeText: { fontSize: 36, fontWeight: '800' },
  scoreText: { fontSize: 26, fontWeight: '800', color: colors.text },
  percentText: { fontSize: 14, color: colors.muted, marginBottom: 8 },
  messageText: { fontSize: 14, color: colors.text, textAlign: 'center', lineHeight: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
  reviewCard: {
    backgroundColor: colors.card, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: colors.border, marginBottom: 10,
  },
  reviewRow: { flexDirection: 'row', gap: 10 },
  reviewContent: { flex: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reviewTitle: { fontSize: 13, fontWeight: '600', color: colors.text, flex: 1 },
  reviewScore: { fontSize: 13, fontWeight: '700', fontFamily: 'Courier' },
  reviewChoice: { fontSize: 11, color: colors.muted, marginBottom: 6 },
  feedbackBox: { backgroundColor: colors.darker, borderRadius: 8, padding: 8 },
  feedbackText: { fontSize: 11, color: colors.text, lineHeight: 16 },
  bestAnswer: { fontSize: 11, color: colors.green, marginTop: 6, fontWeight: '500' },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  secondaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.card, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: '600', color: colors.text },
  primaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.blue, borderRadius: 12, padding: 14,
  },
  primaryBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
