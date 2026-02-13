import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User, CloudUpload, Check, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function UserMenu() {
  const { user, loading, syncing, logout, saveProgress, isConfigured } = useAuth()
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (loading) return null

  // Not logged in — show sign in link
  if (!user) {
    return (
      <Link to="/login"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium no-underline text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 transition-all">
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    )
  }

  const initials = (user.displayName || user.email || '?')
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join('')

  async function handleSave() {
    await saveProgress()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-1.5 py-1.5 rounded-lg cursor-pointer bg-transparent border-0 hover:bg-nebula-surface/50 transition-all"
        aria-expanded={open} aria-haspopup="true">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full border border-nebula-border" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-neon-cyan/15 border border-neon-cyan/25 flex items-center justify-center text-[10px] font-bold text-neon-cyan"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {initials}
          </div>
        )}
        {syncing && <Loader2 className="w-3 h-3 text-neon-cyan animate-spin" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-nebula-border overflow-hidden z-50"
            style={{
              background: 'rgba(6, 9, 24, 0.97)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}>
            {/* User info */}
            <div className="px-4 py-3 border-b border-nebula-border">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full border border-nebula-border" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-neon-cyan/15 border border-neon-cyan/25 flex items-center justify-center text-xs font-bold text-neon-cyan"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-nebula-text truncate">
                    {user.displayName || 'Cloud Engineer'}
                  </div>
                  <div className="text-[10px] text-nebula-dim truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {user.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="py-1">
              <button onClick={handleSave} disabled={syncing}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/30 transition-all cursor-pointer bg-transparent border-0 disabled:opacity-50">
                {saved ? <Check className="w-4 h-4 text-neon-emerald" /> : syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
                {saved ? 'Progress Saved!' : syncing ? 'Syncing...' : 'Save Progress to Cloud'}
              </button>

              <button onClick={() => { setOpen(false); logout() }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-nebula-muted hover:text-neon-rose hover:bg-neon-rose/5 transition-all cursor-pointer bg-transparent border-0">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* Sync status */}
            <div className="px-4 py-2 border-t border-nebula-border">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${syncing ? 'bg-neon-amber animate-pulse' : 'bg-neon-emerald'}`} />
                <span className="text-[10px] text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {syncing ? 'Syncing progress...' : 'Progress synced'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
