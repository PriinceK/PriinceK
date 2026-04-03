/**
 * BSR-to-monthly-sales estimation for Amazon UK.
 *
 * Amazon does not publish exact sales figures. This uses a BSR-based
 * approximation model similar to tools like Jungle Scout and Helium 10.
 * Results are estimates only — treat as directional, not precise.
 *
 * Formula: estimate = category_base_rate / (BSR ^ 0.7)
 * Returned range is ±30% around the central estimate.
 */

const CATEGORY_RATES = {
  'Books': 3000,
  'Kindle Store': 2500,
  'Toys & Games': 1500,
  'Electronics': 800,
  'Computers & Accessories': 700,
  'Home & Kitchen': 1200,
  'Kitchen & Home': 1200,
  'Sports & Outdoors': 1000,
  'Garden & Outdoors': 700,
  'Health & Personal Care': 900,
  'Beauty': 1100,
  'Baby Products': 1300,
  'Pet Supplies': 900,
  'Clothing': 1400,
  'Shoes & Bags': 1000,
  'DIY & Tools': 600,
  'Automotive': 500,
  'Music': 400,
  'Movies & TV': 400,
  'Video Games': 600,
  'Software': 300,
  'Food & Grocery': 1600,
  'Office Products': 700,
  'Stationery & Office Supplies': 700,
  'default': 1000,
}

/**
 * Estimate monthly sales from a BSR value.
 * @param {number} bsr - Best Seller Rank (positive integer)
 * @param {string} [category] - Amazon category name
 * @returns {{ estimate: number, low: number, high: number } | null}
 */
export function estimateMonthlySales(bsr, category = 'default') {
  if (!bsr || bsr <= 0) return null

  // Match category (case-insensitive prefix match)
  let base = CATEGORY_RATES.default
  if (category) {
    const key = Object.keys(CATEGORY_RATES).find(
      (k) => category.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(category.toLowerCase())
    )
    if (key) base = CATEGORY_RATES[key]
  }

  const estimate = Math.max(1, Math.round(base / Math.pow(bsr, 0.7)))
  return {
    estimate,
    low: Math.max(1, Math.round(estimate * 0.7)),
    high: Math.round(estimate * 1.3),
  }
}

/**
 * Format a sales estimate as a human-readable string.
 * @param {{ estimate: number, low: number, high: number } | null} est
 * @returns {string}
 */
export function formatSalesEstimate(est) {
  if (!est) return 'N/A'
  if (est.estimate >= 1000) {
    const lo = (est.low / 1000).toFixed(1).replace(/\.0$/, '')
    const hi = (est.high / 1000).toFixed(1).replace(/\.0$/, '')
    return `${lo}k – ${hi}k / mo`
  }
  return `${est.low.toLocaleString()} – ${est.high.toLocaleString()} / mo`
}
