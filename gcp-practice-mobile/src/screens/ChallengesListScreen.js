import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, DIFFICULTY_COLORS } from '../theme';
import { CHALLENGES } from '../data/challenges';

export default function ChallengesListScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>
        Design GCP architectures to solve real-world problems. Select the right services and get scored on your choices.
      </Text>

      {CHALLENGES.map((challenge) => {
        const diffColor = DIFFICULTY_COLORS[challenge.difficulty] || colors.blue;
        return (
          <TouchableOpacity
            key={challenge.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ChallengeDetail', { challengeId: challenge.id })}
          >
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <View style={[styles.diffBadge, { backgroundColor: diffColor + '20' }]}>
                  <Text style={[styles.diffText, { color: diffColor }]}>{challenge.difficulty}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Ionicons name="pricetag-outline" size={11} color={colors.muted} />
                  <Text style={styles.categoryText}>{challenge.category}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{challenge.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{challenge.description}</Text>

              <View style={styles.reqsRow}>
                {challenge.requirements.slice(0, 2).map((req, i) => (
                  <View key={i} style={styles.reqBadge}>
                    <Text style={styles.reqText} numberOfLines={1}>{req}</Text>
                  </View>
                ))}
                {challenge.requirements.length > 2 && (
                  <View style={styles.reqBadge}>
                    <Text style={styles.reqText}>+{challenge.requirements.length - 2} more</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.scoreBox}>
              <Ionicons name="star" size={18} color={colors.yellow} />
              <Text style={styles.scoreNumber}>{challenge.maxScore}</Text>
              <Text style={styles.scorePts}>pts</Text>
            </View>
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
    flexDirection: 'row', gap: 12,
  },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  diffText: { fontSize: 11, fontWeight: '600' },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  categoryText: { fontSize: 11, color: colors.muted },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: colors.muted, lineHeight: 19, marginBottom: 12 },
  reqsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  reqBadge: { backgroundColor: colors.darker, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, maxWidth: 160 },
  reqText: { fontSize: 10, color: colors.muted },
  scoreBox: { alignItems: 'center', justifyContent: 'center', width: 48 },
  scoreNumber: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 2 },
  scorePts: { fontSize: 10, color: colors.muted },
});
