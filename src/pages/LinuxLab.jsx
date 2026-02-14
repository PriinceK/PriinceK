import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Terminal as TermIcon, BookOpen, ChevronRight, ChevronDown,
  CheckCircle2, Circle, Lock, Star, Cloud, Lightbulb, X, RotateCcw,
  Trophy, Zap, Target, HelpCircle, ChevronLeft
} from 'lucide-react'
import Terminal from '../components/Terminal'
import { VirtualFS } from '../utils/virtualFS'
import { VirtualNetwork } from '../utils/virtualNetwork'
import { ShellInterpreter } from '../utils/shellInterpreter'
import { LINUX_LESSONS } from '../data/linuxLessons'

const DIFFICULTY_COLORS = {
  Beginner: { bg: 'bg-neon-emerald/10', text: 'text-neon-emerald', border: 'border-neon-emerald/20' },
  Intermediate: { bg: 'bg-neon-amber/10', text: 'text-neon-amber', border: 'border-neon-amber/20' },
  Advanced: { bg: 'bg-neon-rose/10', text: 'text-neon-rose', border: 'border-neon-rose/20' },
}

const CATEGORY_LABELS = {
  navigation: 'Navigation',
  files: 'Files & Dirs',
  'text-processing': 'Text Processing',
  permissions: 'Permissions',
  processes: 'Processes',
  system: 'System Admin',
  'shell-scripting': 'Shell Scripting',
  troubleshooting: 'Troubleshooting',
  'cloud-ops': 'Cloud Ops',
}

function getProgress() {
  try { return JSON.parse(localStorage.getItem('linux-lab-progress') || '{}') } catch { return {} }
}
function saveProgress(p) { localStorage.setItem('linux-lab-progress', JSON.stringify(p)) }

