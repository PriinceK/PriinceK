import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft, Shield, CheckCircle2, XCircle, Circle,
    RotateCcw, AlertTriangle, Lightbulb, Trophy,
} from 'lucide-react'
import { IAM_SCENARIOS } from '../data/iamScenarios'

const PROGRESS_KEY = 'gcp-iam-simulator-progress'
const getProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} } }
const saveProgress = (p) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))

export default function IAMSimulator() {
    const [selectedScenario, setSelectedScenario] = useState(null)
    const [answers, setAnswers] = useState({})
    const [progress, setProgress] = useState(getProgress)
    const scenario = selectedScenario ? IAM_SCENARIOS.find((s) => s.id === selectedScenario) : null

    function selectScenario(id) { setSelectedScenario(id); setAnswers({}) }

    function answerTask(taskIdx, optIdx) {
        if (answers[taskIdx] !== undefined) return
        const newAnswers = { ...answers, [taskIdx]: optIdx }
        setAnswers(newAnswers)
        if (Object.keys(newAnswers).length === scenario.tasks.length) {
            const correct = scenario.tasks.filter((t, i) => newAnswers[i] === t.answer).length
            const p = getProgress()
            p[selectedScenario] = { score: correct, total: scenario.tasks.length, completed: true }
            saveProgress(p); setProgress(p)
        }
    }

    function reset() {
        const p = getProgress(); delete p[selectedScenario]; saveProgress(p); setProgress(p); selectScenario(selectedScenario)
    }

    if (!selectedScenario) {
        const completedCount = Object.values(progress).filter((p) => p.completed).length
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <Link to="/" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-neon-emerald/10 flex items-center justify-center border border-neon-emerald/20">
                        <Shield className="w-6 h-6 text-neon-emerald" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                            IAM Policy <span className="gradient-text-cyan">Simulator</span>
                        </h1>
                        <p className="text-nebula-muted text-sm">Practice role assignments, service accounts, and least-privilege design</p>
                    </div>
                </div>
                <div className="glass-card-static rounded-xl p-4 mb-8 mt-6 flex items-center justify-between">
                    <span className="text-sm text-nebula-muted">{completedCount}/{IAM_SCENARIOS.length} completed</span>
                    <div className="w-32 h-2 rounded-full bg-nebula-deep overflow-hidden">
                        <div className="h-full rounded-full bg-neon-emerald" style={{ width: `${(completedCount / IAM_SCENARIOS.length) * 100}%` }} />
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    {IAM_SCENARIOS.map((s) => {
                        const done = progress[s.id]?.completed
                        return (
                            <motion.button key={s.id} whileHover={{ y: -2 }} onClick={() => selectScenario(s.id)}
                                className="glass-card rounded-xl p-5 text-left cursor-pointer border-0 w-full transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-2xl">{s.icon}</span>
                                    {done && <span className="text-[10px] font-mono text-neon-emerald">{progress[s.id].score}/{progress[s.id].total}</span>}
                                </div>
                                <h3 className="text-base font-bold text-nebula-text mb-1">{s.title}</h3>
                                <p className="text-xs text-nebula-muted mb-3">{s.description}</p>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-nebula-surface text-nebula-dim border border-nebula-border">{s.category}</span>
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        )
    }

    const allAnswered = Object.keys(answers).length === scenario.tasks.length
    const correctCount = scenario.tasks.filter((t, i) => answers[i] === t.answer).length

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <button onClick={() => setSelectedScenario(null)} className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 cursor-pointer bg-transparent border-0 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="glass-card-static rounded-2xl p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{scenario.icon} {scenario.title}</h1>
                        <p className="text-sm text-nebula-muted">{scenario.description}</p>
                    </div>
                    <button onClick={reset} className="text-nebula-dim hover:text-nebula-muted text-xs flex items-center gap-1 cursor-pointer bg-transparent border-0 shrink-0">
                        <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                </div>
            </div>
            <div className="glass-card-static rounded-xl p-5 mb-6 border-l-4 border-l-neon-rose">
                <h3 className="text-xs font-semibold text-neon-rose uppercase mb-3 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Current (Insecure) Setup
                </h3>
                <p className="text-xs text-nebula-muted"><span className="text-nebula-text font-medium">Member:</span> {scenario.currentSetup.member}</p>
                <p className="text-xs text-nebula-muted"><span className="text-nebula-text font-medium">Role:</span> <code className="text-neon-rose">{scenario.currentSetup.currentRole}</code></p>
                <p className="text-xs text-neon-rose/80 mt-1">⚠️ {scenario.currentSetup.problem}</p>
            </div>
            <div className="space-y-4">
                {scenario.tasks.map((task, idx) => {
                    const answered = answers[idx] !== undefined
                    return (
                        <div key={idx} className="glass-card-static rounded-xl p-5">
                            <p className="text-sm font-medium text-nebula-text mb-3">{idx + 1}. {task.question}</p>
                            <div className="space-y-2">
                                {task.options.map((opt, optIdx) => {
                                    const selected = answers[idx] === optIdx
                                    const isCorrectOpt = optIdx === task.answer
                                    let cls = 'w-full text-left px-3 py-2.5 rounded-lg text-sm cursor-pointer border transition-all '
                                    if (answered) {
                                        if (isCorrectOpt) cls += 'bg-neon-emerald/10 border-neon-emerald/30 text-neon-emerald'
                                        else if (selected) cls += 'bg-neon-rose/10 border-neon-rose/30 text-neon-rose'
                                        else cls += 'bg-nebula-surface/20 border-nebula-border text-nebula-dim'
                                    } else cls += 'bg-nebula-surface/30 border-nebula-border text-nebula-text hover:border-neon-cyan/30 hover:bg-neon-cyan/5'
                                    return (
                                        <button key={optIdx} onClick={() => answerTask(idx, optIdx)} disabled={answered} className={cls}>
                                            <div className="flex items-center gap-2">
                                                {answered && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0" />}
                                                {answered && selected && !isCorrectOpt && <XCircle className="w-4 h-4 text-neon-rose shrink-0" />}
                                                {!answered && <Circle className="w-4 h-4 text-nebula-dim shrink-0" />}
                                                <span>{opt}</span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                            {answered && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 px-3 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/10">
                                    <p className="text-xs text-nebula-muted"><Lightbulb className="w-3 h-3 inline mr-1 text-neon-cyan" />{task.explanation}</p>
                                </motion.div>
                            )}
                        </div>
                    )
                })}
            </div>
            {allAnswered && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-card-static rounded-2xl p-6 text-center border-neon-emerald/20">
                    <Trophy className="w-8 h-8 text-neon-amber mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-nebula-text mb-1">{correctCount}/{scenario.tasks.length}</h3>
                    <p className="text-sm text-nebula-muted mb-4">
                        {correctCount === scenario.tasks.length ? '🎉 Perfect! You understand IAM security.' : '📚 Review the explanations above.'}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => setSelectedScenario(null)} className="btn-neon px-5 py-2 rounded-xl text-sm">Back</button>
                        <button onClick={reset} className="px-5 py-2 rounded-xl bg-nebula-surface border border-nebula-border text-nebula-muted text-sm cursor-pointer hover:text-nebula-text transition-colors">Retry</button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
