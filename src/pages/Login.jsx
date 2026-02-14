import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cloud, Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { loginWithGoogle, loginWithGithub, loginWithEmail, signupWithEmail, resetPassword, isConfigured } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (e) {
      setError(friendlyError(e.code))
    }
    setLoading(false)
  }

  async function handleGithub() {
    setError('')
    setLoading(true)
    try {
      await loginWithGithub()
      navigate('/')
    } catch (e) {
      setError(friendlyError(e.code))
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'reset') {
        await resetPassword(email)
        setResetSent(true)
        setLoading(false)
        return
      }
      if (mode === 'signup') {
        await signupWithEmail(email, password, displayName)
      } else {
        await loginWithEmail(email, password)
      }
      navigate('/')
    } catch (e) {
      setError(friendlyError(e.code))
    }
    setLoading(false)
  }

  if (!isConfigured) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card-static rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neon-amber/10 flex items-center justify-center border border-neon-amber/20 mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-neon-amber" />
          </div>
          <h1 className="text-xl font-bold text-nebula-text mb-3" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
            Firebase Not Configured
          </h1>
          <p className="text-sm text-nebula-muted leading-relaxed mb-4">
            To enable login and cloud save, add your Firebase config to a <code className="text-neon-cyan">.env</code> file:
          </p>
          <div className="text-left bg-nebula-deep rounded-xl p-4 border border-nebula-border mb-4"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
            <div className="text-nebula-dim">VITE_FIREBASE_API_KEY=your_key</div>
            <div className="text-nebula-dim">VITE_FIREBASE_AUTH_DOMAIN=your_domain</div>
            <div className="text-nebula-dim">VITE_FIREBASE_PROJECT_ID=your_id</div>
            <div className="text-nebula-dim">VITE_FIREBASE_STORAGE_BUCKET=your_bucket</div>
            <div className="text-nebula-dim">VITE_FIREBASE_MESSAGING_SENDER_ID=your_id</div>
            <div className="text-nebula-dim">VITE_FIREBASE_APP_ID=your_app_id</div>
          </div>
          <p className="text-xs text-nebula-dim mb-5">
            Your progress is still saved locally in this browser.
          </p>
          <Link to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-medium no-underline hover:bg-neon-cyan/20 transition-colors">
            Continue as Guest <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 no-underline mb-4">
            <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 glow-cyan">
              <Cloud className="w-6 h-6 text-neon-cyan" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
            {mode === 'reset' ? 'Reset Password' : mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-nebula-muted mt-2">
            {mode === 'reset' ? 'Enter your email to receive a reset link'
              : mode === 'signup' ? 'Start tracking your GCP learning progress'
              : 'Sign in to sync your progress across devices'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card-static rounded-2xl p-7">
          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neon-rose/10 border border-neon-rose/20 mb-5">
              <AlertCircle className="w-4 h-4 text-neon-rose shrink-0" />
              <span className="text-xs text-neon-rose">{error}</span>
            </motion.div>
          )}

          {/* Reset success */}
          {resetSent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="px-4 py-3 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 mb-5 text-center">
              <p className="text-xs text-neon-emerald">Password reset email sent! Check your inbox.</p>
              <button onClick={() => { setMode('login'); setResetSent(false) }}
                className="text-xs text-neon-cyan mt-2 bg-transparent border-0 cursor-pointer hover:underline">
                Back to login
              </button>
            </motion.div>
          )}

          {mode !== 'reset' && !resetSent && (
            <>
              {/* Social login buttons */}
              <div className="space-y-3 mb-6">
                <button onClick={handleGoogle} disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-nebula-border bg-nebula-surface/30 text-nebula-text text-sm font-medium cursor-pointer hover:bg-nebula-surface/60 hover:border-nebula-border-bright transition-all disabled:opacity-50">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button onClick={handleGithub} disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-nebula-border bg-nebula-surface/30 text-nebula-text text-sm font-medium cursor-pointer hover:bg-nebula-surface/60 hover:border-nebula-border-bright transition-all disabled:opacity-50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-nebula-border" />
                <span className="text-xs text-nebula-dim">or</span>
                <div className="flex-1 h-px bg-nebula-border" />
              </div>
            </>
          )}

          {/* Email form */}
          {!resetSent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs text-nebula-muted mb-1.5">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nebula-dim" />
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Cloud Engineer"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nebula-deep border border-nebula-border text-nebula-text text-sm placeholder:text-nebula-dim focus:outline-none focus:border-neon-cyan/40 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-nebula-muted mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nebula-dim" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-nebula-deep border border-nebula-border text-nebula-text text-sm placeholder:text-nebula-dim focus:outline-none focus:border-neon-cyan/40 transition-colors"
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <div>
                  <label className="block text-xs text-nebula-muted mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nebula-dim" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters" required minLength={6}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-nebula-deep border border-nebula-border text-nebula-text text-sm placeholder:text-nebula-dim focus:outline-none focus:border-neon-cyan/40 transition-colors"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-nebula-dim hover:text-nebula-text bg-transparent border-0 cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="text-right">
                  <button type="button" onClick={() => { setMode('reset'); setError('') }}
                    className="text-xs text-neon-cyan bg-transparent border-0 cursor-pointer hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all disabled:opacity-50 border-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  color: '#00d4ff',
                }}>
                {loading ? 'Please wait...'
                  : mode === 'reset' ? 'Send Reset Link'
                  : mode === 'signup' ? 'Create Account'
                  : 'Sign In'}
              </button>
            </form>
          )}

          {/* Mode toggle */}
          {!resetSent && (
            <div className="text-center mt-5">
              {mode === 'login' && (
                <p className="text-xs text-nebula-dim">
                  Don't have an account?{' '}
                  <button onClick={() => { setMode('signup'); setError('') }}
                    className="text-neon-cyan bg-transparent border-0 cursor-pointer hover:underline">
                    Sign up
                  </button>
                </p>
              )}
              {mode === 'signup' && (
                <p className="text-xs text-nebula-dim">
                  Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setError('') }}
                    className="text-neon-cyan bg-transparent border-0 cursor-pointer hover:underline">
                    Sign in
                  </button>
                </p>
              )}
              {mode === 'reset' && (
                <p className="text-xs text-nebula-dim">
                  <button onClick={() => { setMode('login'); setError(''); setResetSent(false) }}
                    className="text-neon-cyan bg-transparent border-0 cursor-pointer hover:underline">
                    Back to login
                  </button>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Guest mode */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-nebula-dim hover:text-nebula-muted no-underline transition-colors">
            Continue without signing in — progress saves locally
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

function friendlyError(code) {
  const errors = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/account-exists-with-different-credential': 'An account already exists with a different sign-in method.',
  }
  return errors[code] || 'Something went wrong. Please try again.'
}
