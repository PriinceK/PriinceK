import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Terminal as TermIcon, BookOpen, ChevronRight, ChevronDown,
  CheckCircle2, Circle, Lock, Star, Cloud, Lightbulb, X, RotateCcw,
  Trophy, Zap, Target, HelpCircle, ChevronLeft, Network, Globe,
  Server, Shield, Monitor, Router
} from 'lucide-react'
import Terminal from '../components/Terminal'
import { VirtualFS } from '../utils/virtualFS'
import { VirtualNetwork } from '../utils/virtualNetwork'
import { ShellInterpreter } from '../utils/shellInterpreter'
import { NETWORK_LESSONS } from '../data/networkLessons'

const DIFFICULTY_COLORS = {
  Beginner: { bg: 'bg-neon-emerald/10', text: 'text-neon-emerald', border: 'border-neon-emerald/20' },
  Intermediate: { bg: 'bg-neon-amber/10', text: 'text-neon-amber', border: 'border-neon-amber/20' },
  Advanced: { bg: 'bg-neon-rose/10', text: 'text-neon-rose', border: 'border-neon-rose/20' },
}

const CATEGORY_LABELS = {
  fundamentals: 'Fundamentals',
  'ip-addressing': 'IP Addressing',
  dns: 'DNS',
  routing: 'Routing',
  'tcp-udp': 'TCP/UDP',
  firewalls: 'Firewalls',
  diagnostics: 'Diagnostics',
  'cloud-networking': 'Cloud Networking',
}

const TOPO_ICONS = {
  server: Server,
  router: Router,
  firewall: Shield,
  cloud: Cloud,
  client: Monitor,
}

const TOPO_COLORS = {
  server: '#4285f4',
  router: '#ea4335',
  firewall: '#fbbc04',
  cloud: '#00d4ff',
  client: '#34a853',
}

function getProgress() {
  try { return JSON.parse(localStorage.getItem('network-lab-progress') || '{}') } catch { return {} }
}
function saveProgress(p) { localStorage.setItem('network-lab-progress', JSON.stringify(p)) }

