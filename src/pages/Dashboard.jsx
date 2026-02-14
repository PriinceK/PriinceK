import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, Trophy, Layout, ArrowRight, Cloud, Target, TrendingUp,
  Sparkles, BookOpen, Brain, RotateCcw, GraduationCap, GitCompareArrows,
  DollarSign, Flame, Terminal, Network, Award, ClipboardList, BarChart3,
  Wrench, StickyNote, Settings, Bug, Layers, AlertTriangle, FileCode2,
  Shield, Zap, Search, ChevronRight, Play, CheckCircle2, X, History,
} from 'lucide-react'
import { DAILY_SCENARIOS } from '../data/scenarios'
import { CHALLENGES } from '../data/challenges'
import { GCP_SERVICES } from '../data/gcpServices'
import { getFlashcardState, getStudyStreak, getExamHistory, getDomainScores } from '../utils/progress'
import { isDueForReview } from '../utils/spacedRepetition'
import { FLASHCARDS } from '../data/flashcards'

/* ─── HERO FEATURES ─── */
const FEATURES = [
  {
    to: '/day-as', icon: Calendar, color: '#00d4ff', glowClass: 'glow-cyan',
    title: 'A Day As...', description: 'Step into the shoes of a GCP Cloud Engineer through realistic daily scenarios.',
    stat: `${DAILY_SCENARIOS.length} scenarios`,
  },
  {
    to: '/challenges', icon: Trophy, color: '#10b981', glowClass: 'glow-emerald',
    title: 'Architecture Challenges', description: 'Design GCP architectures to meet requirements and get scored on your choices.',
    stat: `${CHALLENGES.length} challenges`,
  },
  {
    to: '/canvas', icon: Layout, color: '#f59e0b', glowClass: 'glow-amber',
    title: 'Architecture Canvas', description: 'Drag-and-drop sandbox to design and export your own GCP architectures.',
    stat: 'Free-form design',
  },
]

