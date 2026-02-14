import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, Brain, Flame, Calendar, ArrowRight, Plus } from 'lucide-react'
import { FLASHCARDS } from '../data/flashcards'
import { getFlashcardState, getCustomFlashcards, getStudyStreak } from '../utils/progress'
import { isDueForReview, getCardsDueCount } from '../utils/spacedRepetition'
import { DOMAINS } from '../utils/domainScoring'

const stagger = { animate: { transition: { staggerChildren: 0.06 } } }
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
}

export default function ReviewDashboard() {
  const [flashcardStates, setFlashcardStates] = useState({})
  const [streak, setStreak] = useState({ current: 0 })

  useEffect(() => {
    setFlashcardStates(getFlashcardState())
    setStreak(getStudyStreak())
  }, [])

  const allCards = useMemo(() => {
    const custom = getCustomFlashcards()
    return [...FLASHCARDS, ...custom]
  }, [])

  const dueCards = useMemo(() => {
    return allCards.filter((card) => isDueForReview(flashcardStates[card.id]))
  }, [allCards, flashcardStates])

  const reviewedCount = Object.keys(flashcardStates).length
  const totalCards = allCards.length

  const domainBreakdown = useMemo(() => {
    const counts = {}
    for (const card of dueCards) {
      counts[card.domain] = (counts[card.domain] || 0) + 1
    }
    return DOMAINS.map((d) => ({ ...d, due: counts[d.id] || 0 })).filter((d) => d.due > 0).sort((a, b) => b.due - a.due)
  }, [dueCards])

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center border border-neon-purple/20">
            <RotateCcw className="w-5 h-5 text-neon-purple" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Review Cards</h1>
        </div>
        <p className="text-nebula-muted max-w-xl">
          Spaced repetition flashcards to reinforce your GCP knowledge. Cards appear at optimal intervals based on your recall strength.
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div className="grid grid-cols-3 gap-4 mb-8" variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeUp} className="glass-card-static rounded-xl p-5 text-center">
          <Brain className="w-5 h-5 mx-auto mb-2 text-neon-cyan" />
          <div className="text-2xl font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{dueCards.length}</div>
          <div className="text-xs text-nebula-muted mt-1">Cards Due Today</div>
        </motion.div>
        <motion.div variants={fadeUp} className="glass-card-static rounded-xl p-5 text-center">
          <Flame className="w-5 h-5 mx-auto mb-2 text-neon-amber" />
          <div className="text-2xl font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{streak.current}</div>
          <div className="text-xs text-nebula-muted mt-1">Day Streak</div>
        </motion.div>
        <motion.div variants={fadeUp} className="glass-card-static rounded-xl p-5 text-center">
          <Calendar className="w-5 h-5 mx-auto mb-2 text-neon-emerald" />
          <div className="text-2xl font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{reviewedCount}/{totalCards}</div>
          <div className="text-xs text-nebula-muted mt-1">Cards Reviewed</div>
        </motion.div>
      </motion.div>

      {/* Start Session */}
      {dueCards.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-nebula-text mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Ready to Review</h2>
              <p className="text-sm text-nebula-muted">You have {dueCards.length} cards due. Start a review session to maintain your knowledge.</p>
            </div>
            <Link to="/review/session" className="btn-neon text-sm px-6 py-2.5 rounded-xl no-underline flex items-center gap-2 shrink-0">
              Start Review <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card-static rounded-2xl p-8 mb-8 text-center">
          <RotateCcw className="w-12 h-12 mx-auto mb-3 text-neon-emerald opacity-60" />
          <h2 className="text-lg font-bold text-nebula-text mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>All Caught Up!</h2>
          <p className="text-sm text-nebula-muted">No cards due right now. Come back later or add new cards.</p>
        </motion.div>
      )}

      {/* Domain Breakdown */}
      {domainBreakdown.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-semibold text-nebula-text mb-3">Due by Domain</h3>
          <div className="space-y-2">
            {domainBreakdown.map((d) => (
              <div key={d.id} className="glass-card-static rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm text-nebula-text">{d.label}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: d.color, fontFamily: 'JetBrains Mono, monospace' }}>{d.due}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
