import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Download, Upload, Trash2, RotateCcw, Moon, Monitor, Shield, Database, AlertTriangle, CheckCircle } from 'lucide-react'
import { getProgress } from '../utils/progress'

function exportData() {
  const data = localStorage.getItem('gcp-lab-progress') || '{}'
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gcp-lab-progress-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importData(callback) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (typeof data !== 'object') throw new Error('Invalid data')
        localStorage.setItem('gcp-lab-progress', JSON.stringify(data))
        callback('success', 'Progress data imported successfully. Refresh to see changes.')
      } catch (err) {
        callback('error', 'Invalid file format: ' + err.message)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

function getStorageSize() {
  const data = localStorage.getItem('gcp-lab-progress') || ''
  const bytes = new Blob([data]).size
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function SettingsPage() {
  const [progress, setProgress] = useState({})
  const [storageSize, setStorageSize] = useState('0 B')
  const [message, setMessage] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    setProgress(getProgress())
    setStorageSize(getStorageSize())
  }, [])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    localStorage.removeItem('gcp-lab-progress')
    setProgress({})
    setStorageSize(getStorageSize())
    setConfirmReset(false)
    showMessage('success', 'All progress data has been reset.')
  }

  const stats = {
    scenarios: Object.keys(progress.scenarios || {}).length,
    challenges: Object.keys(progress.challenges || {}).length,
    flashcards: Object.keys(progress.flashcards || {}).length,
    exams: (progress.examHistory || []).length,
    achievements: Object.keys(progress.achievements || {}).length,
    notes: (progress.notes || []).length,
    customScenarios: (progress.customScenarios || []).length,
    linuxLessons: Object.keys(progress.linuxLessons || {}).filter((k) => progress.linuxLessons[k]).length,
    streak: progress.streak?.current || 0,
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-nebula-surface/50 flex items-center justify-center border border-nebula-border">
            <SettingsIcon className="w-8 h-8 text-nebula-muted" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
          Settings
        </h1>
        <p className="text-nebula-muted text-lg">Manage your data, preferences, and progress</p>
      </motion.div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`flex items-center gap-2 mb-6 p-4 rounded-xl border text-sm ${
            message.type === 'success'
              ? 'bg-neon-emerald/10 border-neon-emerald/20 text-neon-emerald'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {message.text}
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Data Summary */}
        <motion.div
          className="glass-card-static rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-neon-cyan" />
            <h3 className="text-sm font-bold text-nebula-text">Data Summary</h3>
            <span className="text-xs text-nebula-dim ml-auto">Storage: {storageSize}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Scenarios', value: stats.scenarios },
              { label: 'Challenges', value: stats.challenges },
              { label: 'Flashcards', value: stats.flashcards },
              { label: 'Exams', value: stats.exams },
              { label: 'Achievements', value: stats.achievements },
              { label: 'Notes', value: stats.notes },
              { label: 'Custom Scenarios', value: stats.customScenarios },
              { label: 'Linux Lessons', value: stats.linuxLessons },
              { label: 'Day Streak', value: stats.streak },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-3 rounded-lg bg-nebula-surface/20">
                <div className="text-lg font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
                <div className="text-[10px] text-nebula-muted">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Export/Import */}
        <motion.div
          className="glass-card-static rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-neon-cyan" />
            <h3 className="text-sm font-bold text-nebula-text">Backup & Restore</h3>
          </div>
          <p className="text-xs text-nebula-muted mb-4 leading-relaxed">
            Export your progress as a JSON file for backup, or import a previously saved file to restore your data.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/20 transition-colors cursor-pointer text-sm font-medium"
            >
              <Download className="w-4 h-4" /> Export Data
            </button>
            <button
              onClick={() => importData(showMessage)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-nebula-surface/50 text-nebula-muted border border-nebula-border hover:text-nebula-text transition-colors cursor-pointer text-sm font-medium"
            >
              <Upload className="w-4 h-4" /> Import Data
            </button>
          </div>
        </motion.div>

        {/* Reset */}
        <motion.div
          className="glass-card-static rounded-2xl p-6 border-rose-500/10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-nebula-text">Danger Zone</h3>
          </div>
          <p className="text-xs text-nebula-muted mb-4 leading-relaxed">
            Reset all progress data including scenarios, challenges, flashcards, exams, achievements, and notes. This action cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors cursor-pointer text-sm font-medium ${
                confirmReset
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
                  : 'bg-nebula-surface/50 text-nebula-muted border-nebula-border hover:text-rose-400 hover:border-rose-500/30'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {confirmReset ? 'Click Again to Confirm Reset' : 'Reset All Progress'}
            </button>
            {confirmReset && (
              <button
                onClick={() => setConfirmReset(false)}
                className="text-xs text-nebula-muted hover:text-nebula-text cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          className="glass-card-static rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-nebula-muted" />
            <h3 className="text-sm font-bold text-nebula-text">About</h3>
          </div>
          <div className="space-y-2 text-xs text-nebula-muted">
            <div className="flex justify-between">
              <span>Application</span>
              <span className="text-nebula-text font-mono">GCP Architect Practice Lab</span>
            </div>
            <div className="flex justify-between">
              <span>Version</span>
              <span className="text-nebula-text font-mono">1.4.0</span>
            </div>
            <div className="flex justify-between">
              <span>Framework</span>
              <span className="text-nebula-text font-mono">React 19 + Vite 7</span>
            </div>
            <div className="flex justify-between">
              <span>Storage</span>
              <span className="text-nebula-text font-mono">localStorage + Firebase (optional)</span>
            </div>
            <div className="flex justify-between">
              <span>GCP Services</span>
              <span className="text-nebula-text font-mono">34</span>
            </div>
            <div className="flex justify-between">
              <span>Total Features</span>
              <span className="text-nebula-text font-mono">20+</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
