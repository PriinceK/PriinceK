import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, ArrowRight, Star, Tag, CheckCircle2, Filter } from 'lucide-react'
import { CHALLENGES } from '../data/challenges'

const DIFFICULTY_COLORS = {
  Beginner: '#34a853',
  Intermediate: '#4285f4',
  Advanced: '#fbbc04',
  Expert: '#ea4335',
}

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert']

function getCompletedChallenges() {
  try {
    return JSON.parse(localStorage.getItem('gcp-lab-progress') || '{}').challenges || {}
  } catch {
    return {}
  }
}

export default function ChallengesList() {
  const [filterDifficulty, setFilterDifficulty] = useState('All')
  const [completedChallenges, setCompletedChallenges] = useState({})

  useEffect(() => {
    setCompletedChallenges(getCompletedChallenges())
  }, [])

  const filtered = filterDifficulty === 'All'
    ? CHALLENGES
    : CHALLENGES.filter((c) => c.difficulty === filterDifficulty)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 page-enter">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-7 h-7 text-gcp-green" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gcp-text">Architecture Challenges</h1>
        </div>
        <p className="text-gcp-muted">
          Design GCP architectures to solve real-world problems. Select the right services,
          and get scored based on how well your design meets the requirements.
        </p>
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-2 mb-6" role="group" aria-label="Filter by difficulty">
        <Filter className="w-4 h-4 text-gcp-muted" aria-hidden="true" />
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setFilterDifficulty(d)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              filterDifficulty === d
                ? 'bg-gcp-green/15 border-gcp-green/40 text-gcp-green'
                : 'bg-transparent border-gcp-border text-gcp-muted hover:text-gcp-text'
            }`}
            aria-pressed={filterDifficulty === d}
          >
            {d}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gcp-muted">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No challenges match this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((challenge, idx) => {
            const completed = completedChallenges[challenge.id]
            return (
              <Link
                key={challenge.id}
                to={`/challenges/${challenge.id}`}
                className="group block bg-gcp-card border border-gcp-border rounded-2xl p-6 no-underline transition-all hover:border-gcp-green/40 hover:-translate-y-0.5 list-item-enter"
                style={{ animationDelay: `${idx * 80}ms` }}
                aria-label={`${challenge.title} - ${challenge.difficulty} - ${challenge.maxScore} points`}
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
                        <Tag className="w-3 h-3" aria-hidden="true" />
                        {challenge.category}
                      </span>
                      {completed && (
                        <span className="flex items-center gap-1 text-xs text-gcp-green">
                          <CheckCircle2 className="w-3 h-3" />
                          {completed.percentage}%
                        </span>
                      )}
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
                    <Star className="w-5 h-5 text-gcp-yellow" aria-hidden="true" />
                    <span className="text-sm font-bold text-gcp-text">{challenge.maxScore}</span>
                    <span className="text-xs text-gcp-muted">pts</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
