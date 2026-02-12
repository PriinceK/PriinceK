import { Link } from 'react-router-dom'
import { Calendar, Trophy, Layout, ArrowRight, Cloud, Target, BookOpen } from 'lucide-react'
import { DAILY_SCENARIOS } from '../data/scenarios'
import { CHALLENGES } from '../data/challenges'

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

export default function Dashboard() {
  const tipOfTheDay = TIPS[new Date().getDate() % TIPS.length]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gcp-blue/15 flex items-center justify-center">
            <Cloud className="w-8 h-8 text-gcp-blue" />
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

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {FEATURES.map(({ to, icon: Icon, color, title, description, stat }) => (
          <Link
            key={to}
            to={to}
            className="group bg-gcp-card border border-gcp-border rounded-2xl p-6 no-underline transition-all hover:border-opacity-60 hover:-translate-y-1"
            style={{ borderColor: color + '30' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: color + '15' }}
            >
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <h2 className="text-xl font-semibold text-gcp-text mb-2">{title}</h2>
            <p className="text-gcp-muted text-sm mb-4 leading-relaxed">{description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: color + '15', color }}>
                {stat}
              </span>
              <ArrowRight className="w-4 h-4 text-gcp-muted group-hover:text-gcp-text transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Tip of the Day */}
      <div className="bg-gcp-card border border-gcp-border rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-gcp-yellow/15 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-gcp-yellow" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gcp-yellow mb-1">GCP Tip of the Day</h3>
            <p className="text-gcp-text text-sm">{tipOfTheDay}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gcp-card border border-gcp-border rounded-xl p-4 text-center">
          <Target className="w-5 h-5 text-gcp-blue mx-auto mb-2" />
          <div className="text-2xl font-bold text-gcp-text">{DAILY_SCENARIOS.reduce((acc, s) => acc + s.tasks.length, 0)}</div>
          <div className="text-xs text-gcp-muted">Scenario Tasks</div>
        </div>
        <div className="bg-gcp-card border border-gcp-border rounded-xl p-4 text-center">
          <Trophy className="w-5 h-5 text-gcp-green mx-auto mb-2" />
          <div className="text-2xl font-bold text-gcp-text">{CHALLENGES.length}</div>
          <div className="text-xs text-gcp-muted">Design Challenges</div>
        </div>
        <div className="bg-gcp-card border border-gcp-border rounded-xl p-4 text-center">
          <Layout className="w-5 h-5 text-gcp-yellow mx-auto mb-2" />
          <div className="text-2xl font-bold text-gcp-text">34</div>
          <div className="text-xs text-gcp-muted">GCP Services</div>
        </div>
      </div>
    </div>
  )
}
