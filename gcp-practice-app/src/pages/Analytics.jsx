import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Target, Clock, Award, Calendar, Flame, Brain, Zap } from 'lucide-react'
import { getProgress, getDomainScores, getExamHistory, getFlashcardState, getStudyStreak, getActivityLog } from '../utils/progress'
import { calculateDomainPercentages, getOverallScore, getWeakestDomains, getStrongestDomains, DOMAINS } from '../utils/domainScoring'
import { DAILY_SCENARIOS } from '../data/scenarios'
import { CHALLENGES } from '../data/challenges'
import { FLASHCARDS } from '../data/flashcards'
import RadarChart from '../components/RadarChart'

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getActivityHeatmap(activityLog) {
  const days = {}
  const now = Date.now()
  // Last 90 days
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now - i * 86400000).toDateString()
    days[d] = 0
  }
  for (const entry of activityLog) {
    const d = new Date(entry.timestamp).toDateString()
    if (days[d] !== undefined) {
      days[d]++
    }
  }
  return Object.entries(days).map(([date, count]) => ({ date, count }))
}

function HeatmapGrid({ data }) {
  const maxCount = Math.max(1, ...data.map((d) => d.count))
  const weeks = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return (
    <div className="flex gap-1">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day, di) => {
            const intensity = day.count > 0 ? Math.max(0.2, day.count / maxCount) : 0
            return (
              <div
                key={di}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: intensity > 0
                    ? `rgba(0, 212, 255, ${intensity})`
                    : 'rgba(255, 255, 255, 0.05)',
                }}
                title={`${new Date(day.date).toLocaleDateString()}: ${day.count} activities`}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function MiniBarChart({ data, color, maxVal }) {
  const max = maxVal || Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t"
            style={{
              height: `${Math.max(2, (d.value / max) * 100)}%`,
              backgroundColor: color,
              opacity: 0.7 + (d.value / max) * 0.3,
              minHeight: '2px',
            }}
          />
          <span className="text-[8px] text-nebula-dim truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [progress, setProgress] = useState({})
  const [domainScores, setDomainScores] = useState({})
  const [examHistory, setExamHistory] = useState([])
  const [flashcardState, setFlashcardState] = useState({})
  const [streak, setStreak] = useState({ current: 0 })
  const [activityLog, setActivityLog] = useState([])

  useEffect(() => {
    setProgress(getProgress())
    setDomainScores(getDomainScores())
    setExamHistory(getExamHistory())
    setFlashcardState(getFlashcardState())
    setStreak(getStudyStreak())
    setActivityLog(getActivityLog())
  }, [])

  const domainData = useMemo(() => calculateDomainPercentages(domainScores), [domainScores])
  const overallScore = useMemo(() => getOverallScore(domainScores), [domainScores])
  const weakDomains = useMemo(() => getWeakestDomains(domainScores, 3), [domainScores])
  const strongDomains = useMemo(() => getStrongestDomains(domainScores, 3), [domainScores])
  const heatmapData = useMemo(() => getActivityHeatmap(activityLog), [activityLog])

  const scenariosCompleted = Object.keys(progress.scenarios || {}).length
  const challengesCompleted = Object.keys(progress.challenges || {}).length
  const cardsReviewed = Object.keys(flashcardState).length
  const totalCards = FLASHCARDS.length
  const linuxCompleted = Object.keys(progress.linuxLessons || {}).filter((k) => progress.linuxLessons[k]).length
  const networkCompleted = Object.keys(progress.networkLessons || {}).filter((k) => progress.networkLessons[k]).length

  const scenarioScores = useMemo(() => {
    return DAILY_SCENARIOS.map((s) => ({
      label: s.title.split(' ').slice(0, 2).join(' '),
      value: (progress.scenarios || {})[s.id]?.percentage || 0,
    }))
  }, [progress])

  const challengeScores = useMemo(() => {
    return CHALLENGES.map((c) => ({
      label: c.title.split(' ').slice(0, 2).join(' '),
      value: (progress.challenges || {})[c.id]?.percentage || 0,
    }))
  }, [progress])

  const examScoreHistory = useMemo(() => {
    return examHistory.slice(-8).map((e, i) => ({
      label: `#${i + 1}`,
      value: e.score || 0,
    }))
  }, [examHistory])

  const totalQuestions = Object.values(domainScores).reduce((s, d) => s + (d.total || 0), 0)
  const totalCorrect = Object.values(domainScores).reduce((s, d) => s + (d.correct || 0), 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20 glow-cyan">
            <BarChart3 className="w-8 h-8 text-neon-cyan" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
          Performance <span className="gradient-text-cyan">Analytics</span>
        </h1>
        <p className="text-nebula-muted text-lg">Detailed breakdown of your learning progress and trends</p>
      </motion.div>

      {/* Top Stats Row */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { icon: Brain, color: '#00d4ff', value: `${overallScore}%`, label: 'Overall Score' },
          { icon: Target, color: '#10b981', value: totalQuestions, label: 'Questions Answered' },
          { icon: Award, color: '#f59e0b', value: `${totalCorrect}/${totalQuestions}`, label: 'Correct Answers' },
          { icon: Flame, color: '#ff6d00', value: streak.current, label: 'Day Streak' },
          { icon: Calendar, color: '#7c3aed', value: activityLog.length, label: 'Activities Logged' },
        ].map(({ icon: Icon, color, value, label }) => (
          <div key={label} className="glass-card-static rounded-xl p-4 text-center">
            <Icon className="w-4 h-4 mx-auto mb-2" style={{ color }} />
            <div className="text-xl font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
            <div className="text-[10px] text-nebula-muted mt-0.5">{label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Domain Radar */}
        <motion.div
          className="glass-card-static rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="text-sm font-bold text-nebula-text mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-neon-cyan" />
            Domain Proficiency Radar
          </h3>
          <div className="flex justify-center">
            <RadarChart data={domainData} size={260} />
          </div>
        </motion.div>

        {/* Domain Breakdown */}
        <motion.div
          className="glass-card-static rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-bold text-nebula-text mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-neon-cyan" />
            Domain Breakdown
          </h3>
          <div className="space-y-3">
            {domainData.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <div className="w-20 text-xs text-nebula-muted truncate">{d.label}</div>
                <div className="flex-1 h-2 bg-nebula-surface rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: d.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${d.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
                <div className="w-10 text-xs font-mono text-right" style={{ color: d.color }}>
                  {d.percentage}%
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <h4 className="text-xs font-bold text-neon-emerald mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Strengths
              </h4>
              {strongDomains.length > 0 ? strongDomains.map((d) => (
                <div key={d.id} className="text-xs text-nebula-muted mb-1">
                  {d.label}: <span className="text-neon-emerald font-mono">{d.percentage}%</span>
                </div>
              )) : <div className="text-xs text-nebula-dim">No data yet</div>}
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1">
                <Target className="w-3 h-3" /> Weaknesses
              </h4>
              {weakDomains.length > 0 ? weakDomains.map((d) => (
                <div key={d.id} className="text-xs text-nebula-muted mb-1">
                  {d.label}: <span className="text-rose-400 font-mono">{d.percentage}%</span>
                </div>
              )) : <div className="text-xs text-nebula-dim">No data yet</div>}
            </div>
          </div>
        </motion.div>

        {/* Scenario Scores */}
        <motion.div
          className="glass-card-static rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-sm font-bold text-nebula-text mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neon-cyan" />
            Scenario Scores
          </h3>
          <p className="text-xs text-nebula-muted mb-4">{scenariosCompleted}/{DAILY_SCENARIOS.length} completed</p>
          <MiniBarChart data={scenarioScores} color="#00d4ff" maxVal={100} />
        </motion.div>

        {/* Challenge Scores */}
        <motion.div
          className="glass-card-static rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-bold text-nebula-text mb-1 flex items-center gap-2">
            <Award className="w-4 h-4 text-neon-emerald" />
            Challenge Scores
          </h3>
          <p className="text-xs text-nebula-muted mb-4">{challengesCompleted}/{CHALLENGES.length} completed</p>
          <MiniBarChart data={challengeScores} color="#10b981" maxVal={100} />
        </motion.div>

        {/* Exam Score Trend */}
        <motion.div
          className="glass-card-static rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="text-sm font-bold text-nebula-text mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neon-amber" />
            Exam Score Trend
          </h3>
          <p className="text-xs text-nebula-muted mb-4">{examHistory.length} exams taken</p>
          {examScoreHistory.length > 0 ? (
            <MiniBarChart data={examScoreHistory} color="#f59e0b" maxVal={100} />
          ) : (
            <div className="h-20 flex items-center justify-center text-xs text-nebula-dim">
              No exams taken yet
            </div>
          )}
        </motion.div>

        {/* Activity Heatmap */}
        <motion.div
          className="glass-card-static rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-bold text-nebula-text mb-1 flex items-center gap-2">
            <Flame className="w-4 h-4 text-neon-amber" />
            Activity Heatmap
          </h3>
          <p className="text-xs text-nebula-muted mb-4">Last 90 days</p>
          <div className="overflow-x-auto">
            <HeatmapGrid data={heatmapData} />
          </div>
          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-[9px] text-nebula-dim">Less</span>
            {[0, 0.2, 0.4, 0.7, 1].map((v) => (
              <div
                key={v}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: v > 0 ? `rgba(0, 212, 255, ${v})` : 'rgba(255,255,255,0.05)' }}
              />
            ))}
            <span className="text-[9px] text-nebula-dim">More</span>
          </div>
        </motion.div>

        {/* Completion Progress */}
        <motion.div
          className="lg:col-span-2 glass-card-static rounded-2xl p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h3 className="text-sm font-bold text-nebula-text mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-cyan" />
            Completion Overview
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Scenarios', done: scenariosCompleted, total: DAILY_SCENARIOS.length, color: '#00d4ff' },
              { label: 'Challenges', done: challengesCompleted, total: CHALLENGES.length, color: '#10b981' },
              { label: 'Flashcards', done: cardsReviewed, total: totalCards, color: '#7c3aed' },
              { label: 'Linux Lessons', done: linuxCompleted, total: 30, color: '#34a853' },
            ].map(({ label, done, total, color }) => (
              <div key={label} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.5" fill="none" stroke={color} strokeWidth="3"
                      strokeDasharray={`${(done / Math.max(total, 1)) * 97.4} 97.4`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-nebula-text" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {total > 0 ? Math.round((done / total) * 100) : 0}%
                  </div>
                </div>
                <div className="text-xs text-nebula-muted">{label}</div>
                <div className="text-[10px] text-nebula-dim">{done}/{total}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
