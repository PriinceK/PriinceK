import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react'
import ExamTimer from '../components/ExamTimer'
import { EXAM_QUESTIONS } from '../data/examQuestions'
import { saveExamResult, updateDomainScore } from '../utils/progress'

export default function ExamSession() {
  const navigate = useNavigate()
  const [examConfig, setExamConfig] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState(new Set())
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  useEffect(() => {
    try {
      const config = JSON.parse(sessionStorage.getItem('current-exam'))
      if (!config?.questions?.length) { navigate('/exam'); return }
      setExamConfig(config)
      const qs = config.questions.map((id) => EXAM_QUESTIONS.find((q) => q.id === id)).filter(Boolean)
      setQuestions(qs)
    } catch { navigate('/exam') }
  }, [navigate])

  const currentQ = questions[currentIdx]

  const selectAnswer = useCallback((optionId) => {
    if (!currentQ) return
    if (currentQ.type === 'multi') {
      setAnswers((prev) => {
        const current = prev[currentQ.id] || []
        return { ...prev, [currentQ.id]: current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId] }
      })
    } else {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: [optionId] }))
    }
  }, [currentQ])

  const toggleFlag = useCallback(() => {
    if (!currentQ) return
    setFlagged((prev) => {
      const next = new Set(prev)
      next.has(currentQ.id) ? next.delete(currentQ.id) : next.add(currentQ.id)
      return next
    })
  }, [currentQ])

  const submitExam = useCallback(() => {
    let correct = 0
    const domainResults = {}
    for (const q of questions) {
      const userAnswer = (answers[q.id] || []).sort().join(',')
      const correctAnswer = q.correct.sort().join(',')
      const isCorrect = userAnswer === correctAnswer
      if (isCorrect) correct++
      if (!domainResults[q.domain]) domainResults[q.domain] = { correct: 0, total: 0 }
      domainResults[q.domain].total++
      if (isCorrect) domainResults[q.domain].correct++
    }
    const percentage = Math.round((correct / questions.length) * 100)
    const result = { correct, total: questions.length, percentage, answers, domainResults, questionIds: questions.map((q) => q.id) }
    saveExamResult(result)
    for (const [domain, scores] of Object.entries(domainResults)) {
      updateDomainScore(domain, scores.correct, scores.total)
    }
    sessionStorage.setItem('last-exam-result', JSON.stringify(result))
    navigate('/exam/results')
  }, [answers, questions, navigate])

  const handleTimeUp = useCallback(() => { submitExam() }, [submitExam])

  const answeredCount = Object.keys(answers).length

  if (!examConfig || questions.length === 0) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 sticky top-16 z-20 py-3" style={{ background: 'linear-gradient(180deg, rgba(6,9,24,0.98) 0%, rgba(6,9,24,0.9) 100%)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Q {currentIdx + 1}/{questions.length}
          </span>
          <span className="text-xs text-nebula-dim">|</span>
          <span className="text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {answeredCount} answered
          </span>
        </div>
        <ExamTimer totalSeconds={examConfig.timeLimit} onTimeUp={handleTimeUp} />
      </div>

      <div className="grid lg:grid-cols-[1fr_200px] gap-6">
        {/* Question Area */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="glass-card-static rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    currentQ.difficulty === 'beginner' ? 'border-neon-emerald/30 text-neon-emerald bg-neon-emerald/5' :
                    currentQ.difficulty === 'intermediate' ? 'border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5' :
                    'border-neon-rose/30 text-neon-rose bg-neon-rose/5'
                  }`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>{currentQ.difficulty}</span>
                  <span className="text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{currentQ.domain}</span>
                  {currentQ.type === 'multi' && <span className="text-xs text-neon-amber">(select multiple)</span>}
                </div>
                <button
                  onClick={toggleFlag}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${flagged.has(currentQ.id) ? 'text-neon-amber bg-neon-amber/10' : 'text-nebula-dim hover:text-nebula-muted'}`}
                  title="Flag for review"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              <p className="text-base text-nebula-text leading-relaxed mb-6">{currentQ.question}</p>

              <div className="space-y-2">
                {currentQ.options.map((opt) => {
                  const selected = (answers[currentQ.id] || []).includes(opt.id)
                  return (
                    <button
                      key={opt.id}
                      onClick={() => selectAnswer(opt.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        selected
                          ? 'border-neon-cyan/40 bg-neon-cyan/5'
                          : 'border-nebula-border hover:border-nebula-border-bright'
                      }`}
                    >
                      <span className={`text-xs font-bold mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${selected ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-nebula-surface text-nebula-dim'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>{opt.id.toUpperCase()}</span>
                      <span className="text-sm text-nebula-text">{opt.text}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-nebula-border text-sm text-nebula-muted hover:text-nebula-text disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {currentIdx === questions.length - 1 ? (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="btn-neon text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit Exam
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-nebula-border text-sm text-nebula-muted hover:text-nebula-text transition-all cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="hidden lg:block">
          <div className="glass-card-static rounded-2xl p-4 sticky top-36">
            <div className="text-xs text-nebula-dim mb-3 font-semibold">Questions</div>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((q, idx) => {
                const answered = !!answers[q.id]
                const isFlagged = flagged.has(q.id)
                const isCurrent = idx === currentIdx
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer relative ${
                      isCurrent ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40' :
                      answered ? 'bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20' :
                      'bg-nebula-surface text-nebula-dim border border-nebula-border hover:border-nebula-border-bright'
                    }`}
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {idx + 1}
                    {isFlagged && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-neon-amber" />}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-nebula-dim">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-neon-emerald/10 border border-neon-emerald/20" /> Answered</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-neon-cyan/20 border border-neon-cyan/40" /> Current</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-nebula-surface border border-nebula-border relative"><div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-neon-amber" /></div> Flagged</div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSubmitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card-static rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-neon-amber" />
                <h3 className="text-lg font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Submit Exam?</h3>
              </div>
              <p className="text-sm text-nebula-muted mb-2">
                You have answered {answeredCount} of {questions.length} questions.
              </p>
              {answeredCount < questions.length && (
                <p className="text-sm text-neon-amber mb-4">{questions.length - answeredCount} questions are unanswered and will be marked incorrect.</p>
              )}
              {flagged.size > 0 && (
                <p className="text-sm text-neon-amber mb-4">{flagged.size} questions are still flagged for review.</p>
              )}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-nebula-border text-sm text-nebula-muted hover:text-nebula-text transition-all cursor-pointer">Continue Exam</button>
                <button onClick={submitExam} className="flex-1 btn-neon py-2.5 rounded-xl text-sm cursor-pointer">Submit Now</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
