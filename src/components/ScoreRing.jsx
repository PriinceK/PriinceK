export default function ScoreRing({ score, maxScore, size = 120, label }) {
  const percentage = Math.round((score / maxScore) * 100)
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius

  let color = '#f43f5e'
  let glowColor = 'rgba(244, 63, 94, 0.3)'
  if (percentage >= 80) { color = '#10b981'; glowColor = 'rgba(16, 185, 129, 0.3)' }
  else if (percentage >= 60) { color = '#f59e0b'; glowColor = 'rgba(245, 158, 11, 0.3)' }
  else if (percentage >= 40) { color = '#00d4ff'; glowColor = 'rgba(0, 212, 255, 0.3)' }

  return (
    <div
      className="flex flex-col items-center gap-2 relative"
      role="meter"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Score: ${percentage}%`}
    >
      <svg width={size} height={size} className="-rotate-90" style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(99, 102, 241, 0.1)"
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
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold" style={{ color, fontSize: size * 0.2, fontFamily: 'JetBrains Mono, monospace' }}>{percentage}%</span>
        <span className="text-nebula-muted" style={{ fontSize: size * 0.09, fontFamily: 'JetBrains Mono, monospace' }}>{score}/{maxScore}</span>
      </div>
      {label && <span className="text-sm text-nebula-muted mt-1">{label}</span>}
    </div>
  )
}