function TopologyViewer({ topology }) {
  if (!topology?.nodes?.length) return null

  // Simple auto-layout
  const nodePositions = useMemo(() => {
    const positions = {}
    const nodes = topology.nodes
    const cols = Math.ceil(Math.sqrt(nodes.length))
    nodes.forEach((node, i) => {
      const row = Math.floor(i / cols)
      const col = i % cols
      const totalCols = Math.min(cols, nodes.length - row * cols)
      const xOffset = (cols - totalCols) * 60
      positions[node.id] = {
        x: xOffset + col * 120 + 60,
        y: row * 100 + 40,
      }
    })
    return positions
  }, [topology])

  const width = 500
  const height = Math.ceil(topology.nodes.length / Math.ceil(Math.sqrt(topology.nodes.length))) * 100 + 60

  return (
    <div className="bg-nebula-deep/60 rounded-lg border border-nebula-border p-2 overflow-hidden">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Connections */}
        {topology.connections?.map((conn, i) => {
          const from = nodePositions[conn.from]
          const to = nodePositions[conn.to]
          if (!from || !to) return null
          const midX = (from.x + to.x) / 2
          const midY = (from.y + to.y) / 2
          return (
            <g key={i}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1.5" strokeDasharray="4,3" />
              {conn.label && (
                <text x={midX} y={midY - 6} textAnchor="middle" fill="#4b5178" fontSize="8"
                  fontFamily="JetBrains Mono, monospace">{conn.label}</text>
              )}
            </g>
          )
        })}
        {/* Nodes */}
        {topology.nodes.map((node) => {
          const pos = nodePositions[node.id]
          if (!pos) return null
          const color = TOPO_COLORS[node.type] || '#00d4ff'
          return (
            <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
              <rect x={-40} y={-20} width={80} height={40} rx={8}
                fill={color + '10'} stroke={color + '40'} strokeWidth="1" />
              <text x={0} y={-4} textAnchor="middle" fill={color} fontSize="9" fontWeight="600"
                fontFamily="JetBrains Mono, monospace">{node.label}</text>
              <text x={0} y={10} textAnchor="middle" fill="#7b83a6" fontSize="7"
                fontFamily="JetBrains Mono, monospace">{node.ip}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function NetworkLab() {
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [currentTaskIdx, setCurrentTaskIdx] = useState(0)
  const [taskStatus, setTaskStatus] = useState({})
  const [showHint, setShowHint] = useState(false)
  const [showCloud, setShowCloud] = useState(false)
  const [showRef, setShowRef] = useState(true)
  const [progress, setProgress] = useState(getProgress)
  const [expandedLevels, setExpandedLevels] = useState({ 1: true })
  const [lessonComplete, setLessonComplete] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showTopology, setShowTopology] = useState(true)

  const fsRef = useRef(null)
  const netRef = useRef(null)
  const shellRef = useRef(null)

  useEffect(() => {
    fsRef.current = new VirtualFS()
    netRef.current = new VirtualNetwork()
    shellRef.current = new ShellInterpreter(fsRef.current, netRef.current)
  }, [])

  useEffect(() => {
    if (selectedLesson && fsRef.current) {
      fsRef.current.resetToLesson(selectedLesson.setupFS)
      if (netRef.current) {
        netRef.current.resetToLesson(selectedLesson.setupNet)
      }
      shellRef.current = new ShellInterpreter(fsRef.current, netRef.current)
      setCurrentTaskIdx(0)
      setTaskStatus({})
      setShowHint(false)
      setShowCloud(false)
      setLessonComplete(false)
      setShowTopology(!!selectedLesson.topology?.nodes?.length)
    }
  }, [selectedLesson?.id])

  const currentTask = selectedLesson?.tasks?.[currentTaskIdx]

  const lessonsByLevel = useMemo(() => {
    const grouped = {}
    NETWORK_LESSONS.forEach((l) => {
      if (!grouped[l.level]) grouped[l.level] = []
      grouped[l.level].push(l)
    })
    return grouped
  }, [])

  const stats = useMemo(() => {
    const total = NETWORK_LESSONS.length
    const completed = Object.values(progress).filter((v) => v === 'completed').length
    return { total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }, [progress])

  function isLevelUnlocked(level) {
    if (level <= 1) return true
    const prevLessons = NETWORK_LESSONS.filter((l) => l.level < level)
    const completedPrev = prevLessons.filter((l) => progress[l.id] === 'completed').length
    return completedPrev >= prevLessons.length * 0.5
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
      default:
        passed = cmd.includes(validation.check)
    }

    if (passed) {
      setTaskStatus((prev) => ({ ...prev, [currentTask.id]: 'completed' }))
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
    if (netRef.current) netRef.current.resetToLesson(selectedLesson.setupNet)
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
            <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center border border-neon-purple/20">
              <Network className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Networking Fundamentals Lab</h1>
              <p className="text-sm text-nebula-muted">Master networking through hands-on diagnostics in an interactive terminal</p>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
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
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #a855f7, #6366f1)', width: `${stats.pct}%` }}
              initial={{ width: 0 }} animate={{ width: `${stats.pct}%` }} transition={{ duration: 0.8 }}
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
                    isUnlocked ? 'border-nebula-border hover:border-nebula-border-bright bg-nebula-surface/30'
                      : 'border-nebula-border/50 bg-nebula-surface/10 opacity-60'
                  }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    levelCompleted ? 'bg-neon-emerald/15 text-neon-emerald border border-neon-emerald/20'
                      : isUnlocked ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
                      : 'bg-nebula-deep text-nebula-dim border border-nebula-border'
                  }`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {levelCompleted ? <CheckCircle2 className="w-5 h-5" /> : isUnlocked ? level : <Lock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-semibold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Level {level}</h3>
                    <p className="text-xs text-nebula-muted">{lessons.length} mission{lessons.length !== 1 ? 's' : ''} — {levelProgress}/{lessons.length} completed</p>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-nebula-dim" /> : <ChevronRight className="w-4 h-4 text-nebula-dim" />}
                </button>

                <AnimatePresence>
                  {isExpanded && isUnlocked && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">
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
                              <h4 className="text-sm font-semibold text-nebula-text mb-1 group-hover:text-neon-purple transition-colors"
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
            className="text-nebula-muted hover:text-nebula-text bg-transparent border-0 cursor-pointer p-1">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-nebula-border" />
          <Network className="w-4 h-4 text-neon-purple" />
          <span className="text-sm font-semibold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
            {selectedLesson.title}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${DIFFICULTY_COLORS[selectedLesson.difficulty].bg} ${DIFFICULTY_COLORS[selectedLesson.difficulty].text} ${DIFFICULTY_COLORS[selectedLesson.difficulty].border}`}
            style={{ fontFamily: 'JetBrains Mono, monospace' }}>{selectedLesson.difficulty}</span>
        </div>
        <div className="flex items-center gap-1">
          {selectedLesson.topology?.nodes?.length > 0 && (
            <button onClick={() => setShowTopology(!showTopology)}
              className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1 transition-all cursor-pointer border-0 ${
                showTopology ? 'bg-neon-purple/10 text-neon-purple' : 'text-nebula-muted hover:text-nebula-text bg-transparent'
              }`}>
              <Globe className="w-3.5 h-3.5" /> Topology
            </button>
          )}
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
        {/* Left panel */}
        {!sidebarCollapsed && (
          <div className="w-80 border-r border-nebula-border flex flex-col shrink-0 overflow-y-auto"
            style={{ background: 'rgba(6, 9, 24, 0.95)' }}>
            {/* Topology */}
            {showTopology && selectedLesson.topology?.nodes?.length > 0 && (
              <div className="p-3 border-b border-nebula-border">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-3.5 h-3.5 text-neon-purple" />
                  <span className="text-xs font-semibold text-nebula-text">Network Topology</span>
                </div>
                <TopologyViewer topology={selectedLesson.topology} />
              </div>
            )}

            {/* Briefing */}
            <div className="p-4 border-b border-nebula-border">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-neon-purple" />
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
                          : isCurrent ? 'border-neon-purple/40 bg-neon-purple/5'
                          : 'border-nebula-border bg-nebula-surface/20 opacity-50'
                      }`}>
                      <div className="flex items-start gap-2">
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0 mt-0.5" />
                        ) : isCurrent ? (
                          <Zap className="w-4 h-4 text-neon-purple shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-nebula-dim shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs text-nebula-text leading-relaxed">{task.instruction}</p>
                          {status === 'completed' && task.successMessage && (
                            <p className="text-[10px] text-neon-emerald mt-1">{task.successMessage}</p>
                          )}
                        </div>
                      </div>
                      {isCurrent && !status && (
                        <button onClick={() => setShowHint(!showHint)}
                          className="flex items-center gap-1 mt-2 text-[10px] text-nebula-dim hover:text-neon-amber bg-transparent border-0 cursor-pointer">
                          <HelpCircle className="w-3 h-3" /> {showHint ? 'Hide hint' : 'Show hint'}
                        </button>
                      )}
                      {isCurrent && showHint && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-[10px] text-neon-amber/70 mt-1 pl-6 leading-relaxed">{task.hint}</motion.p>
                      )}
                    </div>
                  )
                })}
              </div>

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
                        <code className="text-neon-purple shrink-0 font-mono">{ref.cmd}</code>
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
          className="w-5 flex items-center justify-center text-nebula-dim hover:text-nebula-text bg-nebula-deep hover:bg-nebula-surface/30 transition-colors cursor-pointer shrink-0 border-0"
          style={{ borderRight: '1px solid rgba(30, 35, 60, 0.8)' }}>
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Terminal */}
        <div className="flex-1 flex flex-col p-3 min-w-0">
          {shellRef.current && (
            <Terminal shell={shellRef.current} onCommand={handleCommand} className="flex-1" />
          )}
        </div>
      </div>
    </div>
  )
}
