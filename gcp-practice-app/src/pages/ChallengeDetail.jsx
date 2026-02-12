import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Plus, X, Lightbulb,
  Eye, EyeOff, RotateCcw, AlertTriangle, Sparkles
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
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-neon-amber mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-nebula-text mb-2">Challenge not found</h2>
        <Link to="/challenges" className="text-neon-cyan hover:underline">Back to challenges</Link>
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

  const currentIdx = CHALLENGES.indexOf(challenge)
  const nextChallenge = currentIdx < CHALLENGES.length - 1 ? CHALLENGES[currentIdx + 1] : null

  const results = submitted ? evaluate() : []
  const score = results.reduce((acc, r) => acc + (r.met ? r.points : 0), 0)
  const percentage = submitted ? Math.round((score / challenge.maxScore) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link to="/challenges" className="text-nebula-muted hover:text-nebula-text no-underline flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Challenges
        </Link>
        <span className="text-nebula-dim">/</span>
        <span className="text-nebula-text">{challenge.title}</span>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-static rounded-2xl p-6 mb-6"
      >
        <h1 className="text-2xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{challenge.title}</h1>
        <p className="text-sm text-nebula-muted leading-relaxed mb-4">{challenge.description}</p>

        <div className="mb-4">
          <h3 className="text-sm font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Requirements:</h3>
          <ul className="space-y-1.5">
            {challenge.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-nebula-muted">
                <span className="text-neon-cyan mt-0.5" aria-hidden="true">&bull;</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 text-sm text-neon-amber hover:text-neon-amber/80 transition-colors bg-transparent border-0 cursor-pointer"
          aria-expanded={showHints}
        >
          <Lightbulb className="w-4 h-4" aria-hidden="true" />
          {showHints ? 'Hide Hints' : `Show Hints (${challenge.hints.length})`}
        </button>
        {showHints && (
          <div className="mt-3 space-y-2 slide-down">
            {challenge.hints.map((hint, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2 text-sm text-neon-amber/80 bg-neon-amber/5 rounded-lg p-2.5 border border-neon-amber/10"
              >
                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                {hint}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Service picker */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card-static rounded-2xl p-5"
          >
            <h3 className="text-sm font-bold text-nebula-text mb-3" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Select GCP Services</h3>

            <input
              type="text"
              placeholder="Search services by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={submitted}
              className="w-full px-3 py-2.5 bg-nebula-deep/60 border border-nebula-border rounded-lg text-sm text-nebula-text placeholder-nebula-dim mb-3 outline-none focus:border-neon-cyan/40 transition-colors"
              aria-label="Search GCP services"
            />

            {/* Category filters */}
            <div className="flex flex-wrap gap-1.5 mb-4" role="group" aria-label="Filter by category">
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                  !activeCategory ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan' : 'bg-transparent border-nebula-border text-nebula-muted hover:text-nebula-text'
                }`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                aria-pressed={!activeCategory}
              >
                All
              </button>
              {Object.entries(GCP_SERVICE_CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                    activeCategory === key
                      ? ''
                      : 'bg-transparent border-nebula-border text-nebula-muted hover:text-nebula-text'
                  }`}
                  style={activeCategory === key ? { backgroundColor: cat.color + '12', borderColor: cat.color + '30', color: cat.color, fontFamily: 'JetBrains Mono, monospace' } : { fontFamily: 'JetBrains Mono, monospace' }}
                  aria-pressed={activeCategory === key}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Service grid */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-8 text-nebula-muted text-sm">
                No services match your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                {filteredServices.map((service) => {
                  const isSelected = selectedServices.some((s) => s.id === service.id)
                  return (
                    <button
                      key={service.id}
                      onClick={() => isSelected ? removeService(service.id) : addService(service)}
                      disabled={submitted}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neon-cyan/8 border-neon-cyan/30 text-nebula-text'
                          : 'bg-nebula-deep/40 border-nebula-border text-nebula-muted hover:border-neon-cyan/20 hover:text-nebula-text'
                      } ${submitted ? 'opacity-50 cursor-default' : ''}`}
                      aria-pressed={isSelected}
                      aria-label={`${service.name}: ${service.description}`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-neon-cyan shrink-0" aria-hidden="true" />
                      ) : (
                        <Plus className="w-4 h-4 shrink-0 text-nebula-dim" aria-hidden="true" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{service.name}</div>
                        <div className="truncate text-xs opacity-50">{service.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Selected services & results */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card-static rounded-2xl p-5"
          >
            <h3 className="text-sm font-bold text-nebula-text mb-3" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
              Your Architecture <span className="text-nebula-muted font-normal" style={{ fontFamily: 'JetBrains Mono, monospace' }}>({selectedServices.length})</span>
            </h3>

            {selectedServices.length === 0 ? (
              <p className="text-xs text-nebula-dim text-center py-5">
                Select GCP services from the left to build your architecture
              </p>
            ) : (
              <div className="space-y-1.5 mb-4">
                {selectedServices.map((service) => {
                  const cat = GCP_SERVICE_CATEGORIES[service.category]
                  return (
                    <div
                      key={service.id}
                      className="flex items-center gap-2 px-2.5 py-2 bg-nebula-deep/40 rounded-lg text-sm border border-nebula-border canvas-fade-in"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat?.color }} />
                      <span className="flex-1 text-nebula-text truncate text-xs">{service.name}</span>
                      {!submitted && (
                        <button
                          onClick={() => removeService(service.id)}
                          className="text-nebula-dim hover:text-neon-rose bg-transparent border-0 cursor-pointer p-0 transition-colors"
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
                className="w-full py-2.5 btn-neon rounded-lg text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
                style={selectedServices.length === 0 ? { background: 'rgba(99, 102, 241, 0.2)' } : {}}
              >
                Submit Design
              </button>
            ) : (
              <div className="space-y-3 score-reveal">
                <div className="text-center py-4 bg-nebula-deep/40 rounded-xl border border-nebula-border">
                  <ScoreRing score={score} maxScore={challenge.maxScore} size={100} />
                  {percentage >= 90 && (
                    <div className="flex items-center justify-center gap-1 mt-2 text-neon-emerald text-xs">
                      <Sparkles className="w-3 h-3" />
                      Excellent design!
                    </div>
                  )}
                </div>

                {results.map((r, idx) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2 text-xs"
                  >
                    {r.met ? (
                      <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0" aria-label="Met" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neon-rose shrink-0" aria-label="Not met" />
                    )}
                    <span className={r.met ? 'text-nebula-text' : 'text-nebula-muted'}>
                      {r.label} <span className="text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>({r.points}pts)</span>
                    </span>
                  </motion.div>
                ))}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-nebula-deep/40 border border-nebula-border rounded-lg text-nebula-text text-xs hover:bg-nebula-elevated/50 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-nebula-deep/40 border border-nebula-border rounded-lg text-nebula-text text-xs hover:bg-nebula-elevated/50 transition-colors cursor-pointer"
                    aria-expanded={showSolution}
                  >
                    {showSolution ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showSolution ? 'Hide' : 'Solution'}
                  </button>
                </div>

                {nextChallenge && (
                  <Link
                    to={`/challenges/${nextChallenge.id}`}
                    className="w-full flex items-center justify-center gap-1 py-2.5 btn-neon rounded-lg text-white text-xs no-underline"
                  >
                    Next Challenge <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            )}
          </motion.div>

          {showSolution && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-static rounded-2xl p-5 border-neon-emerald/20"
              style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}
            >
              <h3 className="text-sm font-bold text-neon-emerald mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Sample Solution</h3>
              <p className="text-xs text-nebula-text leading-relaxed mb-3">
                {challenge.sampleSolution.explanation}
              </p>
              <div className="space-y-1">
                {challenge.sampleSolution.services.map((sid) => {
                  const svc = GCP_SERVICES.find((s) => s.id === sid)
                  const isInYours = selectedServices.some((s) => s.id === sid)
                  return svc ? (
                    <div key={sid} className="text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-neon-emerald" aria-hidden="true" />
                      <span className={isInYours ? 'text-nebula-text' : 'text-nebula-muted'}>{svc.name}</span>
                      {isInYours && <span className="text-neon-emerald" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}>(in your design)</span>}
                    </div>
                  ) : null
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
