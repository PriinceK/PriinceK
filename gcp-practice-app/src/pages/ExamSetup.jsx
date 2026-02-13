import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Clock, Layers, ArrowRight, BarChart3 } from 'lucide-react'
import { EXAM_QUESTIONS } from '../data/examQuestions'
import { DOMAINS } from '../utils/domainScoring'
import { getExamHistory } from '../utils/progress'

const QUESTION_COUNTS = [20, 35, 50]
const TIME_OPTIONS = [
  { label: '30 min', seconds: 1800 },
  { label: '60 min', seconds: 3600 },
  { label: '90 min', seconds: 5400 },
  { label: '120 min', seconds: 7200 },
]

export default function ExamSetup() {
  const navigate = useNavigate()
  const [questionCount, setQuestionCount] = useState(35)
  const [timeLimit, setTimeLimit] = useState(3600)
  const [selectedDomains, setSelectedDomains] = useState(DOMAINS.map((d) => d.id))

  const availableQuestions = useMemo(() => {
    return EXAM_QUESTIONS.filter((q) => selectedDomains.includes(q.domain))
  }, [selectedDomains])

  const examHistory = getExamHistory()
  const lastExam = examHistory[examHistory.length - 1]

  function toggleDomain(domainId) {
    setSelectedDomains((prev) =>
      prev.includes(domainId)
        ? prev.filter((d) => d !== domainId)
        : [...prev, domainId]
    )
  }

  function startExam() {
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length))
    const examConfig = { questions: selected.map((q) => q.id), timeLimit, startedAt: Date.now() }
    sessionStorage.setItem('current-exam', JSON.stringify(examConfig))
    navigate('/exam/session')
  }

  const effectiveCount = Math.min(questionCount, availableQuestions.length)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-neon-rose/10 flex items-center justify-center border border-neon-rose/20">
            <GraduationCap className="w-5 h-5 text-neon-rose" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Exam Simulator</h1>
        </div>
        <p className="text-nebula-muted max-w-xl">
          Simulate the GCP Associate Cloud Engineer certification exam. Configure your session and test your knowledge under timed conditions.
        </p>
      </motion.div>

      {/* Last Exam Score */}
      {lastExam && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-static rounded-2xl p-5 mb-8 flex items-center gap-4">
          <BarChart3 className="w-5 h-5 text-neon-cyan shrink-0" />
          <div>
            <div className="text-sm text-nebula-text">Last exam: <span className="font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: lastExam.percentage >= 70 ? '#10b981' : '#f43f5e' }}>{lastExam.percentage}%</span></div>
            <div className="text-xs text-nebula-dim">{lastExam.correct}/{lastExam.total} correct — {new Date(lastExam.completedAt).toLocaleDateString()}</div>
          </div>
          <Link to="/exam/results" className="ml-auto text-xs text-neon-cyan no-underline hover:underline">View details</Link>
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Question Count */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-neon-cyan" />
            <h3 className="text-sm font-semibold text-nebula-text">Number of Questions</h3>
          </div>
          <div className="flex gap-3">
            {QUESTION_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  questionCount === count
                    ? 'border-neon-cyan/40 bg-neon-cyan/8 text-neon-cyan'
                    : 'border-nebula-border text-nebula-muted hover:border-nebula-border-bright hover:text-nebula-text'
                }`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {count}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Time Limit */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card-static rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-neon-amber" />
            <h3 className="text-sm font-semibold text-nebula-text">Time Limit</h3>
          </div>
          <div className="flex gap-3">
            {TIME_OPTIONS.map(({ label, seconds }) => (
              <button
                key={seconds}
                onClick={() => setTimeLimit(seconds)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  timeLimit === seconds
                    ? 'border-neon-amber/40 bg-neon-amber/8 text-neon-amber'
                    : 'border-nebula-border text-nebula-muted hover:border-nebula-border-bright hover:text-nebula-text'
                }`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Domain Filter */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-neon-purple" />
            <h3 className="text-sm font-semibold text-nebula-text">Domains</h3>
            <span className="text-xs text-nebula-dim ml-auto">{availableQuestions.length} questions available</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DOMAINS.map((d) => {
              const active = selectedDomains.includes(d.id)
              return (
                <button
                  key={d.id}
                  onClick={() => toggleDomain(d.id)}
                  className={`text-xs px-3 py-2 rounded-lg border transition-all cursor-pointer text-left ${
                    active
                      ? 'border-opacity-40 bg-opacity-10'
                      : 'border-nebula-border text-nebula-dim'
                  }`}
                  style={active ? { borderColor: d.color + '60', backgroundColor: d.color + '10', color: d.color } : {}}
                >
                  {d.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
          <button
            onClick={startExam}
            disabled={effectiveCount === 0}
            className="btn-neon text-base px-10 py-3.5 rounded-xl inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Start Exam ({effectiveCount} questions) <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
