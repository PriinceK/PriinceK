const RAINFOREST_BASE = 'https://api.rainforestapi.com/request'
const SERPAPI_BASE = 'https://serpapi.com/search.json'

/**
 * Search Amazon UK for products by keyword.
 * Uses Rainforest API type=search endpoint.
 * @param {string} query
 * @returns {Promise<Array>} search_results array
 */
export async function searchAmazonUK(query) {
  const apiKey = import.meta.env.VITE_RAINFOREST_API_KEY
  if (!apiKey) throw new Error('VITE_RAINFOREST_API_KEY is not set in .env')

  const params = new URLSearchParams({
    api_key: apiKey,
    type: 'search',
    amazon_domain: 'amazon.co.uk',
    search_term: query,
  })

  const res = await fetch(`${RAINFOREST_BASE}?${params}`)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Rainforest API error ${res.status}: ${body}`)
  }
  const data = await res.json()
  return data.search_results ?? []
}

/**
 * Get detailed product data for a single ASIN on Amazon UK.
 * Returns BSR, price, seller count, FBA status, image, etc.
 * @param {string} asin
 * @returns {Promise<object|null>} product object
 */
export async function getProductDetails(asin) {
  const apiKey = import.meta.env.VITE_RAINFOREST_API_KEY
  if (!apiKey) throw new Error('VITE_RAINFOREST_API_KEY is not set in .env')

  const params = new URLSearchParams({
    api_key: apiKey,
    type: 'product',
    amazon_domain: 'amazon.co.uk',
    asin,
    include_summarization_attributes: 'true',
  })

  const res = await fetch(`${RAINFOREST_BASE}?${params}`)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Rainforest API error ${res.status}: ${body}`)
  }
  const data = await res.json()
  return data.product ?? null
}

/**
 * Search Google Shopping (UK) for a product query via SerpAPI.
 * Returns an array of shopping results from various retailers.
 * @param {string} query
 * @returns {Promise<Array>} shopping_results array (empty if no SerpAPI key)
 */
export async function searchWebPrices(query) {
  const apiKey = import.meta.env.VITE_SERPAPI_KEY
  if (!apiKey) return []

  const params = new URLSearchParams({
    api_key: apiKey,
    engine: 'google_shopping',
    q: query,
    gl: 'gb',
    hl: 'en',
  })

  const res = await fetch(`${SERPAPI_BASE}?${params}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.shopping_results ?? []
}