/* ─── CATEGORIZED LEARNING HUB ─── */
const LEARNING_CATEGORIES = [
  {
    id: 'labs',
    title: 'Hands-On Labs',
    subtitle: 'Interactive terminals and guided exercises',
    icon: Terminal,
    color: '#10b981',
    items: [
      { to: '/linux-lab', icon: Terminal, color: '#10b981', title: 'Linux Fundamentals', description: 'Master Linux commands with 30+ guided missions.', progressKey: 'gcp-linux-lab-progress' },
      { to: '/gcloud-lab', icon: Cloud, color: '#4285f4', title: 'GCloud CLI Lab', description: 'Master gcloud, gsutil, kubectl, and bq commands.', progressKey: 'gcp-gcloud-lab-progress' },
      { to: '/network-lab', icon: Network, color: '#a855f7', title: 'Networking Lab', description: 'DNS, firewall, and diagnostics exercises.', progressKey: 'gcp-network-lab-progress' },
      { to: '/terraform-lab', icon: FileCode2, color: '#7c3aed', title: 'Terraform Lab', description: 'Write infrastructure-as-code for GCP resources.', progressKey: 'gcp-terraform-lab-progress' },
      { to: '/cost-labs', icon: DollarSign, color: '#10b981', title: 'Cost Labs', description: 'Optimize infrastructure costs in lab scenarios.' },
    ],
  },
  {
    id: 'practice',
    title: 'Practice & Assessment',
    subtitle: 'Test your knowledge under pressure',
    icon: GraduationCap,
    color: '#f43f5e',
    items: [
      { to: '/exam', icon: GraduationCap, color: '#f43f5e', title: 'Exam Simulator', description: 'Timed practice exams for ACE certification.' },
      { to: '/exam/history', icon: History, color: '#a855f7', title: 'Exam History', description: 'Review past exam attempts with explanations.' },
      { to: '/timed-drills', icon: Zap, color: '#f59e0b', title: 'Timed Drills', description: 'Race the clock to type GCP commands.', progressKey: 'gcp-timed-drills-progress' },
      { to: '/daily-challenge', icon: Flame, color: '#f43f5e', title: 'Daily Challenge', description: 'One question per day — build your streak.' },
      { to: '/arch-quiz', icon: AlertTriangle, color: '#f59e0b', title: 'Architecture Quiz', description: 'Find flaws in broken architecture diagrams.', progressKey: 'gcp-arch-quiz-progress' },
      { to: '/iam-simulator', icon: Shield, color: '#10b981', title: 'IAM Simulator', description: 'Practice least-privilege role assignments.', progressKey: 'gcp-iam-simulator-progress' },
      { to: '/review', icon: RotateCcw, color: '#7c3aed', title: 'Review Cards', description: 'Spaced repetition flashcards for retention.' },
    ],
  },
  {
    id: 'build',
    title: 'Build & Troubleshoot',
    subtitle: 'End-to-end projects and diagnostics',
    icon: Wrench,
    color: '#7c3aed',
    items: [
      { to: '/projects', icon: Layers, color: '#7c3aed', title: 'Project Mode', description: 'Multi-phase guided GCP projects.', progressKey: 'gcp-project-mode-progress' },
      { to: '/troubleshooting', icon: Bug, color: '#f43f5e', title: 'Troubleshooting Lab', description: 'Diagnose and fix real-world GCP issues.', progressKey: 'gcp-troubleshooting-progress' },
      { to: '/scenario-builder', icon: Wrench, color: '#f59e0b', title: 'Scenario Builder', description: 'Create and share custom scenarios.' },
    ],
  },
  {
    id: 'explore',
    title: 'Explore & Study',
    subtitle: 'Deep-dive references and study tools',
    icon: BookOpen,
    color: '#00d4ff',
    items: [
      { to: '/services', icon: BookOpen, color: '#00d4ff', title: 'Service Encyclopedia', description: 'Deep-dive into 15+ GCP services.' },
      { to: '/knowledge-map', icon: Brain, color: '#7c3aed', title: 'Knowledge Map', description: 'Radar chart of your domain proficiency.' },
      { to: '/compare', icon: GitCompareArrows, color: '#f59e0b', title: 'Compare Services', description: 'Head-to-head service comparisons.' },
      { to: '/study-plan', icon: ClipboardList, color: '#00d4ff', title: 'Study Planner', description: 'Personalized daily study plan.' },
      { to: '/analytics', icon: BarChart3, color: '#00d4ff', title: 'Analytics', description: 'Visualize learning trends and scores.' },
      { to: '/notes', icon: StickyNote, color: '#f59e0b', title: 'Quick Notes', description: 'Capture study notes and exam tips.' },
      { to: '/learning-paths', icon: Target, color: '#00d4ff', title: 'Learning Paths', description: 'Guided career tracks with step-by-step progress.' },
      { to: '/cheat-sheet', icon: Terminal, color: '#10b981', title: 'Command Cheat Sheet', description: '70+ searchable GCP commands at your fingertips.' },
      { to: '/achievements', icon: Award, color: '#f59e0b', title: 'Achievements', description: 'Earn 35+ badges and milestones.' },
      { to: '/settings', icon: Settings, color: '#94a3b8', title: 'Settings', description: 'Export progress and configure preferences.' },
    ],
  },
]

const TIPS = [
  'Cloud Spanner is the only GCP database with synchronous multi-region replication.',
  'GKE Autopilot manages node provisioning automatically — you only pay for pods.',
  'Cloud Run scales to zero, meaning you pay nothing when idle.',
  'VPC Service Controls create a security perimeter around GCP resources.',
  'Cloud Armor integrates with Global HTTP(S) Load Balancing for DDoS protection.',
  'BigQuery supports streaming inserts for real-time analytics.',
  'Pub/Sub guarantees at-least-once delivery with configurable retention.',
  'Cloud Build can be triggered by changes in Cloud Source Repos, GitHub, or Bitbucket.',
]

