import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Terminal as TermIcon, ChevronRight, ChevronDown,
    CheckCircle2, Circle, Lock, Lightbulb, RotateCcw, Cloud,
    Trophy, Star, BookOpen,
} from 'lucide-react'
import { GCLOUD_LESSONS, GCLOUD_CATEGORIES, GCLOUD_CATEGORY_COLORS } from '../data/gcloudCommands'
import { executeGcloudCommand } from '../utils/gcloudInterpreter'

const PROGRESS_KEY = 'gcp-gcloud-lab-progress'

function getProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} }
}
function saveProgress(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)) }

export default function GCloudLab() {
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [progress, setProgress] = useState(getProgress)
    const [showHint, setShowHint] = useState(false)
    const [lines, setLines] = useState([])
    const [input, setInput] = useState('')
    const [cmdHistory, setCmdHistory] = useState([])
    const [historyIdx, setHistoryIdx] = useState(-1)
    const [stepCompleted, setStepCompleted] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const containerRef = useRef(null)
    const inputRef = useRef(null)

    const lesson = selectedLesson ? GCLOUD_LESSONS.find((l) => l.id === selectedLesson) : null
    const step = lesson ? lesson.steps[currentStep] : null

    const completedSteps = progress[selectedLesson]?.completedSteps || []
    const totalCompleted = Object.values(progress).reduce((acc, l) => acc + (l.completedSteps?.length || 0), 0)
    const totalSteps = GCLOUD_LESSONS.reduce((acc, l) => acc + l.steps.length, 0)

    const scrollToBottom = useCallback(() => {
        if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
    }, [])

    useEffect(() => { scrollToBottom() }, [lines, scrollToBottom])
    useEffect(() => { inputRef.current?.focus() }, [selectedLesson, currentStep])

    function selectLesson(id) {
        setSelectedLesson(id)
        setCurrentStep(0)
        setStepCompleted(false)
        setShowHint(false)
        setLines([
            { type: 'system', text: '═══════════════════════════════════════════════════════' },
            { type: 'system', text: `  GCloud CLI Lab — ${GCLOUD_LESSONS.find((l) => l.id === id)?.title}` },
            { type: 'system', text: '═══════════════════════════════════════════════════════' },
            { type: 'system', text: '' },
            { type: 'system', text: 'Type gcloud, gsutil, kubectl, or bq commands to complete each task.' },
            { type: 'system', text: 'Use "hint" for help. Type "clear" to clear the terminal.' },
            { type: 'system', text: '' },
        ])
        setInput('')
    }

    function handleSubmit(e) {
        e.preventDefault()
        const cmd = input.trim()
        if (!cmd) return

        setCmdHistory((prev) => [...prev, cmd])
        setHistoryIdx(-1)

        setLines((prev) => [...prev, { type: 'prompt', text: '$ ', cmd }])

        if (cmd === 'clear') {
            setLines([])
            setInput('')
            return
        }

        if (cmd === 'hint' || cmd === 'help') {
            if (step) {
                setLines((prev) => [...prev, { type: 'hint', text: `💡 Hint: ${step.hint}` }])
                setLines((prev) => [...prev, { type: 'hint', text: `Expected: ${step.expectedCommand}` }])
            }
            setInput('')
            return
        }

        // Execute through gcloud interpreter
        const result = executeGcloudCommand(cmd)
        if (result.output) {
            setLines((prev) => [...prev, { type: result.valid ? 'output' : 'error', text: result.output }])
        }

        // Validate against current step
        if (step && !stepCompleted && step.validation(cmd)) {
            setStepCompleted(true)
            setLines((prev) => [...prev, { type: 'success', text: step.successMessage }])

            // Save progress
            const p = getProgress()
            if (!p[selectedLesson]) p[selectedLesson] = { completedSteps: [] }
            if (!p[selectedLesson].completedSteps.includes(currentStep)) {
                p[selectedLesson].completedSteps.push(currentStep)
            }
            saveProgress(p)
            setProgress(p)
        }

        setInput('')
    }

    function handleKeyDown(e) {
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (cmdHistory.length === 0) return
            const newIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1)
            setHistoryIdx(newIdx)
            setInput(cmdHistory[newIdx] || '')
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (historyIdx === -1) return
            const newIdx = historyIdx + 1
            if (newIdx >= cmdHistory.length) { setHistoryIdx(-1); setInput('') }
            else { setHistoryIdx(newIdx); setInput(cmdHistory[newIdx] || '') }
        }
    }

    function nextStep() {
        if (currentStep < lesson.steps.length - 1) {
            setCurrentStep(currentStep + 1)
            setStepCompleted(false)
            setShowHint(false)
            setLines((prev) => [
                ...prev,
                { type: 'system', text: '' },
                { type: 'system', text: `── Step ${currentStep + 2}/${lesson.steps.length} ──` },
                { type: 'system', text: '' },
            ])
        }
    }

    function resetLesson() {
        const p = getProgress()
        delete p[selectedLesson]
        saveProgress(p)
        setProgress(p)
        selectLesson(selectedLesson)
    }

    // ─── Lesson List View ───
    if (!selectedLesson) {
        const grouped = {}
        GCLOUD_LESSONS.forEach((l) => {
            if (!grouped[l.category]) grouped[l.category] = []
            grouped[l.category].push(l)
        })

        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <Link to="/" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 glow-cyan">
                        <Cloud className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                            GCloud <span className="gradient-text-cyan">CLI Lab</span>
                        </h1>
                        <p className="text-nebula-muted text-sm">Master gcloud, gsutil, kubectl, and bq commands</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="glass-card-static rounded-xl p-4 mb-8 mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-nebula-muted">Overall Progress</span>
                        <span className="text-sm font-mono text-neon-cyan">{totalCompleted}/{totalSteps} steps</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-nebula-deep overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed)' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(totalCompleted / totalSteps) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Lesson categories */}
                {Object.entries(grouped).map(([cat, lessons]) => (
                    <div key={cat} className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GCLOUD_CATEGORY_COLORS[cat] }} />
                            <h2 className="text-lg font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                                {GCLOUD_CATEGORIES[cat]}
                            </h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lessons.map((l) => {
                                const lProgress = progress[l.id]?.completedSteps?.length || 0
                                const isComplete = lProgress === l.steps.length
                                return (
                                    <motion.button
                                        key={l.id}
                                        whileHover={{ y: -2 }}
                                        onClick={() => selectLesson(l.id)}
                                        className="glass-card rounded-xl p-5 text-left cursor-pointer border-0 w-full transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-2xl">{l.icon}</span>
                                            {isComplete && <CheckCircle2 className="w-5 h-5 text-neon-emerald" />}
                                        </div>
                                        <h3 className="text-base font-bold text-nebula-text mb-1">{l.title}</h3>
                                        <p className="text-xs text-nebula-muted mb-3 line-clamp-2">{l.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                style={{
                                                    backgroundColor: GCLOUD_CATEGORY_COLORS[l.category] + '15',
                                                    color: GCLOUD_CATEGORY_COLORS[l.category],
                                                    border: `1px solid ${GCLOUD_CATEGORY_COLORS[l.category]}25`,
                                                }}
                                            >
                                                {l.difficulty}
                                            </span>
                                            <span className="text-[10px] text-nebula-dim font-mono">{lProgress}/{l.steps.length}</span>
                                        </div>
                                        {lProgress > 0 && (
                                            <div className="mt-2 w-full h-1 rounded-full bg-nebula-deep overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-neon-cyan"
                                                    style={{ width: `${(lProgress / l.steps.length) * 100}%` }}
                                                />
                                            </div>
                                        )}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // ─── Lab View ───
    const lessonComplete = completedSteps.length === lesson.steps.length

    return (
        <div className="h-screen flex flex-col bg-nebula-deep">
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-nebula-border shrink-0"
                style={{ background: 'rgba(12, 16, 36, 0.95)' }}>
                <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedLesson(null)} className="text-nebula-muted hover:text-neon-cyan transition-colors cursor-pointer bg-transparent border-0">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <Cloud className="w-5 h-5 text-neon-cyan" />
                    <span className="text-sm font-bold text-nebula-text">{lesson.title}</span>
                    <span className="text-[10px] text-nebula-dim font-mono">Step {currentStep + 1}/{lesson.steps.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={resetLesson} className="text-nebula-dim hover:text-nebula-muted text-xs flex items-center gap-1 cursor-pointer bg-transparent border-0">
                        <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                </div>
            </div>

            <div className="flex-1 flex min-h-0">
                {/* Sidebar — Steps */}
                <div className={`${sidebarOpen ? 'w-80' : 'w-0'} border-r border-nebula-border shrink-0 overflow-y-auto transition-all duration-200`}
                    style={{ background: 'rgba(12, 16, 36, 0.6)' }}>
                    {sidebarOpen && (
                        <div className="p-4">
                            <h3 className="text-xs font-semibold text-nebula-muted uppercase tracking-wider mb-3">Steps</h3>
                            {lesson.steps.map((s, i) => {
                                const done = completedSteps.includes(i)
                                const active = i === currentStep
                                return (
                                    <button
                                        key={i}
                                        onClick={() => { setCurrentStep(i); setStepCompleted(done); setShowHint(false) }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 flex items-start gap-2.5 cursor-pointer border-0 transition-all text-sm ${active ? 'bg-neon-cyan/10 text-nebula-text' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/30'
                                            }`}
                                        style={{ background: active ? 'rgba(0, 212, 255, 0.08)' : undefined }}
                                    >
                                        {done ? (
                                            <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0 mt-0.5" />
                                        ) : (
                                            <Circle className={`w-4 h-4 shrink-0 mt-0.5 ${active ? 'text-neon-cyan' : 'text-nebula-dim'}`} />
                                        )}
                                        <span className="line-clamp-2 text-xs">{s.instruction}</span>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Main area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Task instruction bar */}
                    <div className="px-4 py-3 border-b border-nebula-border" style={{ background: 'rgba(20, 26, 58, 0.5)' }}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <BookOpen className="w-4 h-4 text-neon-cyan shrink-0" />
                                    <span className="text-xs font-semibold text-neon-cyan">Task {currentStep + 1}</span>
                                </div>
                                <p className="text-sm text-nebula-text leading-relaxed">{step?.instruction}</p>
                                {step && (
                                    <p className="text-[11px] text-nebula-dim mt-1 font-mono">Expected: <code className="text-nebula-muted">{step.expectedCommand}</code></p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="text-xs text-nebula-muted hover:text-neon-amber flex items-center gap-1 cursor-pointer bg-transparent border-0"
                                >
                                    <Lightbulb className="w-3.5 h-3.5" /> Hint
                                </button>
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="text-xs text-nebula-muted hover:text-nebula-text cursor-pointer bg-transparent border-0"
                                >
                                    {sidebarOpen ? '◀' : '▶'} Steps
                                </button>
                            </div>
                        </div>
                        <AnimatePresence>
                            {showHint && step && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-2 px-3 py-2 rounded-lg bg-neon-amber/5 border border-neon-amber/15 text-xs text-neon-amber/80"
                                >
                                    💡 {step.hint}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Terminal */}
                    <div
                        ref={containerRef}
                        className="flex-1 overflow-y-auto p-4 cursor-text min-h-0"
                        style={{ fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace', fontSize: '13px', lineHeight: '1.6', background: '#0a0e1a' }}
                        onClick={() => inputRef.current?.focus()}
                    >
                        {lines.map((line, i) => (
                            <div key={i} className="whitespace-pre-wrap break-all">
                                {line.type === 'system' && <span className="text-neon-cyan/70">{line.text}</span>}
                                {line.type === 'prompt' && (
                                    <span>
                                        <span className="text-neon-emerald">{line.text}</span>
                                        <span className="text-nebula-text">{line.cmd}</span>
                                    </span>
                                )}
                                {line.type === 'output' && <span className="text-nebula-text/90">{line.text}</span>}
                                {line.type === 'error' && <span className="text-neon-rose">{line.text}</span>}
                                {line.type === 'success' && <span className="text-neon-emerald font-semibold">{line.text}</span>}
                                {line.type === 'hint' && <span className="text-neon-amber/80">{line.text}</span>}
                            </div>
                        ))}

                        {/* Step completion */}
                        {stepCompleted && !lessonComplete && (
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                                <button
                                    onClick={nextStep}
                                    className="px-4 py-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan text-sm font-medium cursor-pointer hover:bg-neon-cyan/20 transition-colors flex items-center gap-2"
                                >
                                    Next Step <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}

                        {/* Lesson complete */}
                        {lessonComplete && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-4 p-4 rounded-xl bg-neon-emerald/10 border border-neon-emerald/25"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy className="w-5 h-5 text-neon-amber" />
                                    <span className="text-base font-bold text-nebula-text">Lesson Complete!</span>
                                </div>
                                <p className="text-sm text-nebula-muted mb-3">
                                    You've completed all {lesson.steps.length} steps in "{lesson.title}".
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedLesson(null)}
                                        className="px-4 py-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan text-sm font-medium cursor-pointer hover:bg-neon-cyan/20 transition-colors"
                                    >
                                        Back to Lessons
                                    </button>
                                    <button
                                        onClick={resetLesson}
                                        className="px-4 py-2 rounded-lg bg-nebula-surface border border-nebula-border text-nebula-muted text-sm cursor-pointer hover:text-nebula-text transition-colors"
                                    >
                                        Retry Lesson
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Input */}
                        {!lessonComplete && (
                            <form onSubmit={handleSubmit} className="flex items-start mt-1">
                                <span className="text-neon-emerald shrink-0">$ </span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 bg-transparent border-0 outline-none text-nebula-text caret-neon-cyan"
                                    style={{ fontSize: '13px', fontFamily: 'inherit', lineHeight: '1.6' }}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    placeholder="Type a gcloud command..."
                                />
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
