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
