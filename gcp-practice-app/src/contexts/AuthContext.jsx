import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GithubAuthProvider,
} from 'firebase/auth'
import { auth, googleProvider, isConfigured } from '../config/firebase'
import { syncProgressToCloud, loadProgressFromCloud, mergeProgress } from '../utils/cloudProgress'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        // On login, merge local progress with cloud progress
        setSyncing(true)
        try {
          await mergeProgress(firebaseUser.uid)
        } catch (e) {
          console.warn('Progress sync failed:', e)
        }
        setSyncing(false)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  async function loginWithGoogle() {
    if (!isConfigured || !auth) throw new Error('Firebase not configured')
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  }

  async function loginWithGithub() {
    if (!isConfigured || !auth) throw new Error('Firebase not configured')
    const provider = new GithubAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  }

  async function loginWithEmail(email, password) {
    if (!isConfigured || !auth) throw new Error('Firebase not configured')
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  async function signupWithEmail(email, password, displayName) {
    if (!isConfigured || !auth) throw new Error('Firebase not configured')
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(result.user, { displayName })
    }
    return result.user
  }

  async function resetPassword(email) {
    if (!isConfigured || !auth) throw new Error('Firebase not configured')
    await sendPasswordResetEmail(auth, email)
  }

  async function logout() {
    if (!isConfigured || !auth) return
    // Sync progress before logout
    if (user) {
      try { await syncProgressToCloud(user.uid) } catch {}
    }
    await signOut(auth)
    setUser(null)
  }

  async function saveProgress() {
    if (!user) return
    setSyncing(true)
    try {
      await syncProgressToCloud(user.uid)
    } catch (e) {
      console.warn('Save failed:', e)
    }
    setSyncing(false)
  }

  const value = {
    user,
    loading,
    syncing,
    isConfigured,
    loginWithGoogle,
    loginWithGithub,
    loginWithEmail,
    signupWithEmail,
    resetPassword,
    logout,
    saveProgress,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
