import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Search, TrendingUp, Star, Users, BarChart2,
  ExternalLink, Package, AlertCircle, Loader2, ChevronRight,
  Tag, AlertTriangle, X, Info,
} from 'lucide-react'
import { searchAmazonUK, getProductDetails, searchWebPrices } from '../utils/amazonApi'
import { estimateMonthlySales, formatSalesEstimate } from '../utils/salesEstimator'

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
}

function StarRating({ rating, count }) {
  const full = Math.floor(rating ?? 0)
  const half = (rating ?? 0) - full >= 0.5
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < full ? 'text-amber-400' : i === full && half ? 'text-amber-400/50' : 'text-nebula-dim'}`}
          fill={i < full ? 'currentColor' : 'none'}
        />
      ))}
      {count != null && (
        <span className="text-nebula-muted text-xs ml-0.5">({count?.toLocaleString()})</span>
      )}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, sub, color = '#00d4ff', tooltip }) {
  const [showTip, setShowTip] = useState(false)
  return (
    <div className="rounded-xl border border-nebula-border p-4 flex flex-col gap-1 relative" style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-xs text-nebula-muted uppercase tracking-wider font-semibold">{label}</span>
        {tooltip && (
          <button
            className="ml-auto text-nebula-dim hover:text-nebula-muted transition-colors bg-transparent border-0 cursor-pointer p-0"
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
          >
            <Info className="w-3 h-3" />
          </button>
        )}
      </div>
      <span className="text-xl font-bold text-nebula-text">{value}</span>
      {sub && <span className="text-xs text-nebula-muted">{sub}</span>}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 z-10 w-56 rounded-lg border border-nebula-border p-3 text-xs text-nebula-muted"
            style={{ background: 'rgba(6,9,24,0.97)', backdropFilter: 'blur(12px)' }}
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ResultCard({ result, onAnalyse, isSelected, isLoading }) {
  const price = result?.price?.value ?? result?.price?.raw
  const image = result?.image ?? result?.main_image?.link
  const rating = result?.rating
  const ratingsTotal = result?.ratings_total

  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col ${
        isSelected
          ? 'border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
          : 'border-nebula-border hover:border-nebula-border/80 hover:shadow-[0_0_12px_rgba(0,212,255,0.06)]'
      }`}
      style={{ background: 'rgba(255,255,255,0.02)' }}
      onClick={() => onAnalyse(result)}
    >
      {/* Image */}
      <div className="aspect-square bg-nebula-surface/20 flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={result.title} className="w-full h-full object-contain p-3" />
        ) : (
          <Package className="w-12 h-12 text-nebula-dim" />
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-sm text-nebula-text font-medium line-clamp-2 leading-snug">{result.title}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-base font-bold" style={{ color: '#f59e0b' }}>
            {price ? `£${typeof price === 'number' ? price.toFixed(2) : price}` : 'Price N/A'}
          </span>
          {rating && <StarRating rating={rating} count={ratingsTotal} />}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onAnalyse(result) }}
          disabled={isLoading}
          className="w-full mt-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0"
          style={{
            background: isSelected ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.08)',
            color: '#f59e0b',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          {isLoading ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Analysing...</>
          ) : (
            <><BarChart2 className="w-3 h-3" /> Analyse</>
          )}
        </button>
      </div>
    </motion.div>
  )
}

