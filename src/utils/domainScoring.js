// Maps scenario/challenge answers to GCP knowledge domains
// Domains: compute, storage, networking, security, data, ai, devops, serverless

export const DOMAINS = [
  { id: 'compute', label: 'Compute', color: '#4285f4' },
  { id: 'storage', label: 'Storage & DB', color: '#34a853' },
  { id: 'networking', label: 'Networking', color: '#ea4335' },
  { id: 'security', label: 'Security', color: '#fbbc04' },
  { id: 'data', label: 'Data Analytics', color: '#9c27b0' },
  { id: 'ai', label: 'AI & ML', color: '#ff6d00' },
  { id: 'devops', label: 'DevOps', color: '#00bcd4' },
  { id: 'serverless', label: 'Serverless', color: '#e91e63' },
]

// Keyword-to-domain mapping for auto-classifying scenario tasks
const DOMAIN_KEYWORDS = {
  compute: ['compute engine', 'vm', 'virtual machine', 'instance', 'machine type', 'gke', 'kubernetes', 'node pool', 'app engine', 'autoscaling', 'instance group', 'mig'],
  storage: ['cloud storage', 'bucket', 'cloud sql', 'spanner', 'firestore', 'bigtable', 'memorystore', 'database', 'sql', 'nosql', 'persistence', 'disk', 'ssd'],
  networking: ['vpc', 'subnet', 'firewall', 'load balancer', 'cdn', 'dns', 'cloud armor', 'nat', 'vpn', 'interconnect', 'peering', 'ip address', 'network'],
  security: ['iam', 'role', 'permission', 'service account', 'kms', 'encryption', 'secret manager', 'identity', 'access', 'security', 'policy', 'audit'],
  data: ['bigquery', 'dataflow', 'dataproc', 'pub/sub', 'pubsub', 'composer', 'pipeline', 'etl', 'analytics', 'streaming', 'batch processing', 'data warehouse'],
  ai: ['vertex ai', 'ml', 'machine learning', 'model', 'training', 'prediction', 'vision ai', 'natural language', 'tensorflow', 'automl'],
  devops: ['cloud build', 'artifact registry', 'cloud deploy', 'monitoring', 'logging', 'ci/cd', 'deployment', 'container registry', 'alerting', 'sre', 'sli', 'slo'],
  serverless: ['cloud run', 'cloud functions', 'serverless', 'function', 'event-driven', 'scale to zero', 'trigger'],
}

export function classifyTextToDomain(text) {
  const lower = text.toLowerCase()
  const scores = {}
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    scores[domain] = keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0)
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return best[1] > 0 ? best[0] : 'compute' // default to compute
}

export function calculateDomainPercentages(domainScores) {
  return DOMAINS.map(({ id, label, color }) => {
    const score = domainScores[id]
    const percentage = score && score.total > 0
      ? Math.round((score.correct / score.total) * 100)
      : 0
    return { id, label, color, percentage, correct: score?.correct || 0, total: score?.total || 0 }
  })
}

export function getOverallScore(domainScores) {
  let totalCorrect = 0
  let totalQuestions = 0
  for (const score of Object.values(domainScores)) {
    totalCorrect += score.correct || 0
    totalQuestions += score.total || 0
  }
  return totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
}

export function getWeakestDomains(domainScores, count = 3) {
  return calculateDomainPercentages(domainScores)
    .filter((d) => d.total > 0)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, count)
}

export function getStrongestDomains(domainScores, count = 3) {
  return calculateDomainPercentages(domainScores)
    .filter((d) => d.total > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, count)
}
