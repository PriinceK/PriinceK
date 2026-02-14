import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, CheckCircle2, XCircle, ArrowLeft, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { EXAM_QUESTIONS } from '../data/examQuestions'
import { getExamHistory } from '../utils/progress'
import { DOMAINS } from '../utils/domainScoring'

export default function ExamResults() {
  const [result, setResult] = useState(null)
  const [expandedQ, setExpandedQ] = useState(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('last-exam-result')
      if (stored) { setResult(JSON.parse(stored)); return }
      const history = getExamHistory()
      if (history.length > 0) setResult(history[history.length - 1])
    } catch {}
  }, [])

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-nebula-muted">No exam results found.</p>
        <Link to="/exam" className="text-neon-cyan no-underline text-sm mt-2 inline-block">Take an exam</Link>
      </div>
    )
  }

  const passed = result.percentage >= 70
  const questions = (result.questionIds || []).map((id) => EXAM_QUESTIONS.find((q) => q.id === id)).filter(Boolean)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/exam" className="inline-flex items-center gap-1.5 text-sm text-nebula-muted hover:text-nebula-text no-underline mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Exam Setup
      </Link>

      {/* Score Hero */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card-static rounded-2xl p-8 text-center mb-8">
        <GraduationCap className={`w-16 h-16 mx-auto mb-4 ${passed ? 'text-neon-emerald' : 'text-neon-rose'}`} />
        <div className="text-5xl font-extrabold mb-2" style={{ fontFamily: 'JetBrains Mono, monospace', color: passed ? '#10b981' : '#f43f5e' }}>
          {result.percentage}%
        </div>
        <div className="text-lg font-bold text-nebula-text mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
          {passed ? 'Passed!' : 'Not Yet'}
        </div>
        <div className="text-sm text-nebula-muted mb-4">
          {result.correct} of {result.total} correct — Passing: 70%
        </div>
        <Link to="/exam" className="btn-neon text-sm px-6 py-2.5 rounded-xl no-underline inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Retake Exam
        </Link>
      </motion.div>

      {/* Domain Breakdown */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-nebula-text mb-4" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Score by Domain</h3>
        <div className="space-y-3">
          {DOMAINS.map((d) => {
            const dr = result.domainResults?.[d.id]
            if (!dr) return null
            const pct = Math.round((dr.correct / dr.total) * 100)
            return (
              <div key={d.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-nebula-text">{d.label}</span>
                  <span className="text-sm font-bold" style={{ color: pct >= 70 ? '#10b981' : '#f43f5e', fontFamily: 'JetBrains Mono, monospace' }}>
                    {dr.correct}/{dr.total} ({pct}%)
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-nebula-surface overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: pct >= 70 ? '#10b981' : '#f43f5e' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Question Review */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-sm font-semibold text-nebula-text mb-4" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Question Review</h3>
        <div className="space-y-2">
          {questions.map((q, idx) => {
            const userAnswer = (result.answers?.[q.id] || []).sort().join(',')
            const correctAnswer = q.correct.sort().join(',')
            const isCorrect = userAnswer === correctAnswer
            const expanded = expandedQ === q.id
            return (
              <div key={q.id} className="glass-card-static rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedQ(expanded ? null : q.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors hover:bg-nebula-surface/30"
                >
                  {isCorrect
                    ? <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0" />
                    : <XCircle className="w-4 h-4 text-neon-rose shrink-0" />
                  }
                  <span className="text-xs text-nebula-dim shrink-0" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Q{idx + 1}</span>
                  <span className="text-sm text-nebula-text truncate flex-1">{q.question}</span>
                  {expanded ? <ChevronUp className="w-4 h-4 text-nebula-dim shrink-0" /> : <ChevronDown className="w-4 h-4 text-nebula-dim shrink-0" />}
                </button>
                {expanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-4 pb-4 pt-1">
                    <div className="space-y-1.5 mb-3">
                      {q.options.map((opt) => {
                        const wasSelected = (result.answers?.[q.id] || []).includes(opt.id)
                        const isCorrectOpt = q.correct.includes(opt.id)
                        return (
                          <div key={opt.id} className={`text-sm px-3 py-2 rounded-lg flex items-start gap-2 ${
                            isCorrectOpt ? 'bg-neon-emerald/5 border border-neon-emerald/20' :
                            wasSelected ? 'bg-neon-rose/5 border border-neon-rose/20' :
                            'text-nebula-dim'
                          }`}>
                            <span className="text-xs font-bold mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{opt.id.toUpperCase()}</span>
                            <span className={isCorrectOpt ? 'text-nebula-text' : wasSelected ? 'text-neon-rose/80' : 'text-nebula-dim'}>{opt.text}</span>
                            {isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-neon-emerald shrink-0 mt-0.5 ml-auto" />}
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-xs text-nebula-muted leading-relaxed bg-nebula-surface/50 rounded-lg p-3">{q.explanation}</p>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