export default function AmazonPriceComparison() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [selectedAsin, setSelectedAsin] = useState(null)
  const [productDetail, setProductDetail] = useState(null)
  const [webPrices, setWebPrices] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)

  const detailRef = useRef(null)
  const hasKey = !!import.meta.env.VITE_RAINFOREST_API_KEY

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResults([])
    setSelectedAsin(null)
    setProductDetail(null)
    setWebPrices([])
    try {
      const res = await searchAmazonUK(query.trim())
      setResults(res.slice(0, 12))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAnalyse(result) {
    const asin = result.asin
    if (!asin) return
    if (selectedAsin === asin) {
      // Toggle off
      setSelectedAsin(null)
      setProductDetail(null)
      setWebPrices([])
      return
    }
    setSelectedAsin(asin)
    setProductDetail(null)
    setWebPrices([])
    setDetailError(null)
    setDetailLoading(true)

    // Scroll to detail panel after a tick
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)

    try {
      const [detail, webRes] = await Promise.all([
        getProductDetails(asin),
        searchWebPrices(result.title ?? query),
      ])
      setProductDetail(detail)
      setWebPrices(webRes.slice(0, 8))
    } catch (err) {
      setDetailError(err.message)
    } finally {
      setDetailLoading(false)
    }
  }

  // Parse product detail fields
  const bsrList = productDetail?.bestsellers_rank ?? []
  const primaryBsr = bsrList[0]
  const currentPrice = productDetail?.buybox_winner?.price?.value
    ?? productDetail?.price?.value
    ?? productDetail?.buybox_winner?.price?.raw
  const wasPrice = productDetail?.buybox_winner?.rrp?.value
    ?? productDetail?.buybox_winner?.was_price?.value
  const savings = currentPrice && wasPrice ? ((wasPrice - currentPrice) / wasPrice * 100).toFixed(0) : null
  const sellerCount = productDetail?.sellers_results?.total_sellers
    ?? productDetail?.buybox_winner?.offer_count
  const isFBA = productDetail?.buybox_winner?.fulfillment?.is_sold_by_amazon
    ?? productDetail?.fulfillment?.is_fulfilled_by_amazon
    ?? productDetail?.buybox_winner?.fulfillment?.is_fulfilled_by_amazon
  const salesEst = primaryBsr ? estimateMonthlySales(primaryBsr.rank, primaryBsr.category) : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Header ── */}
      <motion.div {...fadeUp} className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{ background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.2)' }}>
            <ShoppingCart className="w-5 h-5" style={{ color: '#f59e0b' }} />
          </div>
          <h1 className="text-3xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
            Amazon UK Price Scout
          </h1>
        </div>
        <p className="text-nebula-muted">
          Search any product to see Amazon UK pricing, Best Seller Rank, estimated monthly sales, seller intelligence, and web price comparison.
        </p>
      </motion.div>

      {/* ── Config Warning ── */}
      {!hasKey && (
        <motion.div {...fadeUp} className="mb-6 flex items-start gap-3 rounded-xl border border-amber-400/30 p-4"
          style={{ background: 'rgba(245,158,11,0.06)' }}>
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-300 mb-0.5">API Key Missing</p>
            <p className="text-xs text-nebula-muted">
              Add <code className="text-amber-300 bg-amber-400/10 px-1 rounded">VITE_RAINFOREST_API_KEY</code> to your <code className="text-amber-300 bg-amber-400/10 px-1 rounded">.env</code> file, then restart the dev server.
              Get a key at <span className="text-amber-300">rainforestapi.com</span>.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Search Bar ── */}
      <motion.form {...fadeUp} onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nebula-dim" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Amazon UK… e.g. wireless earbuds, air fryer, running shoes"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-nebula-border text-nebula-text placeholder-nebula-dim text-sm outline-none focus:border-amber-400/40 transition-colors"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Searching…' : 'Search'}
        </button>
      </motion.form>

      {/* ── Error ── */}
      {error && (
        <motion.div {...fadeUp} className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 p-4"
          style={{ background: 'rgba(239,68,68,0.06)' }}>
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300 mb-0.5">Search Failed</p>
            <p className="text-xs text-nebula-muted">{error}</p>
          </div>
        </motion.div>
      )}

      {/* ── Results Grid ── */}
      {results.length > 0 && (
        <>
          <motion.p variants={fadeUp} initial="initial" animate="animate" className="text-xs text-nebula-dim mb-4">
            {results.length} results for <span className="text-nebula-muted font-medium">"{query}"</span> on Amazon UK — click a product to analyse it
          </motion.p>
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
          >
            {results.map((r) => (
              <ResultCard
                key={r.asin ?? r.position}
                result={r}
                onAnalyse={handleAnalyse}
                isSelected={selectedAsin === r.asin}
                isLoading={detailLoading && selectedAsin === r.asin}
              />
            ))}
          </motion.div>
        </>
      )}

      {/* ── Empty State ── */}
      {!loading && results.length === 0 && !error && (
        <motion.div {...fadeUp} className="text-center py-20 text-nebula-dim">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">Search for a product above to see Amazon UK pricing &amp; intelligence</p>
        </motion.div>
      )}

      {/* ── Detail Panel ── */}
      <AnimatePresence>
        {selectedAsin && (
          <motion.div
            ref={detailRef}
            key={selectedAsin}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-nebula-border overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-nebula-border">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-nebula-text">Product Analysis</span>
                {selectedAsin && (
                  <span className="text-xs text-nebula-dim font-mono bg-nebula-surface/40 px-2 py-0.5 rounded">
                    {selectedAsin}
                  </span>
                )}
              </div>
              <button
                onClick={() => { setSelectedAsin(null); setProductDetail(null); setWebPrices([]) }}
                className="p-1.5 rounded-lg text-nebula-dim hover:text-nebula-muted hover:bg-nebula-surface/50 transition-colors cursor-pointer bg-transparent border-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {detailLoading && (
              <div className="flex items-center justify-center gap-3 py-16 text-nebula-muted">
                <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                <span className="text-sm">Fetching product intelligence…</span>
              </div>
            )}

            {detailError && !detailLoading && (
              <div className="flex items-center gap-3 m-6 rounded-xl border border-red-500/30 p-4"
                style={{ background: 'rgba(239,68,68,0.06)' }}>
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{detailError}</p>
              </div>
            )}

            {productDetail && !detailLoading && (
              <div className="p-6 grid md:grid-cols-[200px_1fr] gap-6">

                {/* Left: image + title + links */}
                <div className="flex flex-col gap-4">
                  {(productDetail.main_image?.link || productDetail.images?.[0]?.link) && (
                    <div className="rounded-xl overflow-hidden border border-nebula-border bg-nebula-surface/10 aspect-square flex items-center justify-center p-3">
                      <img
                        src={productDetail.main_image?.link ?? productDetail.images?.[0]?.link}
                        alt={productDetail.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-nebula-text line-clamp-4 leading-snug mb-2">
                      {productDetail.title}
                    </p>
                    {productDetail.rating && (
                      <StarRating rating={productDetail.rating} count={productDetail.ratings_total} />
                    )}
                  </div>
                  <a
                    href={productDetail.link ?? `https://www.amazon.co.uk/dp/${selectedAsin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold no-underline transition-all"
                    style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View on Amazon UK
                  </a>
                </div>

                {/* Right: stats */}
                <div className="flex flex-col gap-4">

                  {/* Stat Cards Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

                    {/* Price */}
                    <StatCard
                      icon={Tag}
                      label="Price"
                      color="#f59e0b"
                      value={currentPrice ? `£${typeof currentPrice === 'number' ? currentPrice.toFixed(2) : currentPrice}` : 'N/A'}
                      sub={wasPrice && savings ? `RRP £${wasPrice.toFixed(2)} · Save ${savings}%` : wasPrice ? `RRP £${wasPrice.toFixed(2)}` : undefined}
                    />

                    {/* BSR */}
                    <StatCard
                      icon={TrendingUp}
                      label="Best Seller Rank"
                      color="#10b981"
                      value={primaryBsr ? `#${primaryBsr.rank?.toLocaleString()}` : 'N/A'}
                      sub={primaryBsr?.category ?? undefined}
                    />

                    {/* Monthly Sales Estimate */}
                    <StatCard
                      icon={BarChart2}
                      label="Est. Monthly Sales"
                      color="#a855f7"
                      value={salesEst ? formatSalesEstimate(salesEst) : 'N/A'}
                      sub={salesEst ? `~${salesEst.estimate.toLocaleString()} units/mo` : undefined}
                      tooltip="Estimated from BSR using industry-standard formulas (similar to Jungle Scout). Not official Amazon data — treat as a directional range only."
                    />

                    {/* Sellers */}
                    <StatCard
                      icon={Users}
                      label="Sellers"
                      color="#00d4ff"
                      value={sellerCount != null ? sellerCount.toString() : 'N/A'}
                      sub={isFBA != null ? (isFBA ? 'Fulfilled by Amazon (FBA)' : 'Merchant Fulfilled (FBM)') : undefined}
                    />
                  </div>

                  {/* Additional BSR categories */}
                  {bsrList.length > 1 && (
                    <div className="rounded-xl border border-nebula-border p-4" style={{ background: 'rgba(255,255,255,0.01)' }}>
                      <p className="text-xs text-nebula-muted uppercase tracking-wider font-semibold mb-3">All Category Rankings</p>
                      <div className="flex flex-col gap-2">
                        {bsrList.map((b, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-nebula-muted flex items-center gap-1.5">
                              <ChevronRight className="w-3 h-3 text-nebula-dim" />
                              {b.category}
                            </span>
                            <span className="text-nebula-text font-semibold font-mono">
                              #{b.rank?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Web Price Comparison */}
                  <div className="rounded-xl border border-nebula-border overflow-hidden" style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-nebula-border">
                      <ShoppingCart className="w-4 h-4 text-neon-cyan" />
                      <p className="text-xs text-nebula-muted uppercase tracking-wider font-semibold">Web Price Comparison (Google Shopping · UK)</p>
                    </div>

                    {webPrices.length === 0 && !import.meta.env.VITE_SERPAPI_KEY && (
                      <div className="px-4 py-4 flex items-start gap-3">
                        <Info className="w-4 h-4 text-nebula-dim shrink-0 mt-0.5" />
                        <p className="text-xs text-nebula-muted">
                          Add <code className="text-neon-cyan bg-neon-cyan/10 px-1 rounded">VITE_SERPAPI_KEY</code> to your <code className="text-neon-cyan bg-neon-cyan/10 px-1 rounded">.env</code> to enable Google Shopping price comparison.
                          Get a key at <span className="text-neon-cyan">serpapi.com</span>.
                        </p>
                      </div>
                    )}

                    {webPrices.length === 0 && import.meta.env.VITE_SERPAPI_KEY && !detailLoading && (
                      <div className="px-4 py-4 text-xs text-nebula-muted">No web price results found.</div>
                    )}

                    {webPrices.length > 0 && (
                      <div className="divide-y divide-nebula-border/50">
                        {/* Amazon UK row pinned at top */}
                        {currentPrice && (
                          <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'rgba(245,158,11,0.04)' }}>
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-nebula-surface/30 flex items-center justify-center shrink-0">
                              <ShoppingCart className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-nebula-text">Amazon UK</p>
                              <p className="text-xs text-nebula-dim">Prime eligible</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>
                                £{typeof currentPrice === 'number' ? currentPrice.toFixed(2) : currentPrice}
                              </p>
                              <span className="text-[10px] font-semibold text-amber-400/70 bg-amber-400/10 px-1.5 py-0.5 rounded">current</span>
                            </div>
                          </div>
                        )}
                        {webPrices.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-nebula-surface/20 transition-colors">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-nebula-surface/30 flex items-center justify-center shrink-0">
                              {item.thumbnail ? (
                                <img src={item.thumbnail} alt={item.source} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-4 h-4 text-nebula-dim" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-nebula-text truncate">{item.source ?? 'Retailer'}</p>
                              <p className="text-xs text-nebula-dim truncate">{item.title}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <p className="text-sm font-bold text-nebula-text">{item.price}</p>
                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded text-nebula-dim hover:text-neon-cyan transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Disclaimer */}
                  <p className="text-[11px] text-nebula-dim flex items-start gap-1.5">
                    <Info className="w-3 h-3 shrink-0 mt-0.5" />
                    Monthly sales estimates are derived from BSR using industry-standard formulas and are approximate. Amazon does not publish official sales data.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
