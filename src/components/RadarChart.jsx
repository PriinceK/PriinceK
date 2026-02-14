import { motion } from 'framer-motion'

const SIZE = 300
const CENTER = SIZE / 2
const RADIUS = 110
const LEVELS = 5

export default function RadarChart({ data = [], size = SIZE }) {
  const scale = size / SIZE
  const count = data.length
  if (count < 3) return null

  const angleStep = (2 * Math.PI) / count

  function getPoint(index, value) {
    const angle = angleStep * index - Math.PI / 2
    const r = (value / 100) * RADIUS
    return {
      x: CENTER + r * Math.cos(angle),
      y: CENTER + r * Math.sin(angle),
    }
  }

  function getLevelPoints(level) {
    const r = (level / LEVELS) * RADIUS
    return Array.from({ length: count }, (_, i) => {
      const angle = angleStep * i - Math.PI / 2
      return `${CENTER + r * Math.cos(angle)},${CENTER + r * Math.sin(angle)}`
    }).join(' ')
  }

  const dataPoints = data.map((d, i) => getPoint(i, d.percentage))
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="select-none"
    >
      {/* Grid levels */}
      {Array.from({ length: LEVELS }, (_, i) => (
        <polygon
          key={i}
          points={getLevelPoints(i + 1)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {data.map((_, i) => {
        const end = getPoint(i, 100)
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={end.x}
            y2={end.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        )
      })}

      {/* Data area */}
      <motion.polygon
        points={dataPath}
        fill="rgba(0, 212, 255, 0.15)"
        stroke="#00d4ff"
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={data[i].color || '#00d4ff'}
          stroke="rgba(6,9,24,0.8)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
        />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const angle = angleStep * i - Math.PI / 2
        const labelR = RADIUS + 28
        const x = CENTER + labelR * Math.cos(angle)
        const y = CENTER + labelR * Math.sin(angle)
        const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end'
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="central"
            className="fill-nebula-muted"
            style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {d.label}
          </text>
        )
      })}

      {/* Percentage values */}
      {dataPoints.map((p, i) => (
        <text
          key={`pct-${i}`}
          x={p.x}
          y={p.y - 12}
          textAnchor="middle"
          style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fill: data[i].color || '#00d4ff' }}
        >
          {data[i].percentage}%
        </text>
      ))}
    </svg>
  )
}
