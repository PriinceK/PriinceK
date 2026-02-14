import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, Rocket, Calendar, Trophy, Layout, BookOpen, Terminal, Award, BarChart3, ArrowRight, X, Sparkles } from 'lucide-react'

const ONBOARDING_KEY = 'gcp-lab-onboarding-seen'

const STEPS = [
  {
    icon: Cloud,
    color: '#00d4ff',
    title: 'Welcome to GCP Architect Practice Lab',
    description: 'Master Google Cloud Platform architecture through interactive scenarios, hands-on challenges, and 20+ learning tools.',
    features: [
      '5 immersive daily scenarios as a Cloud Engineer',
      '4 architecture design challenges with scoring',
      '34 GCP services with deep-dive encyclopedia',
      '100+ flashcards with spaced repetition',
    ],
  },
  {
    icon: Rocket,
    color: '#10b981',
    title: 'Your Learning Journey',
    description: 'Here\'s the recommended path to get the most out of this platform:',
    features: [
      'Start with "A Day As..." scenarios to build context',
      'Use the Service Encyclopedia to deepen knowledge',
      'Practice with Architecture Challenges',
      'Review flashcards daily for retention',
    ],
  },
  {
    icon: Terminal,
    color: '#f59e0b',
    title: 'Hands-On Labs & Tools',
    description: 'Go beyond theory with interactive labs and powerful tools:',
    features: [
      'Linux Lab: 30+ interactive terminal missions',
      'Networking Lab: DNS, firewall, diagnostics',
      'Architecture Canvas: Design visual architectures',
      'Exam Simulator: Timed practice tests',
    ],
  },
  {
    icon: Award,
    color: '#7c3aed',
    title: 'Track Your Progress',
    description: 'Stay motivated and measure your growth:',
    features: [
      '35+ achievements and badges to unlock',
      'Performance analytics with domain radar',
      'Adaptive study planner for daily goals',
      'Study streak tracking and knowledge map',
    ],
  },
]

export default function Onboarding() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY)
    if (!seen) {
      // Small delay so the app renders first
      setTimeout(() => setVisible(true), 800)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setVisible(false)
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      handleClose()
    }
  }

  if (!visible) return null

  const current = STEPS[step]
  const Icon = current.icon

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-[201] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg"
          >
            <div
              className="rounded-2xl border border-nebula-border overflow-hidden shadow-2xl"
              style={{ background: 'rgba(6, 9, 24, 0.98)' }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-nebula-dim hover:text-nebula-muted cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                      style={{ backgroundColor: current.color + '12', border: `1px solid ${current.color}25` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: current.color }} />
                    </div>

                    <h2 className="text-2xl font-extrabold text-nebula-text mb-3" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                      {current.title}
                    </h2>
                    <p className="text-sm text-nebula-muted mb-6 leading-relaxed">
                      {current.description}
                    </p>

                    <div className="text-left space-y-2.5 mb-8">
                      {current.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: current.color }} />
                          <span className="text-nebula-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Step indicators */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStep(i)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        i === step ? 'w-6 bg-neon-cyan' : 'bg-nebula-surface hover:bg-nebula-muted'
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleClose}
                    className="text-xs text-nebula-dim hover:text-nebula-muted cursor-pointer"
                  >
                    Skip intro
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/20 transition-colors cursor-pointer text-sm font-medium"
                  >
                    {step < STEPS.length - 1 ? (
                      <>Next <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>Get Started <Rocket className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