/* ─── CONTINUE WHERE YOU LEFT OFF ─── */
const CONTINUABLE_FEATURES = [
  { key: 'gcp-gcloud-lab-progress', to: '/gcloud-lab', title: 'GCloud CLI Lab', icon: Cloud, color: '#4285f4', total: 24 },
  { key: 'gcp-troubleshooting-progress', to: '/troubleshooting', title: 'Troubleshooting Lab', icon: Bug, color: '#f43f5e', total: 6 },
  { key: 'gcp-project-mode-progress', to: '/projects', title: 'Project Mode', icon: Layers, color: '#7c3aed', total: 5 },
  { key: 'gcp-arch-quiz-progress', to: '/arch-quiz', title: 'Architecture Quiz', icon: AlertTriangle, color: '#f59e0b', total: 10 },
  { key: 'gcp-terraform-lab-progress', to: '/terraform-lab', title: 'Terraform Lab', icon: FileCode2, color: '#7c3aed', total: 10 },
  { key: 'gcp-iam-simulator-progress', to: '/iam-simulator', title: 'IAM Simulator', icon: Shield, color: '#10b981', total: 6 },
  { key: 'gcp-timed-drills-progress', to: '/timed-drills', title: 'Timed Drills', icon: Zap, color: '#f59e0b', total: 8 },
  { key: 'gcp-linux-lab-progress', to: '/linux-lab', title: 'Linux Fundamentals', icon: Terminal, color: '#10b981', total: 18 },
  { key: 'gcp-network-lab-progress', to: '/network-lab', title: 'Networking Lab', icon: Network, color: '#a855f7', total: 10 },
]

function getContinueItems() {
  const items = []
  for (const feat of CONTINUABLE_FEATURES) {
    try {
      const raw = localStorage.getItem(feat.key)
      if (raw) {
        const data = JSON.parse(raw)
        const keys = Object.keys(data)
        if (keys.length > 0) {
          const pct = feat.total ? Math.round((keys.length / feat.total) * 100) : null
          items.push({ ...feat, progress: keys.length, percentage: pct })
        }
      }
    } catch { /* skip */ }
  }
  return items.slice(0, 3)
}

function getProgress() {
  try {
    const data = JSON.parse(localStorage.getItem('gcp-lab-progress') || '{}')
    return {
      scenariosCompleted: Object.keys(data.scenarios || {}).length,
      challengesCompleted: Object.keys(data.challenges || {}).length,
      bestScenarioScore: Math.max(0, ...Object.values(data.scenarios || {}).map((s) => s.percentage || 0)),
      bestChallengeScore: Math.max(0, ...Object.values(data.challenges || {}).map((c) => c.percentage || 0)),
    }
  } catch {
    return { scenariosCompleted: 0, challengesCompleted: 0, bestScenarioScore: 0, bestChallengeScore: 0 }
  }
}

function getLabsCompleted() {
  let count = 0
  for (const feat of CONTINUABLE_FEATURES) {
    try {
      const raw = localStorage.getItem(feat.key)
      if (raw) count += Object.keys(JSON.parse(raw)).length
    } catch { /* skip */ }
  }
  return count
}

const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
}

