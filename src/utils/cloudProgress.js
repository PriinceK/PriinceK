// Cloud Progress Sync — merges localStorage data with Firestore for logged-in users
// Falls back to localStorage-only when Firebase is not configured or user is offline

import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, isConfigured } from '../config/firebase'

const MAIN_KEY = 'gcp-lab-progress'
const LINUX_KEY = 'linux-lab-progress'
const NETWORK_KEY = 'network-lab-progress'

function loadLocal(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} }
}

function saveLocal(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getAllLocalProgress() {
  return {
    main: loadLocal(MAIN_KEY),
    linux: loadLocal(LINUX_KEY),
    network: loadLocal(NETWORK_KEY),
  }
}

function setAllLocalProgress(data) {
  if (data.main) saveLocal(MAIN_KEY, data.main)
  if (data.linux) saveLocal(LINUX_KEY, data.linux)
  if (data.network) saveLocal(NETWORK_KEY, data.network)
}

// Deep merge: for objects, prefer the one with more data / more recent timestamps
function deepMerge(local, cloud) {
  if (!cloud) return local
  if (!local) return cloud

  const merged = { ...cloud }

  for (const key of Object.keys(local)) {
    if (!(key in merged)) {
      merged[key] = local[key]
    } else if (
      typeof local[key] === 'object' && !Array.isArray(local[key]) &&
      typeof merged[key] === 'object' && !Array.isArray(merged[key])
    ) {
      merged[key] = deepMerge(local[key], merged[key])
    } else if (Array.isArray(local[key]) && Array.isArray(merged[key])) {
      // For arrays (examHistory, customFlashcards), combine and dedupe by id or timestamp
      const combined = [...merged[key]]
      for (const item of local[key]) {
        const exists = combined.some((c) =>
          (item.id && c.id === item.id) ||
          (item.completedAt && c.completedAt === item.completedAt)
        )
        if (!exists) combined.push(item)
      }
      merged[key] = combined
    }
    // For primitive values, cloud wins (already set)
  }

  return merged
}

// Upload all local progress to Firestore
export async function syncProgressToCloud(uid) {
  if (!isConfigured || !db) return
  const local = getAllLocalProgress()
  const ref = doc(db, 'users', uid)
  await setDoc(ref, {
    progress: local,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

// Load progress from Firestore
export async function loadProgressFromCloud(uid) {
  if (!isConfigured || !db) return null
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data().progress || null
}

// Merge local + cloud progress (called on login)
export async function mergeProgress(uid) {
  if (!isConfigured || !db) return

  const local = getAllLocalProgress()
  const cloud = await loadProgressFromCloud(uid)

  if (!cloud) {
    // First login — upload local progress
    await syncProgressToCloud(uid)
    return
  }

  // Merge each category
  const merged = {
    main: deepMerge(local.main, cloud.main),
    linux: deepMerge(local.linux, cloud.linux),
    network: deepMerge(local.network, cloud.network),
  }

  // Save merged data locally
  setAllLocalProgress(merged)

  // Upload merged data to cloud
  const ref = doc(db, 'users', uid)
  await setDoc(ref, {
    progress: merged,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

// Auto-sync debounce helper — call after progress changes
let syncTimer = null
export function debouncedSync(uid) {
  if (!uid || !isConfigured) return
  clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    syncProgressToCloud(uid).catch(() => {})
  }, 3000)
}
