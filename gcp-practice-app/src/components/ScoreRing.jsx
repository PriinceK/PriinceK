export default function ScoreRing({ score, maxScore, size = 120, label }) {
  const percentage = Math.round((score / maxScore) * 100)
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius

  let color = '#ea4335'
  if (percentage >= 80) color = '#34a853'
  else if (percentage >= 60) color = '#fbbc04'
  else if (percentage >= 40) color = '#4285f4'

  return (
    <div
      className="flex flex-col items-center gap-2 relative"
      role="meter"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Score: ${percentage}%`}
    >
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
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        <span className="text-2xl font-bold" style={{ color, fontSize: size * 0.18 }}>{percentage}%</span>
        <span className="text-xs text-gcp-muted" style={{ fontSize: size * 0.09 }}>{score}/{maxScore}</span>
      </div>
      {label && <span className="text-sm text-gcp-muted mt-1">{label}</span>}
    </div>
  )
}
