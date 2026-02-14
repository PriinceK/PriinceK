import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, History, Trophy, CheckCircle2, XCircle,
    ChevronDown, ChevronUp, GraduationCap, Clock, Trash2,
} from 'lucide-react'
import { getExamHistory } from '../utils/progress'
import { EXAM_QUESTIONS } from '../data/examQuestions'
import { DOMAINS } from '../utils/domainScoring'

export default function ExamHistory() {
    const [history, setHistory] = useState([])
    const [expandedIdx, setExpandedIdx] = useState(null)
    const [expandedQ, setExpandedQ] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        setHistory(getExamHistory().reverse())
    }, [])

    if (history.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-10 text-center">
                <Link to="/exam" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Exam Setup
                </Link>
                <History className="w-12 h-12 text-nebula-dim mx-auto mb-4" />
                <h1 className="text-xl font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>No Exam History</h1>
                <p className="text-sm text-nebula-muted mb-4">Take your first practice exam to see your results here.</p>
                <Link to="/exam" className="btn-neon px-6 py-2.5 rounded-xl text-sm no-underline inline-block">Start an Exam</Link>
            </div>
        )
    }

    const bestScore = Math.max(...history.map((h) => h.percentage || 0))
    const avgScore = Math.round(history.reduce((a, h) => a + (h.percentage || 0), 0) / history.length)
    const passCount = history.filter((h) => (h.percentage || 0) >= 70).length

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
            <Link to="/exam" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                <ArrowLeft className="w-4 h-4" /> Exam Setup
            </Link>

            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center border border-neon-purple/20">
                    <History className="w-6 h-6 text-neon-purple" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                        Exam <span className="gradient-text-purple">History</span>
                    </h1>
                    <p className="text-nebula-muted text-sm">{history.length} attempt{history.length !== 1 ? 's' : ''} recorded</p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="glass-card-static rounded-xl p-4 text-center">
                    <Trophy className="w-5 h-5 text-neon-amber mx-auto mb-1" />
                    <div className="text-2xl font-bold text-nebula-text font-mono">{bestScore}%</div>
                    <div className="text-[10px] text-nebula-muted">Best Score</div>
                </div>
                <div className="glass-card-static rounded-xl p-4 text-center">
                    <GraduationCap className="w-5 h-5 text-neon-cyan mx-auto mb-1" />
                    <div className="text-2xl font-bold text-nebula-text font-mono">{avgScore}%</div>
                    <div className="text-[10px] text-nebula-muted">Average</div>
                </div>
                <div className="glass-card-static rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-5 h-5 text-neon-emerald mx-auto mb-1" />
                    <div className="text-2xl font-bold text-nebula-text font-mono">{passCount}/{history.length}</div>
                    <div className="text-[10px] text-nebula-muted">Passed</div>
                </div>
            </div>

            {/* History List */}
            <div className="space-y-3">
                {history.map((attempt, idx) => {
                    const passed = (attempt.percentage || 0) >= 70
                    const expanded = expandedIdx === idx
                    const questions = (attempt.questionIds || []).map((id) => EXAM_QUESTIONS.find((q) => q.id === id)).filter(Boolean)
                    const date = attempt.timestamp ? new Date(attempt.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Unknown date'

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card-static rounded-xl overflow-hidden"
                        >
                            {/* Header */}
                            <button
                                onClick={() => setExpandedIdx(expanded ? null : idx)}
                                className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer bg-transparent border-0 hover:bg-nebula-surface/30 transition-colors"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${passed ? 'bg-neon-emerald/10' : 'bg-neon-rose/10'}`}>
                                    <span className="text-lg font-bold font-mono" style={{ color: passed ? '#10b981' : '#f43f5e' }}>{attempt.percentage || 0}%</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-nebula-text">{passed ? '✅ Passed' : '❌ Did not pass'}</div>
                                    <div className="text-[10px] text-nebula-dim flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {date}
                                        <span>· {attempt.correct || 0}/{attempt.total || 0} correct</span>
                                    </div>
                                </div>
                                {expanded ? <ChevronUp className="w-4 h-4 text-nebula-dim shrink-0" /> : <ChevronDown className="w-4 h-4 text-nebula-dim shrink-0" />}
                            </button>

                            {/* Expanded Detail */}
                            <AnimatePresence>
                                {expanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 border-t border-nebula-border/50">
                                            {/* Domain Breakdown */}
                                            {attempt.domainResults && (
                                                <div className="mt-3 mb-4">
                                                    <h4 className="text-[10px] uppercase tracking-wider text-nebula-dim font-semibold mb-2">Domain Breakdown</h4>
                                                    <div className="space-y-2">
                                                        {DOMAINS.map((d) => {
                                                            const dr = attempt.domainResults[d.id]
                                                            if (!dr) return null
                                                            const pct = Math.round((dr.correct / dr.total) * 100)
                                                            return (
                                                                <div key={d.id} className="flex items-center gap-2">
                                                                    <span className="text-[10px] text-nebula-muted flex-1 truncate">{d.label}</span>
                                                                    <span className="text-[10px] font-mono" style={{ color: pct >= 70 ? '#10b981' : '#f43f5e' }}>{pct}%</span>
                                                                    <div className="w-20 h-1 rounded-full bg-nebula-deep overflow-hidden">
                                                                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct >= 70 ? '#10b981' : '#f43f5e' }} />
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Questions */}
                                            <h4 className="text-[10px] uppercase tracking-wider text-nebula-dim font-semibold mb-2">Questions ({questions.length})</h4>
                                            <div className="space-y-1.5 max-h-64 overflow-y-auto">
                                                {questions.map((q, qIdx) => {
                                                    const userAnswer = (attempt.answers?.[q.id] || []).sort().join(',')
                                                    const correctAnswer = q.correct.sort().join(',')
                                                    const isCorrect = userAnswer === correctAnswer
                                                    const isExpQ = expandedQ === `${idx}-${q.id}`

                                                    return (
                                                        <div key={q.id}>
                                                            <button
                                                                onClick={() => setExpandedQ(isExpQ ? null : `${idx}-${q.id}`)}
                                                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left cursor-pointer bg-transparent border-0 hover:bg-nebula-surface/30 transition-colors"
                                                            >
                                                                {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-neon-emerald shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-neon-rose shrink-0" />}
                                                                <span className="text-[10px] text-nebula-dim font-mono shrink-0">Q{qIdx + 1}</span>
                                                                <span className="text-xs text-nebula-text truncate flex-1">{q.question}</span>
                                                            </button>
                                                            {isExpQ && (
                                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 pb-2">
                                                                    <div className="space-y-1 mt-1 mb-2">
                                                                        {q.options.map((opt) => {
                                                                            const wasSelected = (attempt.answers?.[q.id] || []).includes(opt.id)
                                                                            const isCorrectOpt = q.correct.includes(opt.id)
                                                                            return (
                                                                                <div key={opt.id} className={`text-[11px] px-2 py-1.5 rounded flex items-start gap-1.5 ${isCorrectOpt ? 'bg-neon-emerald/5 text-nebula-text' : wasSelected ? 'bg-neon-rose/5 text-neon-rose/80' : 'text-nebula-dim'}`}>
                                                                                    <span className="font-bold font-mono">{opt.id.toUpperCase()}</span>
                                                                                    <span>{opt.text}</span>
                                                                                    {isCorrectOpt && <CheckCircle2 className="w-3 h-3 text-neon-emerald shrink-0 mt-0.5 ml-auto" />}
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                    <p className="text-[10px] text-nebula-muted bg-nebula-surface/50 rounded p-2 leading-relaxed">{q.explanation}</p>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
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
