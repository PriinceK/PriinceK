import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, Calendar, Trophy, Layout, BookOpen, Brain, RotateCcw, GraduationCap, GitCompareArrows, DollarSign, ChevronDown, Terminal, Network, Award, ClipboardList, BarChart3, Wrench, StickyNote, Settings, Bug, Layers, AlertTriangle, FileCode2, Shield, Zap } from 'lucide-react'
import UserMenu from './UserMenu'
import CommandPalette from './CommandPalette'

const MAIN_NAV = [
  { to: '/', label: 'Dashboard', icon: Cloud },
  { to: '/day-as', label: 'A Day As...', icon: Calendar },
  { to: '/challenges', label: 'Challenges', icon: Trophy },
  { to: '/canvas', label: 'Arch Canvas', icon: Layout },
]

const LEARN_ITEMS = [
  { to: '/services', label: 'Service Encyclopedia', icon: BookOpen, color: '#00d4ff' },
  { to: '/knowledge-map', label: 'Knowledge Map', icon: Brain, color: '#7c3aed' },
  { to: '/review', label: 'Review Cards', icon: RotateCcw, color: '#7c3aed' },
  { to: '/exam', label: 'Exam Simulator', icon: GraduationCap, color: '#f43f5e' },
  { to: '/compare', label: 'Compare Services', icon: GitCompareArrows, color: '#f59e0b' },
  { to: '/cost-labs', label: 'Cost Labs', icon: DollarSign, color: '#10b981' },
  { to: '/linux-lab', label: 'Linux Fundamentals', icon: Terminal, color: '#10b981' },
  { to: '/gcloud-lab', label: 'GCloud CLI Lab', icon: Cloud, color: '#4285f4' },
  { to: '/network-lab', label: 'Networking Lab', icon: Network, color: '#a855f7' },
  { to: '/troubleshooting', label: 'Troubleshooting', icon: Bug, color: '#f43f5e' },
  { to: '/projects', label: 'Project Mode', icon: Layers, color: '#7c3aed' },
  { to: '/arch-quiz', label: 'Architecture Quiz', icon: AlertTriangle, color: '#f59e0b' },
  { to: '/terraform-lab', label: 'Terraform Lab', icon: FileCode2, color: '#7c3aed' },
  { to: '/iam-simulator', label: 'IAM Simulator', icon: Shield, color: '#10b981' },
  { to: '/timed-drills', label: 'Timed Drills', icon: Zap, color: '#f59e0b' },
  { to: '/achievements', label: 'Achievements', icon: Award, color: '#f59e0b' },
  { to: '/study-plan', label: 'Study Planner', icon: ClipboardList, color: '#00d4ff' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, color: '#00d4ff' },
  { to: '/scenario-builder', label: 'Scenario Builder', icon: Wrench, color: '#f59e0b' },
  { to: '/notes', label: 'Quick Notes', icon: StickyNote, color: '#f59e0b' },
  { to: '/settings', label: 'Settings', icon: Settings, color: '#94a3b8' },
]

const LEARN_PATHS = LEARN_ITEMS.map((i) => i.to)

export default function Navbar() {
  const location = useLocation()
  const [learnOpen, setLearnOpen] = useState(false)
  const dropdownRef = useRef(null)

  const isLearnActive = LEARN_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'))

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLearnOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => { setLearnOpen(false) }, [location.pathname])

  return (
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
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 no-underline group" aria-label="GCP Architect Lab - Home">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 group-hover:border-neon-cyan/40 transition-colors">
              <Cloud className="w-5 h-5 text-neon-cyan" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
              GCP <span className="gradient-text-cyan">Architect Lab</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {MAIN_NAV.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to ||
                (to !== '/' && location.pathname.startsWith(to))
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-200 ${active
                    ? 'text-neon-cyan'
                    : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'
                    }`}
                  aria-current={active ? 'page' : undefined}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{label}</span>
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

            {/* Learn Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLearnOpen((p) => !p)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${isLearnActive
                  ? 'text-neon-cyan'
                  : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'
                  }`}
                aria-expanded={learnOpen}
                aria-haspopup="true"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Learn</span>
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
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-nebula-border overflow-hidden overflow-y-auto"
                    style={{
                      background: 'rgba(6, 9, 24, 0.95)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      maxHeight: 'calc(100vh - 80px)',
                    }}
                  >
                    {LEARN_ITEMS.map(({ to, label, icon: Icon, color }) => {
                      const active = location.pathname === to || location.pathname.startsWith(to + '/')
                      return (
                        <Link
                          key={to}
                          to={to}
                          className={`flex items-center gap-3 px-4 py-2.5 no-underline text-sm transition-all ${active
                            ? 'text-nebula-text bg-nebula-surface/50'
                            : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/30'
                            }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                          {label}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Command Palette */}
            <CommandPalette />

            {/* User Menu */}
            <div className="ml-2 pl-2 border-l border-nebula-border">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
    </nav>
  )
}
