import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Search, ArrowRight, Layers } from 'lucide-react'
import { SERVICE_DEEP_DIVES } from '../data/serviceDeepDives'
import { GCP_SERVICE_CATEGORIES } from '../data/gcpServices'

const ALL_CATEGORIES = ['All', ...Object.keys(GCP_SERVICE_CATEGORIES)]

const stagger = { animate: { transition: { staggerChildren: 0.05 } } }
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
}

export default function ServiceCatalog() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    let result = SERVICE_DEEP_DIVES
    if (category !== 'All') result = result.filter((s) => s.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((s) => s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
    }
    return result
  }, [search, category])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20">
            <BookOpen className="w-5 h-5 text-neon-cyan" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Service Encyclopedia</h1>
        </div>
        <p className="text-nebula-muted max-w-xl">
          Deep-dive into GCP services. Learn use cases, pricing, architecture patterns, gotchas, and test your knowledge with quizzes.
        </p>
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nebula-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nebula-surface/80 border border-nebula-border text-sm text-nebula-text placeholder-nebula-dim focus:outline-none focus:border-neon-cyan/40 transition-colors"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filter by category">
          <Layers className="w-4 h-4 text-nebula-dim shrink-0" />
          {ALL_CATEGORIES.map((c) => {
            const cat = GCP_SERVICE_CATEGORIES[c]
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  category === c
                    ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan'
                    : 'bg-transparent border-nebula-border text-nebula-muted hover:text-nebula-text hover:border-nebula-border-bright'
                }`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                aria-pressed={category === c}
              >
                {c === 'All' ? 'All' : cat?.label || c}
              </button>
            )
          })}
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-nebula-muted">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No services match your search.</p>
        </div>
      ) : (
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={stagger} initial="initial" animate="animate">
          {filtered.map((service) => {
            const catMeta = GCP_SERVICE_CATEGORIES[service.category]
            return (
              <motion.div key={service.id} variants={fadeUp}>
                <Link
                  to={`/services/${service.id}`}
                  className="group block glass-card rounded-2xl p-5 no-underline hover:-translate-y-0.5 transition-all h-full"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: catMeta?.color + '15', color: catMeta?.color, border: `1px solid ${catMeta?.color}25`, fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {catMeta?.label || service.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-nebula-text mb-1.5" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{service.name}</h2>
                  <p className="text-sm text-nebula-muted leading-relaxed line-clamp-2 mb-4">{service.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {service.quiz.length} quiz questions
                    </span>
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