export default function LinuxLab() {
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0)
  const [taskStatus, setTaskStatus] = useState({}) // { taskId: 'completed' | 'failed' }
  const [showHint, setShowHint] = useState(false)
  const [showCloud, setShowCloud] = useState(false)
  const [showRef, setShowRef] = useState(true)
  const [progress, setProgress] = useState(getProgress)
  const [expandedLevels, setExpandedLevels] = useState({ 1: true })
  const [lessonComplete, setLessonComplete] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Shell instances
  const fsRef = useRef(null)
  const netRef = useRef(null)
  const shellRef = useRef(null)

  // Initialize shell
  useEffect(() => {
    fsRef.current = new VirtualFS()
    netRef.current = new VirtualNetwork()
    shellRef.current = new ShellInterpreter(fsRef.current, netRef.current)
  }, [])

  // Reset shell when lesson changes
  useEffect(() => {
    if (selectedLesson && fsRef.current) {
      fsRef.current.resetToLesson(selectedLesson.setupFS)
      if (netRef.current && selectedLesson.setupNet) {
        netRef.current.resetToLesson(selectedLesson.setupNet)
      }
      shellRef.current = new ShellInterpreter(fsRef.current, netRef.current)
      setCurrentTaskIdx(0)
      setTaskStatus({})
      setShowHint(false)
      setShowCloud(false)
      setLessonComplete(false)
    }
  }, [selectedLesson?.id])

  const currentTask = selectedLesson?.tasks?.[currentTaskIdx]

  // Group lessons by level
  const lessonsByLevel = useMemo(() => {
    const grouped = {}
    LINUX_LESSONS.forEach((l) => {
      if (!grouped[l.level]) grouped[l.level] = []
      grouped[l.level].push(l)
    })
    return grouped
  }, [])

  // Calculate completion stats
  const stats = useMemo(() => {
    const total = LINUX_LESSONS.length
    const completed = Object.values(progress).filter((v) => v === 'completed').length
    return { total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }, [progress])

  function isLevelUnlocked(level) {
    if (level <= 1) return true
    const prevLessons = LINUX_LESSONS.filter((l) => l.level < level)
    const completedPrev = prevLessons.filter((l) => progress[l.id] === 'completed').length
    return completedPrev >= prevLessons.length * 0.5 // 50% of previous levels completed unlocks next
  }

  function handleCommand(cmd, output) {
    if (!currentTask || taskStatus[currentTask.id] === 'completed') return

    const validation = currentTask.validation
    let passed = false

    switch (validation.type) {
      case 'command':
        passed = cmd.trim() === validation.check || cmd.trim().startsWith(validation.check)
        break
      case 'command_contains':
        passed = cmd.includes(validation.check)
        break
      case 'output_contains':
        passed = output?.includes(validation.check)
        break
      case 'file_exists':
        passed = fsRef.current?.exists(validation.check)
        break
      case 'file_contains': {
        const file = fsRef.current?.readFile(validation.check.path || validation.check)
        passed = file?.content?.includes(validation.check.content || validation.check)
        break
      }
      case 'cwd':
        passed = fsRef.current?.cwd === validation.check || fsRef.current?.cwd.endsWith(validation.check)
        break
      case 'permission': {
        const stat = fsRef.current?.stat(validation.check.path)
        passed = stat && stat.permOctal.toString(8) === String(validation.check.mode)
        break
      }
      default:
        passed = cmd.includes(validation.check)
    }

    if (passed) {
      setTaskStatus((prev) => ({ ...prev, [currentTask.id]: 'completed' }))
      // Check if all tasks are done
      const allDone = selectedLesson.tasks.every((t, i) =>
        i === currentTaskIdx ? true : taskStatus[t.id] === 'completed'
      )
      if (allDone) {
        setLessonComplete(true)
        const newProgress = { ...progress, [selectedLesson.id]: 'completed' }
        setProgress(newProgress)
        saveProgress(newProgress)
      } else if (currentTaskIdx < selectedLesson.tasks.length - 1) {
        setTimeout(() => setCurrentTaskIdx((i) => i + 1), 800)
      }
      setShowHint(false)
    }
  }

  function resetLesson() {
    if (!selectedLesson) return
    fsRef.current.resetToLesson(selectedLesson.setupFS)
    if (netRef.current && selectedLesson.setupNet) {
      netRef.current.resetToLesson(selectedLesson.setupNet)
    }
    shellRef.current = new ShellInterpreter(fsRef.current, netRef.current)
    setCurrentTaskIdx(0)
    setTaskStatus({})
    setLessonComplete(false)
    setShowHint(false)
  }

  // --- LESSON SELECTION VIEW ---
  if (!selectedLesson) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/" className="text-nebula-muted hover:text-nebula-text no-underline">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-neon-emerald/10 flex items-center justify-center border border-neon-emerald/20">
              <TermIcon className="w-5 h-5 text-neon-emerald" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Linux Fundamentals Lab</h1>
              <p className="text-sm text-nebula-muted">Master Linux commands through hands-on missions in an interactive terminal</p>
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="glass-card-static rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-neon-amber" />
              <span className="text-sm font-semibold text-nebula-text">Your Progress</span>
            </div>
            <span className="text-xs text-nebula-muted" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {stats.completed}/{stats.total} missions completed
            </span>
          </div>
          <div className="h-2 bg-nebula-deep rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #00d4ff, #10b981)', width: `${stats.pct}%` }}
              initial={{ width: 0 }} animate={{ width: `${stats.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Levels */}
        <div className="space-y-4">
          {Object.entries(lessonsByLevel).map(([level, lessons]) => {
            const isUnlocked = isLevelUnlocked(parseInt(level))
            const isExpanded = expandedLevels[level] !== false
            const levelCompleted = lessons.every((l) => progress[l.id] === 'completed')
            const levelProgress = lessons.filter((l) => progress[l.id] === 'completed').length

            return (
              <motion.div key={level} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: parseInt(level) * 0.05 }}>
                <button onClick={() => setExpandedLevels((prev) => ({ ...prev, [level]: !prev[level] }))}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                    isUnlocked
                      ? 'border-nebula-border hover:border-nebula-border-bright bg-nebula-surface/30'
                      : 'border-nebula-border/50 bg-nebula-surface/10 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    levelCompleted ? 'bg-neon-emerald/15 text-neon-emerald border border-neon-emerald/20'
                      : isUnlocked ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                      : 'bg-nebula-deep text-nebula-dim border border-nebula-border'
                  }`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {levelCompleted ? <CheckCircle2 className="w-5 h-5" /> : isUnlocked ? level : <Lock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-semibold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                      Level {level}
                    </h3>
                    <p className="text-xs text-nebula-muted">{lessons.length} mission{lessons.length !== 1 ? 's' : ''} — {levelProgress}/{lessons.length} completed</p>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-nebula-dim" /> : <ChevronRight className="w-4 h-4 text-nebula-dim" />}
                </button>

                <AnimatePresence>
                  {isExpanded && isUnlocked && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 pl-13">
                        {lessons.map((lesson) => {
                          const dc = DIFFICULTY_COLORS[lesson.difficulty]
                          const isComplete = progress[lesson.id] === 'completed'
                          return (
                            <button key={lesson.id} onClick={() => setSelectedLesson(lesson)}
                              className="text-left p-4 rounded-xl border border-nebula-border hover:border-nebula-border-bright bg-nebula-surface/20 hover:bg-nebula-surface/40 transition-all cursor-pointer group">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${dc.bg} ${dc.text} ${dc.border}`}
                                  style={{ fontFamily: 'JetBrains Mono, monospace' }}>{lesson.difficulty}</span>
                                {isComplete && <CheckCircle2 className="w-3.5 h-3.5 text-neon-emerald ml-auto" />}
                              </div>
                              <h4 className="text-sm font-semibold text-nebula-text mb-1 group-hover:text-neon-cyan transition-colors"
                                style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{lesson.title}</h4>
                              <p className="text-xs text-nebula-muted leading-relaxed line-clamp-2">{lesson.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-nebula-deep text-nebula-dim border border-nebula-border"
                                  style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                                  {CATEGORY_LABELS[lesson.category] || lesson.category}
                                </span>
                                <span className="text-[10px] text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                                  {lesson.tasks.length} tasks
                                </span>
                              </div>
                            </button>
                          )
                        })}
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

  // --- LESSON/TERMINAL VIEW ---
  const allTasksDone = selectedLesson.tasks.every((t) => taskStatus[t.id] === 'completed')

  return (
    <div className="h-screen flex flex-col bg-nebula-deep">
      {/* Top bar */}
      <div className="h-11 border-b border-nebula-border flex items-center justify-between px-3 shrink-0 z-20"
        style={{ background: 'linear-gradient(180deg, rgba(6, 9, 24, 0.97) 0%, rgba(12, 16, 36, 0.95) 100%)' }}>
        <div className="flex items-center gap-2">
          <button onClick={() => setSelectedLesson(null)}
            className="text-nebula-muted hover:text-nebula-text transition-colors bg-transparent border-0 cursor-pointer p-1">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-nebula-border" />
          <TermIcon className="w-4 h-4 text-neon-emerald" />
          <span className="text-sm font-semibold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
            {selectedLesson.title}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${DIFFICULTY_COLORS[selectedLesson.difficulty].bg} ${DIFFICULTY_COLORS[selectedLesson.difficulty].text} ${DIFFICULTY_COLORS[selectedLesson.difficulty].border}`}
            style={{ fontFamily: 'JetBrains Mono, monospace' }}>{selectedLesson.difficulty}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowCloud(!showCloud)}
            className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1 transition-all cursor-pointer border-0 ${
              showCloud ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-nebula-muted hover:text-nebula-text bg-transparent'
            }`}>
            <Cloud className="w-3.5 h-3.5" /> Cloud Link
          </button>
          <button onClick={resetLesson}
            className="px-2.5 py-1 rounded-md text-xs flex items-center gap-1 text-nebula-muted hover:text-neon-amber transition-all cursor-pointer bg-transparent border-0">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel — Mission briefing & tasks */}
        {!sidebarCollapsed && (
          <div className="w-80 border-r border-nebula-border flex flex-col shrink-0 overflow-y-auto"
            style={{ background: 'rgba(6, 9, 24, 0.95)' }}>
            {/* Briefing */}
            <div className="p-4 border-b border-nebula-border">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-neon-cyan" />
                <h3 className="text-xs font-semibold text-nebula-text">Mission Briefing</h3>
              </div>
              <p className="text-xs text-nebula-muted leading-relaxed whitespace-pre-line">{selectedLesson.briefing}</p>
            </div>

            {/* Cloud Connection */}
            <AnimatePresence>
              {showCloud && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} className="border-b border-nebula-border overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="w-4 h-4 text-neon-cyan" />
                      <h3 className="text-xs font-semibold text-nebula-text">Cloud Engineering Connection</h3>
                    </div>
                    <p className="text-xs text-neon-cyan/70 leading-relaxed whitespace-pre-line">{selectedLesson.cloudConnection}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tasks */}
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-neon-amber" />
                <h3 className="text-xs font-semibold text-nebula-text">Tasks</h3>
                <span className="text-[10px] text-nebula-dim ml-auto" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {Object.values(taskStatus).filter((v) => v === 'completed').length}/{selectedLesson.tasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {selectedLesson.tasks.map((task, idx) => {
                  const status = taskStatus[task.id]
                  const isCurrent = idx === currentTaskIdx && !allTasksDone
                  return (
                    <div key={task.id}
                      className={`p-3 rounded-lg border transition-all ${
                        status === 'completed' ? 'border-neon-emerald/30 bg-neon-emerald/5'
                          : isCurrent ? 'border-neon-cyan/40 bg-neon-cyan/5'
                          : 'border-nebula-border bg-nebula-surface/20 opacity-50'
                      }`}>
                      <div className="flex items-start gap-2">
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0 mt-0.5" />
                        ) : isCurrent ? (
                          <Zap className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-nebula-dim shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-nebula-text leading-relaxed">{task.instruction}</p>
                          {status === 'completed' && task.successMessage && (
                            <p className="text-[10px] text-neon-emerald mt-1">{task.successMessage}</p>
                          )}
                        </div>
                      </div>
                      {isCurrent && !status && (
                        <button onClick={() => setShowHint(!showHint)}
                          className="flex items-center gap-1 mt-2 text-[10px] text-nebula-dim hover:text-neon-amber transition-colors bg-transparent border-0 cursor-pointer">
                          <HelpCircle className="w-3 h-3" /> {showHint ? 'Hide hint' : 'Show hint'}
                        </button>
                      )}
                      {isCurrent && showHint && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          className="text-[10px] text-neon-amber/70 mt-1 pl-6 leading-relaxed">
                          {task.hint}
                        </motion.p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Lesson complete */}
              {allTasksDone && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 rounded-xl border border-neon-emerald/30 bg-neon-emerald/5 text-center">
                  <Trophy className="w-8 h-8 text-neon-amber mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-neon-emerald mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Mission Complete!</h4>
                  <p className="text-xs text-nebula-muted mb-3">All tasks completed successfully.</p>
                  <button onClick={() => setSelectedLesson(null)}
                    className="px-4 py-1.5 rounded-lg bg-neon-emerald/10 border border-neon-emerald/30 text-neon-emerald text-xs cursor-pointer hover:bg-neon-emerald/20 transition-colors">
                    Back to Missions
                  </button>
                </motion.div>
              )}
            </div>

            {/* Quick reference */}
            {selectedLesson.quickReference?.length > 0 && (
              <div className="border-t border-nebula-border p-4">
                <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setShowRef(!showRef)}>
                  <Lightbulb className="w-3.5 h-3.5 text-neon-amber" />
                  <span className="text-xs font-semibold text-nebula-text">Quick Reference</span>
                  {showRef ? <ChevronDown className="w-3 h-3 text-nebula-dim ml-auto" /> : <ChevronRight className="w-3 h-3 text-nebula-dim ml-auto" />}
                </div>
                {showRef && (
                  <div className="space-y-1">
                    {selectedLesson.quickReference.map((ref, i) => (
                      <div key={i} className="flex gap-2 text-[10px]">
                        <code className="text-neon-cyan shrink-0 font-mono">{ref.cmd}</code>
                        <span className="text-nebula-dim">{ref.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Collapse toggle */}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-5 border-r border-nebula-border flex items-center justify-center text-nebula-dim hover:text-nebula-text bg-nebula-deep hover:bg-nebula-surface/30 transition-colors cursor-pointer shrink-0 border-0 border-r"
          style={{ borderRight: '1px solid var(--nebula-border, rgba(30, 35, 60, 0.8))' }}>
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Terminal */}
        <div className="flex-1 flex flex-col p-3 min-w-0">
          {shellRef.current && (
            <Terminal
              shell={shellRef.current}
              onCommand={handleCommand}
              className="flex-1"
            />
          )}
        </div>
      </div>
    </div>
  )
}
