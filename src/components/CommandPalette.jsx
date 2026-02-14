import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Command, Calendar, Trophy, Layout, BookOpen, Brain, RotateCcw, GraduationCap, GitCompareArrows, DollarSign, Terminal, Network, Award, ClipboardList, BarChart3, Wrench, Settings, StickyNote, Cloud, Target, Flame, History, Keyboard, X } from 'lucide-react'
import { GCP_SERVICES, GCP_SERVICE_CATEGORIES } from '../data/gcpServices'
import { DAILY_SCENARIOS } from '../data/scenarios'
import { CHALLENGES } from '../data/challenges'

const PAGES = [
  { path: '/', label: 'Dashboard', icon: Cloud, category: 'Pages' },
  { path: '/day-as', label: 'A Day As...', icon: Calendar, category: 'Pages' },
  { path: '/challenges', label: 'Architecture Challenges', icon: Trophy, category: 'Pages' },
  { path: '/canvas', label: 'Architecture Canvas', icon: Layout, category: 'Pages' },
  { path: '/services', label: 'Service Encyclopedia', icon: BookOpen, category: 'Pages' },
  { path: '/knowledge-map', label: 'Knowledge Map', icon: Brain, category: 'Pages' },
  { path: '/review', label: 'Review Cards', icon: RotateCcw, category: 'Pages' },
  { path: '/exam', label: 'Exam Simulator', icon: GraduationCap, category: 'Pages' },
  { path: '/compare', label: 'Compare Services', icon: GitCompareArrows, category: 'Pages' },
  { path: '/cost-labs', label: 'Cost Labs', icon: DollarSign, category: 'Pages' },
  { path: '/linux-lab', label: 'Linux Fundamentals', icon: Terminal, category: 'Pages' },
  { path: '/network-lab', label: 'Networking Lab', icon: Network, category: 'Pages' },
  { path: '/achievements', label: 'Achievements', icon: Award, category: 'Pages' },
  { path: '/study-plan', label: 'Study Planner', icon: ClipboardList, category: 'Pages' },
  { path: '/analytics', label: 'Performance Analytics', icon: BarChart3, category: 'Pages' },
  { path: '/scenario-builder', label: 'Scenario Builder', icon: Wrench, category: 'Pages' },
  { path: '/notes', label: 'Quick Notes', icon: StickyNote, category: 'Pages' },
  { path: '/settings', label: 'Settings', icon: Settings, category: 'Pages' },
  { path: '/learning-paths', label: 'Learning Paths', icon: Target, category: 'Pages' },
  { path: '/cheat-sheet', label: 'Command Cheat Sheet', icon: Terminal, category: 'Pages' },
  { path: '/daily-challenge', label: 'Daily Challenge', icon: Flame, category: 'Pages' },
  { path: '/exam/history', label: 'Exam History', icon: History, category: 'Pages' },
  { path: '/login', label: 'Login / Sign Up', icon: Cloud, category: 'Pages' },
]

