import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, DollarSign, Layers, AlertTriangle, HelpCircle, CheckCircle2, XCircle, Lightbulb, Zap } from 'lucide-react'
import { SERVICE_DEEP_DIVES } from '../data/serviceDeepDives'
import { GCP_SERVICE_CATEGORIES } from '../data/gcpServices'

const TABS = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'usecases', label: 'Use Cases', icon: Layers },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'gotchas', label: 'Gotchas', icon: AlertTriangle },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
]

export default function ServiceDetail() {
  const { serviceId } = useParams()
  const service = SERVICE_DEEP_DIVES.find((s) => s.id === serviceId)
  const [activeTab, setActiveTab] = useState('overview')
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizRevealed, setQuizRevealed] = useState({})

  if (!service) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-nebula-muted">Service not found.</p>
        <Link to="/services" className="text-neon-cyan no-underline text-sm mt-2 inline-block">Back to catalog</Link>
      </div>
    )
  }

  const catMeta = GCP_SERVICE_CATEGORIES[service.category]

  function handleQuizAnswer(qIdx, optIdx) {
    if (quizRevealed[qIdx]) return
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
    setQuizRevealed((prev) => ({ ...prev, [qIdx]: true }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-nebula-muted hover:text-nebula-text no-underline mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to catalog
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: catMeta?.color + '15', color: catMeta?.color, border: `1px solid ${catMeta?.color}25`, fontFamily: 'JetBrains Mono, monospace' }}
          >
            {catMeta?.label || service.category}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{service.name}</h1>
        <p className="text-nebula-muted text-lg">{service.tagline}</p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-1 mt-8 mb-6 overflow-x-auto pb-1" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === id
                ? 'text-neon-cyan'
                : 'text-nebula-muted hover:text-nebula-text'
            }`}
            role="tab"
            aria-selected={activeTab === id}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {activeTab === id && (
              <motion.div
                layoutId="service-tab"
                className="absolute inset-0 rounded-lg border border-neon-cyan/20"
                style={{ background: 'rgba(0, 212, 255, 0.06)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="glass-card-static rounded-2xl p-6">
                <p className="text-nebula-text leading-relaxed whitespace-pre-line">{service.overview}</p>
              </div>
              <div className="glass-card-static rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-nebula-text mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-neon-cyan" /> Key Features
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {service.keyFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-nebula-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neon-emerald shrink-0 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              {service.vsAlternatives?.length > 0 && (
                <div className="glass-card-static rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-nebula-text mb-4">When to Use vs. Alternatives</h3>
                  <div className="space-y-3">
                    {service.vsAlternatives.map((alt, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium text-neon-cyan">{service.name} vs {alt.service}:</span>
                        <span className="text-nebula-muted ml-1">{alt.comparison}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'usecases' && (
            <div className="space-y-4">
              {service.useCases.map((uc, i) => (
                <div key={i} className="glass-card-static rounded-2xl p-6">
                  <h3 className="text-base font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{uc.title}</h3>
                  <p className="text-sm text-nebula-muted leading-relaxed mb-3">{uc.description}</p>
                  {uc.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {uc.services.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-md bg-nebula-surface border border-nebula-border text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="glass-card-static rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-nebula-text mb-2">Pricing Model</h3>
                <p className="text-sm text-nebula-muted">{service.pricing.model}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-nebula-text mb-2">Tiers</h3>
                <ul className="space-y-1.5">
                  {service.pricing.tiers.map((t, i) => (
                    <li key={i} className="text-sm text-nebula-muted flex items-start gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-neon-amber shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-nebula-text mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-neon-amber" /> Cost Tips
                </h3>
                <ul className="space-y-1.5">
                  {service.pricing.tips.map((t, i) => (
                    <li key={i} className="text-sm text-nebula-muted">{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'gotchas' && (
            <div className="space-y-3">
              {service.gotchas.map((g, i) => (
                <div key={i} className="glass-card-static rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-neon-amber shrink-0 mt-0.5" />
                  <p className="text-sm text-nebula-text leading-relaxed">{g}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6">
              {service.quiz.map((q, qIdx) => (
                <div key={qIdx} className="glass-card-static rounded-2xl p-6">
                  <div className="text-xs text-nebula-dim mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Question {qIdx + 1}</div>
                  <p className="text-base font-medium text-nebula-text mb-4">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const selected = quizAnswers[qIdx] === optIdx
                      const revealed = quizRevealed[qIdx]
                      const isCorrect = opt.correct
                      let borderColor = 'border-nebula-border'
                      let bgColor = ''
                      if (revealed) {
                        if (isCorrect) {
                          borderColor = 'border-neon-emerald/40'
                          bgColor = 'bg-neon-emerald/5'
                        } else if (selected && !isCorrect) {
                          borderColor = 'border-neon-rose/40'
                          bgColor = 'bg-neon-rose/5'
                        }
                      } else if (selected) {
                        borderColor = 'border-neon-cyan/40'
                        bgColor = 'bg-neon-cyan/5'
                      }
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleQuizAnswer(qIdx, optIdx)}
                          disabled={revealed}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${borderColor} ${bgColor} ${
                            !revealed ? 'cursor-pointer hover:border-nebula-border-bright' : 'cursor-default'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="shrink-0 mt-0.5">
                              {revealed && isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-neon-emerald" />
                              ) : revealed && selected ? (
                                <XCircle className="w-4 h-4 text-neon-rose" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-nebula-border" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-nebula-text">{opt.text}</p>
                              {revealed && (
                                <p className="text-xs text-nebula-muted mt-1">{opt.explanation}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
