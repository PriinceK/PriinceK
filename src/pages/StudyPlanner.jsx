import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ClipboardList, Target, ArrowRight, RotateCcw, GraduationCap, BookOpen, Terminal, Network, Trophy, Calendar, Brain, CheckCircle, Circle, Sparkles, Clock, Zap } from 'lucide-react'
import { getProgress, getDomainScores, getFlashcardState, getExamHistory, getStudyStreak } from '../utils/progress'
import { calculateDomainPercentages, getWeakestDomains, getStrongestDomains, getOverallScore } from '../utils/domainScoring'
import { FLASHCARDS } from '../data/flashcards'
import { isDueForReview } from '../utils/spacedRepetition'
import { DAILY_SCENARIOS } from '../data/scenarios'
import { CHALLENGES } from '../data/challenges'

function generateStudyPlan(progress, domainScores, flashcardState, examHistory) {
  const plan = []
  const weakDomains = getWeakestDomains(domainScores, 3)
  const overallScore = getOverallScore(domainScores)
  const scenariosCompleted = Object.keys(progress.scenarios || {}).length
  const challengesCompleted = Object.keys(progress.challenges || {}).length
  const cardsDue = FLASHCARDS.filter((c) => isDueForReview(flashcardState[c.id])).length
  const cardsReviewed = Object.keys(flashcardState).length
  const linuxCompleted = Object.keys(progress.linuxLessons || {}).filter((k) => progress.linuxLessons[k]).length
  const networkCompleted = Object.keys(progress.networkLessons || {}).filter((k) => progress.networkLessons[k]).length

  // Priority 1: Review due flashcards
  if (cardsDue > 0) {
    plan.push({
      id: 'review-cards',
      priority: 'high',
      type: 'review',
      icon: RotateCcw,
      color: '#7c3aed',
      title: 'Review Due Flashcards',
      description: `You have ${cardsDue} flashcards due for review. Spaced repetition is most effective when cards are reviewed on schedule.`,
      action: { to: '/review/session', label: 'Start Review' },
      duration: `~${Math.max(5, Math.ceil(cardsDue * 0.5))} min`,
    })
  }

  // Priority 2: Weak domain study
  if (weakDomains.length > 0 && weakDomains[0].percentage < 70) {
    const weakest = weakDomains[0]
    plan.push({
      id: 'weak-domain',
      priority: 'high',
      type: 'study',
      icon: Target,
      color: '#f43f5e',
      title: `Strengthen ${weakest.label}`,
      description: `Your ${weakest.label} domain is at ${weakest.percentage}%. Study related services and take focused practice to improve.`,
      action: { to: '/services', label: 'Study Services' },
      duration: '~15 min',
    })
  }

  // Priority 3: Uncompleted scenarios
  if (scenariosCompleted < DAILY_SCENARIOS.length) {
    const unfinished = DAILY_SCENARIOS.find((s) => !(progress.scenarios || {})[s.id])
    if (unfinished) {
      plan.push({
        id: 'scenario',
        priority: 'medium',
        type: 'practice',
        icon: Calendar,
        color: '#00d4ff',
        title: `Complete "${unfinished.title}"`,
        description: `You've completed ${scenariosCompleted}/${DAILY_SCENARIOS.length} scenarios. Continue with this ${unfinished.difficulty} scenario.`,
        action: { to: `/day-as/${unfinished.id}`, label: 'Start Scenario' },
        duration: '~10 min',
      })
    }
  }

  // Priority 4: Uncompleted challenges
  if (challengesCompleted < CHALLENGES.length) {
    const unfinished = CHALLENGES.find((c) => !(progress.challenges || {})[c.id])
    if (unfinished) {
      plan.push({
        id: 'challenge',
        priority: 'medium',
        type: 'practice',
        icon: Trophy,
        color: '#10b981',
        title: `Try "${unfinished.title}"`,
        description: `${challengesCompleted}/${CHALLENGES.length} challenges completed. This ${unfinished.difficulty} challenge focuses on ${unfinished.category}.`,
        action: { to: `/challenges/${unfinished.id}`, label: 'Start Challenge' },
        duration: '~15 min',
      })
    }
  }

  // Priority 5: Practice exam
  if (examHistory.length === 0 || (overallScore > 0 && overallScore < 80)) {
    plan.push({
      id: 'exam',
      priority: 'medium',
      type: 'practice',
      icon: GraduationCap,
      color: '#f43f5e',
      title: examHistory.length === 0 ? 'Take Your First Practice Exam' : 'Retake Practice Exam',
      description: examHistory.length === 0
        ? 'Practice exams help identify knowledge gaps and build exam confidence.'
        : `Your last exam score was ${examHistory[examHistory.length - 1]?.score || 0}%. Aim for improvement.`,
      action: { to: '/exam', label: 'Start Exam' },
      duration: '~20 min',
    })
  }

  // Priority 6: Start flashcards if haven't yet
  if (cardsReviewed < 20) {
    plan.push({
      id: 'start-cards',
      priority: 'low',
      type: 'review',
      icon: BookOpen,
      color: '#7c3aed',
      title: 'Build Flashcard Habit',
      description: `You've reviewed ${cardsReviewed} cards. Try to review at least 20 to build a solid knowledge base.`,
      action: { to: '/review', label: 'Review Cards' },
      duration: '~10 min',
    })
  }

  // Priority 7: Linux lab
  if (linuxCompleted < 10) {
    plan.push({
      id: 'linux',
      priority: 'low',
      type: 'lab',
      icon: Terminal,
      color: '#10b981',
      title: 'Practice Linux Commands',
      description: `${linuxCompleted} Linux lessons completed. Hands-on terminal practice reinforces cloud operations skills.`,
      action: { to: '/linux-lab', label: 'Open Linux Lab' },
      duration: '~15 min',
    })
  }

  // Priority 8: Networking lab
  if (networkCompleted < 5) {
    plan.push({
      id: 'network',
      priority: 'low',
      type: 'lab',
      icon: Network,
      color: '#a855f7',
      title: 'Networking Fundamentals',
      description: `${networkCompleted} networking lessons completed. Understanding networking is crucial for cloud architecture.`,
      action: { to: '/network-lab', label: 'Open Network Lab' },
      duration: '~15 min',
    })
  }

  // Priority 9: Knowledge map check
  if (Object.keys(domainScores).length >= 3) {
    plan.push({
      id: 'knowledge-map',
      priority: 'low',
      type: 'review',
      icon: Brain,
      color: '#7c3aed',
      title: 'Review Knowledge Map',
      description: 'Check your domain proficiency radar to visualize strengths and weaknesses across all GCP domains.',
      action: { to: '/knowledge-map', label: 'View Map' },
      duration: '~2 min',
    })
  }

  return plan
}

