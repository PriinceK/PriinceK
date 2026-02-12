import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Plus, X, Lightbulb,
  Eye, EyeOff, RotateCcw, AlertTriangle, Trophy, Sparkles
} from 'lucide-react'
import { CHALLENGES } from '../data/challenges'
import { GCP_SERVICES, GCP_SERVICE_CATEGORIES } from '../data/gcpServices'
import ScoreRing from '../components/ScoreRing'

function saveProgress(challengeId, score, maxScore) {
  try {
    const data = JSON.parse(localStorage.getItem('gcp-lab-progress') || '{}')
    if (!data.challenges) data.challenges = {}
    const existing = data.challenges[challengeId]
    const percentage = Math.round((score / maxScore) * 100)
    if (!existing || percentage > existing.percentage) {
      data.challenges[challengeId] = { score, maxScore, percentage, completedAt: new Date().toISOString() }
    }
    localStorage.setItem('gcp-lab-progress', JSON.stringify(data))
  } catch {}
}

export default function ChallengeDetail() {
  const { challengeId } = useParams()
  const challenge = CHALLENGES.find((c) => c.id === challengeId)

  const [selectedServices, setSelectedServices] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)

  if (!challenge) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center page-enter">
        <AlertTriangle className="w-12 h-12 text-gcp-yellow mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-gcp-text mb-2">Challenge not found</h2>
        <Link to="/challenges" className="text-gcp-blue">Back to challenges</Link>
      </div>
    )
  }

  const filteredServices = GCP_SERVICES.filter((s) => {
    const matchesSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !activeCategory || s.category === activeCategory
    return matchesSearch && matchesCategory
  })

  function addService(service) {
    if (submitted) return
    if (!selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices((prev) => [...prev, service])
    }
  }

  function removeService(serviceId) {
    if (submitted) return
    setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId))
  }

  function evaluate() {
    return challenge.evaluationCriteria.map((criterion) => {
      const met = criterion.services.some((sid) =>
        selectedServices.some((s) => s.id === sid)
      )
      return { ...criterion, met }
    })
  }

  function handleSubmit() {
    setSubmitted(true)
    const results = evaluate()
    const score = results.reduce((acc, r) => acc + (r.met ? r.points : 0), 0)
    saveProgress(challenge.id, score, challenge.maxScore)
  }

  function handleReset() {
    setSelectedServices([])
    setSubmitted(false)
    setShowSolution(false)
  }

  // Navigate to next challenge
  const currentIdx = CHALLENGES.indexOf(challenge)
  const nextChallenge = currentIdx < CHALLENGES.length - 1 ? CHALLENGES[currentIdx + 1] : null

  const results = submitted ? evaluate() : []
  const score = results.reduce((acc, r) => acc + (r.met ? r.points : 0), 0)
  const percentage = submitted ? Math.round((score / challenge.maxScore) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 page-enter">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link to="/challenges" className="text-gcp-muted hover:text-gcp-text no-underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Challenges
        </Link>
        <span className="text-gcp-muted">/</span>
        <span className="text-gcp-text">{challenge.title}</span>
      </div>

      {/* Header */}
      <div className="bg-gcp-card border border-gcp-border rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gcp-text mb-2">{challenge.title}</h1>
        <p className="text-sm text-gcp-muted leading-relaxed mb-4">{challenge.description}</p>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gcp-text mb-2">Requirements:</h3>
          <ul className="space-y-1">
            {challenge.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gcp-muted">
                <span className="text-gcp-blue mt-0.5" aria-hidden="true">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 text-sm text-gcp-yellow hover:text-gcp-yellow/80 transition-colors bg-transparent border-0 cursor-pointer"
          aria-expanded={showHints}
        >
          <Lightbulb className="w-4 h-4" aria-hidden="true" />
          {showHints ? 'Hide Hints' : `Show Hints (${challenge.hints.length})`}
        </button>
        {showHints && (
          <div className="mt-3 space-y-2 slide-down">
            {challenge.hints.map((hint, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gcp-yellow/80 bg-gcp-yellow/5 rounded-lg p-2 list-item-enter" style={{ animationDelay: `${i * 80}ms` }}>
                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                {hint}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Service picker */}
        <div className="lg:col-span-2">
          <div className="bg-gcp-card border border-gcp-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gcp-text mb-3">Select GCP Services</h3>

            <input
              type="text"
              placeholder="Search services by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={submitted}
              className="w-full px-3 py-2 bg-gcp-darker border border-gcp-border rounded-lg text-sm text-gcp-text placeholder-gcp-muted mb-3 outline-none focus:border-gcp-blue"
              aria-label="Search GCP services"
            />

            {/* Category filters */}
            <div className="flex flex-wrap gap-1.5 mb-3" role="group" aria-label="Filter by category">
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-xs px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                  !activeCategory ? 'bg-gcp-blue/15 border-gcp-blue/40 text-gcp-blue' : 'bg-transparent border-gcp-border text-gcp-muted hover:text-gcp-text'
                }`}
                aria-pressed={!activeCategory}
              >
                All
              </button>
              {Object.entries(GCP_SERVICE_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                  className={`text-xs px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                    activeCategory === key
                      ? 'border-opacity-40 text-opacity-100'
                      : 'bg-transparent border-gcp-border text-gcp-muted hover:text-gcp-text'
                  }`}
                  style={activeCategory === key ? { backgroundColor: cat.color + '15', borderColor: cat.color + '40', color: cat.color } : {}}
                  aria-pressed={activeCategory === key}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Service grid */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-8 text-gcp-muted text-sm">
                No services match your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-1">
                {filteredServices.map((service) => {
                  const isSelected = selectedServices.some((s) => s.id === service.id)
                  return (
                    <button
                      key={service.id}
                      onClick={() => isSelected ? removeService(service.id) : addService(service)}
                      disabled={submitted}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gcp-blue/10 border-gcp-blue/40 text-gcp-text'
                          : 'bg-gcp-darker border-gcp-border text-gcp-muted hover:border-gcp-blue/30 hover:text-gcp-text'
                      } ${submitted ? 'opacity-60 cursor-default' : ''}`}
                      aria-pressed={isSelected}
                      aria-label={`${service.name}: ${service.description}`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-gcp-blue shrink-0" aria-hidden="true" />
                      ) : (
                        <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{service.name}</div>
                        <div className="truncate text-xs opacity-60">{service.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected services & results */}
        <div className="space-y-4">
          <div className="bg-gcp-card border border-gcp-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gcp-text mb-3">
              Your Architecture ({selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''})
            </h3>

            {selectedServices.length === 0 ? (
              <p className="text-xs text-gcp-muted text-center py-4">
                Select GCP services from the left to build your architecture
              </p>
            ) : (
              <div className="space-y-1.5 mb-4">
                {selectedServices.map((service) => {
                  const cat = GCP_SERVICE_CATEGORIES[service.category]
                  return (
                    <div
                      key={service.id}
                      className="flex items-center gap-2 px-2 py-1.5 bg-gcp-darker rounded-lg text-sm canvas-fade-in"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat?.color }} />
                      <span className="flex-1 text-gcp-text truncate">{service.name}</span>
                      {!submitted && (
                        <button
                          onClick={() => removeService(service.id)}
                          className="text-gcp-muted hover:text-gcp-red bg-transparent border-0 cursor-pointer p-0"
                          aria-label={`Remove ${service.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedServices.length === 0}
                className="w-full py-2 bg-gcp-green rounded-lg text-white text-sm font-medium hover:bg-gcp-green/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0"
              >
                Submit Design
              </button>
            ) : (
              <div className="space-y-3 score-reveal">
                <div className="text-center py-3 bg-gcp-darker rounded-xl">
                  <div className="relative inline-block">
                    <ScoreRing score={score} maxScore={challenge.maxScore} size={100} />
                  </div>
                  {percentage >= 90 && (
                    <div className="flex items-center justify-center gap-1 mt-1 text-gcp-green text-xs">
                      <Sparkles className="w-3 h-3" />
                      Excellent design!
                    </div>
                  )}
                </div>

                {results.map((r, idx) => (
                  <div key={r.id} className="flex items-start gap-2 text-xs list-item-enter" style={{ animationDelay: `${idx * 50}ms` }}>
                    {r.met ? (
                      <CheckCircle2 className="w-4 h-4 text-gcp-green shrink-0" aria-label="Met" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gcp-red shrink-0" aria-label="Not met" />
                    )}
                    <span className={r.met ? 'text-gcp-text' : 'text-gcp-muted'}>
                      {r.label} <span className="text-gcp-muted">({r.points}pts)</span>
                    </span>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-gcp-darker border border-gcp-border rounded-lg text-gcp-text text-xs hover:bg-gcp-border transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-gcp-darker border border-gcp-border rounded-lg text-gcp-text text-xs hover:bg-gcp-border transition-colors cursor-pointer"
                    aria-expanded={showSolution}
                  >
                    {showSolution ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showSolution ? 'Hide' : 'Solution'}
                  </button>
                </div>

                {nextChallenge && (
                  <Link
                    to={`/challenges/${nextChallenge.id}`}
                    className="w-full flex items-center justify-center gap-1 py-2 bg-gcp-blue rounded-lg text-white text-xs no-underline hover:bg-gcp-blue/80 transition-colors"
                  >
                    Next Challenge <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {showSolution && (
            <div className="bg-gcp-card border border-gcp-green/30 rounded-2xl p-4 slide-down">
              <h3 className="text-sm font-semibold text-gcp-green mb-2">Sample Solution</h3>
              <p className="text-xs text-gcp-text leading-relaxed mb-3">
                {challenge.sampleSolution.explanation}
              </p>
              <div className="space-y-1">
                {challenge.sampleSolution.services.map((sid) => {
                  const svc = GCP_SERVICES.find((s) => s.id === sid)
                  const isInYours = selectedServices.some((s) => s.id === sid)
                  return svc ? (
                    <div key={sid} className="text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-gcp-green" aria-hidden="true" />
                      <span className={isInYours ? 'text-gcp-text' : 'text-gcp-muted'}>{svc.name}</span>
                      {isInYours && <span className="text-[10px] text-gcp-green">(in your design)</span>}
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
