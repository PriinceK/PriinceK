import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Trophy, Layout, ArrowRight, Cloud, Target, BookOpen, TrendingUp, Sparkles } from 'lucide-react'
import { DAILY_SCENARIOS } from '../data/scenarios'
import { CHALLENGES } from '../data/challenges'
import { GCP_SERVICES } from '../data/gcpServices'

const FEATURES = [
  {
    to: '/day-as',
    icon: Calendar,
    color: '#00d4ff',
    glowClass: 'glow-cyan',
    title: 'A Day As...',
    description: 'Step into the shoes of a GCP Cloud Engineer. Complete realistic daily scenarios with tasks, decisions, and instant feedback.',
    stat: `${DAILY_SCENARIOS.length} scenarios`,
  },
  {
    to: '/challenges',
    icon: Trophy,
    color: '#10b981',
    glowClass: 'glow-emerald',
    title: 'Architecture Challenges',
    description: 'Solve architecture design challenges. Select GCP services to meet requirements and get scored on your design choices.',
    stat: `${CHALLENGES.length} challenges`,
  },
  {
    to: '/canvas',
    icon: Layout,
    color: '#f59e0b',
    glowClass: 'glow-amber',
    title: 'Architecture Canvas',
    description: 'Blank canvas to design and visualize your own GCP architectures. Drag and drop services, draw connections, and export.',
    stat: 'Free-form design',
  },
]

const TIPS = [
  'Cloud Spanner is the only GCP database with synchronous multi-region replication.',
  'GKE Autopilot manages node provisioning automatically \u2014 you only pay for pods.',
  'Cloud Run scales to zero, meaning you pay nothing when idle.',
  'VPC Service Controls create a security perimeter around GCP resources.',
  'Cloud Armor integrates with Global HTTP(S) Load Balancing for DDoS protection.',
  'BigQuery supports streaming inserts for real-time analytics.',
  'Pub/Sub guarantees at-least-once delivery with configurable retention.',
  'Cloud Build can be triggered by changes in Cloud Source Repos, GitHub, or Bitbucket.',
]

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

const stagger = { animate: { transition: { staggerChildren: 0.1 } } }
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

export default function Dashboard() {
  const tipOfTheDay = TIPS[new Date().getDate() % TIPS.length]
  const [progress, setProgress] = useState(getProgress)

  useEffect(() => {
    setProgress(getProgress())
  }, [])

  const totalTasks = DAILY_SCENARIOS.reduce((acc, s) => acc + s.tasks.length, 0)
  const hasProgress = progress.scenariosCompleted > 0 || progress.challengesCompleted > 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <motion.div className="text-center mb-14" variants={stagger} initial="initial" animate="animate">
        <motion.div variants={fadeUp} className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 glow-cyan">
              <Cloud className="w-10 h-10 text-neon-cyan" aria-hidden="true" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-emerald animate-pulse" />
          </div>
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-5xl font-extrabold mb-4 text-nebula-text tracking-tight" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
          GCP Architect <span className="gradient-text-cyan">Practice Lab</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-nebula-muted text-lg max-w-2xl mx-auto leading-relaxed">
          Sharpen your Google Cloud Platform engineering and architecture skills through
          realistic scenarios, hands-on challenges, and free-form design.
        </motion.p>
      </motion.div>

      {/* Progress (if user has progress) */}
      {hasProgress && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-static rounded-2xl p-6 mb-10 shimmer-line"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-neon-cyan" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-nebula-text">Your Progress</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{progress.scenariosCompleted}/{DAILY_SCENARIOS.length}</div>
              <div className="text-xs text-nebula-muted mt-0.5">Scenarios completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{progress.challengesCompleted}/{CHALLENGES.length}</div>
              <div className="text-xs text-nebula-muted mt-0.5">Challenges completed</div>
            </div>
            {progress.bestScenarioScore > 0 && (
              <div>
                <div className="text-2xl font-bold text-neon-emerald" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{progress.bestScenarioScore}%</div>
                <div className="text-xs text-nebula-muted mt-0.5">Best scenario score</div>
              </div>
            )}
            {progress.bestChallengeScore > 0 && (
              <div>
                <div className="text-2xl font-bold text-neon-emerald" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{progress.bestChallengeScore}%</div>
                <div className="text-xs text-nebula-muted mt-0.5">Best challenge score</div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Features */}
      <motion.div
        className="grid md:grid-cols-3 gap-6 mb-14"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {FEATURES.map(({ to, icon: Icon, color, glowClass, title, description, stat }) => (
          <motion.div key={to} variants={fadeUp}>
            <Link
              to={to}
              className={`group block glass-card rounded-2xl p-7 no-underline hover:-translate-y-1.5 transition-all duration-300`}
              aria-label={`${title}: ${stat}`}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${glowClass}`}
                style={{ backgroundColor: color + '12', border: `1px solid ${color}25` }}
              >
                <Icon className="w-7 h-7" style={{ color }} aria-hidden="true" />
              </div>
              <h2 className="text-xl font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{title}</h2>
              <p className="text-nebula-muted text-sm mb-5 leading-relaxed">{description}</p>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ backgroundColor: color + '12', color, border: `1px solid ${color}20`, fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {stat}
                </span>
                <ArrowRight className="w-4 h-4 text-nebula-dim group-hover:text-nebula-text group-hover:translate-x-1 transition-all" aria-hidden="true" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Tip of the Day */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card-static rounded-2xl p-6 mb-10"
        role="complementary"
        aria-label="GCP Tip of the Day"
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-neon-amber/10 flex items-center justify-center shrink-0 border border-neon-amber/20 glow-amber">
            <Sparkles className="w-5 h-5 text-neon-amber" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neon-amber mb-1.5" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Tip of the Day</h3>
            <p className="text-nebula-text text-sm leading-relaxed">{tipOfTheDay}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {[
          { icon: Target, color: '#00d4ff', value: totalTasks, label: 'Scenario Tasks' },
          { icon: Trophy, color: '#10b981', value: CHALLENGES.length, label: 'Design Challenges' },
          { icon: Layout, color: '#f59e0b', value: GCP_SERVICES.length, label: 'GCP Services' },
        ].map(({ icon: Icon, color, value, label }) => (
          <motion.div
            key={label}
            variants={fadeUp}
            className="glass-card-static rounded-xl p-5 text-center group hover:scale-[1.02] transition-transform"
          >
            <Icon className="w-5 h-5 mx-auto mb-2.5" style={{ color }} aria-hidden="true" />
            <div className="text-2xl font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
            <div className="text-xs text-nebula-muted mt-1">{label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
