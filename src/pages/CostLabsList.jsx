import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, ArrowRight, Target } from 'lucide-react'
import { COST_LABS } from '../data/costLabs'

const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
}

const DIFFICULTY_COLORS = { Beginner: '#10b981', Intermediate: '#00d4ff', Advanced: '#f43f5e' }

export default function CostLabsList() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-neon-emerald/10 flex items-center justify-center border border-neon-emerald/20">
            <DollarSign className="w-5 h-5 text-neon-emerald" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Cost Optimization Labs</h1>
        </div>
        <p className="text-nebula-muted max-w-xl">
          Interactive labs where you optimize GCP infrastructure costs. Adjust configurations, find savings, and hit the target budget.
        </p>
      </motion.div>

      <motion.div className="grid sm:grid-cols-2 gap-5" variants={stagger} initial="initial" animate="animate">
        {COST_LABS.map((lab) => {
          const diffColor = DIFFICULTY_COLORS[lab.difficulty] || '#00d4ff'
          return (
            <motion.div key={lab.id} variants={fadeUp}>
              <Link
                to={`/cost-labs/${lab.id}`}
                className="group block glass-card rounded-2xl p-6 no-underline hover:-translate-y-0.5 transition-all h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: diffColor + '12', color: diffColor, border: `1px solid ${diffColor}25`, fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {lab.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{lab.title}</h2>
                <p className="text-sm text-nebula-muted leading-relaxed mb-4 line-clamp-2">{lab.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-neon-rose" />
                      <span className="text-xs text-neon-rose" style={{ fontFamily: 'JetBrains Mono, monospace' }}>${lab.startingMonthlyCost.toLocaleString()}</span>
                    </div>
                    <span className="text-nebula-dim text-xs">→</span>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-neon-emerald" />
                      <span className="text-xs text-neon-emerald" style={{ fontFamily: 'JetBrains Mono, monospace' }}>${lab.targetMonthlyCost.toLocaleString()}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-nebula-dim group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
