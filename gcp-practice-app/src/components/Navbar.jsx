import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cloud, Calendar, Trophy, Layout } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: Cloud },
  { to: '/day-as', label: 'A Day As...', icon: Calendar },
  { to: '/challenges', label: 'Challenges', icon: Trophy },
  { to: '/canvas', label: 'Arch Canvas', icon: Layout },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav
      className="sticky top-0 z-50 border-b border-nebula-border"
      style={{
        background: 'linear-gradient(180deg, rgba(6, 9, 24, 0.95) 0%, rgba(6, 9, 24, 0.85) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 no-underline group" aria-label="GCP Architect Lab - Home">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 group-hover:border-neon-cyan/40 transition-colors">
              <Cloud className="w-5 h-5 text-neon-cyan" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
              GCP <span className="gradient-text-cyan">Architect Lab</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to ||
                (to !== '/' && location.pathname.startsWith(to))
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-200 ${
                    active
                      ? 'text-neon-cyan'
                      : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{label}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg border border-neon-cyan/20"
                      style={{ background: 'rgba(0, 212, 255, 0.06)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
    </nav>
  )
}
