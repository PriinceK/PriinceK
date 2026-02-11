import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Clock, Target, BarChart3 } from 'lucide-react'
import { DAILY_SCENARIOS } from '../data/scenarios'

const DIFFICULTY_COLORS = {
  Beginner: '#34a853',
  Intermediate: '#4285f4',
  Advanced: '#fbbc04',
  Expert: '#ea4335',
}

export default function DayAsList() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-7 h-7 text-gcp-blue" />
          <h1 className="text-3xl font-bold text-gcp-text">A Day As...</h1>
        </div>
        <p className="text-gcp-muted">
          Step into realistic GCP Cloud Engineer scenarios. Make decisions, solve problems,
          and receive detailed feedback on your choices.
        </p>
      </div>

      <div className="space-y-4">
        {DAILY_SCENARIOS.map((scenario, idx) => (
          <Link
            key={scenario.id}
            to={`/day-as/${scenario.id}`}
            className="group block bg-gcp-card border border-gcp-border rounded-2xl p-6 no-underline transition-all hover:border-gcp-blue/40 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-gcp-muted">DAY {idx + 1}</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: DIFFICULTY_COLORS[scenario.difficulty] + '15',
                      color: DIFFICULTY_COLORS[scenario.difficulty],
                    }}
                  >
                    {scenario.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gcp-text mb-1">
                  {scenario.title}
                </h2>
                <p className="text-sm text-gcp-muted mb-3">
                  <span className="text-gcp-text font-medium">{scenario.role}</span> at {scenario.company}
                </p>
                <p className="text-sm text-gcp-muted leading-relaxed line-clamp-2">
                  {scenario.briefing}
                </p>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-gcp-muted">
                    <Target className="w-3.5 h-3.5" />
                    {scenario.objectives.length} objectives
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gcp-muted">
                    <BarChart3 className="w-3.5 h-3.5" />
                    {scenario.tasks.length} tasks
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gcp-muted">
                    <Clock className="w-3.5 h-3.5" />
                    {scenario.tasks.length * 10} pts possible
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gcp-muted group-hover:text-gcp-blue transition-colors shrink-0 mt-2" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
