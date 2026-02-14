import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Check, ChevronRight } from 'lucide-react'
import { FLASHCARDS } from '../data/flashcards'
import { getFlashcardState, updateFlashcardState, getCustomFlashcards, recordStudyActivity } from '../utils/progress'
import { isDueForReview, calculateNextReview, QUALITY_LABELS } from '../utils/spacedRepetition'

export default function ReviewSession() {
  const [flashcardStates, setFlashcardStates] = useState(() => getFlashcardState())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, again: 0, hard: 0, good: 0, easy: 0 })
  const [finished, setFinished] = useState(false)

  const dueCards = useMemo(() => {
    const allCards = [...FLASHCARDS, ...getCustomFlashcards()]
    return allCards.filter((card) => isDueForReview(flashcardStates[card.id]))
  }, [])

  const currentCard = dueCards[currentIndex]

  const handleRate = useCallback((quality) => {
    if (!currentCard) return
    const prevState = flashcardStates[currentCard.id] || {}
    const newState = calculateNextReview(prevState, quality)
    updateFlashcardState(currentCard.id, newState)
    setFlashcardStates((prev) => ({ ...prev, [currentCard.id]: newState }))

    const qualityKey = ['again', 'hard', 'good', 'easy'][quality]
    setSessionStats((prev) => ({ ...prev, reviewed: prev.reviewed + 1, [qualityKey]: prev[qualityKey] + 1 }))

    recordStudyActivity()

    if (currentIndex + 1 >= dueCards.length) {
      setFinished(true)
    } else {
      setFlipped(false)
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentCard, currentIndex, dueCards.length, flashcardStates])

  if (dueCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <RotateCcw className="w-16 h-16 mx-auto mb-4 text-neon-emerald opacity-50" />
        <h2 className="text-xl font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>No Cards Due</h2>
        <p className="text-nebula-muted mb-6">All caught up! Check back later.</p>
        <Link to="/review" className="btn-neon text-sm px-5 py-2.5 rounded-xl no-underline">Back to Dashboard</Link>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Check className="w-16 h-16 mx-auto mb-4 text-neon-emerald" />
          <h2 className="text-2xl font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Session Complete!</h2>
          <p className="text-nebula-muted mb-8">You reviewed {sessionStats.reviewed} cards.</p>
          <div className="grid grid-cols-4 gap-3 mb-8 max-w-md mx-auto">
            {QUALITY_LABELS.map((q) => {
              const key = q.label.toLowerCase()
              return (
                <div key={q.value} className="glass-card-static rounded-xl p-3 text-center">
                  <div className="text-lg font-bold" style={{ color: q.color, fontFamily: 'JetBrains Mono, monospace' }}>{sessionStats[key]}</div>
                  <div className="text-xs text-nebula-muted mt-0.5">{q.label}</div>
                </div>
              )
            })}
          </div>
          <Link to="/review" className="btn-neon text-sm px-6 py-2.5 rounded-xl no-underline">Back to Dashboard</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <Link to="/review" className="inline-flex items-center gap-1.5 text-sm text-nebula-muted hover:text-nebula-text no-underline transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <span className="text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {currentIndex + 1} / {dueCards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-nebula-surface mb-8 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-neon-cyan"
          animate={{ width: `${((currentIndex) / dueCards.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <div
            onClick={() => !flipped && setFlipped(true)}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && !flipped && (e.preventDefault(), setFlipped(true))}
            role="button"
            tabIndex={0}
            className={`glass-card-static rounded-2xl p-8 min-h-[240px] flex flex-col justify-center items-center text-center cursor-pointer select-none transition-all ${!flipped ? 'hover:scale-[1.01]' : ''
              }`}
          >
            {!flipped ? (
              <div>
                <div className="text-xs text-nebula-dim mb-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {currentCard.domain}
                </div>
                <p className="text-lg font-medium text-nebula-text leading-relaxed">{currentCard.front}</p>
                <p className="text-xs text-nebula-dim mt-6">Click or press <kbd className="px-1.5 py-0.5 rounded bg-nebula-surface/60 border border-nebula-border text-[10px]">Space</kbd> to reveal</p>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, rotateX: 10 }} animate={{ opacity: 1, rotateX: 0 }} transition={{ duration: 0.3 }}>
                <div className="text-xs text-neon-cyan mb-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Answer</div>
                <p className="text-base text-nebula-text leading-relaxed">{currentCard.back}</p>
              </motion.div>
            )}
          </div>

          {/* Rating buttons */}
          {flipped && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6">
              <p className="text-xs text-nebula-dim text-center mb-3">How well did you know this?</p>
              <div className="grid grid-cols-4 gap-2">
                {QUALITY_LABELS.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => handleRate(q.value)}
                    className="py-3 px-2 rounded-xl border border-nebula-border hover:border-opacity-60 text-center transition-all cursor-pointer"
                    style={{ '--hover-color': q.color }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = q.color + '60'; e.currentTarget.style.backgroundColor = q.color + '08' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.backgroundColor = '' }}
                  >
                    <div className="text-sm font-bold" style={{ color: q.color }}>{q.label}</div>
                    <div className="text-xs text-nebula-dim mt-0.5">{q.description}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
