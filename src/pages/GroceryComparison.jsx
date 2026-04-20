import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ShoppingCart, TrendingDown, Star, X, ChevronDown, Info,
  Tag, Package, ArrowUpDown,
} from 'lucide-react'
import {
  STORES, CATEGORIES, GROCERY_ITEMS,
  searchItems, getItemsByCategory, getCheapestStore, getMostExpensiveStore,
} from '../data/groceryPrices'

const STORE_KEYS = Object.keys(STORES)

function PriceBadge({ storeKey, data, isCheapest, isMostExpensive, compareUnit }) {
  const store = STORES[storeKey]
  return (
    <div
      className={`relative flex flex-col rounded-xl border p-3 transition-all ${
        isCheapest
          ? 'border-neon-emerald/50'
          : isMostExpensive
          ? 'border-neon-rose/20'
          : 'border-nebula-border'
      }`}
      style={{ background: isCheapest ? 'rgba(16,185,129,0.07)' : store.bg }}
    >
      {isCheapest && (
        <span className="absolute -top-2.5 left-3 flex items-center gap-1 bg-neon-emerald text-nebula-deep text-[10px] font-bold px-2 py-0.5 rounded-full">
          <Star className="w-2.5 h-2.5" /> BEST VALUE
        </span>
      )}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: store.color }}
        />
        <span className="text-xs font-semibold text-nebula-text truncate">{store.name}</span>
      </div>
      <div className="text-xl font-bold" style={{ color: isCheapest ? '#10b981' : store.color }}>
        £{data.packPrice.toFixed(2)}
      </div>
      <div className="text-[11px] text-nebula-muted mt-0.5">{data.packSize}</div>
      <div className="mt-2 pt-2 border-t border-nebula-border/50">
        <span className="text-xs text-nebula-dim">Unit: </span>
        <span className="text-xs font-semibold text-nebula-text">
          £{data.unitPrice.toFixed(2)} {compareUnit}
        </span>
      </div>
    </div>
  )
}

function ItemCard({ item, expandedId, setExpandedId }) {
  const cheapest = getCheapestStore(item)
  const mostExpensive = getMostExpensiveStore(item)
  const cheapestData = item.prices[cheapest]
  const isExpanded = expandedId === item.id

  const savings = (() => {
    const prices = Object.values(item.prices).map((p) => p.unitPrice)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return (((max - min) / max) * 100).toFixed(0)
  })()

  return (
    <motion.div
      layout
      className="rounded-2xl border border-nebula-border overflow-hidden"
      style={{ background: 'rgba(17,22,49,0.8)' }}
    >
      {/* Header */}
      <button
        onClick={() => setExpandedId(isExpanded ? null : item.id)}
        className="w-full flex items-center justify-between p-4 cursor-pointer bg-transparent border-0 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
            style={{ background: STORES[cheapest].bg, borderColor: STORES[cheapest].color + '40' }}
          >
            <ShoppingCart className="w-4 h-4" style={{ color: STORES[cheapest].color }} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-nebula-text text-sm leading-tight truncate">{item.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}
              >
                {item.category}
              </span>
              <span className="text-[11px] text-neon-emerald font-semibold flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Save up to {savings}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-nebula-dim">Best price</div>
            <div className="text-sm font-bold text-neon-emerald">
              £{cheapestData.packPrice.toFixed(2)}
              <span className="text-nebula-dim font-normal text-[11px] ml-1">@ {STORES[cheapest].name}</span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-nebula-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Expanded Detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-nebula-border/50 pt-4">
              {/* Store Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-4">
                {STORE_KEYS.map((storeKey) => {
                  const data = item.prices[storeKey]
                  if (!data) return null
                  return (
                    <PriceBadge
                      key={storeKey}
                      storeKey={storeKey}
                      data={data}
                      isCheapest={storeKey === cheapest}
                      isMostExpensive={storeKey === mostExpensive}
                      compareUnit={item.compareUnit}
                    />
                  )
                })}
              </div>

              {/* Summary bar */}
              <div className="flex flex-wrap gap-3 pt-3 border-t border-nebula-border/50">
                <div className="flex items-center gap-2 text-xs text-nebula-muted">
                  <Tag className="w-3.5 h-3.5 text-neon-emerald" />
                  Compared by: <span className="text-nebula-text font-medium">{item.compareUnit}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-nebula-muted">
                  <Package className="w-3.5 h-3.5 text-neon-cyan" />
                  Cheapest: <span className="font-medium" style={{ color: STORES[cheapest].color }}>{STORES[cheapest].name}</span>
                  <span className="text-nebula-text">— {item.prices[cheapest].packSize}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-nebula-muted">
                  <Info className="w-3.5 h-3.5 text-neon-amber" />
                  <span className="text-nebula-dim">{STORES[cheapest].note}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function StoreLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {STORE_KEYS.map((key) => (
        <div key={key} className="flex items-center gap-1.5 text-xs text-nebula-muted">
          <div className="w-2 h-2 rounded-full" style={{ background: STORES[key].color }} />
          {STORES[key].name}
        </div>
      ))}
    </div>
  )
}

