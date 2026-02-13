import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FlipCard({ front, back, className = '' }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
      aria-label={flipped ? 'Show question' : 'Show answer'}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Front */}
        <div
          className="glass-card-static rounded-2xl p-8 min-h-[220px] flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-xs text-nebula-dim mb-3 uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Question</div>
          <p className="text-lg text-nebula-text leading-relaxed font-medium">{front}</p>
          <div className="text-xs text-nebula-dim mt-4">Click to reveal answer</div>
        </div>

        {/* Back */}
        <div
          className="glass-card-static rounded-2xl p-8 min-h-[220px] flex flex-col items-center justify-center text-center absolute inset-0"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'rgba(0, 212, 255, 0.03)', borderColor: 'rgba(0, 212, 255, 0.15)' }}
        >
          <div className="text-xs text-neon-cyan mb-3 uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Answer</div>
          <p className="text-base text-nebula-text leading-relaxed">{back}</p>
          <div className="text-xs text-nebula-dim mt-4">Click to flip back</div>
        </div>
      </motion.div>
    </div>
  )
}
