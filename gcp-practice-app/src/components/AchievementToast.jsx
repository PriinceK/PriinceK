import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Star, X } from 'lucide-react'
import { checkAchievements, ACHIEVEMENTS } from '../data/achievements'
import { getProgress } from '../utils/progress'

export default function AchievementToast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const progress = getProgress()
    const newlyUnlocked = checkAchievements(progress)

    if (newlyUnlocked.length > 0) {
      // Save achievements
      if (!progress.achievements) progress.achievements = {}
      for (const a of newlyUnlocked) {
        progress.achievements[a.id] = { unlockedAt: Date.now() }
      }
      localStorage.setItem('gcp-lab-progress', JSON.stringify(progress))

      // Show toasts with staggered delay
      newlyUnlocked.forEach((achievement, i) => {
        setTimeout(() => {
          setToasts((prev) => [...prev, { ...achievement, key: `${achievement.id}-${Date.now()}` }])
        }, i * 600)
      })
    }

    // Also check periodically for new achievements
    const interval = setInterval(() => {
      const currentProgress = getProgress()
      const newOnes = checkAchievements(currentProgress)
      if (newOnes.length > 0) {
        if (!currentProgress.achievements) currentProgress.achievements = {}
        for (const a of newOnes) {
          currentProgress.achievements[a.id] = { unlockedAt: Date.now() }
        }
        localStorage.setItem('gcp-lab-progress', JSON.stringify(currentProgress))

        newOnes.forEach((achievement, i) => {
          setTimeout(() => {
            setToasts((prev) => [...prev, { ...achievement, key: `${achievement.id}-${Date.now()}` }])
          }, i * 600)
        })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Auto-dismiss toasts after 5 seconds
  useEffect(() => {
    if (toasts.length === 0) return
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 5000)
    return () => clearTimeout(timer)
  }, [toasts])

  const dismiss = (key) => {
    setToasts((prev) => prev.filter((t) => t.key !== key))
  }

  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed top-20 right-4 z-[90] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: '340px' }}>
      <AnimatePresence>
        {toasts.slice(0, 3).map((toast) => {
          const Icon = toast.icon || Award
          return (
            <motion.div
              key={toast.key}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="pointer-events-auto glass-card-static rounded-xl p-4 border border-neon-amber/20 shadow-lg"
              style={{ background: 'rgba(6, 9, 24, 0.95)', backdropFilter: 'blur(16px)' }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-amber/10 flex items-center justify-center border border-neon-amber/20 shrink-0">
                  <Icon className="w-5 h-5 text-neon-amber" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Star className="w-3 h-3 text-neon-amber" />
                    <span className="text-[10px] font-bold text-neon-amber uppercase tracking-wider">Achievement Unlocked</span>
                  </div>
                  <h4 className="text-sm font-bold text-nebula-text">{toast.title}</h4>
                  <p className="text-[11px] text-nebula-muted">{toast.description}</p>
                  <span className="text-[10px] font-mono text-neon-amber mt-1 inline-block">+{toast.points} pts</span>
                </div>
                <button
                  onClick={() => dismiss(toast.key)}
                  className="text-nebula-dim hover:text-nebula-muted cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body
  )
}
