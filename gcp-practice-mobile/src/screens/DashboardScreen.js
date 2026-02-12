import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';
import { DAILY_SCENARIOS } from '../data/scenarios';
import { CHALLENGES } from '../data/challenges';

const TIPS = [
  'Cloud Spanner is the only GCP database with synchronous multi-region replication.',
  'GKE Autopilot manages node provisioning automatically — you only pay for pods.',
  'Cloud Run scales to zero, meaning you pay nothing when idle.',
  'VPC Service Controls create a security perimeter around GCP resources.',
  'Cloud Armor integrates with Global HTTP(S) Load Balancing for DDoS protection.',
  'BigQuery supports streaming inserts for real-time analytics.',
  'Pub/Sub guarantees at-least-once delivery with configurable retention.',
  'Cloud Build can be triggered by changes in Cloud Source Repos, GitHub, or Bitbucket.',
];

const FEATURES = [
  {
    tab: 'Scenarios',
    icon: 'calendar',
    color: colors.blue,
    title: 'A Day As...',
    description: 'Step into the shoes of a GCP Cloud Engineer. Complete realistic daily scenarios.',
    stat: `${DAILY_SCENARIOS.length} scenarios`,
  },
  {
    tab: 'Challenges',
    icon: 'trophy',
    color: colors.green,
    title: 'Architecture Challenges',
    description: 'Solve architecture design challenges. Select GCP services to meet requirements.',
    stat: `${CHALLENGES.length} challenges`,
  },
  {
    tab: 'Canvas',
    icon: 'grid',
    color: colors.yellow,
    title: 'Architecture Canvas',
    description: 'Build your own GCP architecture designs. Add services and connections.',
    stat: 'Free-form design',
  },
];

export default function DashboardScreen() {
  const navigation = useNavigation();
  const tipOfTheDay = TIPS[new Date().getDate() % TIPS.length];
  const totalTasks = DAILY_SCENARIOS.reduce((acc, s) => acc + s.tasks.length, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={[styles.iconCircle, { backgroundColor: colors.blue + '20' }]}>
          <Ionicons name="cloud" size={32} color={colors.blue} />
        </View>
        <Text style={styles.heroTitle}>GCP Architect{'\n'}Practice Lab</Text>
        <Text style={styles.heroSubtitle}>
          Sharpen your Google Cloud Platform engineering and architecture skills through realistic scenarios and challenges.
        </Text>
      </View>

      {/* Features */}
      {FEATURES.map((feature) => (
        <TouchableOpacity
          key={feature.tab}
          style={[styles.featureCard, { borderColor: feature.color + '30' }]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate(feature.tab)}
        >
          <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
            <Ionicons name={feature.icon} size={24} color={feature.color} />
          </View>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDesc}>{feature.description}</Text>
          <View style={styles.featureFooter}>
            <View style={[styles.badge, { backgroundColor: feature.color + '20' }]}>
              <Text style={[styles.badgeText, { color: feature.color }]}>{feature.stat}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </View>
        </TouchableOpacity>
      ))}

      {/* Tip of the Day */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <View style={[styles.tipIcon, { backgroundColor: colors.yellow + '20' }]}>
            <Ionicons name="book" size={20} color={colors.yellow} />
          </View>
          <Text style={styles.tipLabel}>GCP Tip of the Day</Text>
        </View>
        <Text style={styles.tipText}>{tipOfTheDay}</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="flag" size={20} color={colors.blue} />
          <Text style={styles.statNumber}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="trophy" size={20} color={colors.green} />
          <Text style={styles.statNumber}>{CHALLENGES.length}</Text>
          <Text style={styles.statLabel}>Challenges</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="grid" size={20} color={colors.yellow} />
          <Text style={styles.statNumber}>34</Text>
          <Text style={styles.statLabel}>Services</Text>
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20 },
  hero: { alignItems: 'center', marginBottom: 28 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28, fontWeight: '800', color: colors.text,
    textAlign: 'center', marginBottom: 8, lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 14, color: colors.muted, textAlign: 'center',
    lineHeight: 20, paddingHorizontal: 12,
  },
  featureCard: {
    backgroundColor: colors.card, borderRadius: 18, padding: 20,
    marginBottom: 14, borderWidth: 1,
  },
  featureIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  featureTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 6 },
  featureDesc: { fontSize: 13, color: colors.muted, lineHeight: 19, marginBottom: 14 },
  featureFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  tipCard: {
    backgroundColor: colors.card, borderRadius: 18, padding: 18,
    marginBottom: 18, borderWidth: 1, borderColor: colors.border,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  tipIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  tipLabel: { fontSize: 13, fontWeight: '600', color: colors.yellow },
  tipText: { fontSize: 13, color: colors.text, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1, backgroundColor: colors.card, borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  statNumber: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 6 },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
});
