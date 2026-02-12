import { Link } from 'react-router-dom'
import { Trophy, ArrowRight, Star, Tag } from 'lucide-react'
import { CHALLENGES } from '../data/challenges'

const DIFFICULTY_COLORS = {
  Beginner: '#34a853',
  Intermediate: '#4285f4',
  Advanced: '#fbbc04',
  Expert: '#ea4335',
}

export default function ChallengesList() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-7 h-7 text-gcp-green" />
          <h1 className="text-3xl font-bold text-gcp-text">Architecture Challenges</h1>
        </div>
        <p className="text-gcp-muted">
          Design GCP architectures to solve real-world problems. Select the right services,
          and get scored based on how well your design meets the requirements.
        </p>
      </div>

      <div className="space-y-4">
        {CHALLENGES.map((challenge) => (
          <Link
            key={challenge.id}
            to={`/challenges/${challenge.id}`}
            className="group block bg-gcp-card border border-gcp-border rounded-2xl p-6 no-underline transition-all hover:border-gcp-green/40 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: DIFFICULTY_COLORS[challenge.difficulty] + '15',
                      color: DIFFICULTY_COLORS[challenge.difficulty],
                    }}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gcp-muted">
                    <Tag className="w-3 h-3" />
                    {challenge.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gcp-text mb-2">{challenge.title}</h2>
                <p className="text-sm text-gcp-muted leading-relaxed line-clamp-2 mb-3">
                  {challenge.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {challenge.requirements.slice(0, 3).map((req, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-gcp-darker rounded-md text-gcp-muted">
                      {req}
                    </span>
                  ))}
                  {challenge.requirements.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gcp-darker rounded-md text-gcp-muted">
                      +{challenge.requirements.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Star className="w-5 h-5 text-gcp-yellow" />
                <span className="text-sm font-bold text-gcp-text">{challenge.maxScore}</span>
                <span className="text-xs text-gcp-muted">pts</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
