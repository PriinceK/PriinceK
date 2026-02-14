import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Search, Trash2, Download, ZoomIn, ZoomOut,
  Undo2, Redo2, Grid3x3, Cable, Maximize2, Type,
  MousePointer2, ChevronDown, ChevronRight, Map, Box,
  Server, Database, Network, Shield, BarChart3, Brain,
  GitBranch, Zap, LayoutTemplate, BookOpen, Save, FolderOpen,
  Plus, X, Square, StickyNote, Lightbulb, Eye
} from 'lucide-react'
import { GCP_SERVICES, GCP_SERVICE_CATEGORIES } from '../data/gcpServices'
import { ARCHITECTURE_TEMPLATES } from '../data/architectureTemplates'

const ICON_MAP = { Server, Database, Network, Shield, BarChart3, Brain, GitBranch, Zap }

const SIDEBAR_TABS = [
  { id: 'services', label: 'Services', icon: Box },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
]

const DIFFICULTY_COLORS = {
  Beginner: { bg: 'bg-neon-emerald/10', text: 'text-neon-emerald', border: 'border-neon-emerald/20' },
  Intermediate: { bg: 'bg-neon-amber/10', text: 'text-neon-amber', border: 'border-neon-amber/20' },
  Advanced: { bg: 'bg-neon-rose/10', text: 'text-neon-rose', border: 'border-neon-rose/20' },
}

