import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, CheckCircle2, Circle, ChevronRight, ChevronDown,
    Trophy, BookOpen, Lightbulb, RotateCcw, Clock, Layers,
    Terminal, Copy, Check,
} from 'lucide-react'
import { PROJECTS } from '../data/projects'
import { executeGcloudCommand } from '../utils/gcloudInterpreter'

const PROGRESS_KEY = 'gcp-project-mode-progress'
const getProgress = () => { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} } }
const saveProgress = (p) => localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))

const DIFF_COLORS = {
    Advanced: { bg: 'bg-neon-rose/10', text: 'text-neon-rose', border: 'border-neon-rose/20' },
    Expert: { bg: 'bg-neon-purple/10', text: 'text-neon-purple', border: 'border-neon-purple/20' },
}

export default function ProjectMode() {
    const [selectedProject, setSelectedProject] = useState(null)
    const [expandedPhase, setExpandedPhase] = useState(null)
    const [progress, setProgress] = useState(getProgress)
    const [copiedCmd, setCopiedCmd] = useState(null)
    const [termOutput, setTermOutput] = useState({})

    const project = selectedProject ? PROJECTS.find((p) => p.id === selectedProject) : null

    function selectProject(id) {
        setSelectedProject(id)
        const p = PROJECTS.find((pr) => pr.id === id)
        setExpandedPhase(p?.phases[0]?.id || null)
        setTermOutput({})
    }

    function toggleTask(projectId, phaseId, taskIdx) {
        const p = getProgress()
        const key = `${projectId}-${phaseId}-${taskIdx}`
        if (!p[projectId]) p[projectId] = { completedTasks: [] }
        if (p[projectId].completedTasks.includes(key)) {
            p[projectId].completedTasks = p[projectId].completedTasks.filter((t) => t !== key)
        } else {
            p[projectId].completedTasks.push(key)
        }
        saveProgress(p)
        setProgress(p)
    }

    function runCommand(phaseId, taskIdx, cmd) {
        const result = executeGcloudCommand(cmd)
        setTermOutput((prev) => ({ ...prev, [`${phaseId}-${taskIdx}`]: result.output }))
    }

    function copyCommand(cmd, key) {
        navigator.clipboard.writeText(cmd)
        setCopiedCmd(key)
        setTimeout(() => setCopiedCmd(null), 2000)
    }

    function resetProject() {
        const p = getProgress()
        delete p[selectedProject]
        saveProgress(p)
        setProgress(p)
        setTermOutput({})
    }

    // ─── Project List ───
    if (!selectedProject) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <Link to="/" className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 no-underline transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Dashboard
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center border border-neon-purple/20 glow-purple">
                        <Layers className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                            Project <span className="gradient-text-cyan">Mode</span>
                        </h1>
                        <p className="text-nebula-muted text-sm">Guided multi-step projects that chain GCP concepts together</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {PROJECTS.map((p) => {
                        const totalTasks = p.phases.reduce((acc, ph) => acc + ph.tasks.length, 0)
                        const completed = progress[p.id]?.completedTasks?.length || 0
                        const dc = DIFF_COLORS[p.difficulty] || DIFF_COLORS.Advanced
                        return (
                            <motion.button
                                key={p.id}
                                whileHover={{ y: -4 }}
                                onClick={() => selectProject(p.id)}
                                className="glass-card rounded-2xl p-6 text-left cursor-pointer border-0 w-full transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <span className="text-3xl">{p.icon}</span>
                                    {completed === totalTasks && completed > 0 && <Trophy className="w-5 h-5 text-neon-amber" />}
                                </div>
                                <h3 className="text-lg font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{p.title}</h3>
                                <p className="text-xs text-nebula-muted mb-4 leading-relaxed">{p.description}</p>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {p.tags.map((t) => (
                                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-nebula-surface text-nebula-dim border border-nebula-border">{t}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${dc.bg} ${dc.text} border ${dc.border}`}>{p.difficulty}</span>
                                        <span className="text-[10px] text-nebula-dim flex items-center gap-1"><Clock className="w-3 h-3" /> {p.estimatedTime}</span>
                                    </div>
                                    <span className="text-[10px] text-nebula-dim font-mono">{completed}/{totalTasks}</span>
                                </div>
                                {completed > 0 && (
                                    <div className="mt-3 w-full h-1 rounded-full bg-nebula-deep overflow-hidden">
                                        <div className="h-full rounded-full bg-neon-purple" style={{ width: `${(completed / totalTasks) * 100}%` }} />
                                    </div>
                                )}
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        )
    }

    // ─── Project Detail ───
    const totalTasks = project.phases.reduce((acc, ph) => acc + ph.tasks.length, 0)
    const completedTasks = progress[selectedProject]?.completedTasks || []

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <button onClick={() => setSelectedProject(null)} className="inline-flex items-center gap-2 text-nebula-muted hover:text-neon-cyan text-sm mb-6 cursor-pointer bg-transparent border-0 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
            </button>

            {/* Header */}
            <div className="glass-card-static rounded-2xl p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <span className="text-3xl">{project.icon}</span>
                        <div>
                            <h1 className="text-2xl font-extrabold text-nebula-text mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{project.title}</h1>
                            <p className="text-sm text-nebula-muted">{project.description}</p>
                        </div>
                    </div>
                    <button onClick={resetProject} className="text-nebula-dim hover:text-nebula-muted text-xs flex items-center gap-1 cursor-pointer bg-transparent border-0 shrink-0">
                        <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-nebula-deep overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #00d4ff)', width: `${(completedTasks.length / totalTasks) * 100}%` }} />
                    </div>
                    <span className="text-xs text-nebula-muted font-mono">{completedTasks.length}/{totalTasks}</span>
                </div>
            </div>

            {/* Phases */}
            <div className="space-y-3">
                {project.phases.map((phase, phaseIdx) => {
                    const isExpanded = expandedPhase === phase.id
                    const phaseCompletedCount = phase.tasks.filter((_, ti) => completedTasks.includes(`${selectedProject}-${phase.id}-${ti}`)).length
                    const phaseComplete = phaseCompletedCount === phase.tasks.length

                    return (
                        <div key={phase.id} className={`glass-card-static rounded-xl overflow-hidden transition-all ${phaseComplete ? 'border-neon-emerald/20' : ''}`}>
                            <button
                                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                                className="w-full px-5 py-4 flex items-center justify-between cursor-pointer bg-transparent border-0 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    {phaseComplete ? (
                                        <CheckCircle2 className="w-5 h-5 text-neon-emerald" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-nebula-dim flex items-center justify-center text-[10px] text-nebula-dim font-bold">
                                            {phaseIdx + 1}
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-sm font-bold text-nebula-text">{phase.title}</span>
                                        <span className="text-[10px] text-nebula-dim ml-2">{phaseCompletedCount}/{phase.tasks.length}</span>
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-nebula-dim transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <div className="px-5 pb-5 border-t border-nebula-border pt-4">
                                            <p className="text-xs text-nebula-muted mb-3">{phase.description}</p>

                                            <div className="space-y-3">
                                                {phase.tasks.map((task, taskIdx) => {
                                                    const taskKey = `${selectedProject}-${phase.id}-${taskIdx}`
                                                    const isDone = completedTasks.includes(taskKey)
                                                    const outputKey = `${phase.id}-${taskIdx}`

                                                    return (
                                                        <div key={taskIdx} className={`rounded-lg p-3 transition-all ${isDone ? 'bg-neon-emerald/5 border border-neon-emerald/15' : 'bg-nebula-surface/30 border border-nebula-border'}`}>
                                                            <div className="flex items-start gap-2">
                                                                <button
                                                                    onClick={() => toggleTask(selectedProject, phase.id, taskIdx)}
                                                                    className="mt-0.5 cursor-pointer bg-transparent border-0 shrink-0"
                                                                >
                                                                    {isDone ? <CheckCircle2 className="w-4 h-4 text-neon-emerald" /> : <Circle className="w-4 h-4 text-nebula-dim" />}
                                                                </button>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm ${isDone ? 'text-nebula-muted line-through' : 'text-nebula-text'}`}>{task.instruction}</p>

                                                                    {/* Command block */}
                                                                    <div className="mt-2 rounded-lg bg-[#0a0e1a] overflow-hidden">
                                                                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-nebula-border/50">
                                                                            <code className="text-[11px] text-neon-cyan font-mono">$ {task.command}</code>
                                                                            <div className="flex items-center gap-1">
                                                                                <button
                                                                                    onClick={() => copyCommand(task.command, taskKey)}
                                                                                    className="text-nebula-dim hover:text-nebula-muted cursor-pointer bg-transparent border-0 p-1"
                                                                                    title="Copy command"
                                                                                >
                                                                                    {copiedCmd === taskKey ? <Check className="w-3 h-3 text-neon-emerald" /> : <Copy className="w-3 h-3" />}
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => runCommand(phase.id, taskIdx, task.command)}
                                                                                    className="text-[10px] text-neon-cyan hover:text-neon-cyan/80 cursor-pointer bg-transparent border-0 px-1.5 py-0.5 rounded bg-neon-cyan/10"
                                                                                >
                                                                                    ▶ Run
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        {termOutput[outputKey] && (
                                                                            <pre className="px-3 py-2 text-[11px] text-nebula-text/80 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                                                                                {termOutput[outputKey]}
                                                                            </pre>
                                                                        )}
                                                                    </div>

                                                                    {/* Hint */}
                                                                    <p className="text-[10px] text-nebula-dim mt-1.5">💡 {task.hint}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>

            {/* Completion */}
            {completedTasks.length === totalTasks && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-card-static rounded-2xl p-6 border-neon-amber/20 text-center">
                    <Trophy className="w-10 h-10 text-neon-amber mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Project Complete! 🎉</h3>
                    <p className="text-sm text-nebula-muted mb-4">You've successfully completed all {totalTasks} tasks in "{project.title}".</p>
                    <button onClick={() => setSelectedProject(null)} className="btn-neon px-6 py-2.5 rounded-xl text-sm">
                        Back to Projects
                    </button>
                </motion.div>
            )}
        </div>
    )
}
