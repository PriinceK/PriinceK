import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Trophy, Layout, ArrowRight, Cloud, Target, BookOpen, TrendingUp } from 'lucide-react'
import { DAILY_SCENARIOS } from '../data/scenarios'
import { CHALLENGES } from '../data/challenges'
import { GCP_SERVICES } from '../data/gcpServices'

const FEATURES = [
  {
    to: '/day-as',
    icon: Calendar,
    color: '#4285f4',
    title: 'A Day As...',
    description: 'Step into the shoes of a GCP Cloud Engineer. Complete realistic daily scenarios with tasks, decisions, and instant feedback.',
    stat: `${DAILY_SCENARIOS.length} scenarios`,
  },
  {
    to: '/challenges',
    icon: Trophy,
    color: '#34a853',
    title: 'Architecture Challenges',
    description: 'Solve architecture design challenges. Select GCP services to meet requirements and get scored on your design choices.',
    stat: `${CHALLENGES.length} challenges`,
  },
  {
    to: '/canvas',
    icon: Layout,
    color: '#fbbc04',
    title: 'Architecture Canvas',
    description: 'Blank canvas to design and visualize your own GCP architectures. Drag and drop services, draw connections, and export your designs.',
    stat: 'Free-form design',
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

export default function Dashboard() {
  const tipOfTheDay = TIPS[new Date().getDate() % TIPS.length]
  const [progress, setProgress] = useState(getProgress)

  useEffect(() => {
    setProgress(getProgress())
  }, [])

  const totalTasks = DAILY_SCENARIOS.reduce((acc, s) => acc + s.tasks.length, 0)
  const hasProgress = progress.scenariosCompleted > 0 || progress.challengesCompleted > 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 page-enter">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gcp-blue/15 flex items-center justify-center">
            <Cloud className="w-8 h-8 text-gcp-blue" aria-hidden="true" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3 text-gcp-text">
          GCP Architect Practice Lab
        </h1>
        <p className="text-gcp-muted text-lg max-w-2xl mx-auto">
          Sharpen your Google Cloud Platform engineering and architecture skills through
          realistic scenarios, hands-on challenges, and free-form design.
        </p>
      </div>

      {/* Progress bar (if user has progress) */}
      {hasProgress && (
        <div className="bg-gcp-card border border-gcp-border rounded-2xl p-5 mb-8 fade-in">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-gcp-blue" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-gcp-text">Your Progress</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xl font-bold text-gcp-text">{progress.scenariosCompleted}/{DAILY_SCENARIOS.length}</div>
              <div className="text-xs text-gcp-muted">Scenarios completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gcp-text">{progress.challengesCompleted}/{CHALLENGES.length}</div>
              <div className="text-xs text-gcp-muted">Challenges completed</div>
            </div>
            {progress.bestScenarioScore > 0 && (
              <div>
                <div className="text-xl font-bold text-gcp-green">{progress.bestScenarioScore}%</div>
                <div className="text-xs text-gcp-muted">Best scenario score</div>
              </div>
            )}
            {progress.bestChallengeScore > 0 && (
              <div>
                <div className="text-xl font-bold text-gcp-green">{progress.bestChallengeScore}%</div>
                <div className="text-xs text-gcp-muted">Best challenge score</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {FEATURES.map(({ to, icon: Icon, color, title, description, stat }, idx) => (
          <Link
            key={to}
            to={to}
            className="group bg-gcp-card border border-gcp-border rounded-2xl p-6 no-underline transition-all hover:border-opacity-60 hover:-translate-y-1 list-item-enter"
            style={{ borderColor: color + '30', animationDelay: `${idx * 100}ms` }}
            aria-label={`${title}: ${stat}`}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: color + '15' }}
            >
              <Icon className="w-6 h-6" style={{ color }} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-gcp-text mb-2">{title}</h2>
            <p className="text-gcp-muted text-sm mb-4 leading-relaxed">{description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: color + '15', color }}>
                {stat}
              </span>
              <ArrowRight className="w-4 h-4 text-gcp-muted group-hover:text-gcp-text transition-colors" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>

      {/* Tip of the Day */}
      <div className="bg-gcp-card border border-gcp-border rounded-2xl p-6 mb-8" role="complementary" aria-label="GCP Tip of the Day">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-gcp-yellow/15 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-gcp-yellow" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gcp-yellow mb-1">GCP Tip of the Day</h3>
            <p className="text-gcp-text text-sm">{tipOfTheDay}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gcp-card border border-gcp-border rounded-xl p-4 text-center list-item-enter" style={{ animationDelay: '200ms' }}>
          <Target className="w-5 h-5 text-gcp-blue mx-auto mb-2" aria-hidden="true" />
          <div className="text-2xl font-bold text-gcp-text">{totalTasks}</div>
          <div className="text-xs text-gcp-muted">Scenario Tasks</div>
        </div>
        <div className="bg-gcp-card border border-gcp-border rounded-xl p-4 text-center list-item-enter" style={{ animationDelay: '300ms' }}>
          <Trophy className="w-5 h-5 text-gcp-green mx-auto mb-2" aria-hidden="true" />
          <div className="text-2xl font-bold text-gcp-text">{CHALLENGES.length}</div>
          <div className="text-xs text-gcp-muted">Design Challenges</div>
        </div>
        <div className="bg-gcp-card border border-gcp-border rounded-xl p-4 text-center list-item-enter" style={{ animationDelay: '400ms' }}>
          <Layout className="w-5 h-5 text-gcp-yellow mx-auto mb-2" aria-hidden="true" />
          <div className="text-2xl font-bold text-gcp-text">{GCP_SERVICES.length}</div>
          <div className="text-xs text-gcp-muted">GCP Services</div>
        </div>
      </div>
    </div>
  )
}
