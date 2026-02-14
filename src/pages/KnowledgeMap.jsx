import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, TrendingDown, Target, ArrowRight } from 'lucide-react'
import RadarChart from '../components/RadarChart'
import { getDomainScores } from '../utils/progress'
import { DOMAINS, calculateDomainPercentages, getOverallScore, getWeakestDomains, getStrongestDomains } from '../utils/domainScoring'

const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

export default function KnowledgeMap() {
  const [domainScores, setDomainScores] = useState({})

  useEffect(() => {
    setDomainScores(getDomainScores())
  }, [])

  const domainData = calculateDomainPercentages(domainScores)
  const overall = getOverallScore(domainScores)
  const weakest = getWeakestDomains(domainScores, 3)
  const strongest = getStrongestDomains(domainScores, 3)
  const hasData = Object.keys(domainScores).length > 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center border border-neon-purple/20">
            <Brain className="w-5 h-5 text-neon-purple" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Knowledge Map</h1>
        </div>
        <p className="text-nebula-muted max-w-xl">
          Track your proficiency across all GCP domains. Complete scenarios, challenges, and exams to build your knowledge profile.
        </p>
      </motion.div>

      {!hasData ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Brain className="w-16 h-16 mx-auto mb-4 text-nebula-dim opacity-30" />
          <h2 className="text-xl font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>No Data Yet</h2>
          <p className="text-nebula-muted mb-6 max-w-md mx-auto">
            Complete scenarios, challenges, or exams to start building your knowledge map. Your proficiency across GCP domains will appear here.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/day-as" className="btn-neon text-sm px-5 py-2.5 rounded-xl no-underline">Start a Scenario</Link>
            <Link to="/exam" className="text-sm px-5 py-2.5 rounded-xl border border-nebula-border text-nebula-muted hover:text-nebula-text hover:border-nebula-border-bright no-underline transition-all">Take an Exam</Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="glass-card-static rounded-2xl p-8 flex flex-col items-center">
            <div className="text-sm font-semibold text-nebula-text mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Domain Proficiency</div>
            <div className="text-xs text-nebula-dim mb-6">Based on your answers across all activities</div>
            <RadarChart data={domainData} size={300} />
            <div className="mt-6 text-center">
              <div className="text-3xl font-bold text-neon-cyan" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{overall}%</div>
              <div className="text-xs text-nebula-dim mt-1">Overall Score</div>
            </div>
          </motion.div>

          {/* Domain Breakdown */}
          <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
            {domainData.map((domain) => (
              <motion.div key={domain.id} variants={fadeUp} className="glass-card-static rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: domain.color }} />
                    <span className="text-sm font-medium text-nebula-text">{domain.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: domain.color, fontFamily: 'JetBrains Mono, monospace' }}>
                    {domain.percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-nebula-surface overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: domain.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${domain.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
                <div className="text-xs text-nebula-dim mt-1.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {domain.correct}/{domain.total} correct
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Strengths */}
          {strongest.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card-static rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-neon-emerald" />
                <h3 className="text-sm font-semibold text-nebula-text">Strongest Domains</h3>
              </div>
              <div className="space-y-3">
                {strongest.map((d) => (
                  <div key={d.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-sm text-nebula-text">{d.label}</span>
                    </div>
                    <span className="text-sm font-bold text-neon-emerald" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{d.percentage}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Weaknesses */}
          {weakest.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card-static rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-4 h-4 text-neon-amber" />
                <h3 className="text-sm font-semibold text-nebula-text">Areas to Improve</h3>
              </div>
              <div className="space-y-3">
                {weakest.map((d) => (
                  <div key={d.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-sm text-nebula-text">{d.label}</span>
                    </div>
                    <span className="text-sm font-bold text-neon-amber" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{d.percentage}%</span>
                  </div>
                ))}
              </div>
              <Link to="/review" className="flex items-center gap-1.5 text-xs text-neon-cyan mt-4 no-underline hover:underline">
                <Target className="w-3 h-3" /> Review weak areas
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
