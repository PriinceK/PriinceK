import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Wrench, Plus, Trash2, Play, Save, Download, Upload, ArrowLeft, ArrowRight, Eye, Copy, GripVertical, ChevronDown, ChevronUp } from 'lucide-react'
import { getCustomScenarios, saveCustomScenario, deleteCustomScenario } from '../utils/progress'

const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const DIFFICULTY_COLORS = { Beginner: '#10b981', Intermediate: '#3b82f6', Advanced: '#7c3aed', Expert: '#ef4444' }

function emptyTask() {
  return {
    id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: '',
    description: '',
    options: [
      { id: 'a', text: '', points: 10, feedback: '' },
      { id: 'b', text: '', points: 6, feedback: '' },
      { id: 'c', text: '', points: 3, feedback: '' },
      { id: 'd', text: '', points: 1, feedback: '' },
    ],
  }
}

function emptyScenario() {
  return {
    id: `custom-${Date.now()}`,
    title: '',
    role: 'Cloud Engineer',
    company: '',
    difficulty: 'Intermediate',
    briefing: '',
    objectives: [''],
    tasks: [emptyTask()],
    isCustom: true,
  }
}

export default function ScenarioBuilder() {
  const navigate = useNavigate()
  const [scenarios, setScenarios] = useState([])
  const [editing, setEditing] = useState(null)
  const [activeTask, setActiveTask] = useState(0)
  const [previewMode, setPreviewMode] = useState(false)
  const [showList, setShowList] = useState(true)

  useEffect(() => {
    setScenarios(getCustomScenarios())
  }, [])

  const startNew = () => {
    const s = emptyScenario()
    setEditing(s)
    setActiveTask(0)
    setShowList(false)
    setPreviewMode(false)
  }

  const editExisting = (scenario) => {
    setEditing({ ...scenario })
    setActiveTask(0)
    setShowList(false)
    setPreviewMode(false)
  }

  const handleSave = () => {
    if (!editing) return
    if (!editing.title.trim()) return alert('Please enter a scenario title.')
    if (!editing.company.trim()) return alert('Please enter a company name.')
    if (editing.tasks.length === 0) return alert('Add at least one task.')
    for (const task of editing.tasks) {
      if (!task.title.trim()) return alert(`Task "${task.id}" needs a title.`)
      if (task.options.some((o) => !o.text.trim())) return alert(`All options in "${task.title}" need text.`)
    }
    editing.estimatedTasks = editing.tasks.length
    const updated = saveCustomScenario(editing)
    setScenarios(updated)
    setShowList(true)
    setEditing(null)
  }

  const handleDelete = (id) => {
    if (!confirm('Delete this scenario?')) return
    const updated = deleteCustomScenario(id)
    setScenarios(updated)
  }

  const handleExport = (scenario) => {
    const json = JSON.stringify(scenario, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scenario-${scenario.title.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
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
          if (!data.title || !data.tasks) throw new Error('Invalid scenario format')
          data.id = `custom-${Date.now()}`
          data.isCustom = true
          const updated = saveCustomScenario(data)
          setScenarios(updated)
        } catch (err) {
          alert('Invalid scenario file: ' + err.message)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const updateScenarioField = (field, value) => {
    setEditing((prev) => ({ ...prev, [field]: value }))
  }

  const updateObjective = (idx, value) => {
    setEditing((prev) => {
      const objs = [...prev.objectives]
      objs[idx] = value
      return { ...prev, objectives: objs }
    })
  }

  const addObjective = () => {
    setEditing((prev) => ({ ...prev, objectives: [...prev.objectives, ''] }))
  }

  const removeObjective = (idx) => {
    setEditing((prev) => ({ ...prev, objectives: prev.objectives.filter((_, i) => i !== idx) }))
  }

  const addTask = () => {
    setEditing((prev) => ({ ...prev, tasks: [...prev.tasks, emptyTask()] }))
    setActiveTask(editing.tasks.length)
  }

  const removeTask = (idx) => {
    if (editing.tasks.length <= 1) return
    setEditing((prev) => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== idx) }))
    setActiveTask(Math.max(0, activeTask - 1))
  }

  const updateTask = (idx, field, value) => {
    setEditing((prev) => {
      const tasks = [...prev.tasks]
      tasks[idx] = { ...tasks[idx], [field]: value }
      return { ...prev, tasks }
    })
  }

  const updateOption = (taskIdx, optIdx, field, value) => {
    setEditing((prev) => {
      const tasks = [...prev.tasks]
      const options = [...tasks[taskIdx].options]
      options[optIdx] = { ...options[optIdx], [field]: field === 'points' ? parseInt(value) || 0 : value }
      tasks[taskIdx] = { ...tasks[taskIdx], options }
      return { ...prev, tasks }
    })
  }

  // Scenario List
  if (showList && !editing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-neon-amber/10 flex items-center justify-center border border-neon-amber/20 glow-amber">
              <Wrench className="w-8 h-8 text-neon-amber" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-nebula-text mb-2" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
            Scenario <span className="gradient-text-cyan">Builder</span>
          </h1>
          <p className="text-nebula-muted text-lg">Create, edit, and share your own cloud engineering scenarios</p>
        </motion.div>

        <div className="flex gap-3 mb-8 justify-center">
          <button
            onClick={startNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/20 transition-colors cursor-pointer text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> New Scenario
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-nebula-surface/50 text-nebula-muted border border-nebula-border hover:text-nebula-text transition-colors cursor-pointer text-sm font-medium"
          >
            <Upload className="w-4 h-4" /> Import JSON
          </button>
        </div>

        {scenarios.length === 0 ? (
          <motion.div
            className="glass-card-static rounded-2xl p-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Wrench className="w-12 h-12 text-nebula-dim mx-auto mb-4" />
            <h2 className="text-lg font-bold text-nebula-text mb-2">No Custom Scenarios Yet</h2>
            <p className="text-nebula-muted text-sm">Create your first scenario or import one from a JSON file.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {scenarios.map((s, idx) => (
              <motion.div
                key={s.id}
                className="glass-card-static rounded-xl p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-nebula-text truncate">{s.title}</h3>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: DIFFICULTY_COLORS[s.difficulty] + '15', color: DIFFICULTY_COLORS[s.difficulty] }}
                      >
                        {s.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-nebula-muted">
                      {s.company} &middot; {s.tasks?.length || 0} tasks &middot; {s.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/day-as/${s.id}`)}
                      className="p-2 rounded-lg hover:bg-nebula-surface/50 text-nebula-muted hover:text-neon-cyan transition-colors cursor-pointer"
                      title="Play"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => editExisting(s)}
                      className="p-2 rounded-lg hover:bg-nebula-surface/50 text-nebula-muted hover:text-neon-cyan transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Wrench className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExport(s)}
                      className="p-2 rounded-lg hover:bg-nebula-surface/50 text-nebula-muted hover:text-neon-amber transition-colors cursor-pointer"
                      title="Export"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 rounded-lg hover:bg-nebula-surface/50 text-nebula-muted hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!editing) return null

  const currentTask = editing.tasks[activeTask]

  // Editor
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => { setShowList(true); setEditing(null) }}
          className="flex items-center gap-2 text-sm text-nebula-muted hover:text-nebula-text cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              previewMode ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'text-nebula-muted hover:text-nebula-text'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20 hover:bg-neon-emerald/20 transition-colors text-sm font-medium cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      {previewMode ? (
        <PreviewMode scenario={editing} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Scenario Details */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-card-static rounded-xl p-5">
              <h3 className="text-sm font-bold text-nebula-text mb-4">Scenario Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-nebula-muted mb-1 block">Title *</label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => updateScenarioField('title', e.target.value)}
                    className="w-full px-3 py-2 bg-nebula-surface/50 border border-nebula-border rounded-lg text-sm text-nebula-text focus:outline-none focus:border-neon-cyan/40"
                    placeholder="e.g., Migrating to Microservices"
                  />
                </div>
                <div>
                  <label className="text-xs text-nebula-muted mb-1 block">Company *</label>
                  <input
                    type="text"
                    value={editing.company}
                    onChange={(e) => updateScenarioField('company', e.target.value)}
                    className="w-full px-3 py-2 bg-nebula-surface/50 border border-nebula-border rounded-lg text-sm text-nebula-text focus:outline-none focus:border-neon-cyan/40"
                    placeholder="e.g., TechCorp"
                  />
                </div>
                <div>
                  <label className="text-xs text-nebula-muted mb-1 block">Role</label>
                  <input
                    type="text"
                    value={editing.role}
                    onChange={(e) => updateScenarioField('role', e.target.value)}
                    className="w-full px-3 py-2 bg-nebula-surface/50 border border-nebula-border rounded-lg text-sm text-nebula-text focus:outline-none focus:border-neon-cyan/40"
                    placeholder="e.g., Cloud Engineer"
                  />
                </div>
                <div>
                  <label className="text-xs text-nebula-muted mb-1 block">Difficulty</label>
                  <select
                    value={editing.difficulty}
                    onChange={(e) => updateScenarioField('difficulty', e.target.value)}
                    className="w-full px-3 py-2 bg-nebula-surface/50 border border-nebula-border rounded-lg text-sm text-nebula-text focus:outline-none focus:border-neon-cyan/40 cursor-pointer"
                  >
                    {DIFFICULTY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-nebula-muted mb-1 block">Briefing</label>
                  <textarea
                    value={editing.briefing}
                    onChange={(e) => updateScenarioField('briefing', e.target.value)}
                    className="w-full px-3 py-2 bg-nebula-surface/50 border border-nebula-border rounded-lg text-sm text-nebula-text focus:outline-none focus:border-neon-cyan/40 min-h-[80px] resize-y"
                    placeholder="Describe the scenario context..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Objectives */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-nebula-muted">Objectives</label>
                  <button onClick={addObjective} className="text-xs text-neon-cyan hover:text-neon-cyan/80 cursor-pointer">+ Add</button>
                </div>
                {editing.objectives.map((obj, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => updateObjective(i, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-nebula-surface/50 border border-nebula-border rounded-lg text-xs text-nebula-text focus:outline-none focus:border-neon-cyan/40"
                      placeholder={`Objective ${i + 1}`}
                    />
                    {editing.objectives.length > 1 && (
                      <button onClick={() => removeObjective(i)} className="text-nebula-dim hover:text-rose-400 cursor-pointer">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Task Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Task tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              {editing.tasks.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTask(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeTask === idx
                      ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                      : 'text-nebula-muted hover:text-nebula-text bg-nebula-surface/30'
                  }`}
                >
                  Task {idx + 1}
                </button>
              ))}
              <button
                onClick={addTask}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-nebula-dim hover:text-neon-cyan cursor-pointer border border-dashed border-nebula-border hover:border-neon-cyan/30"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {currentTask && (
              <motion.div
                key={currentTask.id}
                className="glass-card-static rounded-xl p-5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-nebula-text">Task {activeTask + 1}</h3>
                  {editing.tasks.length > 1 && (
                    <button
                      onClick={() => removeTask(activeTask)}
                      className="flex items-center gap-1 text-xs text-nebula-dim hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-nebula-muted mb-1 block">Task Title *</label>
                    <input
                      type="text"
                      value={currentTask.title}
                      onChange={(e) => updateTask(activeTask, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-nebula-surface/50 border border-nebula-border rounded-lg text-sm text-nebula-text focus:outline-none focus:border-neon-cyan/40"
                      placeholder="e.g., Choose the right database service"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-nebula-muted mb-1 block">Description</label>
                    <textarea
                      value={currentTask.description}
                      onChange={(e) => updateTask(activeTask, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-nebula-surface/50 border border-nebula-border rounded-lg text-sm text-nebula-text focus:outline-none focus:border-neon-cyan/40 resize-y"
                      rows={2}
                      placeholder="Describe the decision the user needs to make..."
                    />
                  </div>

                  <div>
                    <label className="text-xs text-nebula-muted mb-2 block">Options (4 required)</label>
                    <div className="space-y-3">
                      {currentTask.options.map((opt, oi) => (
                        <div key={opt.id} className="rounded-lg border border-nebula-border p-3 bg-nebula-surface/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-neon-cyan w-5">{opt.id.toUpperCase()}</span>
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => updateOption(activeTask, oi, 'text', e.target.value)}
                              className="flex-1 px-2 py-1 bg-nebula-surface/50 border border-nebula-border rounded text-xs text-nebula-text focus:outline-none focus:border-neon-cyan/40"
                              placeholder="Option text..."
                            />
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-nebula-dim">pts:</span>
                              <input
                                type="number"
                                min={0}
                                max={10}
                                value={opt.points}
                                onChange={(e) => updateOption(activeTask, oi, 'points', e.target.value)}
                                className="w-12 px-2 py-1 bg-nebula-surface/50 border border-nebula-border rounded text-xs text-neon-amber text-center focus:outline-none focus:border-neon-cyan/40"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            value={opt.feedback}
                            onChange={(e) => updateOption(activeTask, oi, 'feedback', e.target.value)}
                            className="w-full px-2 py-1 bg-nebula-surface/30 border border-nebula-border/50 rounded text-[11px] text-nebula-muted focus:outline-none focus:border-neon-cyan/40"
                            placeholder="Feedback explanation for this option..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Task Navigation */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-nebula-border">
                  <button
                    onClick={() => setActiveTask(Math.max(0, activeTask - 1))}
                    disabled={activeTask === 0}
                    className="flex items-center gap-1 text-xs text-nebula-muted hover:text-nebula-text disabled:opacity-30 cursor-pointer disabled:cursor-default"
                  >
                    <ArrowLeft className="w-3 h-3" /> Previous
                  </button>
                  <span className="text-xs text-nebula-dim">{activeTask + 1} / {editing.tasks.length}</span>
                  <button
                    onClick={() => setActiveTask(Math.min(editing.tasks.length - 1, activeTask + 1))}
                    disabled={activeTask === editing.tasks.length - 1}
                    className="flex items-center gap-1 text-xs text-nebula-muted hover:text-nebula-text disabled:opacity-30 cursor-pointer disabled:cursor-default"
                  >
                    Next <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function PreviewMode({ scenario }) {
  const [phase, setPhase] = useState('briefing')
  const [taskIdx, setTaskIdx] = useState(0)

  if (phase === 'briefing') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card-static rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: DIFFICULTY_COLORS[scenario.difficulty] + '15', color: DIFFICULTY_COLORS[scenario.difficulty] }}
            >
              {scenario.difficulty}
            </span>
            <span className="text-xs text-nebula-dim">{scenario.company}</span>
          </div>
          <h2 className="text-2xl font-bold text-nebula-text mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
            {scenario.title || 'Untitled Scenario'}
          </h2>
          <p className="text-sm text-nebula-muted mb-4">Role: {scenario.role}</p>
          <p className="text-sm text-nebula-text leading-relaxed mb-5">{scenario.briefing || 'No briefing provided.'}</p>
          {scenario.objectives.filter(Boolean).length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-nebula-muted mb-2">OBJECTIVES</h4>
              <ul className="space-y-1">
                {scenario.objectives.filter(Boolean).map((o, i) => (
                  <li key={i} className="text-xs text-nebula-text flex items-start gap-2">
                    <span className="text-neon-cyan mt-0.5">&#x2022;</span> {o}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={() => setPhase('tasks')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/20 transition-colors cursor-pointer text-sm font-medium"
          >
            Start Tasks <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  const task = scenario.tasks[taskIdx]
  if (!task) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card-static rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-nebula-dim">Task {taskIdx + 1} of {scenario.tasks.length}</span>
          <div className="flex-1 h-1 bg-nebula-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-neon-cyan rounded-full"
              style={{ width: `${((taskIdx + 1) / scenario.tasks.length) * 100}%` }}
            />
          </div>
        </div>
        <h3 className="text-lg font-bold text-nebula-text mb-2">{task.title || 'Untitled Task'}</h3>
        <p className="text-sm text-nebula-muted mb-5">{task.description}</p>
        <div className="space-y-2">
          {task.options.map((opt) => (
            <div
              key={opt.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-nebula-border hover:border-neon-cyan/30 cursor-pointer transition-colors"
            >
              <span className="text-xs font-bold text-neon-cyan w-5">{opt.id.toUpperCase()}</span>
              <span className="text-sm text-nebula-text flex-1">{opt.text || '(empty)'}</span>
              <span className="text-[10px] font-mono text-neon-amber">{opt.points}pts</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setTaskIdx(Math.max(0, taskIdx - 1))}
            disabled={taskIdx === 0}
            className="text-xs text-nebula-muted hover:text-nebula-text disabled:opacity-30 cursor-pointer disabled:cursor-default"
          >
            Previous
          </button>
          <button
            onClick={() => taskIdx < scenario.tasks.length - 1 ? setTaskIdx(taskIdx + 1) : setPhase('briefing')}
            className="text-xs text-neon-cyan cursor-pointer"
          >
            {taskIdx < scenario.tasks.length - 1 ? 'Next Task' : 'Back to Briefing'}
          </button>
        </div>
      </div>
    </div>
  )
}
