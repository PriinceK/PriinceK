// SM-2 Spaced Repetition Algorithm
// Quality ratings: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy

export function calculateNextReview(cardState, quality) {
  let { easeFactor = 2.5, interval = 0, repetitions = 0 } = cardState

  if (quality < 1) {
    // Again — reset
    repetitions = 0
    interval = 0
  } else {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 3
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
  }

  // Update ease factor (modified SM-2)
  const qualityNorm = quality / 3 // normalize 0-3 to 0-1
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (1 - qualityNorm) * (0.08 + (1 - qualityNorm) * 0.02))

  const nextReview = Date.now() + interval * 86400000 // days to ms

  return { easeFactor, interval, repetitions, nextReview }
}

export function isDueForReview(cardState) {
  if (!cardState || !cardState.nextReview) return true
  return Date.now() >= cardState.nextReview
}

export function getCardsDueCount(flashcardStates) {
  let count = 0
  for (const state of Object.values(flashcardStates)) {
    if (isDueForReview(state)) count++
  }
  return count
}

export function sortByDueDate(cardIds, flashcardStates) {
  return [...cardIds].sort((a, b) => {
    const stateA = flashcardStates[a]
    const stateB = flashcardStates[b]
    const dueA = stateA?.nextReview || 0
    const dueB = stateB?.nextReview || 0
    return dueA - dueB
  })
}

export const QUALITY_LABELS = [
  { value: 0, label: 'Again', color: '#f43f5e', description: 'Forgot completely' },
  { value: 1, label: 'Hard', color: '#f59e0b', description: 'Recalled with difficulty' },
  { value: 2, label: 'Good', color: '#00d4ff', description: 'Recalled correctly' },
  { value: 3, label: 'Easy', color: '#10b981', description: 'Knew it instantly' },
]
