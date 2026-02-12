import React, { useState, useLayoutEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { CHALLENGES } from '../data/challenges';
import { GCP_SERVICES, GCP_SERVICE_CATEGORIES } from '../data/gcpServices';

export default function ChallengeDetailScreen({ route, navigation }) {
  const { challengeId } = route.params;
  const challenge = CHALLENGES.find((c) => c.id === challengeId);

  const [selectedServices, setSelectedServices] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  useLayoutEffect(() => {
    if (challenge) {
      navigation.setOptions({ title: challenge.title });
    }
  }, [navigation, challenge]);

  if (!challenge) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={48} color={colors.yellow} />
        <Text style={styles.errorText}>Challenge not found</Text>
      </View>
    );
  }

  const filteredServices = GCP_SERVICES.filter((s) => {
    const matchesSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  function toggleService(service) {
    if (submitted) return;
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  }

  function evaluate() {
    return challenge.evaluationCriteria.map((criterion) => {
      const met = criterion.services.some((sid) =>
        selectedServices.some((s) => s.id === sid)
      );
      return { ...criterion, met };
    });
  }

  function handleReset() {
    setSelectedServices([]);
    setSubmitted(false);
    setShowSolution(false);
  }

  const results = submitted ? evaluate() : [];
  const score = results.reduce((acc, r) => acc + (r.met ? r.points : 0), 0);
  const percentage = submitted ? Math.round((score / challenge.maxScore) * 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Challenge info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{challenge.title}</Text>
        <Text style={styles.infoDesc}>{challenge.description}</Text>

        <Text style={styles.reqTitle}>Requirements:</Text>
        {challenge.requirements.map((req, i) => (
          <View key={i} style={styles.reqRow}>
            <Text style={styles.bullet}>*</Text>
            <Text style={styles.reqText}>{req}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.hintBtn} onPress={() => setShowHints(!showHints)}>
          <Ionicons name="bulb-outline" size={16} color={colors.yellow} />
          <Text style={styles.hintBtnText}>{showHints ? 'Hide Hints' : 'Show Hints'}</Text>
        </TouchableOpacity>

        {showHints && (
          <View style={styles.hintsBox}>
            {challenge.hints.map((hint, i) => (
              <View key={i} style={styles.hintRow}>
                <Ionicons name="bulb" size={13} color={colors.yellow} />
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Your Architecture */}
      {selectedServices.length > 0 && (
        <View style={styles.selectedCard}>
          <Text style={styles.selectedTitle}>
            Your Architecture ({selectedServices.length} services)
          </Text>
          <View style={styles.selectedList}>
            {selectedServices.map((service) => {
              const cat = GCP_SERVICE_CATEGORIES[service.category];
              return (
                <View key={service.id} style={styles.selectedItem}>
                  <View style={[styles.catDot, { backgroundColor: cat?.color }]} />
                  <Text style={styles.selectedName} numberOfLines={1}>{service.name}</Text>
                  {!submitted && (
                    <TouchableOpacity onPress={() => toggleService(service)}>
                      <Ionicons name="close" size={14} color={colors.muted} />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Submit / Results */}
      {!submitted ? (
        <TouchableOpacity
          style={[styles.submitBtn, selectedServices.length === 0 && styles.submitBtnDisabled]}
          onPress={() => setSubmitted(true)}
          disabled={selectedServices.length === 0}
        >
          <Text style={styles.submitBtnText}>Submit Design</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.resultsCard}>
          <View style={styles.resultHeader}>
            <Ionicons
              name="trophy"
              size={28}
              color={percentage >= 80 ? colors.green : percentage >= 60 ? colors.yellow : colors.red}
            />
            <Text style={styles.resultScore}>{score}/{challenge.maxScore}</Text>
            <Text style={styles.resultPercent}>{percentage}% score</Text>
          </View>

          {results.map((r) => (
            <View key={r.id} style={styles.criterionRow}>
              <Ionicons
                name={r.met ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={r.met ? colors.green : colors.red}
              />
              <Text style={[styles.criterionText, !r.met && { color: colors.muted }]}>
                {r.label} ({r.points}pts)
              </Text>
            </View>
          ))}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Ionicons name="refresh" size={14} color={colors.text} />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.solutionBtn}
              onPress={() => setShowSolution(!showSolution)}
            >
              <Ionicons name={showSolution ? 'eye-off' : 'eye'} size={14} color={colors.text} />
              <Text style={styles.resetBtnText}>{showSolution ? 'Hide' : 'Solution'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showSolution && (
        <View style={styles.solutionCard}>
          <Text style={styles.solutionTitle}>Sample Solution</Text>
          <Text style={styles.solutionExplanation}>{challenge.sampleSolution.explanation}</Text>
          {challenge.sampleSolution.services.map((sid) => {
            const svc = GCP_SERVICES.find((s) => s.id === sid);
            return svc ? (
              <View key={sid} style={styles.solutionSvc}>
                <Ionicons name="checkmark-circle" size={13} color={colors.green} />
                <Text style={styles.solutionSvcName}>{svc.name}</Text>
              </View>
            ) : null;
          })}
        </View>
      )}

      {/* Service picker */}
      <View style={styles.pickerCard}>
        <Text style={styles.pickerTitle}>Select GCP Services</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          editable={!submitted}
        />

        {/* Category filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          <TouchableOpacity
            style={[styles.catBtn, !activeCategory && styles.catBtnActive]}
            onPress={() => setActiveCategory(null)}
          >
            <Text style={[styles.catBtnText, !activeCategory && { color: colors.blue }]}>All</Text>
          </TouchableOpacity>
          {Object.entries(GCP_SERVICE_CATEGORIES).map(([key, cat]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.catBtn,
                activeCategory === key && { backgroundColor: cat.color + '20', borderColor: cat.color + '40' },
              ]}
              onPress={() => setActiveCategory(activeCategory === key ? null : key)}
            >
              <Text style={[styles.catBtnText, activeCategory === key && { color: cat.color }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Service list */}
        {filteredServices.map((service) => {
          const isSelected = selectedServices.some((s) => s.id === service.id);
          const cat = GCP_SERVICE_CATEGORIES[service.category];
          return (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceItem,
                isSelected && { backgroundColor: colors.blue + '15', borderColor: colors.blue + '40' },
                submitted && { opacity: 0.5 },
              ]}
              onPress={() => toggleService(service)}
              disabled={submitted}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                size={18}
                color={isSelected ? colors.blue : colors.muted}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDesc} numberOfLines={1}>{service.description}</Text>
              </View>
              <View style={[styles.catIndicator, { backgroundColor: cat?.color }]} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  errorText: { fontSize: 16, color: colors.text, marginTop: 12 },

  infoCard: {
    backgroundColor: colors.card, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: colors.border, marginBottom: 14,
  },
  infoTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
  infoDesc: { fontSize: 13, color: colors.muted, lineHeight: 19, marginBottom: 14 },
  reqTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  reqRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  bullet: { color: colors.blue, fontSize: 13, marginTop: 1 },
  reqText: { fontSize: 13, color: colors.muted, flex: 1, lineHeight: 19 },

  hintBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14,
  },
  hintBtnText: { fontSize: 13, color: colors.yellow, fontWeight: '500' },
  hintsBox: { marginTop: 10, gap: 6 },
  hintRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: colors.yellow + '08', borderRadius: 10, padding: 10,
  },
  hintText: { fontSize: 12, color: colors.yellow, flex: 1, lineHeight: 17, opacity: 0.85 },

  selectedCard: {
    backgroundColor: colors.card, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: colors.border, marginBottom: 14,
  },
  selectedTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10 },
  selectedList: { gap: 4 },
  selectedItem: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.darker, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7,
  },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  selectedName: { flex: 1, fontSize: 13, color: colors.text },

  submitBtn: {
    backgroundColor: colors.green, borderRadius: 14, padding: 16,
    alignItems: 'center', marginBottom: 14,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },

  resultsCard: {
    backgroundColor: colors.card, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border, marginBottom: 14,
  },
  resultHeader: { alignItems: 'center', paddingVertical: 10, marginBottom: 10 },
  resultScore: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 4 },
  resultPercent: { fontSize: 12, color: colors.muted },
  criterionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  criterionText: { fontSize: 12, color: colors.text, flex: 1 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  resetBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: colors.darker, borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  solutionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: colors.darker, borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: colors.border,
  },
  resetBtnText: { fontSize: 12, color: colors.text, fontWeight: '500' },

  solutionCard: {
    backgroundColor: colors.card, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.green + '30', marginBottom: 14,
  },
  solutionTitle: { fontSize: 14, fontWeight: '600', color: colors.green, marginBottom: 8 },
  solutionExplanation: { fontSize: 12, color: colors.text, lineHeight: 18, marginBottom: 10 },
  solutionSvc: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  solutionSvcName: { fontSize: 12, color: colors.muted },

  pickerCard: {
    backgroundColor: colors.card, borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  pickerTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10 },
  searchInput: {
    backgroundColor: colors.darker, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 13, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: 10,
  },
  catScroll: { marginBottom: 12 },
  catBtn: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    borderWidth: 1, borderColor: colors.border, marginRight: 6,
  },
  catBtnActive: { backgroundColor: colors.blue + '20', borderColor: colors.blue + '40' },
  catBtnText: { fontSize: 11, color: colors.muted, fontWeight: '500' },

  serviceItem: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.darker, borderRadius: 10, padding: 12,
    marginBottom: 6, borderWidth: 1, borderColor: colors.border,
  },
  serviceName: { fontSize: 13, fontWeight: '600', color: colors.text },
  serviceDesc: { fontSize: 11, color: colors.muted, marginTop: 1 },
  catIndicator: { width: 4, height: 24, borderRadius: 2 },
});
