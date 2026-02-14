import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, AlertTriangle, ChevronRight, CheckCircle2, Circle,
    Terminal, Eye, EyeOff, RotateCcw, Trophy, Bug, Lightbulb,
    ArrowRight, BookOpen, Wrench, Shield,
} from 'lucide-react'
import { TROUBLESHOOTING_SCENARIOS } from '../data/troubleshootingScenarios'

const PROGRESS_KEY = 'gcp-troubleshooting-progress'
const getProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} } }
const saveProgress = (p) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))

const DIFF_COLORS = {
    Intermediate: { bg: 'bg-neon-amber/10', text: 'text-neon-amber', border: 'border-neon-amber/20' },
    Advanced: { bg: 'bg-neon-rose/10', text: 'text-neon-rose', border: 'border-neon-rose/20' },
}

export default function TroubleshootingLab() {
    const [selectedScenario, setSelectedScenario] = useState(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [revealedSteps, setRevealedSteps] = useState([])
    const [showRootCause, setShowRootCause] = useState(false)
    const [progress, setProgress] = useState(getProgress)

    const scenario = selectedScenario ? TROUBLESHOOTING_SCENARIOS.find((s) => s.id === selectedScenario) : null

    function selectScenario(id) {
        setSelectedScenario(id)
        setCurrentStep(0)
        setRevealedSteps([])
        setShowRootCause(false)
    }

    function revealStep(idx) {
        if (!revealedSteps.includes(idx)) {
            setRevealedSteps([...revealedSteps, idx])
            if (idx === scenario.steps.length - 1) {
                const p = getProgress()
                p[selectedScenario] = { completed: true, stepsUsed: revealedSteps.length + 1, timestamp: Date.now() }
                saveProgress(p)
                setProgress(p)
            }
        }
    }

    function reset() {
        const p = getProgress()
        delete p[selectedScenario]
        saveProgress(p)
        setProgress(p)
        selectScenario(selectedScenario)
    }

    // ─── Scenario List ───
    if (!selectedScenario) {
        const completedCount = Object.values(progress).filter((p) => p.completed).length
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <Link to="/" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-neon-rose/10 flex items-center justify-center border border-neon-rose/20 glow-rose">
                        <Bug className="w-6 h-6 text-neon-rose" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                            Troubleshooting <span className="gradient-text-warm">Lab</span>
                        </h1>
                        <p className="text-nebula-muted text-sm">Diagnose and fix real-world GCP infrastructure issues</p>
                    </div>
                </div>

                <div className="glass-card-static rounded-xl p-4 mb-8 mt-6 flex items-center justify-between">
                    <span className="text-sm text-nebula-muted">{completedCount}/{TROUBLESHOOTING_SCENARIOS.length} scenarios resolved</span>
                    <div className="w-32 h-2 rounded-full bg-nebula-deep overflow-hidden">
                        <div className="h-full rounded-full bg-neon-rose" style={{ width: `${(completedCount / TROUBLESHOOTING_SCENARIOS.length) * 100}%` }} />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TROUBLESHOOTING_SCENARIOS.map((s) => {
                        const done = progress[s.id]?.completed
                        const dc = DIFF_COLORS[s.difficulty] || DIFF_COLORS.Intermediate
                        return (
                            <motion.button
                                key={s.id}
                                whileHover={{ y: -2 }}
                                onClick={() => selectScenario(s.id)}
                                className="glass-card rounded-xl p-5 text-left cursor-pointer border-0 w-full transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-2xl">{s.icon}</span>
                                    {done && <CheckCircle2 className="w-5 h-5 text-neon-emerald" />}
                                </div>
                                <h3 className="text-base font-bold text-nebula-text mb-1">{s.title}</h3>
                                <p className="text-xs text-nebula-muted mb-3 line-clamp-2">{s.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${dc.bg} ${dc.text} border ${dc.border}`}>
                                        {s.difficulty}
                                    </span>
                                    <span className="text-[10px] text-nebula-dim">{s.steps.length} steps</span>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        )
    }

    // ─── Scenario Detail ───
    const allRevealed = revealedSteps.length === scenario.steps.length
    const completed = progress[selectedScenario]?.completed

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <button onClick={() => setSelectedScenario(null)} className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 cursor-pointer bg-transparent border-0 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Scenarios
            </button>

            {/* Header */}
            <div className="glass-card-static rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4">
                    <span className="text-3xl">{scenario.icon}</span>
                    <div className="flex-1">
                        <h1 className="text-2xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{scenario.title}</h1>
                        <p className="text-sm text-nebula-muted mb-3">{scenario.context}</p>
                        <div className="flex flex-wrap gap-2">
                            {scenario.tags.map((t) => (
                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-nebula-surface text-nebula-dim border border-nebula-border">{t}</span>
                            ))}
                        </div>
                    </div>
                    <button onClick={reset} className="text-nebula-dim hover:text-nebula-muted text-xs flex items-center gap-1 cursor-pointer bg-transparent border-0 shrink-0">
                        <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                </div>
            </div>

            {/* Symptoms */}
            <div className="glass-card-static rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-neon-amber" />
                    <h3 className="text-sm font-semibold text-nebula-text">Reported Symptoms</h3>
                </div>
                <ul className="space-y-2">
                    {scenario.symptoms.map((sym, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-nebula-muted">
                            <span className="text-neon-amber mt-1">•</span> {sym}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-6">
                {scenario.steps.map((step, idx) => {
                    const revealed = revealedSteps.includes(idx)
                    const isNext = !revealed && revealedSteps.length === idx

                    return (
                        <motion.div
                            key={step.id}
                            initial={false}
                            className={`glass-card-static rounded-xl overflow-hidden transition-all ${revealed ? 'border-neon-cyan/20' : isNext ? 'border-neon-amber/20' : 'opacity-60'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {revealed ? (
                                            <CheckCircle2 className="w-4 h-4 text-neon-emerald" />
                                        ) : (
                                            <Circle className={`w-4 h-4 ${isNext ? 'text-neon-amber' : 'text-nebula-dim'}`} />
                                        )}
                                        <span className="text-sm font-semibold text-nebula-text">{step.title}</span>
                                        <span className="text-[10px] text-nebula-dim">Step {idx + 1}/{scenario.steps.length}</span>
                                    </div>
                                    {isNext && (
                                        <button
                                            onClick={() => revealStep(idx)}
                                            className="px-3 py-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan text-xs font-medium cursor-pointer hover:bg-neon-cyan/20 transition-colors flex items-center gap-1"
                                        >
                                            <Eye className="w-3 h-3" /> Run Diagnostic
                                        </button>
                                    )}
                                </div>

                                <p className="text-xs text-nebula-muted mb-2">{step.instruction}</p>

                                <AnimatePresence>
                                    {revealed && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                            {/* Command */}
                                            <div className="mt-3 rounded-lg bg-[#0a0e1a] p-3 font-mono text-xs">
                                                <div className="text-neon-emerald mb-1">$ {step.command}</div>
                                                <pre className="text-nebula-text/80 whitespace-pre-wrap">{step.output}</pre>
                                            </div>

                                            {/* Analysis */}
                                            <div className="mt-2 px-3 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/10">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <Lightbulb className="w-3 h-3 text-neon-cyan" />
                                                    <span className="text-[10px] font-semibold text-neon-cyan uppercase">Analysis</span>
                                                </div>
                                                <p className="text-xs text-nebula-muted">{step.analysis}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Root Cause & Lesson */}
            {allRevealed && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="glass-card-static rounded-xl p-5 border-neon-emerald/20">
                        <div className="flex items-center gap-2 mb-3">
                            <Wrench className="w-5 h-5 text-neon-emerald" />
                            <h3 className="text-base font-bold text-nebula-text">Root Cause</h3>
                        </div>
                        <p className="text-sm text-nebula-muted leading-relaxed">{scenario.rootCause}</p>
                    </div>

                    <div className="glass-card-static rounded-xl p-5 border-neon-cyan/20">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="w-5 h-5 text-neon-cyan" />
                            <h3 className="text-base font-bold text-nebula-text">Key Lesson</h3>
                        </div>
                        <p className="text-sm text-nebula-muted leading-relaxed">{scenario.lesson}</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setSelectedScenario(null)}
                            className="px-4 py-2.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan text-sm font-medium cursor-pointer hover:bg-neon-cyan/20 transition-colors"
                        >
                            Back to Scenarios
                        </button>
                        <button
                            onClick={reset}
                            className="px-4 py-2.5 rounded-lg bg-nebula-surface border border-nebula-border text-nebula-muted text-sm cursor-pointer hover:text-nebula-text transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