export default function GroceryComparison() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  const [sortBy, setSortBy] = useState('name') // 'name' | 'savings'

  const filtered = useMemo(() => {
    let items = query.trim() ? searchItems(query) : getItemsByCategory(category)
    if (query.trim() && category !== 'All') {
      items = items.filter((i) => i.category === category)
    }
    if (sortBy === 'savings') {
      return [...items].sort((a, b) => {
        const savPct = (item) => {
          const prices = Object.values(item.prices).map((p) => p.unitPrice)
          return (Math.max(...prices) - Math.min(...prices)) / Math.max(...prices)
        }
        return savPct(b) - savPct(a)
      })
    }
    return [...items].sort((a, b) => a.name.localeCompare(b.name))
  }, [query, category, sortBy])

  const totalItems = GROCERY_ITEMS.length
  const avgSavings = useMemo(() => {
    const pcts = GROCERY_ITEMS.map((item) => {
      const prices = Object.values(item.prices).map((p) => p.unitPrice)
      return ((Math.max(...prices) - Math.min(...prices)) / Math.max(...prices)) * 100
    })
    return (pcts.reduce((a, b) => a + b, 0) / pcts.length).toFixed(0)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-neon-emerald" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-nebula-text">Grocery Price Comparison</h1>
            <p className="text-sm text-nebula-muted">UK supermarket prices — Costco vs Tesco, Lidl, Aldi, Iceland, Sainsbury's & Asda</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Items tracked', value: totalItems, color: '#00d4ff' },
            { label: 'Stores compared', value: STORE_KEYS.length, color: '#7c3aed' },
            { label: 'Avg max saving', value: `${avgSavings}%`, color: '#10b981' },
            { label: 'Categories', value: CATEGORIES.length - 1, color: '#f59e0b' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl border border-nebula-border p-3" style={{ background: 'rgba(17,22,49,0.6)' }}>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs text-nebula-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Costco note */}
      <div className="mb-6 rounded-xl border border-neon-amber/20 p-3 flex gap-2" style={{ background: 'rgba(245,158,11,0.05)' }}>
        <Info className="w-4 h-4 text-neon-amber shrink-0 mt-0.5" />
        <p className="text-xs text-nebula-muted">
          <span className="text-neon-amber font-semibold">Costco note:</span> Costco requires an annual membership (from £33.60/yr). Prices shown are per-unit costs from bulk pack prices — bulk buying offers the best Costco value but requires storage space.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nebula-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCategory('All') }}
            placeholder="Search for an item (e.g. chicken, milk, pasta…)"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-nebula-border text-nebula-text text-sm outline-none focus:border-neon-cyan/50 transition-colors"
            style={{ background: 'rgba(17,22,49,0.8)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-nebula-muted hover:text-nebula-text cursor-pointer bg-transparent border-0 p-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <button
          onClick={() => setSortBy((s) => (s === 'name' ? 'savings' : 'name'))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-nebula-border text-sm text-nebula-muted hover:text-nebula-text hover:border-neon-cyan/30 transition-all cursor-pointer bg-transparent"
          style={{ background: 'rgba(17,22,49,0.8)' }}
        >
          <ArrowUpDown className="w-4 h-4" />
          Sort: {sortBy === 'name' ? 'A–Z' : 'Best Savings'}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setQuery('') }}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
              category === cat && !query
                ? 'border-neon-cyan/40 text-neon-cyan'
                : 'border-nebula-border text-nebula-muted hover:text-nebula-text hover:border-nebula-border-bright'
            }`}
            style={{
              background: category === cat && !query ? 'rgba(0,212,255,0.08)' : 'rgba(17,22,49,0.6)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Store legend */}
      <div className="mb-4">
        <StoreLegend />
      </div>

      {/* Results */}
      <div className="mb-2 text-xs text-nebula-dim">
        {filtered.length} item{filtered.length !== 1 ? 's' : ''} shown
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-nebula-muted">
          <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No items found for "{query}"</p>
          <p className="text-sm mt-1">Try a different search term or browse by category.</p>
        </div>
      ) : (
        <motion.div layout className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ItemCard
                  item={item}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 text-center text-xs text-nebula-dim">
        Prices are indicative and may vary by location, promotion, and date. Always verify at point of purchase.
      </div>
    </div>
  )
}
