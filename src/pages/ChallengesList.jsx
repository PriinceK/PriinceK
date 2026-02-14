import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, ArrowRight, Star, Tag, CheckCircle2, Filter } from 'lucide-react'
import { CHALLENGES } from '../data/challenges'

const DIFFICULTY_COLORS = {
  Beginner: '#10b981',
  Intermediate: '#00d4ff',
  Advanced: '#f59e0b',
  Expert: '#f43f5e',
}

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert']

function getCompletedChallenges() {
  try {
    return JSON.parse(localStorage.getItem('gcp-lab-progress') || '{}').challenges || {}
  } catch {
    return {}
  }
}

const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

export default function ChallengesList() {
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [completedChallenges, setCompletedChallenges] = useState({})

  useEffect(() => {
    setCompletedChallenges(getCompletedChallenges())
  }, [])

  const filtered = filterDifficulty === 'All'
    ? CHALLENGES
    : CHALLENGES.filter((c) => c.difficulty === filterDifficulty)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-neon-emerald/10 flex items-center justify-center border border-neon-emerald/20">
            <Trophy className="w-5 h-5 text-neon-emerald" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Architecture Challenges</h1>
        </div>
        <p className="text-nebula-muted max-w-xl">
          Design GCP architectures to solve real-world problems. Select the right services,
          and get scored based on how well your design meets the requirements.
        </p>
      </motion.div>

      {/* Difficulty filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 mb-8"
        role="group"
        aria-label="Filter by difficulty"
      >
        <Filter className="w-4 h-4 text-nebula-dim" aria-hidden="true" />
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setFilterDifficulty(d)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              filterDifficulty === d
                ? 'bg-neon-emerald/10 border-neon-emerald/30 text-neon-emerald'
                : 'bg-transparent border-nebula-border text-nebula-muted hover:text-nebula-text hover:border-nebula-border-bright'
            }`}
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
            aria-pressed={filterDifficulty === d}
          >
            {d}
          </button>
        ))}
      </motion.div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-nebula-muted">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No challenges match this filter.</p>
        </div>
      ) : (
        <motion.div className="space-y-4" variants={stagger} initial="initial" animate="animate">
          {filtered.map((challenge) => {
            const completed = completedChallenges[challenge.id]
            const diffColor = DIFFICULTY_COLORS[challenge.difficulty]
            return (
              <motion.div key={challenge.id} variants={fadeUp}>
                <Link
                  to={`/challenges/${challenge.id}`}
                  className="group block glass-card rounded-2xl p-6 no-underline hover:-translate-y-0.5 transition-all"
                  aria-label={`${challenge.title} - ${challenge.difficulty} - ${challenge.maxScore} points`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2.5">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: diffColor + '12', color: diffColor, border: `1px solid ${diffColor}20`, fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {challenge.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-nebula-dim">
                          <Tag className="w-3 h-3" aria-hidden="true" />
                          {challenge.category}
                        </span>
                        {completed && (
                          <span className="flex items-center gap-1 text-xs text-neon-emerald" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            <CheckCircle2 className="w-3 h-3" />
                            {completed.percentage}%
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{challenge.title}</h2>
                      <p className="text-sm text-nebula-muted leading-relaxed line-clamp-2 mb-3">
                        {challenge.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {challenge.requirements.slice(0, 3).map((req, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-md text-nebula-dim bg-nebula-surface/60 border border-nebula-border">
                            {req}
                          </span>
                        ))}
                        {challenge.requirements.length > 3 && (
                          <span className="text-xs px-2 py-1 rounded-md text-nebula-dim bg-nebula-surface/60 border border-nebula-border">
                            +{challenge.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <Star className="w-5 h-5 text-neon-amber" aria-hidden="true" />
                      <span className="text-sm font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{challenge.maxScore}</span>
                      <span className="text-xs text-nebula-dim">pts</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
