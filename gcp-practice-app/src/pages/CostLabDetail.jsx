import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, DollarSign, Target, AlertTriangle, Lightbulb, Trophy } from 'lucide-react'
import { COST_LABS } from '../data/costLabs'

export default function CostLabDetail() {
  const { labId } = useParams()
  const lab = COST_LABS.find((l) => l.id === labId)
  const [selections, setSelections] = useState(() => {
    if (!lab) return {}
    const initial = {}
    for (const svc of lab.services) {
      initial[svc.name] = {}
      for (const [key, config] of Object.entries(svc.configOptions)) {
        initial[svc.name][key] = config.defaultIndex
      }
    }
    return initial
  })
  const [showTips, setShowTips] = useState(false)

  if (!lab) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-nebula-muted">Lab not found.</p>
        <Link to="/cost-labs" className="text-neon-cyan no-underline text-sm mt-2 inline-block">Back to labs</Link>
      </div>
    )
  }

  const currentCost = useMemo(() => {
    let total = 0
    for (const svc of lab.services) {
      let serviceCost = 0
      let multiplier = 1
      let discount = 0
      for (const [key, config] of Object.entries(svc.configOptions)) {
        const selectedIdx = selections[svc.name]?.[key] ?? config.defaultIndex
        const choice = config.choices[selectedIdx]
        if (choice.monthlyCost !== undefined) {
          serviceCost += choice.monthlyCost
        }
        if (choice.multiplier !== undefined) {
          multiplier = choice.multiplier
        }
        if (choice.discount !== undefined) {
          discount = choice.discount
        }
      }
      total += serviceCost * multiplier * (1 - discount)
    }
    return Math.round(total)
  }, [lab, selections])

  const savings = lab.startingMonthlyCost - currentCost
  const savingsPercent = Math.round((savings / lab.startingMonthlyCost) * 100)
  const metTarget = currentCost <= lab.targetMonthlyCost

  const scoreLevel = Object.entries(lab.scoring).find(([, v]) => currentCost <= v.threshold)?.[1] || lab.scoring.poor

  function updateSelection(serviceName, configKey, index) {
    setSelections((prev) => ({
      ...prev,
      [serviceName]: { ...prev[serviceName], [configKey]: index },
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/cost-labs" className="inline-flex items-center gap-1.5 text-sm text-nebula-muted hover:text-nebula-text no-underline mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to labs
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{lab.title}</h1>
        <p className="text-nebula-muted mb-4">{lab.scenario}</p>

        {/* Constraints */}
        <div className="flex flex-wrap gap-2 mb-8">
          {lab.constraints.map((c, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-neon-amber/8 border border-neon-amber/20 text-neon-amber flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> {c}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Cost Dashboard */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static rounded-2xl p-6 mb-8 sticky top-20 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-nebula-dim mb-1">Starting Cost</div>
            <div className="text-lg font-bold text-neon-rose line-through" style={{ fontFamily: 'JetBrains Mono, monospace' }}>${lab.startingMonthlyCost.toLocaleString()}/mo</div>
          </div>
          <div>
            <div className="text-xs text-nebula-dim mb-1">Current Cost</div>
            <div className={`text-2xl font-bold ${metTarget ? 'text-neon-emerald' : 'text-neon-amber'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>${currentCost.toLocaleString()}/mo</div>
          </div>
          <div>
            <div className="text-xs text-nebula-dim mb-1">Target</div>
            <div className="text-lg font-bold text-neon-cyan" style={{ fontFamily: 'JetBrains Mono, monospace' }}>${lab.targetMonthlyCost.toLocaleString()}/mo</div>
          </div>
          <div>
            <div className="text-xs text-nebula-dim mb-1">Savings</div>
            <div className={`text-lg font-bold ${savings > 0 ? 'text-neon-emerald' : 'text-nebula-dim'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {savings > 0 ? `-$${savings.toLocaleString()}` : '$0'} {savings > 0 && <span className="text-xs">({savingsPercent}%)</span>}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 rounded-full bg-nebula-surface overflow-hidden relative">
          <div className="absolute h-full w-px bg-neon-cyan/60" style={{ left: `${Math.min(100, (lab.targetMonthlyCost / lab.startingMonthlyCost) * 100)}%` }} />
          <motion.div
            className={`h-full rounded-full ${metTarget ? 'bg-neon-emerald' : 'bg-neon-amber'}`}
            animate={{ width: `${Math.max(0, Math.min(100, (1 - savings / lab.startingMonthlyCost) * 100))}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-nebula-dim">$0</span>
          <span className="text-xs text-nebula-dim">${lab.startingMonthlyCost.toLocaleString()}</span>
        </div>
        {metTarget && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-neon-emerald" />
            <span className="text-neon-emerald font-medium">{scoreLevel.label}:</span>
            <span className="text-nebula-muted">{scoreLevel.message}</span>
          </div>
        )}
      </motion.div>

      {/* Service Configurations */}
      <div className="space-y-6 mb-8">
        {lab.services.map((svc, svcIdx) => (
          <motion.div
            key={svc.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + svcIdx * 0.05 }}
            className="glass-card-static rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-neon-cyan" />
              <h3 className="text-base font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{svc.name}</h3>
              <span className="text-xs text-nebula-dim ml-auto">{svc.description}</span>
            </div>
            <div className="space-y-4">
              {Object.entries(svc.configOptions).map(([key, config]) => {
                const selectedIdx = selections[svc.name]?.[key] ?? config.defaultIndex
                return (
                  <div key={key}>
                    <label className="text-sm text-nebula-muted mb-2 block">{config.label}</label>
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(config.choices.length, 3)}, 1fr)` }}>
                      {config.choices.map((choice, cIdx) => {
                        const active = selectedIdx === cIdx
                        const isOptimal = cIdx === config.optimalIndex
                        return (
                          <button
                            key={cIdx}
                            onClick={() => updateSelection(svc.name, key, cIdx)}
                            className={`text-xs p-3 rounded-xl border transition-all cursor-pointer text-left ${
                              active
                                ? 'border-neon-cyan/40 bg-neon-cyan/8 text-neon-cyan'
                                : 'border-nebula-border text-nebula-muted hover:border-nebula-border-bright'
                            }`}
                          >
                            <div className="font-medium mb-0.5">{choice.label}</div>
                            {choice.monthlyCost !== undefined && (
                              <div style={{ fontFamily: 'JetBrains Mono, monospace' }}>${choice.monthlyCost}/mo</div>
                            )}
                            {choice.discount !== undefined && choice.discount > 0 && (
                              <div className="text-neon-emerald">{Math.round(choice.discount * 100)}% off</div>
                            )}
                            {choice.multiplier !== undefined && (
                              <div style={{ fontFamily: 'JetBrains Mono, monospace' }}>×{choice.multiplier}</div>
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
        ))}
      </div>

      {/* Tips */}
      <div className="glass-card-static rounded-2xl p-6">
        <button
          onClick={() => setShowTips((p) => !p)}
          className="flex items-center gap-2 text-sm cursor-pointer w-full text-left"
        >
          <Lightbulb className="w-4 h-4 text-neon-amber" />
          <span className="font-semibold text-nebula-text">Optimization Tips</span>
          <span className="text-xs text-nebula-dim ml-auto">{showTips ? 'Hide' : 'Show'}</span>
        </button>
        {showTips && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-2">
            {lab.tips.map((tip, i) => (
              <p key={i} className="text-sm text-nebula-muted flex items-start gap-2">
                <span className="text-neon-amber">•</span> {tip}
              </p>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
