import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cloud, Calendar, Trophy, Layout, BookOpen, Brain, RotateCcw,
  GraduationCap, GitCompareArrows, DollarSign, ChevronDown, Terminal,
  Network, Award, ClipboardList, BarChart3, Wrench, StickyNote, Settings,
  Bug, Layers, AlertTriangle, FileCode2, Shield, Zap, Menu, X,
  Target, Flame, History,
} from 'lucide-react'
import UserMenu from './UserMenu'
import CommandPalette from './CommandPalette'

const MAIN_NAV = [
  { to: '/', label: 'Dashboard', icon: Cloud },
  { to: '/day-as', label: 'A Day As...', icon: Calendar },
  { to: '/challenges', label: 'Challenges', icon: Trophy },
  { to: '/canvas', label: 'Arch Canvas', icon: Layout },
]

const LEARN_SECTIONS = [
  {
    label: 'Labs',
    items: [
      { to: '/linux-lab', label: 'Linux Fundamentals', icon: Terminal, color: '#10b981' },
      { to: '/gcloud-lab', label: 'GCloud CLI Lab', icon: Cloud, color: '#4285f4' },
      { to: '/network-lab', label: 'Networking Lab', icon: Network, color: '#a855f7' },
      { to: '/terraform-lab', label: 'Terraform Lab', icon: FileCode2, color: '#7c3aed' },
      { to: '/cost-labs', label: 'Cost Labs', icon: DollarSign, color: '#10b981' },
    ],
  },
  {
    label: 'Practice',
    items: [
      { to: '/exam', label: 'Exam Simulator', icon: GraduationCap, color: '#f43f5e' },
      { to: '/exam/history', label: 'Exam History', icon: History, color: '#a855f7' },
      { to: '/timed-drills', label: 'Timed Drills', icon: Zap, color: '#f59e0b' },
      { to: '/daily-challenge', label: 'Daily Challenge', icon: Flame, color: '#f43f5e' },
      { to: '/arch-quiz', label: 'Architecture Quiz', icon: AlertTriangle, color: '#f59e0b' },
      { to: '/iam-simulator', label: 'IAM Simulator', icon: Shield, color: '#10b981' },
      { to: '/review', label: 'Review Cards', icon: RotateCcw, color: '#7c3aed' },
    ],
  },
  {
    label: 'Build',
    items: [
      { to: '/projects', label: 'Project Mode', icon: Layers, color: '#7c3aed' },
      { to: '/troubleshooting', label: 'Troubleshooting', icon: Bug, color: '#f43f5e' },
      { to: '/scenario-builder', label: 'Scenario Builder', icon: Wrench, color: '#f59e0b' },
    ],
  },
  {
    label: 'Study',
    items: [
      { to: '/services', label: 'Service Encyclopedia', icon: BookOpen, color: '#00d4ff' },
      { to: '/knowledge-map', label: 'Knowledge Map', icon: Brain, color: '#7c3aed' },
      { to: '/compare', label: 'Compare Services', icon: GitCompareArrows, color: '#f59e0b' },
      { to: '/study-plan', label: 'Study Planner', icon: ClipboardList, color: '#00d4ff' },
      { to: '/analytics', label: 'Analytics', icon: BarChart3, color: '#00d4ff' },
      { to: '/notes', label: 'Quick Notes', icon: StickyNote, color: '#f59e0b' },
      { to: '/learning-paths', label: 'Learning Paths', icon: Target, color: '#00d4ff' },
      { to: '/cheat-sheet', label: 'Command Cheat Sheet', icon: Terminal, color: '#10b981' },
      { to: '/achievements', label: 'Achievements', icon: Award, color: '#f59e0b' },
      { to: '/settings', label: 'Settings', icon: Settings, color: '#94a3b8' },
    ],
  },
]

const ALL_LEARN_PATHS = LEARN_SECTIONS.flatMap((s) => s.items.map((i) => i.to))

