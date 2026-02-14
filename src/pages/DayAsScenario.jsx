import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Target,
  Briefcase, Building2, AlertTriangle, RotateCcw, Sparkles
} from 'lucide-react'
import { DAILY_SCENARIOS } from '../data/scenarios'
import { getCustomScenarios } from '../utils/progress'
import ScoreRing from '../components/ScoreRing'

function saveProgress(scenarioId, score, maxScore) {
  try {
    const data = JSON.parse(localStorage.getItem('gcp-lab-progress') || '{}')
    if (!data.scenarios) data.scenarios = {}
    const existing = data.scenarios[scenarioId]
    const percentage = Math.round((score / maxScore) * 100)
    if (!existing || percentage > existing.percentage) {
      data.scenarios[scenarioId] = { score, maxScore, percentage, completedAt: new Date().toISOString() }
    }
    localStorage.setItem('gcp-lab-progress', JSON.stringify(data))
  } catch {}
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
}

export default function DayAsScenario() {
  const { scenarioId } = useParams()
  const scenario = DAILY_SCENARIOS.find((s) => s.id === scenarioId) || getCustomScenarios().find((s) => s.id === scenarioId)

  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1)
  const [answers, setAnswers] = useState({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [completed, setCompleted] = useState(false)

  if (!scenario) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-neon-amber mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-nebula-text mb-2">Scenario not found</h2>
        <Link to="/day-as" className="text-neon-cyan hover:underline">Back to scenarios</Link>
      </div>
    )
  }

  const currentTask = currentTaskIndex >= 0 ? scenario.tasks[currentTaskIndex] : null
  const selectedOption = currentTask ? answers[currentTask.id] : null
  const totalScore = Object.entries(answers).reduce((acc, [taskId, optionId]) => {
    const task = scenario.tasks.find((t) => t.id === taskId)
    const option = task?.options.find((o) => o.id === optionId)
    return acc + (option?.points || 0)
  }, 0)
  const maxScore = scenario.tasks.length * 10

  function handleSelect(optionId) {
    if (selectedOption) return
    setAnswers((prev) => ({ ...prev, [currentTask.id]: optionId }))
    setShowFeedback(true)
  }

  function handleNext() {
    setShowFeedback(false)
    if (currentTaskIndex < scenario.tasks.length - 1) {
      setCurrentTaskIndex((i) => i + 1)
    } else {
      setCompleted(true)
      saveProgress(scenario.id, totalScore, maxScore)
    }
  }

  function handleRestart() {
    setCurrentTaskIndex(-1)
    setAnswers({})
    setShowFeedback(false)
    setCompleted(false)
  }

  const currentIdx = DAILY_SCENARIOS.indexOf(scenario)
  const nextScenario = currentIdx < DAILY_SCENARIOS.length - 1 ? DAILY_SCENARIOS[currentIdx + 1] : null

  // Results screen
  if (completed) {
    const percentage = Math.round((totalScore / maxScore) * 100)
    let grade, gradeColor, message
    if (percentage >= 95) { grade = 'A+'; gradeColor = '#10b981'; message = 'Outstanding! You demonstrated expert-level GCP architecture knowledge.' }
    else if (percentage >= 85) { grade = 'A'; gradeColor = '#10b981'; message = 'Excellent work! Your architecture decisions are well-reasoned.' }
    else if (percentage >= 70) { grade = 'B'; gradeColor = '#00d4ff'; message = 'Good job! You have solid fundamentals with some areas to refine.' }
    else if (percentage >= 50) { grade = 'C'; gradeColor = '#f59e0b'; message = 'Decent effort. Review the feedback on each task to improve.' }
    else { grade = 'D'; gradeColor = '#f43f5e'; message = 'Keep practicing! Review the GCP documentation and try again.' }

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/day-as" className="flex items-center gap-2 text-nebula-muted hover:text-nebula-text text-sm mb-6 no-underline transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to scenarios
        </Link>

        <motion.div {...fadeUp} className="glass-card-static rounded-2xl p-8 text-center mb-8">
          <h2 className="text-2xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Day Complete!</h2>
          <p className="text-nebula-muted mb-6">{scenario.title}</p>

          <div className={`inline-block ${percentage >= 95 ? 'celebration' : 'score-reveal'}`}>
            <ScoreRing score={totalScore} maxScore={maxScore} size={140} />
          </div>

          {percentage >= 95 && (
            <div className="flex items-center justify-center gap-2 mt-3 text-neon-emerald celebration">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Perfect score!</span>
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 mb-4 mt-4 score-reveal"
            style={{ borderColor: gradeColor, boxShadow: `0 0 24px ${gradeColor}30` }}
          >
            <span className="text-3xl font-extrabold" style={{ color: gradeColor, fontFamily: 'Syne, system-ui, sans-serif' }}>{grade}</span>
          </div>

          <p className="text-nebula-text max-w-md mx-auto">{message}</p>
        </motion.div>

        {/* Task review */}
        <h3 className="text-lg font-bold text-nebula-text mb-4" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Task Review</h3>
        <div className="space-y-3 mb-8">
          {scenario.tasks.map((task, idx) => {
            const selected = answers[task.id]
            const option = task.options.find((o) => o.id === selected)
            const best = task.options.reduce((a, b) => a.points > b.points ? a : b)
            const gotBest = option?.id === best.id
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="glass-card-static rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  {gotBest ? (
                    <CheckCircle2 className="w-5 h-5 text-neon-emerald shrink-0 mt-0.5" aria-label="Best answer" />
                  ) : (
                    <XCircle className="w-5 h-5 text-neon-amber shrink-0 mt-0.5" aria-label="Not best answer" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-nebula-text text-sm">{task.title}</span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: option?.points >= 8 ? '#10b981' : option?.points >= 5 ? '#f59e0b' : '#f43f5e', fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {option?.points || 0}/10
                      </span>
                    </div>
                    <p className="text-xs text-nebula-muted mb-2">You chose: {option?.text}</p>
                    <p className="text-xs text-nebula-text bg-nebula-deep/60 rounded-lg p-2.5 border border-nebula-border">{option?.feedback}</p>
                    {!gotBest && (
                      <p className="text-xs text-neon-emerald mt-2">Best answer: {best.text} ({best.points}/10)</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2.5 glass-card-static rounded-lg text-nebula-text hover:bg-nebula-elevated/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          {nextScenario ? (
            <Link
              to={`/day-as/${nextScenario.id}`}
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 btn-neon rounded-lg text-white no-underline"
            >
              Next Scenario <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/day-as"
              className="flex items-center gap-2 px-5 py-2.5 btn-neon rounded-lg text-white no-underline"
            >
              All Scenarios <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    )
  }

  // Briefing screen
  if (currentTaskIndex === -1) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/day-as" className="flex items-center gap-2 text-nebula-muted hover:text-nebula-text text-sm mb-6 no-underline transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to scenarios
        </Link>

        <motion.div {...fadeUp} className="glass-card-static rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 glow-cyan">
              <Briefcase className="w-7 h-7 text-neon-cyan" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{scenario.title}</h1>
              <div className="flex items-center gap-2 text-sm text-nebula-muted mt-1">
                <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                {scenario.role} at {scenario.company}
              </div>
            </div>
          </div>

          <div className="bg-nebula-deep/60 rounded-xl p-5 mb-6 border border-nebula-border">
            <h3 className="text-sm font-bold text-neon-amber mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Morning Briefing</h3>
            <p className="text-sm text-nebula-text leading-relaxed">{scenario.briefing}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-nebula-text mb-3 flex items-center gap-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
              <Target className="w-4 h-4 text-neon-emerald" aria-hidden="true" /> Today's Objectives
            </h3>
            <ul className="space-y-2.5">
              {scenario.objectives.map((obj, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-2.5 text-sm text-nebula-muted"
                >
                  <span className="w-5 h-5 rounded-full bg-neon-emerald/10 text-neon-emerald flex items-center justify-center text-xs font-bold shrink-0 border border-neon-emerald/20" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {i + 1}
                  </span>
                  {obj}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {scenario.tasks.length} tasks &middot; {maxScore} points possible &middot; Each task scored 1-10
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => setCurrentTaskIndex(0)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 btn-neon rounded-xl text-white font-semibold text-base"
        >
          Start Your Day <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    )
  }

  // Task screen
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/day-as" className="flex items-center gap-2 text-nebula-muted hover:text-nebula-text text-sm mb-6 no-underline transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to scenarios
      </Link>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6" role="progressbar" aria-valuenow={currentTaskIndex + 1} aria-valuemin={1} aria-valuemax={scenario.tasks.length} aria-label="Task progress">
        {scenario.tasks.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full flex-1 transition-all duration-500"
            style={{
              backgroundColor:
                i < currentTaskIndex ? '#10b981'
                : i === currentTaskIndex ? '#00d4ff'
                : 'rgba(99, 102, 241, 0.12)',
              boxShadow: i === currentTaskIndex ? '0 0 8px rgba(0, 212, 255, 0.3)' : 'none',
            }}
          />
        ))}
      </div>

      <div className="text-xs text-nebula-dim mb-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        Task {currentTaskIndex + 1} of {scenario.tasks.length} &middot; Score: {totalScore}/{maxScore}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentTask.id} {...fadeUp}>
          <div className="glass-card-static rounded-2xl p-6 mb-5">
            <h2 className="text-lg font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{currentTask.title}</h2>
            <p className="text-sm text-nebula-muted leading-relaxed">{currentTask.description}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6" role="radiogroup" aria-label="Answer options">
            {currentTask.options.map((option, optIdx) => {
              const isSelected = selectedOption === option.id
              const best = currentTask.options.reduce((a, b) => a.points > b.points ? a : b)
              const isBest = showFeedback && option.id === best.id
              const isWrong = showFeedback && isSelected && option.id !== best.id

              let borderColor = 'rgba(99, 102, 241, 0.12)'
              let bg = ''
              if (isBest) { borderColor = '#10b981'; bg = 'bg-neon-emerald/5' }
              else if (isWrong) { borderColor = '#f43f5e'; bg = 'bg-neon-rose/5' }
              else if (isSelected) { borderColor = '#00d4ff' }

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: optIdx * 0.05 }}
                  onClick={() => handleSelect(option.id)}
                  disabled={!!selectedOption}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${bg} ${
                    !selectedOption ? 'hover:border-neon-cyan/40 hover:bg-neon-cyan/5 cursor-pointer' : 'cursor-default'
                  }`}
                  style={{ borderColor, background: bg ? undefined : 'linear-gradient(135deg, rgba(20, 26, 58, 0.5) 0%, rgba(17, 22, 49, 0.3) 100%)' }}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Option ${option.id.toUpperCase()}: ${option.text}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                      style={{
                        borderColor,
                        color: isBest ? '#10b981' : isWrong ? '#f43f5e' : '#7b83a6',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {option.id.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <span className="text-sm text-nebula-text">{option.text}</span>
                      {showFeedback && isSelected && (
                        <div className="mt-3 p-3 bg-nebula-deep/60 rounded-lg slide-down border border-nebula-border">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-xs font-bold"
                              style={{
                                color: option.points >= 8 ? '#10b981' : option.points >= 5 ? '#f59e0b' : '#f43f5e',
                                fontFamily: 'JetBrains Mono, monospace',
                              }}
                            >
                              {option.points}/10 points
                            </span>
                          </div>
                          <p className="text-xs text-nebula-text leading-relaxed">{option.feedback}</p>
                        </div>
                      )}
                      {showFeedback && isBest && !isSelected && (
                        <div className="mt-2">
                          <span className="text-xs text-neon-emerald font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Best answer (10/10)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {showFeedback && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 btn-neon rounded-xl text-white font-semibold"
            >
              {currentTaskIndex < scenario.tasks.length - 1 ? (
                <>Next Task <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>View Results <CheckCircle2 className="w-4 h-4" /></>
              )}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
