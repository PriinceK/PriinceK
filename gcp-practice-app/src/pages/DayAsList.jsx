import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, Clock, Target, BarChart3, CheckCircle2, Filter, Wrench } from 'lucide-react'
import { DAILY_SCENARIOS } from '../data/scenarios'
import { getCustomScenarios } from '../utils/progress'

const DIFFICULTY_COLORS = {
  Beginner: '#10b981',
  Intermediate: '#00d4ff',
  Advanced: '#f59e0b',
  Expert: '#f43f5e',
}

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert']

function getCompletedScenarios() {
  try {
    return JSON.parse(localStorage.getItem('gcp-lab-progress') || '{}').scenarios || {}
  } catch {
    return {}
  }
}

const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

export default function DayAsList() {
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [completedScenarios, setCompletedScenarios] = useState({})
  const [customScenarios, setCustomScenarios] = useState([])

  useEffect(() => {
    setCompletedScenarios(getCompletedScenarios())
    setCustomScenarios(getCustomScenarios())
  }, [])

  const allScenarios = [...DAILY_SCENARIOS, ...customScenarios]
  const filtered = filterDifficulty === 'All'
    ? allScenarios
    : allScenarios.filter((s) => s.difficulty === filterDifficulty)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20">
            <Calendar className="w-5 h-5 text-neon-cyan" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>A Day As...</h1>
        </div>
        <p className="text-nebula-muted max-w-xl">
          Step into realistic GCP Cloud Engineer scenarios. Make decisions, solve problems,
          and receive detailed feedback on your choices.
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
                ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan'
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
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No scenarios match this filter.</p>
        </div>
      ) : (
        <motion.div className="space-y-4" variants={stagger} initial="initial" animate="animate">
          {filtered.map((scenario) => {
            const completed = completedScenarios[scenario.id]
            const diffColor = DIFFICULTY_COLORS[scenario.difficulty]
            return (
              <motion.div key={scenario.id} variants={fadeUp}>
                <Link
                  to={`/day-as/${scenario.id}`}
                  className="group block glass-card rounded-2xl p-6 no-underline hover:-translate-y-0.5 transition-all"
                  aria-label={`${scenario.title} - ${scenario.difficulty} difficulty`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2.5">
                        <span className="text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {scenario.isCustom ? (
                            <span className="flex items-center gap-1"><Wrench className="w-3 h-3" />CUSTOM</span>
                          ) : (
                            `DAY ${DAILY_SCENARIOS.indexOf(scenario) + 1}`
                          )}
                        </span>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: diffColor + '12', color: diffColor, border: `1px solid ${diffColor}20`, fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {scenario.difficulty}
                        </span>
                        {completed && (
                          <span className="flex items-center gap-1 text-xs text-neon-emerald" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            <CheckCircle2 className="w-3 h-3" />
                            {completed.percentage}%
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-nebula-text mb-1.5" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                        {scenario.title}
                      </h2>
                      <p className="text-sm text-nebula-muted mb-3">
                        <span className="text-nebula-text font-medium">{scenario.role}</span> at {scenario.company}
                      </p>
                      <p className="text-sm text-nebula-muted leading-relaxed line-clamp-2">
                        {scenario.briefing}
                      </p>

                      <div className="flex items-center gap-5 mt-4">
                        <div className="flex items-center gap-1.5 text-xs text-nebula-dim">
                          <Target className="w-3.5 h-3.5" aria-hidden="true" />
                          {scenario.objectives.length} objectives
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-nebula-dim">
                          <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                          {scenario.tasks.length} tasks
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-nebula-dim">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          {scenario.tasks.length * 10} pts
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-nebula-dim group-hover:text-neon-cyan group-hover:translate-x-1 transition-all shrink-0 mt-2" aria-hidden="true" />
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
