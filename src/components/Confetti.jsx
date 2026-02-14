import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = ['#00d4ff', '#10b981', '#f59e0b', '#7c3aed', '#f43f5e', '#4285f4']

function randomBetween(a, b) { return a + Math.random() * (b - a) }

export default function Confetti({ active, duration = 3000 }) {
    const [particles, setParticles] = useState([])

    useEffect(() => {
        if (!active) { setParticles([]); return }

        const p = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: randomBetween(10, 90),
            color: COLORS[i % COLORS.length],
            delay: randomBetween(0, 0.5),
            size: randomBetween(4, 8),
            rotation: randomBetween(0, 360),
            drift: randomBetween(-30, 30),
        }))
        setParticles(p)

        const timer = setTimeout(() => setParticles([]), duration)
        return () => clearTimeout(timer)
    }, [active, duration])

    if (particles.length === 0) return null

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
                    animate={{
                        y: '110vh',
                        x: `${p.x + p.drift}vw`,
                        opacity: [1, 1, 0],
                        rotate: p.rotation + 720,
                        scale: [1, 1.2, 0.5],
                    }}
                    transition={{ duration: randomBetween(2, 3.5), delay: p.delay, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size * 1.4,
                        backgroundColor: p.color,
                        borderRadius: p.size > 6 ? '50%' : '1px',
                    }}
                />
            ))}
        </div>
    )
}
