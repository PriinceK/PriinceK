import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GitCompareArrows, Search, ArrowRight } from 'lucide-react'
import { SERVICE_COMPARISONS } from '../data/serviceComparisons'

const stagger = { animate: { transition: { staggerChildren: 0.06 } } }
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
}

const CATEGORY_COLORS = {
  compute: '#4285f4',
  storage: '#34a853',
  networking: '#ea4335',
  security: '#fbbc04',
  data: '#9c27b0',
  serverless: '#e91e63',
}

export default function CompareServices() {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return SERVICE_COMPARISONS
    const q = search.toLowerCase()
    return SERVICE_COMPARISONS.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.services.some((s) => s.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-neon-amber/10 flex items-center justify-center border border-neon-amber/20">
            <GitCompareArrows className="w-5 h-5 text-neon-amber" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Compare Services</h1>
        </div>
        <p className="text-nebula-muted max-w-xl">
          Head-to-head comparisons of commonly confused GCP services. Understand when to use each one through feature tables and scenario exercises.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nebula-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search comparisons..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nebula-surface/80 border border-nebula-border text-sm text-nebula-text placeholder-nebula-dim focus:outline-none focus:border-neon-cyan/40 transition-colors"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          />
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-nebula-muted">
          <GitCompareArrows className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No comparisons match your search.</p>
        </div>
      ) : (
        <motion.div className="grid sm:grid-cols-2 gap-4" variants={stagger} initial="initial" animate="animate">
          {filtered.map((comp) => {
            const color = CATEGORY_COLORS[comp.category] || '#00d4ff'
            return (
              <motion.div key={comp.id} variants={fadeUp}>
                <Link
                  to={`/compare/${comp.id}`}
                  className="group block glass-card rounded-2xl p-6 no-underline hover:-translate-y-0.5 transition-all h-full"
                >
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full mb-3 inline-block"
                    style={{ backgroundColor: color + '15', color, border: `1px solid ${color}25`, fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {comp.category}
                  </span>
                  <h2 className="text-lg font-bold text-nebula-text mb-1.5" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{comp.title}</h2>
                  <p className="text-sm text-nebula-muted mb-4">{comp.subtitle}</p>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {comp.services.map((s, i) => (
                      <span key={s}>
                        <span className="text-xs text-nebula-text bg-nebula-surface px-2 py-0.5 rounded-md border border-nebula-border" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{s}</span>
                        {i < comp.services.length - 1 && <span className="text-nebula-dim mx-1 text-xs">vs</span>}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-nebula-dim">{comp.exercises.length} exercises</span>
                    <ArrowRight className="w-4 h-4 text-nebula-dim group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
