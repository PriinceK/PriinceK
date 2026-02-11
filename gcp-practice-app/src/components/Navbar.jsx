import { Link, useLocation } from 'react-router-dom'
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
    <nav className="bg-gcp-dark border-b border-gcp-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Cloud className="w-8 h-8 text-gcp-blue" />
            <span className="text-lg font-bold text-gcp-text">
              GCP <span className="text-gcp-blue">Architect Lab</span>
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
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                    active
                      ? 'bg-gcp-blue/15 text-gcp-blue'
                      : 'text-gcp-muted hover:text-gcp-text hover:bg-gcp-card'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
