import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, XCircle, Plus, X, Lightbulb,
  Eye, EyeOff, RotateCcw, AlertTriangle, Trophy
} from 'lucide-react'
import { CHALLENGES } from '../data/challenges'
import { GCP_SERVICES, GCP_SERVICE_CATEGORIES } from '../data/gcpServices'
import GcpServiceNode from '../components/GcpServiceNode'

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
        <AlertTriangle className="w-12 h-12 text-gcp-yellow mx-auto mb-4" />
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
    const results = challenge.evaluationCriteria.map((criterion) => {
      const met = criterion.services.some((sid) =>
        selectedServices.some((s) => s.id === sid)
      )
      return { ...criterion, met }
    })
    return results
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  function handleReset() {
    setSelectedServices([])
    setSubmitted(false)
    setShowSolution(false)
  }

  const results = submitted ? evaluate() : []
  const score = results.reduce((acc, r) => acc + (r.met ? r.points : 0), 0)
  const percentage = submitted ? Math.round((score / challenge.maxScore) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/challenges" className="flex items-center gap-2 text-gcp-muted hover:text-gcp-text text-sm mb-6 no-underline">
        <ArrowLeft className="w-4 h-4" /> Back to challenges
      </Link>

      {/* Header */}
      <div className="bg-gcp-card border border-gcp-border rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gcp-text mb-2">{challenge.title}</h1>
        <p className="text-sm text-gcp-muted leading-relaxed mb-4">{challenge.description}</p>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gcp-text mb-2">Requirements:</h3>
          <ul className="space-y-1">
            {challenge.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gcp-muted">
                <span className="text-gcp-blue mt-0.5">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 text-sm text-gcp-yellow hover:text-gcp-yellow/80 transition-colors bg-transparent border-0 cursor-pointer"
        >
          <Lightbulb className="w-4 h-4" />
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </button>
        {showHints && (
          <div className="mt-3 space-y-2">
            {challenge.hints.map((hint, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gcp-yellow/80 bg-gcp-yellow/5 rounded-lg p-2">
                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
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
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={submitted}
              className="w-full px-3 py-2 bg-gcp-darker border border-gcp-border rounded-lg text-sm text-gcp-text placeholder-gcp-muted mb-3 outline-none focus:border-gcp-blue"
            />

            {/* Category filters */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-xs px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                  !activeCategory ? 'bg-gcp-blue/15 border-gcp-blue/40 text-gcp-blue' : 'bg-transparent border-gcp-border text-gcp-muted hover:text-gcp-text'
                }`}
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
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Service grid */}
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
                  >
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-gcp-blue shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{service.name}</div>
                      <div className="truncate text-xs opacity-60">{service.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected services & results */}
        <div className="space-y-4">
          <div className="bg-gcp-card border border-gcp-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gcp-text mb-3">
              Your Architecture ({selectedServices.length} services)
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
                      className="flex items-center gap-2 px-2 py-1.5 bg-gcp-darker rounded-lg text-sm"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat?.color }} />
                      <span className="flex-1 text-gcp-text truncate">{service.name}</span>
                      {!submitted && (
                        <button
                          onClick={() => removeService(service.id)}
                          className="text-gcp-muted hover:text-gcp-red bg-transparent border-0 cursor-pointer p-0"
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
              <div className="space-y-3">
                <div className="text-center py-3 bg-gcp-darker rounded-xl">
                  <Trophy className="w-6 h-6 mx-auto mb-1" style={{ color: percentage >= 80 ? '#34a853' : percentage >= 60 ? '#fbbc04' : '#ea4335' }} />
                  <div className="text-2xl font-bold text-gcp-text">{score}/{challenge.maxScore}</div>
                  <div className="text-xs text-gcp-muted">{percentage}% score</div>
                </div>

                {results.map((r) => (
                  <div key={r.id} className="flex items-start gap-2 text-xs">
                    {r.met ? (
                      <CheckCircle2 className="w-4 h-4 text-gcp-green shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gcp-red shrink-0" />
                    )}
                    <span className={r.met ? 'text-gcp-text' : 'text-gcp-muted'}>
                      {r.label} ({r.points}pts)
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
                  >
                    {showSolution ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showSolution ? 'Hide' : 'Solution'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {showSolution && (
            <div className="bg-gcp-card border border-gcp-green/30 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-gcp-green mb-2">Sample Solution</h3>
              <p className="text-xs text-gcp-text leading-relaxed mb-3">
                {challenge.sampleSolution.explanation}
              </p>
              <div className="space-y-1">
                {challenge.sampleSolution.services.map((sid) => {
                  const svc = GCP_SERVICES.find((s) => s.id === sid)
                  return svc ? (
                    <div key={sid} className="text-xs text-gcp-muted flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-gcp-green" />
                      {svc.name}
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
