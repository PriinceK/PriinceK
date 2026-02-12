import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, DIFFICULTY_COLORS } from '../theme';
import { DAILY_SCENARIOS } from '../data/scenarios';

export default function DayAsListScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>
        Step into realistic GCP Cloud Engineer scenarios. Make decisions, solve problems, and receive detailed feedback.
      </Text>

      {DAILY_SCENARIOS.map((scenario, idx) => {
        const diffColor = DIFFICULTY_COLORS[scenario.difficulty] || colors.blue;
        return (
          <TouchableOpacity
            key={scenario.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('DayAsScenario', { scenarioId: scenario.id })}
          >
            <View style={styles.cardTop}>
              <Text style={styles.dayLabel}>DAY {idx + 1}</Text>
              <View style={[styles.diffBadge, { backgroundColor: diffColor + '20' }]}>
                <Text style={[styles.diffText, { color: diffColor }]}>{scenario.difficulty}</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>{scenario.title}</Text>

            <Text style={styles.roleText}>
              <Text style={styles.roleHighlight}>{scenario.role}</Text> at {scenario.company}
            </Text>

            <Text style={styles.briefing} numberOfLines={2}>
              {scenario.briefing}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="flag-outline" size={13} color={colors.muted} />
                <Text style={styles.metaText}>{scenario.objectives.length} objectives</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="list-outline" size={13} color={colors.muted} />
                <Text style={styles.metaText}>{scenario.tasks.length} tasks</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="star-outline" size={13} color={colors.muted} />
                <Text style={styles.metaText}>{scenario.tasks.length * 10} pts</Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color={colors.muted} style={styles.arrow} />
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20 },
  subtitle: { fontSize: 13, color: colors.muted, lineHeight: 19, marginBottom: 20 },
  card: {
    backgroundColor: colors.card, borderRadius: 18, padding: 18,
    marginBottom: 14, borderWidth: 1, borderColor: colors.border,
    position: 'relative',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  dayLabel: { fontSize: 11, fontFamily: 'Courier', color: colors.muted, fontWeight: '600' },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  diffText: { fontSize: 11, fontWeight: '600' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  roleText: { fontSize: 13, color: colors.muted, marginBottom: 8 },
  roleHighlight: { color: colors.text, fontWeight: '600' },
  briefing: { fontSize: 13, color: colors.muted, lineHeight: 19, marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: colors.muted },
  arrow: { position: 'absolute', right: 18, top: 18 },
});
