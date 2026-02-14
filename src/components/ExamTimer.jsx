import { useState, useEffect, useRef } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'

export default function ExamTimer({ totalSeconds, onTimeUp, paused = false }) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [paused, onTimeUp])

  const hours = Math.floor(remaining / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  const seconds = remaining % 60
  const pad = (n) => String(n).padStart(2, '0')

  const isWarning = remaining <= 600 && remaining > 300 // 10-5 min
  const isCritical = remaining <= 300 // under 5 min

  const colorClass = isCritical ? 'text-neon-rose' : isWarning ? 'text-neon-amber' : 'text-nebula-text'
  const bgClass = isCritical ? 'bg-neon-rose/10 border-neon-rose/20' : isWarning ? 'bg-neon-amber/10 border-neon-amber/20' : 'bg-nebula-surface/80 border-nebula-border'

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${bgClass} transition-colors`}>
      {isCritical ? (
        <AlertTriangle className={`w-4 h-4 ${colorClass} animate-pulse`} />
      ) : (
        <Clock className={`w-4 h-4 ${colorClass}`} />
      )}
      <span
        className={`text-sm font-bold tabular-nums ${colorClass}`}
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {hours > 0 && `${pad(hours)}:`}{pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  )
}
