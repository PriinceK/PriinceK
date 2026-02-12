import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Target,
  Briefcase, Building2, AlertTriangle, RotateCcw
} from 'lucide-react'
import { DAILY_SCENARIOS } from '../data/scenarios'

export default function DayAsScenario() {
  const { scenarioId } = useParams()
  const scenario = DAILY_SCENARIOS.find((s) => s.id === scenarioId)

  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1) // -1 = briefing
  const [answers, setAnswers] = useState({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [completed, setCompleted] = useState(false)

  if (!scenario) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-gcp-yellow mx-auto mb-4" />
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
    }
  }

  function handleRestart() {
    setCurrentTaskIndex(-1)
    setAnswers({})
    setShowFeedback(false)
    setCompleted(false)
  }

  // Results screen
  if (completed) {
    const percentage = Math.round((totalScore / maxScore) * 100)
    let grade, gradeColor, message
    if (percentage >= 90) { grade = 'A+'; gradeColor = '#34a853'; message = 'Outstanding! You demonstrated expert-level GCP architecture knowledge.' }
    else if (percentage >= 80) { grade = 'A'; gradeColor = '#34a853'; message = 'Excellent work! Your architecture decisions are well-reasoned.' }
    else if (percentage >= 70) { grade = 'B'; gradeColor = '#4285f4'; message = 'Good job! You have solid fundamentals with some areas to refine.' }
    else if (percentage >= 60) { grade = 'C'; gradeColor = '#fbbc04'; message = 'Decent effort. Review the feedback on each task to improve.' }
    else { grade = 'D'; gradeColor = '#ea4335'; message = 'Keep practicing! Review the GCP documentation and try again.' }

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/day-as" className="flex items-center gap-2 text-gcp-muted hover:text-gcp-text text-sm mb-6 no-underline">
          <ArrowLeft className="w-4 h-4" /> Back to scenarios
        </Link>

        <div className="bg-gcp-card border border-gcp-border rounded-2xl p-8 text-center mb-6">
          <h2 className="text-2xl font-bold text-gcp-text mb-2">Day Complete!</h2>
          <p className="text-gcp-muted mb-6">{scenario.title}</p>

          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 mb-4" style={{ borderColor: gradeColor }}>
            <span className="text-4xl font-bold" style={{ color: gradeColor }}>{grade}</span>
          </div>

          <div className="text-3xl font-bold text-gcp-text mb-1">{totalScore} / {maxScore}</div>
          <div className="text-gcp-muted mb-4">{percentage}% score</div>
          <p className="text-gcp-text max-w-md mx-auto">{message}</p>
        </div>

        {/* Task review */}
        <h3 className="text-lg font-semibold text-gcp-text mb-4">Task Review</h3>
        <div className="space-y-3 mb-6">
          {scenario.tasks.map((task) => {
            const selected = answers[task.id]
            const option = task.options.find((o) => o.id === selected)
            const best = task.options.reduce((a, b) => a.points > b.points ? a : b)
            const gotBest = option?.id === best.id
            return (
              <div key={task.id} className="bg-gcp-card border border-gcp-border rounded-xl p-4">
                <div className="flex items-start gap-3">
                  {gotBest ? (
                    <CheckCircle2 className="w-5 h-5 text-gcp-green shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gcp-yellow shrink-0 mt-0.5" />
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
                      <p className="text-xs text-gcp-green mt-2">Best answer: {best.text}</p>
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
            className="flex items-center gap-2 px-4 py-2 bg-gcp-card border border-gcp-border rounded-lg text-gcp-text hover:bg-gcp-border transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            to="/day-as"
            className="flex items-center gap-2 px-4 py-2 bg-gcp-blue rounded-lg text-white no-underline hover:bg-gcp-blue/80 transition-colors"
          >
            More Scenarios <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // Briefing screen
  if (currentTaskIndex === -1) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/day-as" className="flex items-center gap-2 text-gcp-muted hover:text-gcp-text text-sm mb-6 no-underline">
          <ArrowLeft className="w-4 h-4" /> Back to scenarios
        </Link>

        <div className="bg-gcp-card border border-gcp-border rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gcp-blue/15 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-gcp-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gcp-text">{scenario.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gcp-muted">
                <Building2 className="w-3.5 h-3.5" />
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
              <Target className="w-4 h-4 text-gcp-green" /> Today's Objectives
            </h3>
            <ul className="space-y-2">
              {scenario.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gcp-muted">
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
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gcp-blue rounded-xl text-white font-medium hover:bg-gcp-blue/80 transition-colors"
        >
          Start Your Day <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // Task screen
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/day-as" className="flex items-center gap-2 text-gcp-muted hover:text-gcp-text text-sm mb-6 no-underline">
        <ArrowLeft className="w-4 h-4" /> Back to scenarios
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {scenario.tasks.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full flex-1 transition-colors"
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

      <div className="bg-gcp-card border border-gcp-border rounded-2xl p-6 mb-4">
        <h2 className="text-lg font-semibold text-gcp-text mb-2">{currentTask.title}</h2>
        <p className="text-sm text-gcp-muted leading-relaxed">{currentTask.description}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentTask.options.map((option) => {
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
              className={`w-full text-left p-4 rounded-xl border transition-all ${bg} ${
                !selectedOption ? 'hover:border-gcp-blue/50 hover:bg-gcp-blue/5 cursor-pointer' : 'cursor-default'
              }`}
              style={{ borderColor }}
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  style={{ borderColor, color: isBest ? '#34a853' : isWrong ? '#ea4335' : '#8888aa' }}
                >
                  {option.id.toUpperCase()}
                </span>
                <div className="flex-1">
                  <span className="text-sm text-gcp-text">{option.text}</span>
                  {showFeedback && isSelected && (
                    <div className="mt-3 p-3 bg-gcp-darker rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: option.points >= 8 ? '#34a853' : option.points >= 5 ? '#fbbc04' : '#ea4335' }}>
                          {option.points}/10 points
                        </span>
                      </div>
                      <p className="text-xs text-gcp-text leading-relaxed">{option.feedback}</p>
                    </div>
                  )}
                  {showFeedback && isBest && !isSelected && (
                    <div className="mt-2">
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
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gcp-blue rounded-xl text-white font-medium hover:bg-gcp-blue/80 transition-colors"
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
