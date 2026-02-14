import { debouncedSync } from './cloudProgress'
import { auth, isConfigured } from '../config/firebase'

const STORAGE_KEY = 'gcp-lab-progress'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  // Auto-sync to cloud if user is logged in
  if (isConfigured && auth?.currentUser) {
    debouncedSync(auth.currentUser.uid)
  }
}

export function getProgress() {
  return load()
}

export function updateProgress(key, value) {
  const data = load()
  data[key] = value
  save(data)
  return data
}

export function getScenarios() {
  return load().scenarios || {}
}

export function getChallenges() {
  return load().challenges || {}
}

// Domain scoring
export function getDomainScores() {
  return load().domainScores || {}
}

export function updateDomainScore(domain, correct, total) {
  const data = load()
  if (!data.domainScores) data.domainScores = {}
  const prev = data.domainScores[domain] || { correct: 0, total: 0 }
  data.domainScores[domain] = {
    correct: prev.correct + correct,
    total: prev.total + total,
    lastUpdated: Date.now(),
  }
  save(data)
  return data.domainScores
}

// Flashcards / Spaced repetition
export function getFlashcardState() {
  return load().flashcards || {}
}

export function updateFlashcardState(cardId, state) {
  const data = load()
  if (!data.flashcards) data.flashcards = {}
  data.flashcards[cardId] = { ...state, lastReviewed: Date.now() }
  save(data)
}

export function addCustomFlashcard(card) {
  const data = load()
  if (!data.customFlashcards) data.customFlashcards = []
  data.customFlashcards.push({ ...card, id: `custom-${Date.now()}`, createdAt: Date.now() })
  save(data)
}

export function getCustomFlashcards() {
  return load().customFlashcards || []
}

// Exam history
export function getExamHistory() {
  return load().examHistory || []
}

export function saveExamResult(result) {
  const data = load()
  if (!data.examHistory) data.examHistory = []
  data.examHistory.push({ ...result, completedAt: Date.now() })
  save(data)
  return data.examHistory
}

// Study streak
export function getStudyStreak() {
  const data = load()
  const today = new Date().toDateString()
  if (!data.streak) return { current: 0, lastDate: null }
  if (data.streak.lastDate === today) return data.streak
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (data.streak.lastDate === yesterday) return data.streak
  return { current: 0, lastDate: data.streak.lastDate }
}

export function recordStudyActivity() {
  const data = load()
  const today = new Date().toDateString()
  if (!data.streak) data.streak = { current: 0, lastDate: null }
  if (data.streak.lastDate === today) {
    save(data)
    return data.streak
  }
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (data.streak.lastDate === yesterday) {
    data.streak.current += 1
  } else {
    data.streak.current = 1
  }
  data.streak.lastDate = today
  save(data)
  return data.streak
}

// Achievement tracking
export function getAchievements() {
  return load().achievements || {}
}

export function unlockAchievement(achievementId) {
  const data = load()
  if (!data.achievements) data.achievements = {}
  if (!data.achievements[achievementId]) {
    data.achievements[achievementId] = { unlockedAt: Date.now() }
    save(data)
    return true
  }
  return false
}

export async function runAchievementCheck() {
  const { checkAchievements } = await import('../data/achievements')
  const data = load()
  const newlyUnlocked = checkAchievements(data)
  if (newlyUnlocked.length > 0) {
    if (!data.achievements) data.achievements = {}
    for (const a of newlyUnlocked) {
      data.achievements[a.id] = { unlockedAt: Date.now() }
    }
    save(data)
  }
  return newlyUnlocked
}

// Custom scenarios
export function getCustomScenarios() {
  return load().customScenarios || []
}

export function saveCustomScenario(scenario) {
  const data = load()
  if (!data.customScenarios) data.customScenarios = []
  const existing = data.customScenarios.findIndex((s) => s.id === scenario.id)
  if (existing >= 0) {
    data.customScenarios[existing] = { ...scenario, updatedAt: Date.now() }
  } else {
    data.customScenarios.push({ ...scenario, createdAt: Date.now() })
  }
  save(data)
  return data.customScenarios
}

export function deleteCustomScenario(scenarioId) {
  const data = load()
  if (!data.customScenarios) return []
  data.customScenarios = data.customScenarios.filter((s) => s.id !== scenarioId)
  save(data)
  return data.customScenarios
}

// Activity log for analytics
export function logActivity(type, details) {
  const data = load()
  if (!data.activityLog) data.activityLog = []
  data.activityLog.push({ type, ...details, timestamp: Date.now() })
  // Keep last 500 entries
  if (data.activityLog.length > 500) {
    data.activityLog = data.activityLog.slice(-500)
  }
  save(data)
}

export function getActivityLog() {
  return load().activityLog || []
}
