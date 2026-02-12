export default function ScoreRing({ score, maxScore, size = 120, label }) {
  const percentage = Math.round((score / maxScore) * 100)
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  let color = '#ea4335'
  if (percentage >= 80) color = '#34a853'
  else if (percentage >= 60) color = '#fbbc04'
  else if (percentage >= 40) color = '#4285f4'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2a2a4a"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: size * 0.25 }}>
        <span className="text-2xl font-bold" style={{ color }}>{percentage}%</span>
        <span className="text-xs text-gcp-muted">{score}/{maxScore}</span>
      </div>
      {label && <span className="text-sm text-gcp-muted mt-1">{label}</span>}
    </div>
  )
}