export default function Navbar() {
  const location = useLocation()
  const [learnOpen, setLearnOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)

  const isLearnActive = ALL_LEARN_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'))

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLearnOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => { setLearnOpen(false); setMobileOpen(false) }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b border-nebula-border"
        style={{
          background: 'linear-gradient(180deg, rgba(6, 9, 24, 0.95) 0%, rgba(6, 9, 24, 0.85) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 no-underline group shrink-0" aria-label="GCP Architect Lab - Home">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 group-hover:border-neon-cyan/40 transition-colors">
                <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan" />
              </div>
              <span className="text-base sm:text-lg font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                GCP <span className="gradient-text-cyan">Lab</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {MAIN_NAV.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-200 ${active ? 'text-neon-cyan' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'
                      }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg border border-neon-cyan/20"
                        style={{ background: 'rgba(0, 212, 255, 0.06)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}

              {/* Learn Dropdown — Segmented */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setLearnOpen((p) => !p)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer bg-transparent border-0 ${isLearnActive ? 'text-neon-cyan' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'
                    }`}
                  aria-expanded={learnOpen}
                  aria-haspopup="true"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Learn</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${learnOpen ? 'rotate-180' : ''}`} />
                  {isLearnActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg border border-neon-cyan/20"
                      style={{ background: 'rgba(0, 212, 255, 0.06)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {learnOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-nebula-border overflow-hidden overflow-y-auto"
                      style={{
                        background: 'rgba(6, 9, 24, 0.97)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        maxHeight: 'calc(100vh - 80px)',
                      }}
                    >
                      {LEARN_SECTIONS.map((section, sIdx) => (
                        <div key={section.label}>
                          {sIdx > 0 && <div className="h-px bg-nebula-border/50 mx-3" />}
                          <div className="px-4 pt-3 pb-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-nebula-dim">{section.label}</span>
                          </div>
                          {section.items.map(({ to, label, icon: Icon, color }) => {
                            const active = location.pathname === to || location.pathname.startsWith(to + '/')
                            return (
                              <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-3 px-4 py-2 no-underline text-sm transition-all ${active ? 'text-nebula-text bg-nebula-surface/50' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/30'
                                  }`}
                              >
                                <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                                {label}
                              </Link>
                            )
                          })}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <CommandPalette />

              <div className="ml-2 pl-2 border-l border-nebula-border">
                <UserMenu />
              </div>
            </div>

            {/* Mobile: Command Palette + User + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <CommandPalette />
              <UserMenu />
              <button
                onClick={() => setMobileOpen((p) => !p)}
                className="p-2 rounded-lg text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 transition-colors cursor-pointer bg-transparent border-0"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
      </nav>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 border-l border-nebula-border overflow-y-auto"
              style={{
                background: 'rgba(6, 9, 24, 0.98)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              <div className="flex items-center justify-between p-4 border-b border-nebula-border">
                <span className="text-sm font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
                  GCP <span className="gradient-text-cyan">Lab</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 cursor-pointer bg-transparent border-0 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Nav */}
              <div className="p-3 border-b border-nebula-border/50">
                {MAIN_NAV.map(({ to, label, icon: Icon }) => {
                  const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
                  return (
                    <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline text-sm font-medium transition-all ${active ? 'text-neon-cyan bg-neon-cyan/5' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/30'}`}>
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  )
                })}
              </div>

              {/* Learn Sections */}
              {LEARN_SECTIONS.map((section) => (
                <div key={section.label} className="p-3 border-b border-nebula-border/30">
                  <div className="px-3 py-1 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-nebula-dim">{section.label}</span>
                  </div>
                  {section.items.map(({ to, label, icon: Icon, color }) => {
                    const active = location.pathname === to || location.pathname.startsWith(to + '/')
                    return (
                      <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2 rounded-lg no-underline text-sm transition-all ${active ? 'text-nebula-text bg-nebula-surface/50' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/30'}`}>
                        <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                        {label}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