export default function Dashboard() {
  const tipOfTheDay = TIPS[new Date().getDate() % TIPS.length]
  const [progress, setProgress] = useState(getProgress)
  const [cardsDue, setCardsDue] = useState(0)
  const [streak, setStreak] = useState({ current: 0 })
  const [lastExam, setLastExam] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [continueItems, setContinueItems] = useState([])
  const [labsCount, setLabsCount] = useState(0)

  useEffect(() => {
    setProgress(getProgress())
    const fcState = getFlashcardState()
    const due = FLASHCARDS.filter((c) => isDueForReview(fcState[c.id])).length
    setCardsDue(due)
    setStreak(getStudyStreak())
    const history = getExamHistory()
    if (history.length > 0) setLastExam(history[history.length - 1])
    setContinueItems(getContinueItems())
    setLabsCount(getLabsCompleted())
  }, [])

  const totalTasks = DAILY_SCENARIOS.reduce((acc, s) => acc + s.tasks.length, 0)

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return LEARNING_CATEGORIES
    const q = searchQuery.toLowerCase()
    return LEARNING_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0)
  }, [searchQuery])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
      {/* ─── Hero ─── */}
      <motion.div className="text-center mb-10 sm:mb-14" variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeUp} className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 glow-cyan">
              <Cloud className="w-8 h-8 sm:w-10 sm:h-10 text-neon-cyan" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-emerald animate-pulse" />
          </div>
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl font-extrabold mb-3 sm:mb-4 text-nebula-text tracking-tight" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
          GCP Architect <span className="gradient-text-cyan">Practice Lab</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-nebula-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Sharpen your GCP engineering and architecture skills through realistic scenarios, hands-on labs, and in-depth study tools.
        </motion.p>
      </motion.div>

      {/* ─── Global Progress Widget ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card-static rounded-2xl p-5 sm:p-6 mb-8 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/[0.03] via-neon-purple/[0.03] to-neon-emerald/[0.03]" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
            <h3 className="text-sm font-semibold text-nebula-text">Your Progress</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
            {[
              { value: progress.scenariosCompleted, total: DAILY_SCENARIOS.length, label: 'Scenarios', color: '#00d4ff', icon: Calendar },
              { value: progress.challengesCompleted, total: CHALLENGES.length, label: 'Challenges', color: '#10b981', icon: Trophy },
              { value: labsCount, label: 'Labs Started', color: '#7c3aed', icon: Terminal },
              { value: cardsDue, label: 'Cards Due', color: '#f59e0b', icon: RotateCcw },
              { value: streak.current, label: 'Day Streak', color: '#f43f5e', icon: Flame },
              { value: lastExam ? `${lastExam.percentage}%` : '—', label: 'Last Exam', color: '#00d4ff', icon: GraduationCap },
            ].map(({ value, total, label, color, icon: Icon }) => (
              <div key={label} className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                  <span className="text-xl sm:text-2xl font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {total ? `${value}/${total}` : value}
                  </span>
                </div>
                <div className="text-[10px] sm:text-xs text-nebula-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Quick Actions ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        <Link to="/daily-challenge" className="group glass-card rounded-xl p-4 no-underline hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-neon-rose/10 flex items-center justify-center border border-neon-rose/20">
              <Flame className="w-4 h-4 text-neon-rose" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-nebula-dim group-hover:text-neon-cyan ml-auto transition-colors" />
          </div>
          <div className="text-sm font-semibold text-nebula-text mb-0.5">Daily Challenge</div>
          <div className="text-[10px] text-nebula-dim">{streak.current > 0 ? `🔥 ${streak.current} day streak` : 'Start your streak'}</div>
        </Link>
        <Link to="/review" className="group glass-card rounded-xl p-4 no-underline hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-neon-amber/10 flex items-center justify-center border border-neon-amber/20">
              <RotateCcw className="w-4 h-4 text-neon-amber" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-nebula-dim group-hover:text-neon-cyan ml-auto transition-colors" />
          </div>
          <div className="text-sm font-semibold text-nebula-text mb-0.5">Review Cards</div>
          <div className="text-[10px] text-nebula-dim">{cardsDue > 0 ? `${cardsDue} cards due now` : 'All caught up!'}</div>
        </Link>
        <Link to="/learning-paths" className="group glass-card rounded-xl p-4 no-underline hover:-translate-y-0.5 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20">
              <Target className="w-4 h-4 text-neon-cyan" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-nebula-dim group-hover:text-neon-cyan ml-auto transition-colors" />
          </div>
          <div className="text-sm font-semibold text-nebula-text mb-0.5">Learning Paths</div>
          <div className="text-[10px] text-nebula-dim">5 guided tracks</div>
        </Link>
      </motion.div>

      {/* ─── Continue Where You Left Off ─── */}
      <AnimatePresence>
        {continueItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-4 h-4 text-neon-emerald" />
              <h3 className="text-sm font-semibold text-nebula-text">Continue Where You Left Off</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {continueItems.map(({ to, title, icon: Icon, color, progress: prog, percentage, total }) => (
                <Link
                  key={to}
                  to={to}
                  className="group glass-card rounded-xl p-4 no-underline flex flex-col gap-3 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: color + '15', border: `1px solid ${color}25` }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-nebula-text truncate">{title}</h4>
                      <p className="text-[10px] text-nebula-muted">{prog}{total ? `/${total}` : ''} completed</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-nebula-dim group-hover:text-neon-cyan group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  {percentage != null && (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-nebula-dim">{percentage}%</span>
                      </div>
                      <div className="h-1 bg-nebula-surface rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Hero Feature Cards ─── */}
      <motion.div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12" variants={stagger} initial="initial" animate="animate">
        {FEATURES.map(({ to, icon: Icon, color, glowClass, title, description, stat }) => (
          <motion.div key={to} variants={fadeUp}>
            <Link to={to} className="group block glass-card rounded-2xl p-6 sm:p-7 no-underline hover:-translate-y-1.5 transition-all duration-300">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5 ${glowClass}`}
                style={{ backgroundColor: color + '12', border: `1px solid ${color}25` }}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color }} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{title}</h2>
              <p className="text-nebula-muted text-sm mb-4 leading-relaxed">{description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: color + '12', color, border: `1px solid ${color}20`, fontFamily: 'JetBrains Mono, monospace' }}>
                  {stat}
                </span>
                <ArrowRight className="w-4 h-4 text-nebula-dim group-hover:text-nebula-text group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Learning Hub with Search ─── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neon-cyan" />
            <h2 className="text-xl font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Learning Hub</h2>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nebula-dim" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search labs, tools..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-nebula-surface/50 border border-nebula-border text-sm text-nebula-text placeholder-nebula-dim outline-none focus:border-neon-cyan/30 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-nebula-dim hover:text-nebula-muted cursor-pointer bg-transparent border-0 p-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Categorized Sections */}
        <div className="space-y-8">
          {filteredCategories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-2 mb-3">
                <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                <h3 className="text-sm font-semibold text-nebula-text">{cat.title}</h3>
                <span className="text-[10px] text-nebula-dim hidden sm:inline">· {cat.subtitle}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.items.map(({ to, icon: Icon, color, title, description }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group glass-card rounded-xl p-4 no-underline hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: color + '10', border: `1px solid ${color}20` }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-nebula-text mb-0.5" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{title}</h4>
                      <p className="text-[11px] text-nebula-muted leading-relaxed line-clamp-2">{description}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-nebula-dim group-hover:text-neon-cyan group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-8 h-8 text-nebula-dim mx-auto mb-3" />
            <p className="text-sm text-nebula-muted">No results for "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="text-xs text-neon-cyan mt-2 cursor-pointer bg-transparent border-0 hover:underline">Clear search</button>
          </div>
        )}
      </motion.div>

      {/* ─── Tip of the Day ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card-static rounded-2xl p-5 sm:p-6 mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-neon-amber/10 flex items-center justify-center shrink-0 border border-neon-amber/20 glow-amber">
            <Sparkles className="w-5 h-5 text-neon-amber" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neon-amber mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Tip of the Day</h3>
            <p className="text-nebula-text text-sm leading-relaxed">{tipOfTheDay}</p>
          </div>
        </div>
      </motion.div>

      {/* ─── Quick Stats ─── */}
      <motion.div className="grid grid-cols-3 gap-3 sm:gap-4" variants={stagger} initial="initial" animate="animate">
        {[
          { icon: Target, color: '#00d4ff', value: totalTasks, label: 'Scenario Tasks' },
          { icon: Trophy, color: '#10b981', value: CHALLENGES.length, label: 'Design Challenges' },
          { icon: Layout, color: '#f59e0b', value: GCP_SERVICES.length, label: 'GCP Services' },
        ].map(({ icon: Icon, color, value, label }) => (
          <motion.div key={label} variants={fadeUp} className="glass-card-static rounded-xl p-4 sm:p-5 text-center group hover:scale-[1.02] transition-transform">
            <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
            <div className="text-xl sm:text-2xl font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
            <div className="text-[10px] sm:text-xs text-nebula-muted mt-1">{label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
