import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Target,
  Briefcase, Building2, AlertTriangle, RotateCcw, Sparkles
} from 'lucide-react'
import { DAILY_SCENARIOS } from '../data/scenarios'
import ScoreRing from '../components/ScoreRing'

function saveProgress(scenarioId, score, maxScore) {
  try {
    const data = JSON.parse(localStorage.getItem('gcp-lab-progress') || '{}')
    if (!data.scenarios) data.scenarios = {}
    const existing = data.scenarios[scenarioId]
    const percentage = Math.round((score / maxScore) * 100)
    if (!existing || percentage > existing.percentage) {
      data.scenarios[scenarioId] = { score, maxScore, percentage, completedAt: new Date().toISOString() }
    }
    localStorage.setItem('gcp-lab-progress', JSON.stringify(data))
  } catch {}
}

export default function DayAsScenario() {
  const { scenarioId } = useParams()
  const scenario = DAILY_SCENARIOS.find((s) => s.id === scenarioId)

  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1) // -1 = briefing
  const [answers, setAnswers] = useState({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [completed, setCompleted] = useState(false)

  if (!scenario) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center page-enter">
        <AlertTriangle className="w-12 h-12 text-gcp-yellow mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-gcp-text mb-2">Scenario not found</h2>
        <Link to="/day-as" className="text-gcp-blue">Back to scenarios</Link>
      </div>
    )
  }

  const currentTask = currentTaskIndex >= 0 ? scenario.tasks[currentTaskIndex] : null
  const selectedOption = currentTask ? answers[currentTask.id] : null
  const totalScore = Object.entries(answers).reduce((acc, [taskId, optionId]) => {
    const task = scenario.tasks.find((t) => t.id === taskId)
    const option = task?.options.find((o) => o.id === optionId)
    return acc + (option?.points || 0)
  }, 0)
  const maxScore = scenario.tasks.length * 10

  function handleSelect(optionId) {
    if (selectedOption) return
    setAnswers((prev) => ({ ...prev, [currentTask.id]: optionId }))
    setShowFeedback(true)
  }

  function handleNext() {
    setShowFeedback(false)
    if (currentTaskIndex < scenario.tasks.length - 1) {
      setCurrentTaskIndex((i) => i + 1)
    } else {
      setCompleted(true)
      saveProgress(scenario.id, totalScore, maxScore)
    }
  }

  function handleRestart() {
    setCurrentTaskIndex(-1)
    setAnswers({})
    setShowFeedback(false)
    setCompleted(false)
  }

  // Determine next scenario for "Next Scenario" button
  const currentIdx = DAILY_SCENARIOS.indexOf(scenario)
  const nextScenario = currentIdx < DAILY_SCENARIOS.length - 1 ? DAILY_SCENARIOS[currentIdx + 1] : null

  // Results screen
  if (completed) {
    const percentage = Math.round((totalScore / maxScore) * 100)
    let grade, gradeColor, message
    if (percentage >= 95) { grade = 'A+'; gradeColor = '#34a853'; message = 'Outstanding! You demonstrated expert-level GCP architecture knowledge.' }
    else if (percentage >= 85) { grade = 'A'; gradeColor = '#34a853'; message = 'Excellent work! Your architecture decisions are well-reasoned.' }
    else if (percentage >= 70) { grade = 'B'; gradeColor = '#4285f4'; message = 'Good job! You have solid fundamentals with some areas to refine.' }
    else if (percentage >= 50) { grade = 'C'; gradeColor = '#fbbc04'; message = 'Decent effort. Review the feedback on each task to improve.' }
    else { grade = 'D'; gradeColor = '#ea4335'; message = 'Keep practicing! Review the GCP documentation and try again.' }

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 page-enter">
        <Link to="/day-as" className="flex items-center gap-2 text-gcp-muted hover:text-gcp-text text-sm mb-6 no-underline">
          <ArrowLeft className="w-4 h-4" /> Back to scenarios
        </Link>

        <div className="bg-gcp-card border border-gcp-border rounded-2xl p-8 text-center mb-6">
          <h2 className="text-2xl font-bold text-gcp-text mb-2">Day Complete!</h2>
          <p className="text-gcp-muted mb-6">{scenario.title}</p>

          <div className={`inline-block ${percentage >= 95 ? 'celebration' : 'score-reveal'}`}>
            <div className="relative inline-flex items-center justify-center">
              <ScoreRing score={totalScore} maxScore={maxScore} size={140} />
            </div>
          </div>

          {percentage >= 95 && (
            <div className="flex items-center justify-center gap-2 mt-2 text-gcp-green celebration">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Perfect score!</span>
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 mb-4 mt-4 score-reveal" style={{ borderColor: gradeColor }}>
            <span className="text-3xl font-bold" style={{ color: gradeColor }}>{grade}</span>
          </div>

          <p className="text-gcp-text max-w-md mx-auto">{message}</p>
        </div>

        {/* Task review */}
        <h3 className="text-lg font-semibold text-gcp-text mb-4">Task Review</h3>
        <div className="space-y-3 mb-6">
          {scenario.tasks.map((task, idx) => {
            const selected = answers[task.id]
            const option = task.options.find((o) => o.id === selected)
            const best = task.options.reduce((a, b) => a.points > b.points ? a : b)
            const gotBest = option?.id === best.id
            return (
              <div key={task.id} className="bg-gcp-card border border-gcp-border rounded-xl p-4 list-item-enter" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex items-start gap-3">
                  {gotBest ? (
                    <CheckCircle2 className="w-5 h-5 text-gcp-green shrink-0 mt-0.5" aria-label="Best answer" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gcp-yellow shrink-0 mt-0.5" aria-label="Not best answer" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gcp-text text-sm">{task.title}</span>
                      <span className="text-sm font-mono" style={{ color: option?.points >= 8 ? '#34a853' : option?.points >= 5 ? '#fbbc04' : '#ea4335' }}>
                        {option?.points || 0}/10
                      </span>
                    </div>
                    <p className="text-xs text-gcp-muted mb-2">You chose: {option?.text}</p>
                    <p className="text-xs text-gcp-text bg-gcp-darker rounded-lg p-2">{option?.feedback}</p>
                    {!gotBest && (
                      <p className="text-xs text-gcp-green mt-2">Best answer: {best.text} ({best.points}/10)</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 bg-gcp-card border border-gcp-border rounded-lg text-gcp-text hover:bg-gcp-border transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          {nextScenario ? (
            <Link
              to={`/day-as/${nextScenario.id}`}
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 bg-gcp-blue rounded-lg text-white no-underline hover:bg-gcp-blue/80 transition-colors"
            >
              Next Scenario <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/day-as"
              className="flex items-center gap-2 px-4 py-2 bg-gcp-blue rounded-lg text-white no-underline hover:bg-gcp-blue/80 transition-colors"
            >
              All Scenarios <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    )
  }

  // Briefing screen
  if (currentTaskIndex === -1) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 page-enter">
        <Link to="/day-as" className="flex items-center gap-2 text-gcp-muted hover:text-gcp-text text-sm mb-6 no-underline">
          <ArrowLeft className="w-4 h-4" /> Back to scenarios
        </Link>

        <div className="bg-gcp-card border border-gcp-border rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gcp-blue/15 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-gcp-blue" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gcp-text">{scenario.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gcp-muted">
                <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                {scenario.role} at {scenario.company}
              </div>
            </div>
          </div>

          <div className="bg-gcp-darker rounded-xl p-5 mb-6">
            <h3 className="text-sm font-semibold text-gcp-yellow mb-2">Morning Briefing</h3>
            <p className="text-sm text-gcp-text leading-relaxed">{scenario.briefing}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gcp-text mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-gcp-green" aria-hidden="true" /> Today's Objectives
            </h3>
            <ul className="space-y-2">
              {scenario.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gcp-muted list-item-enter" style={{ animationDelay: `${i * 80}ms` }}>
                  <span className="w-5 h-5 rounded-full bg-gcp-green/15 text-gcp-green flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-gcp-muted">
            {scenario.tasks.length} tasks · {maxScore} points possible · Each task is scored 1-10
          </div>
        </div>

        <button
          onClick={() => setCurrentTaskIndex(0)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gcp-blue rounded-xl text-white font-medium hover:bg-gcp-blue/80 transition-colors cursor-pointer border-0"
        >
          Start Your Day <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // Task screen
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 page-enter">
      <Link to="/day-as" className="flex items-center gap-2 text-gcp-muted hover:text-gcp-text text-sm mb-6 no-underline">
        <ArrowLeft className="w-4 h-4" /> Back to scenarios
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6" role="progressbar" aria-valuenow={currentTaskIndex + 1} aria-valuemin={1} aria-valuemax={scenario.tasks.length} aria-label="Task progress">
        {scenario.tasks.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full flex-1 transition-all duration-300"
            style={{
              backgroundColor:
                i < currentTaskIndex ? '#34a853'
                : i === currentTaskIndex ? '#4285f4'
                : '#2a2a4a',
            }}
          />
        ))}
      </div>

      <div className="text-xs text-gcp-muted mb-2">
        Task {currentTaskIndex + 1} of {scenario.tasks.length} · Score: {totalScore}/{maxScore}
      </div>

      <div className="bg-gcp-card border border-gcp-border rounded-2xl p-6 mb-4 fade-in">
        <h2 className="text-lg font-semibold text-gcp-text mb-2">{currentTask.title}</h2>
        <p className="text-sm text-gcp-muted leading-relaxed">{currentTask.description}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6" role="radiogroup" aria-label="Answer options">
        {currentTask.options.map((option, optIdx) => {
          const isSelected = selectedOption === option.id
          const best = currentTask.options.reduce((a, b) => a.points > b.points ? a : b)
          const isBest = showFeedback && option.id === best.id
          const isWrong = showFeedback && isSelected && option.id !== best.id

          let borderColor = '#2a2a4a'
          let bg = ''
          if (isBest) { borderColor = '#34a853'; bg = 'bg-gcp-green/5' }
          else if (isWrong) { borderColor = '#ea4335'; bg = 'bg-gcp-red/5' }
          else if (isSelected) { borderColor = '#4285f4' }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={!!selectedOption}
              className={`w-full text-left p-4 rounded-xl border transition-all list-item-enter ${bg} ${
                !selectedOption ? 'hover:border-gcp-blue/50 hover:bg-gcp-blue/5 cursor-pointer' : 'cursor-default'
              }`}
              style={{ borderColor, animationDelay: `${optIdx * 60}ms` }}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Option ${option.id.toUpperCase()}: ${option.text}`}
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  style={{ borderColor, color: isBest ? '#34a853' : isWrong ? '#ea4335' : '#9a9abe' }}
                >
                  {option.id.toUpperCase()}
                </span>
                <div className="flex-1">
                  <span className="text-sm text-gcp-text">{option.text}</span>
                  {showFeedback && isSelected && (
                    <div className="mt-3 p-3 bg-gcp-darker rounded-lg slide-down">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: option.points >= 8 ? '#34a853' : option.points >= 5 ? '#fbbc04' : '#ea4335' }}>
                          {option.points}/10 points
                        </span>
                      </div>
                      <p className="text-xs text-gcp-text leading-relaxed">{option.feedback}</p>
                    </div>
                  )}
                  {showFeedback && isBest && !isSelected && (
                    <div className="mt-2 fade-in">
                      <span className="text-xs text-gcp-green font-medium">Best answer (10/10)</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {showFeedback && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gcp-blue rounded-xl text-white font-medium hover:bg-gcp-blue/80 transition-colors cursor-pointer border-0 fade-in"
        >
          {currentTaskIndex < scenario.tasks.length - 1 ? (
            <>Next Task <ArrowRight className="w-4 h-4" /></>
          ) : (
            <>View Results <CheckCircle2 className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  )
}
