import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, GitCompareArrows, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import { SERVICE_COMPARISONS } from '../data/serviceComparisons'

export default function ComparisonDetail() {
  const { comparisonId } = useParams()
  const comp = SERVICE_COMPARISONS.find((c) => c.id === comparisonId)
  const [exerciseAnswers, setExerciseAnswers] = useState({})
  const [exerciseRevealed, setExerciseRevealed] = useState({})

  if (!comp) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-nebula-muted">Comparison not found.</p>
        <Link to="/compare" className="text-neon-cyan no-underline text-sm mt-2 inline-block">Back to comparisons</Link>
      </div>
    )
  }

  function handleExerciseAnswer(exIdx, optIdx) {
    if (exerciseRevealed[exIdx]) return
    setExerciseAnswers((prev) => ({ ...prev, [exIdx]: optIdx }))
    setExerciseRevealed((prev) => ({ ...prev, [exIdx]: true }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/compare" className="inline-flex items-center gap-1.5 text-sm text-nebula-muted hover:text-nebula-text no-underline mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to comparisons
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{comp.title}</h1>
        <p className="text-nebula-muted mb-8">{comp.subtitle}</p>
      </motion.div>

      {/* Comparison Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static rounded-2xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nebula-border">
                <th className="text-left px-4 py-3 text-nebula-dim font-medium" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Feature</th>
                {comp.services.map((s) => (
                  <th key={s} className="text-left px-4 py-3 text-neon-cyan font-semibold" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comp.comparison.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-nebula-surface/20' : ''}>
                  <td className="px-4 py-3 text-nebula-text font-medium whitespace-nowrap">{row.feature}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className="px-4 py-3 text-nebula-muted">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Decision Guide */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card-static rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-neon-amber" />
          <h3 className="text-sm font-semibold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Decision Guide</h3>
        </div>
        <p className="text-sm text-nebula-muted leading-relaxed">{comp.decisionGuide}</p>
      </motion.div>

      {/* Exercises */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-lg font-bold text-nebula-text mb-4" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Scenario Exercises</h3>
        <div className="space-y-6">
          {comp.exercises.map((ex, exIdx) => {
            const revealed = exerciseRevealed[exIdx]
            const selectedIdx = exerciseAnswers[exIdx]
            return (
              <div key={exIdx} className="glass-card-static rounded-2xl p-6">
                <div className="text-xs text-nebula-dim mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Scenario {exIdx + 1}</div>
                <p className="text-base text-nebula-text leading-relaxed mb-5">{ex.scenario}</p>
                <div className="space-y-2">
                  {ex.options.map((opt, optIdx) => {
                    const selected = selectedIdx === optIdx
                    const isBest = revealed && opt.points >= Math.max(...ex.options.map((o) => o.points))
                    let borderColor = 'border-nebula-border'
                    let bgColor = ''
                    if (revealed) {
                      if (isBest) { borderColor = 'border-neon-emerald/40'; bgColor = 'bg-neon-emerald/5' }
                      else if (selected) { borderColor = 'border-neon-amber/40'; bgColor = 'bg-neon-amber/5' }
                    }
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleExerciseAnswer(exIdx, optIdx)}
                        disabled={revealed}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${borderColor} ${bgColor} ${!revealed ? 'cursor-pointer hover:border-nebula-border-bright' : 'cursor-default'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {revealed && isBest ? <CheckCircle2 className="w-4 h-4 text-neon-emerald shrink-0" /> : revealed ? <div className="w-4 h-4" /> : <GitCompareArrows className="w-4 h-4 text-nebula-dim shrink-0" />}
                            <span className="text-sm text-nebula-text font-medium">{opt.service}</span>
                          </div>
                          {revealed && (
                            <span className="text-xs font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: opt.points >= 8 ? '#10b981' : opt.points >= 5 ? '#f59e0b' : '#f43f5e' }}>
                              {opt.points}/10
                            </span>
                          )}
                        </div>
                        {revealed && (
                          <p className="text-xs text-nebula-muted mt-2 ml-7">{opt.feedback}</p>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
