import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Lock, Star, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, getTotalPoints, getMaxPoints, checkAchievements } from '../data/achievements'
import { getProgress } from '../utils/progress'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Achievements() {
  const [progress, setProgress] = useState({})
  const [expandedCat, setExpandedCat] = useState(null)
  const [justUnlocked, setJustUnlocked] = useState([])

  useEffect(() => {
    const p = getProgress()
    setProgress(p)

    // Check for new achievements
    const newOnes = checkAchievements(p)
    if (newOnes.length > 0) {
      // Unlock them
      if (!p.achievements) p.achievements = {}
      for (const a of newOnes) {
        p.achievements[a.id] = { unlockedAt: Date.now() }
      }
      localStorage.setItem('gcp-lab-progress', JSON.stringify(p))
      setProgress({ ...p })
      setJustUnlocked(newOnes.map((a) => a.id))
      setTimeout(() => setJustUnlocked([]), 5000)
    }
  }, [])

  const unlocked = progress.achievements || {}
  const totalPoints = getTotalPoints(progress)
  const maxPoints = getMaxPoints()
  const unlockedCount = Object.keys(unlocked).length
  const totalCount = ACHIEVEMENTS.length
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  const groupedAchievements = useMemo(() => {
    const grouped = {}
    for (const cat of ACHIEVEMENT_CATEGORIES) {
      grouped[cat.id] = ACHIEVEMENTS.filter((a) => a.category === cat.id)
    }
    return grouped
  }, [])

  const categoryStats = useMemo(() => {
    const stats = {}
    for (const cat of ACHIEVEMENT_CATEGORIES) {
      const achievements = groupedAchievements[cat.id] || []
      const count = achievements.filter((a) => unlocked[a.id]).length
      stats[cat.id] = { total: achievements.length, unlocked: count }
    }
    return stats
  }, [unlocked, groupedAchievements])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-neon-amber/10 flex items-center justify-center border border-neon-amber/20 glow-amber">
            <Award className="w-8 h-8 text-neon-amber" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
          Achievements
        </h1>
        <p className="text-nebula-muted text-lg">Track your mastery milestones and earn points</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="glass-card-static rounded-2xl p-6 mb-8 shimmer-line"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-cyan" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {unlockedCount}/{totalCount}
            </div>
            <div className="text-xs text-nebula-muted mt-1">Achievements Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-amber" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {totalPoints}
            </div>
            <div className="text-xs text-nebula-muted mt-1">Points Earned / {maxPoints}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neon-emerald" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {percentage}%
            </div>
            <div className="text-xs text-nebula-muted mt-1">Completion</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 h-3 bg-nebula-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00d4ff, #10b981, #f59e0b)' }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Achievement Categories */}
      <div className="space-y-4">
        {ACHIEVEMENT_CATEGORIES.map((cat, idx) => {
          const achievements = groupedAchievements[cat.id] || []
          const stats = categoryStats[cat.id]
          const isExpanded = expandedCat === cat.id
          const allUnlocked = stats.unlocked === stats.total

          return (
            <motion.div
              key={cat.id}
              className="glass-card-static rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
            >
              <button
                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-nebula-surface/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: cat.color + '15', border: `1px solid ${cat.color}30` }}
                  >
                    {allUnlocked ? (
                      <Sparkles className="w-5 h-5" style={{ color: cat.color }} />
                    ) : (
                      <Star className="w-5 h-5" style={{ color: cat.color }} />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-nebula-text">{cat.label}</h3>
                    <p className="text-xs text-nebula-muted">
                      {stats.unlocked}/{stats.total} unlocked
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-nebula-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(stats.unlocked / stats.total) * 100}%`, backgroundColor: cat.color }}
                    />
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-nebula-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-nebula-muted" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 grid sm:grid-cols-2 gap-3">
                      {achievements.map((achievement) => {
                        const isUnlocked = !!unlocked[achievement.id]
                        const isNew = justUnlocked.includes(achievement.id)
                        const Icon = achievement.icon

                        return (
                          <motion.div
                            key={achievement.id}
                            className={`relative rounded-lg p-4 border transition-all ${
                              isUnlocked
                                ? 'border-neon-cyan/20 bg-neon-cyan/5'
                                : 'border-nebula-border bg-nebula-surface/20 opacity-60'
                            } ${isNew ? 'ring-2 ring-neon-amber/50' : ''}`}
                            variants={fadeUp}
                            initial="initial"
                            animate="animate"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                  isUnlocked ? '' : 'grayscale'
                                }`}
                                style={{
                                  backgroundColor: isUnlocked ? cat.color + '15' : 'rgba(255,255,255,0.05)',
                                  border: `1px solid ${isUnlocked ? cat.color + '30' : 'rgba(255,255,255,0.1)'}`,
                                }}
                              >
                                {isUnlocked ? (
                                  <Icon className="w-5 h-5" style={{ color: cat.color }} />
                                ) : (
                                  <Lock className="w-4 h-4 text-nebula-dim" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className={`text-sm font-bold ${isUnlocked ? 'text-nebula-text' : 'text-nebula-dim'}`}>
                                    {achievement.title}
                                  </h4>
                                  {isNew && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neon-amber/20 text-neon-amber animate-pulse">
                                      NEW
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-nebula-muted mt-0.5">{achievement.description}</p>
                                <div className="flex items-center gap-1 mt-2">
                                  <Star className="w-3 h-3 text-neon-amber" />
                                  <span className="text-xs font-mono text-neon-amber">{achievement.points} pts</span>
                                </div>
                              </div>
                            </div>
                            {isUnlocked && unlocked[achievement.id]?.unlockedAt && (
                              <div className="text-[10px] text-nebula-dim mt-2 text-right">
                                Unlocked {new Date(unlocked[achievement.id].unlockedAt).toLocaleDateString()}
                              </div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