const PRIORITY_CONFIG = {
  high: { label: 'High Priority', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
  medium: { label: 'Recommended', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  low: { label: 'Optional', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
}

export default function StudyPlanner() {
  const [progress, setProgress] = useState({})
  const [domainScores, setDomainScores] = useState({})
  const [flashcardState, setFlashcardState] = useState({})
  const [examHistory, setExamHistory] = useState([])
  const [streak, setStreak] = useState({ current: 0 })
  const [completedTasks, setCompletedTasks] = useState({})

  useEffect(() => {
    setProgress(getProgress())
    setDomainScores(getDomainScores())
    setFlashcardState(getFlashcardState())
    setExamHistory(getExamHistory())
    setStreak(getStudyStreak())
    // Load completed study plan tasks from session
    try {
      setCompletedTasks(JSON.parse(sessionStorage.getItem('study-plan-completed') || '{}'))
    } catch { /* ignore */ }
  }, [])

  const plan = useMemo(
    () => generateStudyPlan(progress, domainScores, flashcardState, examHistory),
    [progress, domainScores, flashcardState, examHistory]
  )

  const toggleCompleted = (id) => {
    const next = { ...completedTasks, [id]: !completedTasks[id] }
    setCompletedTasks(next)
    sessionStorage.setItem('study-plan-completed', JSON.stringify(next))
  }

  const overallScore = getOverallScore(domainScores)
  const highPriority = plan.filter((t) => t.priority === 'high')
  const medPriority = plan.filter((t) => t.priority === 'medium')
  const lowPriority = plan.filter((t) => t.priority === 'low')

  const totalEstimate = plan.reduce((acc, t) => {
    const match = t.duration.match(/(\d+)/)
    return acc + (match ? parseInt(match[1]) : 10)
  }, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 glow-cyan">
            <ClipboardList className="w-8 h-8 text-neon-cyan" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
          Study <span className="gradient-text-cyan">Planner</span>
        </h1>
        <p className="text-nebula-muted text-lg">Your personalized daily study plan based on progress analysis</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="glass-card-static rounded-2xl p-6 mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-cyan" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {plan.length}
            </div>
            <div className="text-xs text-nebula-muted mt-0.5">Tasks Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-amber" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              ~{totalEstimate}m
            </div>
            <div className="text-xs text-nebula-muted mt-0.5">Est. Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-emerald" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {overallScore}%
            </div>
            <div className="text-xs text-nebula-muted mt-0.5">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-amber" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {streak.current}
            </div>
            <div className="text-xs text-nebula-muted mt-0.5">Day Streak</div>
          </div>
        </div>
      </motion.div>

      {/* Plan Empty State */}
      {plan.length === 0 && (
        <motion.div
          className="glass-card-static rounded-2xl p-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Sparkles className="w-12 h-12 text-neon-amber mx-auto mb-4" />
          <h2 className="text-xl font-bold text-nebula-text mb-2">All Caught Up!</h2>
          <p className="text-nebula-muted">You've completed all recommended study activities. Great work!</p>
        </motion.div>
      )}

      {/* High Priority */}
      {highPriority.length > 0 && (
        <PrioritySection title="High Priority" tasks={highPriority} config={PRIORITY_CONFIG.high} completedTasks={completedTasks} onToggle={toggleCompleted} delay={0.15} />
      )}

      {/* Medium Priority */}
      {medPriority.length > 0 && (
        <PrioritySection title="Recommended" tasks={medPriority} config={PRIORITY_CONFIG.medium} completedTasks={completedTasks} onToggle={toggleCompleted} delay={0.25} />
      )}

      {/* Low Priority */}
      {lowPriority.length > 0 && (
        <PrioritySection title="Optional" tasks={lowPriority} config={PRIORITY_CONFIG.low} completedTasks={completedTasks} onToggle={toggleCompleted} delay={0.35} />
      )}
    </div>
  )
}

function PrioritySection({ title, tasks, config, completedTasks, onToggle, delay }) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
        <h2 className="text-sm font-bold text-nebula-text">{title}</h2>
        <span className="text-xs text-nebula-dim">({tasks.length})</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const Icon = task.icon
          const isDone = completedTasks[task.id]
          return (
            <motion.div
              key={task.id}
              className={`glass-card-static rounded-xl p-5 transition-all ${isDone ? 'opacity-50' : ''}`}
              whileHover={{ scale: 1.005 }}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => onToggle(task.id)}
                  className="mt-0.5 shrink-0 cursor-pointer"
                  aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-neon-emerald" />
                  ) : (
                    <Circle className="w-5 h-5 text-nebula-dim hover:text-nebula-muted transition-colors" />
                  )}
                </button>

                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: task.color + '10', border: `1px solid ${task.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: task.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-sm font-bold ${isDone ? 'text-nebula-dim line-through' : 'text-nebula-text'}`}>
                      {task.title}
                    </h3>
                    <span className="flex items-center gap-1 text-[10px] text-nebula-dim">
                      <Clock className="w-3 h-3" />
                      {task.duration}
                    </span>
                  </div>
                  <p className="text-xs text-nebula-muted leading-relaxed">{task.description}</p>

                  {!isDone && task.action && (
                    <Link
                      to={task.action.to}
                      className="inline-flex items-center gap-1 mt-3 text-xs font-medium no-underline transition-colors"
                      style={{ color: task.color }}
                    >
                      {task.action.label}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