function buildIndex() {
  const items = []

  // Pages
  for (const page of PAGES) {
    items.push({
      id: `page-${page.path}`,
      type: 'page',
      label: page.label,
      path: page.path,
      icon: page.icon,
      category: 'Pages',
      searchText: page.label.toLowerCase(),
    })
  }

  // GCP Services
  for (const service of GCP_SERVICES) {
    const cat = GCP_SERVICE_CATEGORIES[service.category]
    items.push({
      id: `service-${service.id}`,
      type: 'service',
      label: service.name,
      description: service.description,
      path: `/services/${service.id}`,
      icon: BookOpen,
      category: cat?.label || 'Services',
      color: cat?.color,
      searchText: `${service.name} ${service.description} ${service.category}`.toLowerCase(),
    })
  }

  // Scenarios
  for (const scenario of DAILY_SCENARIOS) {
    items.push({
      id: `scenario-${scenario.id}`,
      type: 'scenario',
      label: scenario.title,
      description: `${scenario.role} at ${scenario.company} - ${scenario.difficulty}`,
      path: `/day-as/${scenario.id}`,
      icon: Calendar,
      category: 'Scenarios',
      searchText: `${scenario.title} ${scenario.role} ${scenario.company} ${scenario.briefing}`.toLowerCase(),
    })
  }

  // Challenges
  for (const challenge of CHALLENGES) {
    items.push({
      id: `challenge-${challenge.id}`,
      type: 'challenge',
      label: challenge.title,
      description: `${challenge.difficulty} - ${challenge.category}`,
      path: `/challenges/${challenge.id}`,
      icon: Trophy,
      category: 'Challenges',
      searchText: `${challenge.title} ${challenge.category} ${challenge.description}`.toLowerCase(),
    })
  }

  return items
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  const index = useMemo(() => buildIndex(), [])

  const results = useMemo(() => {
    if (!query.trim()) {
      return PAGES.map((p) => ({
        id: `page-${p.path}`,
        type: 'page',
        label: p.label,
        path: p.path,
        icon: p.icon,
        category: 'Quick Navigation',
      }))
    }
    const q = query.toLowerCase().trim()
    const words = q.split(/\s+/)
    return index
      .filter((item) => words.every((w) => item.searchText.includes(w)))
      .slice(0, 15)
  }, [query, index])

  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  const handleOpen = useCallback(() => {
    setOpen(true)
    setQuery('')
    setSelectedIndex(0)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  const handleSelect = useCallback((item) => {
    handleClose()
    if (item.path) navigate(item.path)
  }, [navigate, handleClose])

  // Keyboard shortcut
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) handleClose()
        else handleOpen()
      }
      if (e.key === '?' && !open && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        setShowShortcuts((s) => !s)
      }
      if (e.key === 'Escape') {
        if (showShortcuts) setShowShortcuts(false)
        else if (open) handleClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, handleOpen, handleClose])

  // Arrow key navigation
  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        handleSelect(results[selectedIndex])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, results, selectedIndex, handleSelect])

  // Scroll selected into view
  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.children[selectedIndex]
      if (el) el.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  // Group results by category
  const grouped = useMemo(() => {
    const groups = {}
    for (const r of results) {
      const cat = r.category || 'Results'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(r)
    }
    return groups
  }, [results])

  const SHORTCUTS = [
    { keys: ['⌘', 'K'], desc: 'Open search / command palette' },
    { keys: ['?'], desc: 'Show this shortcuts overlay' },
    { keys: ['Esc'], desc: 'Close modal / overlay' },
    { keys: ['↑', '↓'], desc: 'Navigate search results' },
    { keys: ['↵'], desc: 'Select search result' },
  ]

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-nebula-dim hover:text-nebula-muted bg-nebula-surface/30 border border-nebula-border hover:border-nebula-border-bright transition-all cursor-pointer"
        aria-label="Open command palette (Ctrl+K)"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-nebula-dim bg-nebula-surface/50 px-1.5 py-0.5 rounded border border-nebula-border">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Shortcuts Overlay */}
      <AnimatePresence>
        {showShortcuts && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setShowShortcuts(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[101] top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-md"
            >
              <div className="rounded-2xl border border-nebula-border overflow-hidden shadow-2xl" style={{ background: 'rgba(6, 9, 24, 0.98)', backdropFilter: 'blur(24px)' }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-nebula-border">
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-5 h-5 text-neon-cyan" />
                    <span className="text-sm font-semibold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Keyboard Shortcuts</span>
                  </div>
                  <button onClick={() => setShowShortcuts(false)} className="text-nebula-dim hover:text-nebula-muted cursor-pointer bg-transparent border-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {SHORTCUTS.map((s) => (
                    <div key={s.desc} className="flex items-center justify-between">
                      <span className="text-sm text-nebula-muted">{s.desc}</span>
                      <div className="flex items-center gap-1">
                        {s.keys.map((k) => (
                          <kbd key={k} className="px-2 py-1 text-[11px] text-nebula-text bg-nebula-surface/60 border border-nebula-border rounded font-mono min-w-[24px] text-center">{k}</kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-2.5 border-t border-nebula-border text-[10px] text-nebula-dim text-center">
                  Press <kbd className="px-1 py-0.5 rounded bg-nebula-surface/50 border border-nebula-border">?</kbd> anytime to toggle this overlay
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[101] top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-xl"
            >
              <div
                className="rounded-2xl border border-nebula-border overflow-hidden shadow-2xl"
                style={{ background: 'rgba(6, 9, 24, 0.98)', backdropFilter: 'blur(24px)' }}
              >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-nebula-border">
                  <Search className="w-5 h-5 text-nebula-dim shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search pages, services, scenarios..."
                    className="flex-1 bg-transparent text-sm text-nebula-text placeholder:text-nebula-dim outline-none"
                    autoComplete="off"
                  />
                  <kbd className="text-[10px] text-nebula-dim bg-nebula-surface/50 px-2 py-1 rounded border border-nebula-border">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div
                  ref={listRef}
                  className="max-h-[50vh] overflow-y-auto py-2"
                  role="listbox"
                >
                  {results.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-nebula-dim">
                      No results for "{query}"
                    </div>
                  ) : (
                    Object.entries(grouped).map(([cat, items]) => (
                      <div key={cat}>
                        <div className="px-5 py-1.5 text-[10px] font-bold text-nebula-dim uppercase tracking-wider">
                          {cat}
                        </div>
                        {items.map((item) => {
                          const globalIdx = results.indexOf(item)
                          const Icon = item.icon
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`w-full flex items-center gap-3 px-5 py-2.5 text-left cursor-pointer transition-colors ${globalIdx === selectedIndex
                                ? 'bg-neon-cyan/8 text-nebula-text'
                                : 'text-nebula-muted hover:text-nebula-text'
                                }`}
                              role="option"
                              aria-selected={globalIdx === selectedIndex}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{
                                  backgroundColor: item.color ? item.color + '10' : 'rgba(0, 212, 255, 0.06)',
                                  border: `1px solid ${item.color ? item.color + '20' : 'rgba(0, 212, 255, 0.12)'}`,
                                }}
                              >
                                <Icon className="w-4 h-4" style={{ color: item.color || '#00d4ff' }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{item.label}</div>
                                {item.description && (
                                  <div className="text-[11px] text-nebula-dim truncate">{item.description}</div>
                                )}
                              </div>
                              {globalIdx === selectedIndex && (
                                <ArrowRight className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-5 py-2.5 border-t border-nebula-border text-[10px] text-nebula-dim">
                  <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-nebula-surface/50 border border-nebula-border">↑↓</kbd> navigate</span>
                  <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-nebula-surface/50 border border-nebula-border">↵</kbd> select</span>
                  <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-nebula-surface/50 border border-nebula-border">esc</kbd> close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