export default function ArchitectureCanvas() {
  const canvasRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [zones, setZones] = useState([])
  const [annotations, setAnnotations] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [selectedAnnotation, setSelectedAnnotation] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [draggingZone, setDraggingZone] = useState(null)
  const [draggingAnnotation, setDraggingAnnotation] = useState(null)
  const [connecting, setConnecting] = useState(null)
  const [connectPreview, setConnectPreview] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [panning, setPanning] = useState(false)
  const [panStart, setPanStart] = useState(null)
  const [search, setSearch] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({})
  const [mode, setMode] = useState('select')
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [projectName, setProjectName] = useState('Untitled Architecture')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [editingLabel, setEditingLabel] = useState(null)
  const [sidebarTab, setSidebarTab] = useState('services')
  const [templatePreview, setTemplatePreview] = useState(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [savedDesigns, setSavedDesigns] = useState([])
  const [showLearningNotes, setShowLearningNotes] = useState(false)
  const [learningNotes, setLearningNotes] = useState([])
  const [editingAnnotation, setEditingAnnotation] = useState(null)
  const [editingZone, setEditingZone] = useState(null)

  const gridSize = 24

  // Load saved designs list on mount
  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('arch-design-'))
    const designs = keys.map((k) => {
      try {
        const d = JSON.parse(localStorage.getItem(k))
        return { key: k, name: d.name, date: d.date, nodeCount: d.nodes?.length || 0 }
      } catch { return null }
    }).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date))
    setSavedDesigns(designs)
  }, [showLoadModal])

  function pushHistory() {
    const state = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      connections: JSON.parse(JSON.stringify(connections)),
      zones: JSON.parse(JSON.stringify(zones)),
      annotations: JSON.parse(JSON.stringify(annotations)),
    }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(state)
    if (newHistory.length > 50) newHistory.shift()
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  function undo() {
    if (historyIndex <= 0) return
    const prev = history[historyIndex - 1]
    setNodes(prev.nodes)
    setConnections(prev.connections)
    setZones(prev.zones || [])
    setAnnotations(prev.annotations || [])
    setHistoryIndex((i) => i - 1)
    clearSelection()
  }

  function redo() {
    if (historyIndex >= history.length - 1) return
    const next = history[historyIndex + 1]
    setNodes(next.nodes)
    setConnections(next.connections)
    setZones(next.zones || [])
    setAnnotations(next.annotations || [])
    setHistoryIndex((i) => i + 1)
    clearSelection()
  }

  function clearSelection() {
    setSelectedNode(null)
    setSelectedConnection(null)
    setSelectedZone(null)
    setSelectedAnnotation(null)
  }

  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ nodes: [], connections: [], zones: [], annotations: [] }])
      setHistoryIndex(0)
    }
  }, [])

  const snap = useCallback((val) => snapToGrid ? Math.round(val / gridSize) * gridSize : val, [snapToGrid])

  // --- Load template ---
  function loadTemplate(template) {
    setNodes(JSON.parse(JSON.stringify(template.nodes)))
    setConnections(JSON.parse(JSON.stringify(template.connections)))
    setZones(JSON.parse(JSON.stringify(template.zones || [])))
    setAnnotations(JSON.parse(JSON.stringify(template.annotations || [])))
    setProjectName(template.name)
    setLearningNotes(template.learningNotes || [])
    setShowLearningNotes(true)
    setTemplatePreview(null)
    clearSelection()
    pushHistory()
    // Fit to screen after a tick
    setTimeout(() => fitToScreen(), 100)
  }

  // --- Save / Load ---
  function saveDesign() {
    const key = `arch-design-${Date.now()}`
    const data = {
      name: projectName,
      date: new Date().toISOString(),
      nodes,
      connections,
      zones,
      annotations,
      learningNotes,
    }
    localStorage.setItem(key, JSON.stringify(data))
    setShowSaveModal(false)
  }

  function loadDesign(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key))
      setNodes(data.nodes || [])
      setConnections(data.connections || [])
      setZones(data.zones || [])
      setAnnotations(data.annotations || [])
      setLearningNotes(data.learningNotes || [])
      setProjectName(data.name || 'Untitled')
      setShowLoadModal(false)
      clearSelection()
      pushHistory()
      setTimeout(() => fitToScreen(), 100)
    } catch {}
  }

  function deleteDesign(key) {
    localStorage.removeItem(key)
    setSavedDesigns((prev) => prev.filter((d) => d.key !== key))
  }

  // --- Zone / Annotation creation ---
  function addZone() {
    const newZone = {
      id: `zone-${Date.now()}`,
      x: (-pan.x / zoom) + 200,
      y: (-pan.y / zoom) + 150,
      width: 280,
      height: 140,
      label: 'New Zone',
      color: '#4285f4',
    }
    setZones((prev) => [...prev, newZone])
    pushHistory()
  }

  function addAnnotation() {
    const newAnnotation = {
      id: `ann-${Date.now()}`,
      x: (-pan.x / zoom) + 300,
      y: (-pan.y / zoom) + 200,
      text: 'Add note here...',
    }
    setAnnotations((prev) => [...prev, newAnnotation])
    pushHistory()
  }

  // --- Drop handler ---
  function handleDrop(e) {
    e.preventDefault()
    try {
      const service = JSON.parse(e.dataTransfer.getData('service'))
      const rect = canvasRef.current.getBoundingClientRect()
      const x = snap((e.clientX - rect.left - pan.x) / zoom)
      const y = snap((e.clientY - rect.top - pan.y) / zoom)
      const newNode = { id: `node-${Date.now()}`, service, x, y }
      setNodes((prev) => [...prev, newNode])
      pushHistory()
    } catch {}
  }

  function handleCanvasMouseDown(e) {
    if (e.target !== canvasRef.current && e.target.closest('.canvas-inner') === canvasRef.current) {
      setPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  function handleCanvasMouseMove(e) {
    if (panning && panStart) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y })
    }
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = snap((e.clientX - rect.left - pan.x) / zoom - dragging.offsetX)
      const y = snap((e.clientY - rect.top - pan.y) / zoom - dragging.offsetY)
      setNodes((prev) => prev.map((n) => n.id === dragging.id ? { ...n, x, y } : n))
    }
    if (draggingZone) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = snap((e.clientX - rect.left - pan.x) / zoom - draggingZone.offsetX)
      const y = snap((e.clientY - rect.top - pan.y) / zoom - draggingZone.offsetY)
      setZones((prev) => prev.map((z) => z.id === draggingZone.id ? { ...z, x, y } : z))
    }
    if (draggingAnnotation) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = snap((e.clientX - rect.left - pan.x) / zoom - draggingAnnotation.offsetX)
      const y = snap((e.clientY - rect.top - pan.y) / zoom - draggingAnnotation.offsetY)
      setAnnotations((prev) => prev.map((a) => a.id === draggingAnnotation.id ? { ...a, x, y } : a))
    }
    if (connecting) {
      const rect = canvasRef.current.getBoundingClientRect()
      setConnectPreview({
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom,
      })
    }
  }

  function handleCanvasMouseUp() {
    if (dragging) { pushHistory(); setDragging(null) }
    if (draggingZone) { pushHistory(); setDraggingZone(null) }
    if (draggingAnnotation) { pushHistory(); setDraggingAnnotation(null) }
    setPanning(false)
    setPanStart(null)
  }

  function handleNodeMouseDown(e, node) {
    e.stopPropagation()
    if (mode === 'connect') {
      if (connecting) {
        if (connecting.id !== node.id) {
          const newConn = { id: `conn-${Date.now()}`, from: connecting.id, to: node.id, label: '' }
          setConnections((prev) => [...prev, newConn])
          pushHistory()
        }
        setConnecting(null)
        setConnectPreview(null)
      } else {
        setConnecting(node)
      }
    } else {
      setSelectedNode(node.id)
      setSelectedConnection(null)
      setSelectedZone(null)
      setSelectedAnnotation(null)
      const rect = canvasRef.current.getBoundingClientRect()
      setDragging({
        id: node.id,
        offsetX: (e.clientX - rect.left - pan.x) / zoom - node.x,
        offsetY: (e.clientY - rect.top - pan.y) / zoom - node.y,
      })
    }
  }

  function handleZoneMouseDown(e, zone) {
    e.stopPropagation()
    setSelectedZone(zone.id)
    setSelectedNode(null)
    setSelectedConnection(null)
    setSelectedAnnotation(null)
    const rect = canvasRef.current.getBoundingClientRect()
    setDraggingZone({
      id: zone.id,
      offsetX: (e.clientX - rect.left - pan.x) / zoom - zone.x,
      offsetY: (e.clientY - rect.top - pan.y) / zoom - zone.y,
    })
  }

  function handleAnnotationMouseDown(e, ann) {
    e.stopPropagation()
    setSelectedAnnotation(ann.id)
    setSelectedNode(null)
    setSelectedConnection(null)
    setSelectedZone(null)
    const rect = canvasRef.current.getBoundingClientRect()
    setDraggingAnnotation({
      id: ann.id,
      offsetX: (e.clientX - rect.left - pan.x) / zoom - ann.x,
      offsetY: (e.clientY - rect.top - pan.y) / zoom - ann.y,
    })
  }

  function handleConnectionClick(e, conn) {
    e.stopPropagation()
    setSelectedConnection(conn.id)
    setSelectedNode(null)
    setSelectedZone(null)
    setSelectedAnnotation(null)
  }

  function handleConnectionDoubleClick(e, conn) {
    e.stopPropagation()
    setEditingLabel(conn.id)
  }

  function handleDeleteSelected() {
    if (selectedNode) {
      setNodes((prev) => prev.filter((n) => n.id !== selectedNode))
      setConnections((prev) => prev.filter((c) => c.from !== selectedNode && c.to !== selectedNode))
      setSelectedNode(null)
      pushHistory()
    } else if (selectedConnection) {
      setConnections((prev) => prev.filter((c) => c.id !== selectedConnection))
      setSelectedConnection(null)
      pushHistory()
    } else if (selectedZone) {
      setZones((prev) => prev.filter((z) => z.id !== selectedZone))
      setSelectedZone(null)
      pushHistory()
    } else if (selectedAnnotation) {
      setAnnotations((prev) => prev.filter((a) => a.id !== selectedAnnotation))
      setSelectedAnnotation(null)
      pushHistory()
    }
  }

  function handleCanvasClick(e) {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-inner')) {
      clearSelection()
      setConnecting(null)
      setConnectPreview(null)
    }
  }

  function fitToScreen() {
    const allX = [...nodes.map((n) => n.x), ...zones.map((z) => z.x)]
    const allY = [...nodes.map((n) => n.y), ...zones.map((z) => z.y)]
    const allXMax = [...nodes.map((n) => n.x + 120), ...zones.map((z) => z.x + z.width)]
    const allYMax = [...nodes.map((n) => n.y + 80), ...zones.map((z) => z.y + z.height)]
    if (allX.length === 0) return
    const minX = Math.min(...allX) - 80
    const maxX = Math.max(...allXMax) + 80
    const minY = Math.min(...allY) - 80
    const maxY = Math.max(...allYMax) + 80
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = rect.width / (maxX - minX)
    const scaleY = rect.height / (maxY - minY)
    const newZoom = Math.min(scaleX, scaleY, 1.5)
    setZoom(Math.max(0.2, newZoom))
    setPan({ x: -minX * newZoom + 40, y: -minY * newZoom + 40 })
  }

  function exportJSON() {
    const data = JSON.stringify({ name: projectName, nodes, connections, zones, annotations, learningNotes }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName.replace(/\s/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'Delete' || e.key === 'Backspace') handleDeleteSelected()
      if (e.key === 'c' || e.key === 'C') setMode((m) => m === 'connect' ? 'select' : 'connect')
      if (e.key === 'g' || e.key === 'G') setSnapToGrid((s) => !s)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo() }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo() }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveDesign() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const filteredServices = GCP_SERVICES.filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  )

  const groupedServices = {}
  filteredServices.forEach((s) => {
    if (!groupedServices[s.category]) groupedServices[s.category] = []
    groupedServices[s.category].push(s)
  })

  function toggleCategory(cat) {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const minimapScale = 0.06
  const minimapW = 160
  const minimapH = 100

  return (
    <div className="h-screen flex flex-col bg-nebula-deep">
      {/* Toolbar */}
      <div
        className="h-12 border-b border-nebula-border flex items-center justify-between px-3 gap-2 shrink-0 z-20"
        style={{
          background: 'linear-gradient(180deg, rgba(6, 9, 24, 0.97) 0%, rgba(12, 16, 36, 0.95) 100%)',
          backdropFilter: 'blur(12px)',
        }}
        role="toolbar"
        aria-label="Canvas toolbar"
      >
        <div className="flex items-center gap-2">
          <Link to="/" className="text-nebula-muted hover:text-nebula-text no-underline transition-colors" aria-label="Back to dashboard">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-5 bg-nebula-border" />
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent border-0 text-sm font-semibold text-nebula-text outline-none w-48 focus:text-neon-cyan transition-colors"
            style={{ fontFamily: 'Syne, system-ui, sans-serif' }}
            aria-label="Project name"
          />
        </div>

        <div className="flex items-center gap-1">
          {/* Undo / Redo */}
          {[
            { icon: Undo2, label: 'Undo (Ctrl+Z)', onClick: undo, disabled: historyIndex <= 0 },
            { icon: Redo2, label: 'Redo (Ctrl+Y)', onClick: redo, disabled: historyIndex >= history.length - 1 },
          ].map(({ icon: Icon, label, onClick, disabled }) => (
            <button key={label} onClick={onClick} disabled={disabled}
              className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 disabled:opacity-25 transition-all cursor-pointer bg-transparent border-0"
              title={label} aria-label={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <div className="w-px h-5 bg-nebula-border mx-1" />

          {/* Mode buttons */}
          <button onClick={() => setMode('select')}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer bg-transparent border-0 ${mode === 'select' ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'}`}
            title="Select mode" aria-label="Select mode" aria-pressed={mode === 'select'}
          >
            <MousePointer2 className="w-4 h-4" />
          </button>
          <button onClick={() => setMode('connect')}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer bg-transparent border-0 ${mode === 'connect' ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'}`}
            title="Connect mode (C)" aria-label="Connect mode" aria-pressed={mode === 'connect'}
          >
            <Cable className="w-4 h-4" />
          </button>
          <button onClick={() => setSnapToGrid(!snapToGrid)}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer bg-transparent border-0 ${snapToGrid ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'}`}
            title="Snap to grid (G)" aria-label="Snap to grid" aria-pressed={snapToGrid}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-nebula-border mx-1" />

          {/* Add zone / annotation */}
          <button onClick={addZone}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all cursor-pointer bg-transparent border-0"
            title="Add zone" aria-label="Add group zone"
          >
            <Square className="w-4 h-4" />
          </button>
          <button onClick={addAnnotation}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-neon-amber hover:bg-neon-amber/10 transition-all cursor-pointer bg-transparent border-0"
            title="Add annotation" aria-label="Add annotation"
          >
            <StickyNote className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-nebula-border mx-1" />

          {/* Zoom */}
          <button onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 transition-all cursor-pointer bg-transparent border-0"
            title="Zoom in" aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs text-nebula-dim w-10 text-center select-none" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom((z) => Math.max(0.2, z - 0.15))}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 transition-all cursor-pointer bg-transparent border-0"
            title="Zoom out" aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={fitToScreen}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 transition-all cursor-pointer bg-transparent border-0"
            title="Fit to screen" aria-label="Fit to screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-nebula-border mx-1" />

          {/* Save / Load */}
          <button onClick={() => setShowSaveModal(true)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-neon-emerald hover:bg-neon-emerald/10 transition-all cursor-pointer bg-transparent border-0"
            title="Save (Ctrl+S)" aria-label="Save design"
          >
            <Save className="w-4 h-4" />
          </button>
          <button onClick={() => setShowLoadModal(true)}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all cursor-pointer bg-transparent border-0"
            title="Load saved design" aria-label="Load design"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-nebula-border mx-1" />

          {/* Delete / Export */}
          <button onClick={handleDeleteSelected}
            disabled={!selectedNode && !selectedConnection && !selectedZone && !selectedAnnotation}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-neon-rose hover:bg-neon-rose/10 disabled:opacity-25 transition-all cursor-pointer bg-transparent border-0"
            title="Delete (Del)" aria-label="Delete selected"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={exportJSON}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-neon-emerald hover:bg-neon-emerald/10 transition-all cursor-pointer bg-transparent border-0"
            title="Export JSON" aria-label="Export JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-nebula-border flex flex-col shrink-0 z-10" style={{ background: 'rgba(6, 9, 24, 0.95)' }}>
          {/* Sidebar tabs */}
          <div className="flex border-b border-nebula-border">
            {SIDEBAR_TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setSidebarTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all cursor-pointer border-0 ${
                  sidebarTab === id ? 'text-neon-cyan bg-neon-cyan/5 border-b-2 border-neon-cyan' : 'text-nebula-muted hover:text-nebula-text bg-transparent'
                }`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {sidebarTab === 'services' && (
            <>
              <div className="p-3 border-b border-nebula-border">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-nebula-dim" />
                  <input type="text" placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-nebula-deep/60 border border-nebula-border rounded-lg text-xs text-nebula-text placeholder-nebula-dim outline-none focus:border-neon-cyan/30 transition-colors"
                    aria-label="Search GCP services"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {Object.entries(groupedServices).map(([catKey, services]) => {
                  const cat = GCP_SERVICE_CATEGORIES[catKey]
                  const isExpanded = expandedCategories[catKey] !== false
                  return (
                    <div key={catKey} className="mb-1">
                      <button onClick={() => toggleCategory(catKey)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-nebula-muted hover:text-nebula-text rounded-md transition-colors bg-transparent border-0 cursor-pointer"
                        aria-expanded={isExpanded}
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }} />
                        {cat?.label || catKey}
                        <span className="ml-auto text-nebula-dim">{services.length}</span>
                      </button>
                      {isExpanded && (
                        <div className="ml-2 space-y-0.5 mt-0.5">
                          {services.map((service) => {
                            const CatIcon = ICON_MAP[cat?.icon] || Box
                            return (
                              <div key={service.id} draggable
                                onDragStart={(e) => e.dataTransfer.setData('service', JSON.stringify(service))}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 cursor-grab active:cursor-grabbing transition-colors"
                                title={service.description}
                              >
                                <CatIcon className="w-3 h-3 shrink-0" style={{ color: cat?.color }} />
                                <span className="truncate">{service.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {sidebarTab === 'templates' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <p className="text-xs text-nebula-dim mb-2">Click a template to preview, then load it onto the canvas.</p>
              {ARCHITECTURE_TEMPLATES.map((t) => {
                const dc = DIFFICULTY_COLORS[t.difficulty] || DIFFICULTY_COLORS.Beginner
                return (
                  <button key={t.id} onClick={() => setTemplatePreview(t)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      templatePreview?.id === t.id ? 'border-neon-cyan/40 bg-neon-cyan/5' : 'border-nebula-border bg-nebula-surface/30 hover:border-nebula-border-bright'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${dc.bg} ${dc.text} ${dc.border} border`}
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {t.difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-nebula-text mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{t.name}</h4>
                    <p className="text-xs text-nebula-muted leading-relaxed line-clamp-2">{t.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {t.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-nebula-deep/60 text-nebula-dim border border-nebula-border"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      <span>{t.preview.nodeCount} nodes</span>
                      <span>{t.preview.connectionCount} connections</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Minimap */}
          <div className="border-t border-nebula-border p-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Map className="w-3 h-3 text-nebula-dim" />
              <span className="text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Minimap</span>
            </div>
            <div className="relative bg-nebula-deep/60 rounded-lg border border-nebula-border overflow-hidden" style={{ height: minimapH }}>
              <svg width="100%" height="100%" viewBox={`0 0 ${minimapW} ${minimapH}`}>
                {zones.map((zone) => (
                  <rect key={zone.id} x={zone.x * minimapScale + 4} y={zone.y * minimapScale + 4}
                    width={zone.width * minimapScale} height={zone.height * minimapScale}
                    rx={1} fill={zone.color + '15'} stroke={zone.color + '30'} strokeWidth="0.5"
                  />
                ))}
                {connections.map((conn) => {
                  const from = nodes.find((n) => n.id === conn.from)
                  const to = nodes.find((n) => n.id === conn.to)
                  if (!from || !to) return null
                  return <line key={conn.id} x1={from.x * minimapScale + 10} y1={from.y * minimapScale + 10}
                    x2={to.x * minimapScale + 10} y2={to.y * minimapScale + 10}
                    stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.5" />
                })}
                {nodes.map((node) => {
                  const cat = GCP_SERVICE_CATEGORIES[node.service.category]
                  return <rect key={node.id} x={node.x * minimapScale + 8} y={node.y * minimapScale + 8}
                    width={4} height={4} rx={1} fill={cat?.color || '#00d4ff'} opacity={0.8} />
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div ref={canvasRef}
            className="absolute inset-0 architecture-canvas canvas-inner"
            style={{ cursor: mode === 'connect' ? 'crosshair' : panning ? 'grabbing' : 'grab' }}
            onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
            onMouseDown={handleCanvasMouseDown} onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp} onClick={handleCanvasClick}
            onWheel={(e) => { e.preventDefault(); setZoom((z) => Math.max(0.2, Math.min(3, z + (e.deltaY > 0 ? -0.08 : 0.08)))) }}
            role="application" aria-label="Architecture design canvas"
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
              {/* Connections */}
              {connections.map((conn) => {
                const from = nodes.find((n) => n.id === conn.from)
                const to = nodes.find((n) => n.id === conn.to)
                if (!from || !to) return null
                const x1 = from.x + 60, y1 = from.y + 40
                const x2 = to.x + 60, y2 = to.y + 40
                const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2
                const isSelected = selectedConnection === conn.id
                return (
                  <g key={conn.id} className="pointer-events-auto" style={{ cursor: 'pointer' }}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="12"
                      onClick={(e) => handleConnectionClick(e, conn)}
                      onDoubleClick={(e) => handleConnectionDoubleClick(e, conn)}
                    />
                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isSelected ? '#00d4ff' : 'rgba(99, 102, 241, 0.35)'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray={isSelected ? '8,4' : 'none'}
                      className={isSelected ? 'connection-line' : ''}
                      style={{ filter: isSelected ? 'drop-shadow(0 0 4px rgba(0, 212, 255, 0.3))' : 'none' }}
                    />
                    {/* Arrow head */}
                    {(() => {
                      const angle = Math.atan2(y2 - y1, x2 - x1)
                      const ax = x2 - 14 * Math.cos(angle)
                      const ay = y2 - 14 * Math.sin(angle)
                      return (
                        <polygon
                          points={`${x2},${y2} ${ax - 5 * Math.cos(angle - Math.PI / 6)},${ay - 5 * Math.sin(angle - Math.PI / 6)} ${ax - 5 * Math.cos(angle + Math.PI / 6)},${ay - 5 * Math.sin(angle + Math.PI / 6)}`}
                          fill={isSelected ? '#00d4ff' : 'rgba(99, 102, 241, 0.5)'}
                        />
                      )
                    })()}
                    {conn.label && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect x={-conn.label.length * 3.5 - 6} y={-10} width={conn.label.length * 7 + 12} height={20}
                          rx={4} fill="rgba(12, 16, 36, 0.9)" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" />
                        <text textAnchor="middle" dominantBaseline="central" fill="#7b83a6" fontSize="10" fontFamily="JetBrains Mono, monospace">
                          {conn.label}
                        </text>
                      </g>
                    )}
                    {editingLabel === conn.id && (
                      <foreignObject x={midX - 60} y={midY - 14} width={120} height={28}>
                        <input autoFocus defaultValue={conn.label}
                          className="w-full h-full px-2 text-xs bg-nebula-base border border-neon-cyan/40 rounded text-nebula-text outline-none text-center"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                          onBlur={(e) => {
                            setConnections((prev) => prev.map((c) => c.id === conn.id ? { ...c, label: e.target.value } : c))
                            setEditingLabel(null)
                            pushHistory()
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.target.blur()
                            if (e.key === 'Escape') setEditingLabel(null)
                          }}
                        />
                      </foreignObject>
                    )}
                  </g>
                )
              })}
              {connecting && connectPreview && (
                <line x1={connecting.x + 60} y1={connecting.y + 40} x2={connectPreview.x} y2={connectPreview.y}
                  stroke="rgba(0, 212, 255, 0.5)" strokeWidth="2" strokeDasharray="6,4" className="connection-line" />
              )}
            </svg>

            {/* Zones + Annotations + Nodes layer */}
            <div className="absolute inset-0"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
              {/* Zones */}
              {zones.map((zone) => {
                const isSelected = selectedZone === zone.id
                return (
                  <div key={zone.id}
                    className={`absolute rounded-xl border-2 border-dashed transition-shadow ${isSelected ? 'shadow-lg' : ''}`}
                    style={{
                      left: zone.x, top: zone.y, width: zone.width, height: zone.height,
                      borderColor: zone.color + (isSelected ? '80' : '40'),
                      backgroundColor: zone.color + '08',
                    }}
                    onMouseDown={(e) => handleZoneMouseDown(e, zone)}
                    onDoubleClick={(e) => { e.stopPropagation(); setEditingZone(zone.id) }}
                  >
                    {editingZone === zone.id ? (
                      <input autoFocus defaultValue={zone.label}
                        className="absolute top-1.5 left-2.5 bg-transparent border-0 text-xs font-semibold outline-none w-32"
                        style={{ color: zone.color, fontFamily: 'JetBrains Mono, monospace' }}
                        onBlur={(e) => {
                          setZones((prev) => prev.map((z) => z.id === zone.id ? { ...z, label: e.target.value } : z))
                          setEditingZone(null)
                          pushHistory()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.target.blur()
                          if (e.key === 'Escape') setEditingZone(null)
                        }}
                      />
                    ) : (
                      <span className="absolute top-1.5 left-2.5 text-[10px] font-semibold select-none"
                        style={{ color: zone.color, fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {zone.label}
                      </span>
                    )}
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-sm cursor-se-resize"
                        style={{ backgroundColor: zone.color }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                          const startX = e.clientX
                          const startY = e.clientY
                          const startW = zone.width
                          const startH = zone.height
                          function onMove(ev) {
                            const dw = (ev.clientX - startX) / zoom
                            const dh = (ev.clientY - startY) / zoom
                            setZones((prev) => prev.map((z) => z.id === zone.id ? { ...z, width: Math.max(100, startW + dw), height: Math.max(60, startH + dh) } : z))
                          }
                          function onUp() {
                            pushHistory()
                            window.removeEventListener('mousemove', onMove)
                            window.removeEventListener('mouseup', onUp)
                          }
                          window.addEventListener('mousemove', onMove)
                          window.addEventListener('mouseup', onUp)
                        }}
                      />
                    )}
                  </div>
                )
              })}

              {/* Annotations */}
              {annotations.map((ann) => {
                const isSelected = selectedAnnotation === ann.id
                return (
                  <div key={ann.id}
                    className={`absolute rounded-lg p-2.5 border transition-shadow max-w-[200px] ${isSelected ? 'shadow-lg border-neon-amber/50' : 'border-neon-amber/20'}`}
                    style={{ left: ann.x, top: ann.y, backgroundColor: 'rgba(251, 188, 4, 0.06)' }}
                    onMouseDown={(e) => handleAnnotationMouseDown(e, ann)}
                    onDoubleClick={(e) => { e.stopPropagation(); setEditingAnnotation(ann.id) }}
                  >
                    <StickyNote className="w-3 h-3 text-neon-amber/50 mb-1" />
                    {editingAnnotation === ann.id ? (
                      <textarea autoFocus defaultValue={ann.text} rows={3}
                        className="bg-transparent border-0 text-xs text-nebula-muted outline-none w-full resize-none"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        onBlur={(e) => {
                          setAnnotations((prev) => prev.map((a) => a.id === ann.id ? { ...a, text: e.target.value } : a))
                          setEditingAnnotation(null)
                          pushHistory()
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setEditingAnnotation(null)
                        }}
                      />
                    ) : (
                      <p className="text-[10px] text-nebula-muted leading-relaxed whitespace-pre-line"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {ann.text}
                      </p>
                    )}
                  </div>
                )
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const cat = GCP_SERVICE_CATEGORIES[node.service.category]
                const CatIcon = ICON_MAP[cat?.icon] || Box
                const isSelected = selectedNode === node.id
                const isConnectSource = connecting?.id === node.id
                return (
                  <div key={node.id}
                    className={`absolute gcp-node canvas-fade-in glass-card-static rounded-xl p-3 w-[120px] ${
                      isSelected ? 'ring-2 ring-neon-cyan/50' : ''
                    } ${isConnectSource ? 'ring-2 ring-neon-purple/50 pulse-ring' : ''}`}
                    style={{ left: node.x, top: node.y, borderColor: isSelected ? 'rgba(0, 212, 255, 0.3)' : cat?.color + '25' }}
                    onMouseDown={(e) => handleNodeMouseDown(e, node)}
                  >
                    <div className="flex flex-col items-center text-center gap-1.5">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat?.color + '15' }}>
                        <CatIcon className="w-4 h-4" style={{ color: cat?.color }} />
                      </div>
                      <span className="text-[10px] font-medium text-nebula-text leading-tight">{node.service.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Empty state */}
            {nodes.length === 0 && zones.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <Box className="w-12 h-12 text-nebula-dim mx-auto mb-3 opacity-20" />
                  <p className="text-nebula-dim text-sm mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Drag services here or load a template</p>
                  <p className="text-nebula-dim text-xs opacity-50" style={{ fontFamily: 'JetBrains Mono, monospace' }}>C = connect &middot; G = grid &middot; Del = delete</p>
                </div>
              </div>
            )}
          </div>

          {/* Template Preview Overlay */}
          {templatePreview && (
            <div className="absolute bottom-4 right-4 w-80 glass-card-static rounded-2xl p-5 z-20 border border-nebula-border">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>{templatePreview.name}</h3>
                <button onClick={() => setTemplatePreview(null)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-nebula-dim hover:text-nebula-text bg-transparent border-0 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-nebula-muted leading-relaxed mb-3">{templatePreview.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {templatePreview.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-nebula-deep/60 text-nebula-dim border border-nebula-border"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}>{tag}</span>
                ))}
              </div>
              {/* Mini preview */}
              <div className="bg-nebula-deep/60 rounded-lg border border-nebula-border p-2 mb-3" style={{ height: 100 }}>
                <svg width="100%" height="100%" viewBox="0 0 260 80">
                  {(templatePreview.zones || []).map((z) => (
                    <rect key={z.id} x={z.x * 0.25} y={z.y * 0.15} width={z.width * 0.25} height={z.height * 0.15}
                      rx={2} fill={z.color + '10'} stroke={z.color + '30'} strokeWidth="0.5" strokeDasharray="2,2" />
                  ))}
                  {templatePreview.connections.map((c) => {
                    const from = templatePreview.nodes.find((n) => n.id === c.from)
                    const to = templatePreview.nodes.find((n) => n.id === c.to)
                    if (!from || !to) return null
                    return <line key={c.id} x1={from.x * 0.25 + 12} y1={from.y * 0.15 + 6} x2={to.x * 0.25 + 12} y2={to.y * 0.15 + 6}
                      stroke="rgba(99, 102, 241, 0.4)" strokeWidth="0.7" />
                  })}
                  {templatePreview.nodes.map((n) => {
                    const cat = GCP_SERVICE_CATEGORIES[n.service.category]
                    return <rect key={n.id} x={n.x * 0.25 + 6} y={n.y * 0.15} width={14} height={12}
                      rx={2} fill={cat?.color + '30'} stroke={cat?.color + '60'} strokeWidth="0.5" />
                  })}
                </svg>
              </div>
              <div className="flex items-center gap-3 mb-3 text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <span>{templatePreview.nodes.length} nodes</span>
                <span>{templatePreview.connections.length} connections</span>
                <span>{(templatePreview.zones || []).length} zones</span>
              </div>
              <button onClick={() => loadTemplate(templatePreview)}
                className="w-full py-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-medium hover:bg-neon-cyan/20 transition-colors cursor-pointer"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Load Template onto Canvas
              </button>
            </div>
          )}

          {/* Learning Notes Panel */}
          {showLearningNotes && learningNotes.length > 0 && (
            <div className="absolute top-4 right-4 w-72 glass-card-static rounded-2xl p-4 z-20 border border-nebula-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-neon-amber" />
                  <h3 className="text-xs font-semibold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Learning Notes</h3>
                </div>
                <button onClick={() => setShowLearningNotes(false)}
                  className="w-5 h-5 rounded flex items-center justify-center text-nebula-dim hover:text-nebula-text bg-transparent border-0 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <ul className="space-y-2">
                {learningNotes.map((note, i) => (
                  <li key={i} className="text-[11px] text-nebula-muted leading-relaxed flex items-start gap-2">
                    <span className="text-neon-amber shrink-0 mt-0.5">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Learning notes toggle (when hidden) */}
          {!showLearningNotes && learningNotes.length > 0 && (
            <button onClick={() => setShowLearningNotes(true)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center bg-neon-amber/10 border border-neon-amber/30 text-neon-amber hover:bg-neon-amber/20 transition-colors cursor-pointer"
              title="Show learning notes"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="h-7 border-t border-nebula-border flex items-center px-3 text-xs text-nebula-dim gap-4 shrink-0"
        style={{ background: 'rgba(6, 9, 24, 0.97)', fontFamily: 'JetBrains Mono, monospace' }}>
        <span>{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
        <span>{connections.length} connection{connections.length !== 1 ? 's' : ''}</span>
        <span>{zones.length} zone{zones.length !== 1 ? 's' : ''}</span>
        <span>{annotations.length} note{annotations.length !== 1 ? 's' : ''}</span>
        <span className="ml-auto">{mode === 'connect' ? 'Connect mode' : 'Select mode'}</span>
        {snapToGrid && <span>Grid ON</span>}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card-static rounded-2xl p-6 w-96 border border-nebula-border">
            <div className="flex items-center gap-2 mb-4">
              <Save className="w-5 h-5 text-neon-emerald" />
              <h2 className="text-lg font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Save Design</h2>
            </div>
            <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Design name"
              className="w-full px-3 py-2.5 rounded-lg bg-nebula-deep/60 border border-nebula-border text-sm text-nebula-text outline-none focus:border-neon-cyan/40 mb-4"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
            <div className="text-xs text-nebula-dim mb-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {nodes.length} nodes • {connections.length} connections • {zones.length} zones
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2 rounded-lg border border-nebula-border text-nebula-muted text-sm hover:text-nebula-text transition-colors cursor-pointer bg-transparent">
                Cancel
              </button>
              <button onClick={saveDesign}
                className="flex-1 py-2 rounded-lg bg-neon-emerald/10 border border-neon-emerald/30 text-neon-emerald text-sm font-medium hover:bg-neon-emerald/20 transition-colors cursor-pointer">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card-static rounded-2xl p-6 w-96 border border-nebula-border max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-neon-cyan" />
                <h2 className="text-lg font-bold text-nebula-text" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Load Design</h2>
              </div>
              <button onClick={() => setShowLoadModal(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-nebula-dim hover:text-nebula-text bg-transparent border-0 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {savedDesigns.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="w-10 h-10 mx-auto mb-2 text-nebula-dim opacity-20" />
                  <p className="text-sm text-nebula-muted">No saved designs yet.</p>
                  <p className="text-xs text-nebula-dim mt-1">Save your current design or load a template first.</p>
                </div>
              ) : (
                savedDesigns.map((d) => (
                  <div key={d.key} className="flex items-center gap-3 p-3 rounded-lg border border-nebula-border hover:border-nebula-border-bright transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-nebula-text truncate">{d.name}</p>
                      <p className="text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {d.nodeCount} nodes • {new Date(d.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button onClick={() => loadDesign(d.key)}
                      className="px-3 py-1.5 rounded-md bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs hover:bg-neon-cyan/20 transition-colors cursor-pointer">
                      Load
                    </button>
                    <button onClick={() => deleteDesign(d.key)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-nebula-dim hover:text-neon-rose hover:bg-neon-rose/10 transition-colors cursor-pointer bg-transparent border-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
