import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Eye,
    ChevronRight, RotateCcw, Trophy, Lightbulb, Layout,
    Circle, Wrench, BookOpen,
} from 'lucide-react'
import { ARCHITECTURE_QUIZZES } from '../data/architectureQuizzes'

const PROGRESS_KEY = 'gcp-arch-quiz-progress'
const getProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} } }
const saveProgress = (p) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))

const NODE_COLORS = {
    external: { bg: '#94a3b8', border: '#64748b' },
    compute: { bg: '#4285f4', border: '#2563eb' },
    networking: { bg: '#ea4335', border: '#dc2626' },
    storage: { bg: '#34a853', border: '#16a34a' },
    database: { bg: '#34a853', border: '#16a34a' },
    data: { bg: '#9c27b0', border: '#7c3aed' },
}

const DIFF_COLORS = {
    Beginner: { bg: 'bg-neon-emerald/10', text: 'text-neon-emerald', border: 'border-neon-emerald/20' },
    Intermediate: { bg: 'bg-neon-amber/10', text: 'text-neon-amber', border: 'border-neon-amber/20' },
    Advanced: { bg: 'bg-neon-rose/10', text: 'text-neon-rose', border: 'border-neon-rose/20' },
}

export default function ArchitectureQuiz() {
    const [selectedQuiz, setSelectedQuiz] = useState(null)
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({})
    const [showFlaws, setShowFlaws] = useState(false)
    const [progress, setProgress] = useState(getProgress)

    const quiz = selectedQuiz ? ARCHITECTURE_QUIZZES.find((q) => q.id === selectedQuiz) : null

    function selectQuiz(id) {
        setSelectedQuiz(id)
        setCurrentQ(0)
        setAnswers({})
        setShowFlaws(false)
    }

    function answerQuestion(qIdx, optIdx) {
        if (answers[qIdx] !== undefined) return
        const newAnswers = { ...answers, [qIdx]: optIdx }
        setAnswers(newAnswers)

        if (Object.keys(newAnswers).length === quiz.questions.length) {
            const correct = quiz.questions.filter((q, i) => newAnswers[i] === q.answer).length
            const p = getProgress()
            p[selectedQuiz] = { score: correct, total: quiz.questions.length, completed: true }
            saveProgress(p)
            setProgress(p)
        }
    }

    function reset() {
        const p = getProgress()
        delete p[selectedQuiz]
        saveProgress(p)
        setProgress(p)
        selectQuiz(selectedQuiz)
    }

    // ─── Quiz List ───
    if (!selectedQuiz) {
        const completedCount = Object.values(progress).filter((p) => p.completed).length
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <Link to="/" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-neon-amber/10 flex items-center justify-center border border-neon-amber/20 glow-amber">
                        <Layout className="w-6 h-6 text-neon-amber" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                            Architecture <span className="gradient-text-warm">Quizzes</span>
                        </h1>
                        <p className="text-nebula-muted text-sm">Identify flaws in broken architecture diagrams</p>
                    </div>
                </div>

                <div className="glass-card-static rounded-xl p-4 mb-8 mt-6 flex items-center justify-between">
                    <span className="text-sm text-nebula-muted">{completedCount}/{ARCHITECTURE_QUIZZES.length} quizzes completed</span>
                    <div className="w-32 h-2 rounded-full bg-nebula-deep overflow-hidden">
                        <div className="h-full rounded-full bg-neon-amber" style={{ width: `${(completedCount / ARCHITECTURE_QUIZZES.length) * 100}%` }} />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ARCHITECTURE_QUIZZES.map((q) => {
                        const done = progress[q.id]?.completed
                        const dc = DIFF_COLORS[q.difficulty] || DIFF_COLORS.Beginner
                        return (
                            <motion.button
                                key={q.id}
                                whileHover={{ y: -2 }}
                                onClick={() => selectQuiz(q.id)}
                                className="glass-card rounded-xl p-5 text-left cursor-pointer border-0 w-full transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <AlertTriangle className="w-5 h-5 text-neon-amber" />
                                    {done && (
                                        <span className="text-[10px] font-mono text-neon-emerald">{progress[q.id].score}/{progress[q.id].total}</span>
                                    )}
                                </div>
                                <h3 className="text-base font-bold text-nebula-text mb-1">{q.title}</h3>
                                <p className="text-xs text-nebula-muted mb-3 line-clamp-2">{q.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${dc.bg} ${dc.text} border ${dc.border}`}>{q.difficulty}</span>
                                    <span className="text-[10px] text-nebula-dim">{q.flaws.length} flaws · {q.questions.length} questions</span>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        )
    }

    // ─── Quiz Detail ───
    const allAnswered = Object.keys(answers).length === quiz.questions.length
    const correctCount = quiz.questions.filter((q, i) => answers[i] === q.answer).length

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <button onClick={() => setSelectedQuiz(null)} className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 cursor-pointer bg-transparent border-0 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Quizzes
            </button>

            {/* Header */}
            <div className="glass-card-static rounded-2xl p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{quiz.title}</h1>
                        <p className="text-sm text-nebula-muted">{quiz.description}</p>
                    </div>
                    <button onClick={reset} className="text-nebula-dim hover:text-nebula-muted text-xs flex items-center gap-1 cursor-pointer bg-transparent border-0 shrink-0">
                        <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                </div>
            </div>

            {/* Architecture Diagram */}
            <div className="glass-card-static rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-nebula-text flex items-center gap-2">
                        <Layout className="w-4 h-4 text-neon-cyan" /> Architecture Diagram
                    </h3>
                    <button
                        onClick={() => setShowFlaws(!showFlaws)}
                        className={`text-xs flex items-center gap-1 cursor-pointer bg-transparent border-0 transition-colors ${showFlaws ? 'text-neon-rose' : 'text-nebula-muted hover:text-nebula-text'}`}
                    >
                        <Eye className="w-3 h-3" /> {showFlaws ? 'Hide' : 'Reveal'} Flaws
                    </button>
                </div>

                <div className="relative bg-[#0a0e1a] rounded-xl p-4 overflow-x-auto" style={{ minHeight: '300px' }}>
                    <svg width="700" height="300" className="w-full h-auto">
                        {/* Connections */}
                        {quiz.connections.map((conn, i) => {
                            const fromNode = quiz.nodes.find((n) => n.id === conn.from)
                            const toNode = quiz.nodes.find((n) => n.id === conn.to)
                            if (!fromNode || !toNode) return null
                            const isFlaw = conn.flaw && showFlaws
                            return (
                                <line
                                    key={i}
                                    x1={fromNode.x + 60}
                                    y1={fromNode.y + 25}
                                    x2={toNode.x + 60}
                                    y2={toNode.y + 25}
                                    stroke={isFlaw ? '#f43f5e' : '#3b4677'}
                                    strokeWidth={isFlaw ? 3 : 2}
                                    strokeDasharray={isFlaw ? '8 4' : '0'}
                                />
                            )
                        })}

                        {/* Nodes */}
                        {quiz.nodes.map((node) => {
                            const colors = NODE_COLORS[node.type] || NODE_COLORS.external
                            const isFlaw = node.flaw && showFlaws
                            return (
                                <g key={node.id}>
                                    <rect
                                        x={node.x}
                                        y={node.y}
                                        width={120}
                                        height={50}
                                        rx={8}
                                        fill={isFlaw ? 'rgba(244, 63, 94, 0.15)' : `${colors.bg}15`}
                                        stroke={isFlaw ? '#f43f5e' : colors.border + '40'}
                                        strokeWidth={isFlaw ? 2 : 1}
                                    />
                                    {node.label.split('\n').map((line, li) => (
                                        <text
                                            key={li}
                                            x={node.x + 60}
                                            y={node.y + 20 + li * 14}
                                            textAnchor="middle"
                                            fill={isFlaw ? '#f43f5e' : '#eef2ff'}
                                            fontSize="10"
                                            fontFamily="system-ui, sans-serif"
                                        >
                                            {line}
                                        </text>
                                    ))}
                                    {isFlaw && (
                                        <text x={node.x + 110} y={node.y + 10} fill="#f43f5e" fontSize="14">⚠️</text>
                                    )}
                                </g>
                            )
                        })}
                    </svg>
                </div>
            </div>

            {/* Flaws (when revealed) */}
            <AnimatePresence>
                {showFlaws && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mb-6 space-y-3">
                        {quiz.flaws.map((flaw) => (
                            <div key={flaw.id} className={`glass-card-static rounded-xl p-4 border-l-4 ${flaw.severity === 'high' ? 'border-l-neon-rose' : flaw.severity === 'medium' ? 'border-l-neon-amber' : 'border-l-neon-cyan'
                                }`}>
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${flaw.severity === 'high' ? 'text-neon-rose' : 'text-neon-amber'
                                        }`} />
                                    <div>
                                        <p className="text-sm text-nebula-text font-medium">{flaw.description}</p>
                                        <p className="text-xs text-nebula-muted mt-1"><Wrench className="w-3 h-3 inline mr-1" />{flaw.fix}</p>
                                        {flaw.missingService && (
                                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                                                Missing: {flaw.missingService}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Questions */}
            <div className="space-y-4 mb-6">
                <h3 className="text-sm font-semibold text-nebula-text flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-neon-cyan" /> Architecture Questions
                </h3>

                {quiz.questions.map((q, qIdx) => {
                    const answered = answers[qIdx] !== undefined
                    const isCorrect = answers[qIdx] === q.answer
                    return (
                        <div key={qIdx} className="glass-card-static rounded-xl p-5">
                            <p className="text-sm font-medium text-nebula-text mb-3">{qIdx + 1}. {q.question}</p>
                            <div className="grid sm:grid-cols-2 gap-2">
                                {q.options.map((opt, optIdx) => {
                                    const selected = answers[qIdx] === optIdx
                                    const isCorrectOpt = optIdx === q.answer
                                    let className = 'px-3 py-2.5 rounded-lg text-sm text-left cursor-pointer border transition-all w-full '
                                    if (answered) {
                                        if (isCorrectOpt) className += 'bg-neon-emerald/10 border-neon-emerald/30 text-neon-emerald'
                                        else if (selected) className += 'bg-neon-rose/10 border-neon-rose/30 text-neon-rose'
                                        else className += 'bg-nebula-surface/20 border-nebula-border text-nebula-dim'
                                    } else {
                                        className += 'bg-nebula-surface/30 border-nebula-border text-nebula-text hover:border-neon-cyan/30 hover:bg-neon-cyan/5'
                                    }
                                    return (
                                        <button key={optIdx} onClick={() => answerQuestion(qIdx, optIdx)} disabled={answered} className={className}>
                                            <div className="flex items-center gap-2">
                                                {answered && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0" />}
                                                {answered && selected && !isCorrectOpt && <XCircle className="w-4 h-4 text-neon-rose shrink-0" />}
                                                {!answered && <Circle className="w-4 h-4 text-nebula-dim shrink-0" />}
                                                {opt}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                            {answered && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 px-3 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/10">
                                    <p className="text-xs text-nebula-muted"><Lightbulb className="w-3 h-3 inline mr-1 text-neon-cyan" />{q.explanation}</p>
                                </motion.div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Results */}
            {allAnswered && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static rounded-2xl p-6 text-center border-neon-amber/20">
                    <Trophy className="w-8 h-8 text-neon-amber mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-nebula-text mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                        Score: {correctCount}/{quiz.questions.length}
                    </h3>
                    <p className="text-sm text-nebula-muted mb-4">
                        {correctCount === quiz.questions.length ? '🎉 Perfect! You identified all the issues.' :
                            correctCount >= quiz.questions.length / 2 ? '👍 Good job! Review the explanations for missed questions.' :
                                '📚 Review the flaws and try again to improve.'}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => setSelectedQuiz(null)} className="btn-neon px-5 py-2 rounded-xl text-sm">Back to Quizzes</button>
                        <button onClick={reset} className="px-5 py-2 rounded-xl bg-nebula-surface border border-nebula-border text-nebula-muted text-sm cursor-pointer hover:text-nebula-text transition-colors">Retry</button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
