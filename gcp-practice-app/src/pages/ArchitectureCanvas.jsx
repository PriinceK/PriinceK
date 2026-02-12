import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Search, Trash2, Download, ZoomIn, ZoomOut,
  Undo2, Redo2, Grid3x3, Cable, Maximize2, Type,
  MousePointer2, ChevronDown, ChevronRight, Map, Box,
  Server, Database, Network, Shield, BarChart3, Brain,
  GitBranch, Zap
} from 'lucide-react'
import { GCP_SERVICES, GCP_SERVICE_CATEGORIES } from '../data/gcpServices'

const ICON_MAP = { Server, Database, Network, Shield, BarChart3, Brain, GitBranch, Zap }

export default function ArchitectureCanvas() {
  const canvasRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [dragging, setDragging] = useState(null)
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

  const gridSize = 24

  function pushHistory() {
    const state = { nodes: JSON.parse(JSON.stringify(nodes)), connections: JSON.parse(JSON.stringify(connections)) }
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
    setHistoryIndex((i) => i - 1)
    setSelectedNode(null)
    setSelectedConnection(null)
  }

  function redo() {
    if (historyIndex >= history.length - 1) return
    const next = history[historyIndex + 1]
    setNodes(next.nodes)
    setConnections(next.connections)
    setHistoryIndex((i) => i + 1)
    setSelectedNode(null)
    setSelectedConnection(null)
  }

  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ nodes: [], connections: [] }])
      setHistoryIndex(0)
    }
  }, [])

  const snap = useCallback((val) => snapToGrid ? Math.round(val / gridSize) * gridSize : val, [snapToGrid])

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
    if (connecting) {
      const rect = canvasRef.current.getBoundingClientRect()
      setConnectPreview({
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom,
      })
    }
  }

  function handleCanvasMouseUp() {
    if (dragging) {
      pushHistory()
      setDragging(null)
    }
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
      const rect = canvasRef.current.getBoundingClientRect()
      setDragging({
        id: node.id,
        offsetX: (e.clientX - rect.left - pan.x) / zoom - node.x,
        offsetY: (e.clientY - rect.top - pan.y) / zoom - node.y,
      })
    }
  }

  function handleConnectionClick(e, conn) {
    e.stopPropagation()
    setSelectedConnection(conn.id)
    setSelectedNode(null)
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
    }
  }

  function handleCanvasClick(e) {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-inner')) {
      setSelectedNode(null)
      setSelectedConnection(null)
      setConnecting(null)
      setConnectPreview(null)
    }
  }

  function fitToScreen() {
    if (nodes.length === 0) return
    const xs = nodes.map((n) => n.x)
    const ys = nodes.map((n) => n.y)
    const minX = Math.min(...xs) - 100
    const maxX = Math.max(...xs) + 250
    const minY = Math.min(...ys) - 100
    const maxY = Math.max(...ys) + 200
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = rect.width / (maxX - minX)
    const scaleY = rect.height / (maxY - minY)
    const newZoom = Math.min(scaleX, scaleY, 1.5)
    setZoom(Math.max(0.2, newZoom))
    setPan({ x: -minX * newZoom + 40, y: -minY * newZoom + 40 })
  }

  function exportJSON() {
    const data = JSON.stringify({ name: projectName, nodes, connections }, null, 2)
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

  // Minimap
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
            className="bg-transparent border-0 text-sm font-semibold text-nebula-text outline-none w-40 focus:text-neon-cyan transition-colors"
            style={{ fontFamily: 'Syne, system-ui, sans-serif' }}
            aria-label="Project name"
          />
        </div>

        <div className="flex items-center gap-1">
          {[
            { icon: Undo2, label: 'Undo (Ctrl+Z)', onClick: undo, disabled: historyIndex <= 0 },
            { icon: Redo2, label: 'Redo (Ctrl+Y)', onClick: redo, disabled: historyIndex >= history.length - 1 },
          ].map(({ icon: Icon, label, onClick, disabled }) => (
            <button
              key={label}
              onClick={onClick}
              disabled={disabled}
              className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 disabled:opacity-25 transition-all cursor-pointer bg-transparent border-0"
              title={label}
              aria-label={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <div className="w-px h-5 bg-nebula-border mx-1" />

          <button
            onClick={() => setMode('select')}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer bg-transparent border-0 ${
              mode === 'select' ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'
            }`}
            title="Select mode"
            aria-label="Select mode"
            aria-pressed={mode === 'select'}
          >
            <MousePointer2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMode('connect')}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer bg-transparent border-0 ${
              mode === 'connect' ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'
            }`}
            title="Connect mode (C)"
            aria-label="Connect mode"
            aria-pressed={mode === 'connect'}
          >
            <Cable className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all cursor-pointer bg-transparent border-0 ${
              snapToGrid ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50'
            }`}
            title="Snap to grid (G)"
            aria-label="Snap to grid"
            aria-pressed={snapToGrid}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-nebula-border mx-1" />

          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 transition-all cursor-pointer bg-transparent border-0"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-xs text-nebula-dim w-10 text-center select-none" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.max(0.2, z - 0.15))}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 transition-all cursor-pointer bg-transparent border-0"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={fitToScreen}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-nebula-text hover:bg-nebula-surface/50 transition-all cursor-pointer bg-transparent border-0"
            title="Fit to screen"
            aria-label="Fit to screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-nebula-border mx-1" />

          <button
            onClick={handleDeleteSelected}
            disabled={!selectedNode && !selectedConnection}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-neon-rose hover:bg-neon-rose/10 disabled:opacity-25 transition-all cursor-pointer bg-transparent border-0"
            title="Delete (Del)"
            aria-label="Delete selected"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={exportJSON}
            className="w-8 h-8 rounded-md flex items-center justify-center text-nebula-muted hover:text-neon-emerald hover:bg-neon-emerald/10 transition-all cursor-pointer bg-transparent border-0"
            title="Export JSON"
            aria-label="Export JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className="w-60 border-r border-nebula-border flex flex-col shrink-0 z-10"
          style={{ background: 'rgba(6, 9, 24, 0.95)' }}
        >
          <div className="p-3 border-b border-nebula-border">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-nebula-dim" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                  <button
                    onClick={() => toggleCategory(catKey)}
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
                          <div
                            key={service.id}
                            draggable
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

          {/* Minimap */}
          <div className="border-t border-nebula-border p-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Map className="w-3 h-3 text-nebula-dim" aria-hidden="true" />
              <span className="text-xs text-nebula-dim" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Minimap</span>
            </div>
            <div className="relative bg-nebula-deep/60 rounded-lg border border-nebula-border overflow-hidden" style={{ height: minimapH }}>
              <svg width="100%" height="100%" viewBox={`0 0 ${minimapW} ${minimapH}`}>
                {connections.map((conn) => {
                  const from = nodes.find((n) => n.id === conn.from)
                  const to = nodes.find((n) => n.id === conn.to)
                  if (!from || !to) return null
                  return (
                    <line
                      key={conn.id}
                      x1={from.x * minimapScale + 10}
                      y1={from.y * minimapScale + 10}
                      x2={to.x * minimapScale + 10}
                      y2={to.y * minimapScale + 10}
                      stroke="rgba(0, 212, 255, 0.3)"
                      strokeWidth="0.5"
                    />
                  )
                })}
                {nodes.map((node) => {
                  const cat = GCP_SERVICE_CATEGORIES[node.service.category]
                  return (
                    <rect
                      key={node.id}
                      x={node.x * minimapScale + 8}
                      y={node.y * minimapScale + 8}
                      width={4}
                      height={4}
                      rx={1}
                      fill={cat?.color || '#00d4ff'}
                      opacity={0.8}
                    />
                  )
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden architecture-canvas canvas-inner"
          style={{ cursor: mode === 'connect' ? 'crosshair' : panning ? 'grabbing' : 'grab' }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onClick={handleCanvasClick}
          onWheel={(e) => {
            e.preventDefault()
            const delta = e.deltaY > 0 ? -0.08 : 0.08
            setZoom((z) => Math.max(0.2, Math.min(3, z + delta)))
          }}
          role="application"
          aria-label="Architecture design canvas"
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
          >
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
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="transparent" strokeWidth="12"
                    onClick={(e) => handleConnectionClick(e, conn)}
                    onDoubleClick={(e) => handleConnectionDoubleClick(e, conn)}
                  />
                  <line
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isSelected ? '#00d4ff' : 'rgba(99, 102, 241, 0.35)'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    strokeDasharray={isSelected ? '8,4' : 'none'}
                    className={isSelected ? 'connection-line' : ''}
                    style={{ filter: isSelected ? 'drop-shadow(0 0 4px rgba(0, 212, 255, 0.3))' : 'none' }}
                  />
                  {conn.label && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x={-conn.label.length * 3.5 - 6}
                        y={-10}
                        width={conn.label.length * 7 + 12}
                        height={20}
                        rx={4}
                        fill="rgba(12, 16, 36, 0.9)"
                        stroke="rgba(99, 102, 241, 0.2)"
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#7b83a6"
                        fontSize="10"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {conn.label}
                      </text>
                    </g>
                  )}
                  {editingLabel === conn.id && (
                    <foreignObject x={midX - 60} y={midY - 14} width={120} height={28}>
                      <input
                        autoFocus
                        defaultValue={conn.label}
                        className="w-full h-full px-2 text-xs bg-nebula-base border border-neon-cyan/40 rounded text-nebula-text outline-none text-center"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        onBlur={(e) => {
                          setConnections((prev) =>
                            prev.map((c) => c.id === conn.id ? { ...c, label: e.target.value } : c)
                          )
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

            {/* Connect preview */}
            {connecting && connectPreview && (
              <line
                x1={connecting.x + 60}
                y1={connecting.y + 40}
                x2={connectPreview.x}
                y2={connectPreview.y}
                stroke="rgba(0, 212, 255, 0.5)"
                strokeWidth="2"
                strokeDasharray="6,4"
                className="connection-line"
              />
            )}
          </svg>

          {/* Nodes */}
          <div
            className="absolute inset-0"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
          >
            {nodes.map((node) => {
              const cat = GCP_SERVICE_CATEGORIES[node.service.category]
              const CatIcon = ICON_MAP[cat?.icon] || Box
              const isSelected = selectedNode === node.id
              const isConnectSource = connecting?.id === node.id
              return (
                <div
                  key={node.id}
                  className={`absolute gcp-node canvas-fade-in glass-card-static rounded-xl p-3 w-[120px] ${
                    isSelected ? 'ring-2 ring-neon-cyan/50' : ''
                  } ${isConnectSource ? 'ring-2 ring-neon-purple/50 pulse-ring' : ''}`}
                  style={{
                    left: node.x,
                    top: node.y,
                    borderColor: isSelected ? 'rgba(0, 212, 255, 0.3)' : cat?.color + '25',
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node)}
                >
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: cat?.color + '15' }}
                    >
                      <CatIcon className="w-4 h-4" style={{ color: cat?.color }} />
                    </div>
                    <span className="text-[10px] font-medium text-nebula-text leading-tight">
                      {node.service.name}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <Box className="w-12 h-12 text-nebula-dim mx-auto mb-3 opacity-20" />
                <p className="text-nebula-dim text-sm mb-1" style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>Drag services here to get started</p>
                <p className="text-nebula-dim text-xs opacity-50" style={{ fontFamily: 'JetBrains Mono, monospace' }}>C = connect &middot; G = grid snap &middot; Del = delete</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="h-7 border-t border-nebula-border flex items-center px-3 text-xs text-nebula-dim gap-4 shrink-0" style={{ background: 'rgba(6, 9, 24, 0.97)', fontFamily: 'JetBrains Mono, monospace' }}>
        <span>{nodes.length} node{nodes.length !== 1 ? 's' : ''}</span>
        <span>{connections.length} connection{connections.length !== 1 ? 's' : ''}</span>
        <span className="ml-auto">{mode === 'connect' ? 'Connect mode' : 'Select mode'}</span>
        {snapToGrid && <span>Grid snap ON</span>}
      </div>
    </div>
  )
}
