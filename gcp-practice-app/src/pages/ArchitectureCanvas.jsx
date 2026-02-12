import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Layout, Trash2, Download, RotateCcw, ZoomIn, ZoomOut,
  Link as LinkIcon, MousePointer, X, ChevronDown, ChevronRight,
  Undo2, Redo2, Grid3X3, Maximize, Image, AlertTriangle,
  ArrowRight, Type, Move
} from 'lucide-react'
import { GCP_SERVICES, GCP_SERVICE_CATEGORIES } from '../data/gcpServices'
import GcpServiceNode from '../components/GcpServiceNode'

const GRID_SIZE = 24
const SNAP_THRESHOLD = 12

function snapToGrid(val) {
  return Math.round(val / GRID_SIZE) * GRID_SIZE
}

function getNodeCenter(node) {
  if (!node) return { x: 0, y: 0 }
  return { x: node.x + 56, y: node.y + 36 }
}

function computeArrowHead(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return { x1: to.x, y1: to.y, x2: to.x, y2: to.y }
  const ux = dx / len
  const uy = dy / len
  const arrowLen = 10
  const arrowAngle = Math.PI / 6
  return {
    x1: to.x - arrowLen * (ux * Math.cos(arrowAngle) - uy * Math.sin(arrowAngle)),
    y1: to.y - arrowLen * (uy * Math.cos(arrowAngle) + ux * Math.sin(arrowAngle)),
    x2: to.x - arrowLen * (ux * Math.cos(arrowAngle) + uy * Math.sin(arrowAngle)),
    y2: to.y - arrowLen * (uy * Math.cos(arrowAngle) - ux * Math.sin(arrowAngle)),
  }
}

const MAX_HISTORY = 50

export default function ArchitectureCanvas() {
  const canvasRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [dragging, setDragging] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connectMode, setConnectMode] = useState(false)
  const [connectFrom, setConnectFrom] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState({})
  const [selectedNode, setSelectedNode] = useState(null)
  const [projectName, setProjectName] = useState('Untitled Architecture')
  const [snapEnabled, setSnapEnabled] = useState(true)
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const [editingLabel, setEditingLabel] = useState(null)
  const [editingConnection, setEditingConnection] = useState(null)
  const [connectionLabelInput, setConnectionLabelInput] = useState('')
  const [hoveredConnection, setHoveredConnection] = useState(null)
  const [mousePos, setMousePos] = useState(null)

  // Undo/redo history
  const [history, setHistory] = useState([{ nodes: [], connections: [] }])
  const [historyIndex, setHistoryIndex] = useState(0)

  const nextId = useRef(1)

  function pushHistory(newNodes, newConns) {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1)
      const next = [...trimmed, { nodes: newNodes, connections: newConns }]
      if (next.length > MAX_HISTORY) next.shift()
      return next
    })
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1))
  }

  function undo() {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    const state = history[newIndex]
    setNodes(state.nodes)
    setConnections(state.connections)
    setSelectedNode(null)
  }

  function redo() {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    const state = history[newIndex]
    setNodes(state.nodes)
    setConnections(state.connections)
    setSelectedNode(null)
  }

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNode) {
          e.preventDefault()
          removeNode(selectedNode)
        }
      }
      if (e.key === 'Escape') {
        setConnectMode(false)
        setConnectFrom(null)
        setSelectedNode(null)
        setEditingLabel(null)
        setEditingConnection(null)
        setShowConfirmClear(false)
      }
      if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
        setConnectMode((prev) => !prev)
        setConnectFrom(null)
      }
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        setSnapEnabled((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const addNode = useCallback((service, x, y) => {
    const id = `node-${nextId.current++}`
    const nodeX = x || 200 + Math.random() * 300
    const nodeY = y || 100 + Math.random() * 200
    const snappedX = snapEnabled ? snapToGrid(nodeX) : nodeX
    const snappedY = snapEnabled ? snapToGrid(nodeY) : nodeY
    setNodes((prev) => {
      const next = [...prev, {
        id,
        serviceId: service.id,
        service,
        x: snappedX,
        y: snappedY,
        label: service.name,
      }]
      setConnections((conns) => {
        pushHistory(next, conns)
        return conns
      })
      return next
    })
  }, [snapEnabled, historyIndex])

  function handleCanvasDrop(e) {
    e.preventDefault()
    const data = e.dataTransfer.getData('service')
    if (!data) return
    const service = JSON.parse(data)
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom
    addNode(service, x, y)
  }

  function handleCanvasDragOver(e) {
    e.preventDefault()
  }

  function handleNodeMouseDown(e, nodeId) {
    if (connectMode) {
      if (!connectFrom) {
        setConnectFrom(nodeId)
      } else if (connectFrom !== nodeId) {
        const exists = connections.some(
          (c) => (c.from === connectFrom && c.to === nodeId) || (c.from === nodeId && c.to === connectFrom)
        )
        if (!exists) {
          setConnections((prev) => {
            const next = [...prev, { from: connectFrom, to: nodeId, id: `conn-${Date.now()}`, label: '' }]
            pushHistory(nodes, next)
            return next
          })
        }
        setConnectFrom(null)
      }
      return
    }

    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    const node = nodes.find((n) => n.id === nodeId)
    setDragging(nodeId)
    setDragOffset({
      x: (e.clientX - rect.left) / zoom - node.x,
      y: (e.clientY - rect.top) / zoom - node.y,
    })
    setSelectedNode(nodeId)
  }

  function handleCanvasMouseMove(e) {
    if (connectMode && connectFrom) {
      const rect = canvasRef.current.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      })
    }
    if (!dragging) return
    const rect = canvasRef.current.getBoundingClientRect()
    let x = (e.clientX - rect.left) / zoom - dragOffset.x
    let y = (e.clientY - rect.top) / zoom - dragOffset.y
    if (snapEnabled) {
      x = snapToGrid(x)
      y = snapToGrid(y)
    }
    setNodes((prev) => prev.map((n) =>
      n.id === dragging ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n
    ))
  }

  function handleCanvasMouseUp() {
    if (dragging) {
      pushHistory(nodes, connections)
    }
    setDragging(null)
  }

  function removeNode(nodeId) {
    setNodes((prev) => {
      const next = prev.filter((n) => n.id !== nodeId)
      setConnections((conns) => {
        const nextConns = conns.filter((c) => c.from !== nodeId && c.to !== nodeId)
        pushHistory(next, nextConns)
        return nextConns
      })
      return next
    })
    if (selectedNode === nodeId) setSelectedNode(null)
  }

  function removeConnection(connId) {
    setConnections((prev) => {
      const next = prev.filter((c) => c.id !== connId)
      pushHistory(nodes, next)
      return next
    })
  }

  function clearCanvas() {
    setNodes([])
    setConnections([])
    setSelectedNode(null)
    nextId.current = 1
    pushHistory([], [])
    setShowConfirmClear(false)
  }

  function handleLabelChange(nodeId, newLabel) {
    setNodes((prev) => {
      const next = prev.map((n) => n.id === nodeId ? { ...n, label: newLabel } : n)
      pushHistory(next, connections)
      return next
    })
    setEditingLabel(null)
  }

  function handleConnectionLabelSave(connId) {
    setConnections((prev) => {
      const next = prev.map((c) => c.id === connId ? { ...c, label: connectionLabelInput } : c)
      pushHistory(nodes, next)
      return next
    })
    setEditingConnection(null)
    setConnectionLabelInput('')
  }

  function fitToScreen() {
    if (nodes.length === 0) return
    const minX = Math.min(...nodes.map((n) => n.x))
    const maxX = Math.max(...nodes.map((n) => n.x + 112))
    const minY = Math.min(...nodes.map((n) => n.y))
    const maxY = Math.max(...nodes.map((n) => n.y + 72))
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const width = canvasEl.clientWidth
    const height = canvasEl.clientHeight
    const contentWidth = maxX - minX + 100
    const contentHeight = maxY - minY + 100
    const fitZoom = Math.min(width / contentWidth, height / contentHeight, 2)
    setZoom(Math.max(0.25, Math.min(2, Math.round(fitZoom * 4) / 4)))
  }

  function exportDesign() {
    const design = {
      name: projectName,
      exportedAt: new Date().toISOString(),
      nodes: nodes.map((n) => ({
        service: n.service.name,
        serviceId: n.service.id,
        category: n.service.category,
        x: Math.round(n.x),
        y: Math.round(n.y),
        label: n.label,
      })),
      connections: connections.map((c) => {
        const fromNode = nodes.find((n) => n.id === c.from)
        const toNode = nodes.find((n) => n.id === c.to)
        return {
          from: fromNode?.service.name,
          to: toNode?.service.name,
          label: c.label || undefined,
        }
      }),
    }
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportAsPNG() {
    const svgData = canvasRef.current?.querySelector('svg')
    if (!svgData || nodes.length === 0) return

    const minX = Math.min(...nodes.map((n) => n.x)) - 40
    const minY = Math.min(...nodes.map((n) => n.y)) - 40
    const maxX = Math.max(...nodes.map((n) => n.x + 112)) + 40
    const maxY = Math.max(...nodes.map((n) => n.y + 72)) + 40
    const w = maxX - minX
    const h = maxY - minY

    const canvas = document.createElement('canvas')
    canvas.width = w * 2
    canvas.height = h * 2
    const ctx = canvas.getContext('2d')
    ctx.scale(2, 2)
    ctx.fillStyle = '#16162a'
    ctx.fillRect(0, 0, w, h)

    // Draw grid
    ctx.strokeStyle = '#2a2a4a'
    ctx.lineWidth = 0.5
    for (let gx = 0; gx < w; gx += GRID_SIZE) {
      for (let gy = 0; gy < h; gy += GRID_SIZE) {
        ctx.beginPath()
        ctx.arc(gx, gy, 0.5, 0, Math.PI * 2)
        ctx.fillStyle = '#2a2a4a'
        ctx.fill()
      }
    }

    // Draw connections
    connections.forEach((conn) => {
      const fromNode = nodes.find((n) => n.id === conn.from)
      const toNode = nodes.find((n) => n.id === conn.to)
      if (!fromNode || !toNode) return
      const from = { x: fromNode.x + 56 - minX, y: fromNode.y + 36 - minY }
      const to = { x: toNode.x + 56 - minX, y: toNode.y + 36 - minY }
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.strokeStyle = '#4285f4'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 4])
      ctx.stroke()
      ctx.setLineDash([])
      // Arrow
      const arrow = computeArrowHead(from, to)
      ctx.beginPath()
      ctx.moveTo(to.x, to.y)
      ctx.lineTo(arrow.x1, arrow.y1)
      ctx.moveTo(to.x, to.y)
      ctx.lineTo(arrow.x2, arrow.y2)
      ctx.strokeStyle = '#4285f4'
      ctx.lineWidth = 2
      ctx.stroke()
      // Label
      if (conn.label) {
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2
        ctx.font = '10px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#8888aa'
        ctx.textAlign = 'center'
        ctx.fillText(conn.label, midX, midY - 6)
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      const cat = GCP_SERVICE_CATEGORIES[node.service.category]
      const nx = node.x - minX
      const ny = node.y - minY
      // Card bg
      ctx.fillStyle = '#1e1e3a'
      ctx.strokeStyle = (cat?.color || '#4285f4') + '60'
      ctx.lineWidth = 2
      const r = 12
      ctx.beginPath()
      ctx.roundRect(nx, ny, 112, 72, r)
      ctx.fill()
      ctx.stroke()
      // Icon bg
      ctx.fillStyle = (cat?.color || '#4285f4') + '33'
      ctx.beginPath()
      ctx.roundRect(nx + 37, ny + 8, 38, 30, 8)
      ctx.fill()
      // Initials
      ctx.font = 'bold 12px Inter, system-ui, sans-serif'
      ctx.fillStyle = cat?.color || '#4285f4'
      ctx.textAlign = 'center'
      ctx.fillText(node.service.name.slice(0, 2).toUpperCase(), nx + 56, ny + 28)
      // Label
      ctx.font = '10px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#e0e0f0'
      ctx.textAlign = 'center'
      ctx.fillText(node.label.length > 16 ? node.label.slice(0, 15) + '...' : node.label, nx + 56, ny + 58)
    })

    // Title
    ctx.font = 'bold 14px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#e0e0f0'
    ctx.textAlign = 'left'
    ctx.fillText(projectName, 12, 20)

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  function toggleCategory(key) {
    setExpandedCategories((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredServices = GCP_SERVICES.filter((s) =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const servicesByCategory = {}
  filteredServices.forEach((s) => {
    if (!servicesByCategory[s.category]) servicesByCategory[s.category] = []
    servicesByCategory[s.category].push(s)
  })

  // Minimap
  const minimapScale = 0.06
  const minimapNodes = nodes.map((n) => ({
    x: n.x * minimapScale,
    y: n.y * minimapScale,
    color: GCP_SERVICE_CATEGORIES[n.service.category]?.color || '#4285f4',
  }))

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <div className="w-64 bg-gcp-dark border-r border-gcp-border flex flex-col shrink-0">
        <div className="p-3 border-b border-gcp-border">
          <div className="flex items-center gap-2 mb-3">
            <Layout className="w-4 h-4 text-gcp-yellow" />
            <span className="text-sm font-semibold text-gcp-text">Services</span>
            <span className="ml-auto text-[10px] text-gcp-muted bg-gcp-darker px-1.5 py-0.5 rounded">{GCP_SERVICES.length}</span>
          </div>
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-gcp-darker border border-gcp-border rounded-lg text-xs text-gcp-text placeholder-gcp-muted outline-none focus:border-gcp-blue"
            aria-label="Search GCP services"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {Object.entries(servicesByCategory).map(([catKey, services]) => {
            const cat = GCP_SERVICE_CATEGORIES[catKey]
            const expanded = expandedCategories[catKey] !== false
            return (
              <div key={catKey}>
                <button
                  onClick={() => toggleCategory(catKey)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium text-gcp-muted hover:text-gcp-text bg-transparent border-0 cursor-pointer rounded"
                  aria-expanded={expanded}
                >
                  {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }} />
                  {cat?.label}
                  <span className="ml-auto text-gcp-muted/50">{services.length}</span>
                </button>
                {expanded && (
                  <div className="space-y-0.5 ml-2 mt-0.5">
                    {services.map((service) => (
                      <GcpServiceNode
                        key={service.id}
                        service={service}
                        compact
                        onClick={(s) => addNode(s)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Minimap */}
        {nodes.length > 0 && (
          <div className="p-2 border-t border-gcp-border">
            <div className="text-[10px] text-gcp-muted mb-1.5 flex items-center gap-1">
              <Move className="w-3 h-3" /> Minimap
            </div>
            <div className="bg-gcp-darker rounded-lg p-1.5 relative" style={{ height: 80 }}>
              <svg width="100%" height="100%" viewBox="0 0 140 70">
                {connections.map((conn) => {
                  const fromNode = nodes.find((n) => n.id === conn.from)
                  const toNode = nodes.find((n) => n.id === conn.to)
                  if (!fromNode || !toNode) return null
                  return (
                    <line
                      key={conn.id}
                      x1={(fromNode.x + 56) * minimapScale}
                      y1={(fromNode.y + 36) * minimapScale}
                      x2={(toNode.x + 56) * minimapScale}
                      y2={(toNode.y + 36) * minimapScale}
                      stroke="#4285f4"
                      strokeWidth="0.5"
                      opacity="0.4"
                    />
                  )
                })}
                {minimapNodes.map((n, i) => (
                  <rect
                    key={i}
                    x={n.x}
                    y={n.y}
                    width={6}
                    height={4}
                    rx={1}
                    fill={n.color}
                    opacity={0.8}
                  />
                ))}
              </svg>
            </div>
          </div>
        )}

        <div className="p-2 border-t border-gcp-border text-[10px] text-gcp-muted">
          <div className="flex flex-col gap-0.5">
            <span><kbd className="px-1 py-0.5 rounded bg-gcp-darker text-[9px]">C</kbd> Connect mode</span>
            <span><kbd className="px-1 py-0.5 rounded bg-gcp-darker text-[9px]">G</kbd> Toggle grid snap</span>
            <span><kbd className="px-1 py-0.5 rounded bg-gcp-darker text-[9px]">Del</kbd> Remove selected</span>
            <span><kbd className="px-1 py-0.5 rounded bg-gcp-darker text-[9px]">Ctrl+Z</kbd> Undo</span>
          </div>
        </div>
      </div>

      {/* Main canvas area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gcp-dark border-b border-gcp-border">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent border-0 text-sm font-medium text-gcp-text outline-none w-52"
            aria-label="Project name"
          />

          <div className="flex-1" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 border border-gcp-border rounded-lg">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 text-gcp-muted hover:text-gcp-text bg-transparent border-0 cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 text-gcp-muted hover:text-gcp-text bg-transparent border-0 cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
              title="Redo (Ctrl+Shift+Z)"
              aria-label="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid snap */}
          <button
            onClick={() => setSnapEnabled(!snapEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
              snapEnabled
                ? 'bg-gcp-green/15 border-gcp-green/40 text-gcp-green'
                : 'bg-transparent border-gcp-border text-gcp-muted hover:text-gcp-text'
            }`}
            title="Toggle grid snap (G)"
            aria-label="Toggle grid snap"
            aria-pressed={snapEnabled}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            Snap
          </button>

          {/* Connect mode */}
          <button
            onClick={() => { setConnectMode(!connectMode); setConnectFrom(null); setMousePos(null) }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
              connectMode
                ? 'bg-gcp-blue/15 border-gcp-blue/40 text-gcp-blue'
                : 'bg-transparent border-gcp-border text-gcp-muted hover:text-gcp-text'
            }`}
            title="Toggle connection mode (C)"
            aria-label="Toggle connection mode"
            aria-pressed={connectMode}
          >
            {connectMode ? <LinkIcon className="w-3.5 h-3.5" /> : <MousePointer className="w-3.5 h-3.5" />}
            {connectMode ? 'Connecting...' : 'Connect'}
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-1 border border-gcp-border rounded-lg">
            <button
              onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
              className="p-1.5 text-gcp-muted hover:text-gcp-text bg-transparent border-0 cursor-pointer"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-gcp-muted w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
              className="p-1.5 text-gcp-muted hover:text-gcp-text bg-transparent border-0 cursor-pointer"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fit to screen */}
          <button
            onClick={fitToScreen}
            disabled={nodes.length === 0}
            className="p-1.5 text-gcp-muted hover:text-gcp-text bg-transparent border border-gcp-border rounded-lg cursor-pointer disabled:opacity-30 transition-colors"
            title="Fit to screen"
            aria-label="Fit to screen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>

          {/* Export dropdown */}
          <div className="flex items-center">
            <button
              onClick={exportDesign}
              disabled={nodes.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-l-lg text-xs bg-transparent border border-gcp-border text-gcp-muted hover:text-gcp-text transition-colors cursor-pointer disabled:opacity-40"
              title="Export design as JSON"
              aria-label="Export as JSON"
            >
              <Download className="w-3.5 h-3.5" /> JSON
            </button>
            <button
              onClick={exportAsPNG}
              disabled={nodes.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-r-lg text-xs bg-transparent border border-l-0 border-gcp-border text-gcp-muted hover:text-gcp-text transition-colors cursor-pointer disabled:opacity-40"
              title="Export design as PNG image"
              aria-label="Export as PNG"
            >
              <Image className="w-3.5 h-3.5" /> PNG
            </button>
          </div>

          {/* Clear */}
          <button
            onClick={() => nodes.length > 0 && setShowConfirmClear(true)}
            disabled={nodes.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-transparent border border-gcp-border text-gcp-muted hover:text-gcp-red transition-colors cursor-pointer disabled:opacity-40"
            title="Clear canvas"
            aria-label="Clear canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>

        {/* Confirm clear dialog */}
        {showConfirmClear && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 1000 }}>
            <div className="bg-gcp-card border border-gcp-border rounded-xl p-6 max-w-sm mx-4 shadow-2xl canvas-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gcp-red/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-gcp-red" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gcp-text">Clear Canvas?</h3>
                  <p className="text-xs text-gcp-muted mt-0.5">This will remove all {nodes.length} services and {connections.length} connections.</p>
                </div>
              </div>
              <p className="text-xs text-gcp-muted mb-4">This action can be undone with Ctrl+Z.</p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-4 py-1.5 text-xs rounded-lg border border-gcp-border text-gcp-muted hover:text-gcp-text bg-transparent cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={clearCanvas}
                  className="px-4 py-1.5 text-xs rounded-lg bg-gcp-red text-white border-0 cursor-pointer hover:brightness-110 transition-all"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 architecture-canvas overflow-auto relative"
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={() => { handleCanvasMouseUp(); setMousePos(null) }}
          onClick={() => { if (!connectMode) setSelectedNode(null) }}
          onWheel={(e) => {
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault()
              setZoom((z) => Math.max(0.25, Math.min(2, z + (e.deltaY > 0 ? -0.1 : 0.1))))
            }
          }}
          style={{ cursor: connectMode ? 'crosshair' : 'default' }}
        >
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: '2000px', minHeight: '1500px', position: 'relative' }}>
            {/* Connections SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#4285f4" />
                </marker>
              </defs>
              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.from)
                const toNode = nodes.find((n) => n.id === conn.to)
                if (!fromNode || !toNode) return null
                const from = getNodeCenter(fromNode)
                const to = getNodeCenter(toNode)
                const midX = (from.x + to.x) / 2
                const midY = (from.y + to.y) / 2
                const isHovered = hoveredConnection === conn.id
                const arrow = computeArrowHead(from, to)
                return (
                  <g key={conn.id}>
                    {/* Main dashed line */}
                    <line
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke={isHovered ? '#6aa5f8' : '#4285f4'}
                      strokeWidth={isHovered ? 3 : 2}
                      strokeDasharray="8 4"
                      className="connection-line"
                    />
                    {/* Arrowhead lines */}
                    <line x1={to.x} y1={to.y} x2={arrow.x1} y2={arrow.y1} stroke={isHovered ? '#6aa5f8' : '#4285f4'} strokeWidth={isHovered ? 3 : 2} />
                    <line x1={to.x} y1={to.y} x2={arrow.x2} y2={arrow.y2} stroke={isHovered ? '#6aa5f8' : '#4285f4'} strokeWidth={isHovered ? 3 : 2} />
                    {/* Connection label */}
                    {conn.label && (
                      <g>
                        <rect
                          x={midX - conn.label.length * 3.2 - 4}
                          y={midY - 16}
                          width={conn.label.length * 6.4 + 8}
                          height={16}
                          rx={4}
                          fill="#1e1e3a"
                          stroke="#2a2a4a"
                          strokeWidth={1}
                        />
                        <text
                          x={midX}
                          y={midY - 5}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#8888aa"
                          fontFamily="Inter, system-ui, sans-serif"
                        >
                          {conn.label}
                        </text>
                      </g>
                    )}
                    {/* Hit area for interaction */}
                    <line
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="transparent"
                      strokeWidth="16"
                      className="pointer-events-auto cursor-pointer"
                      onMouseEnter={() => setHoveredConnection(conn.id)}
                      onMouseLeave={() => setHoveredConnection(null)}
                      onClick={(e) => {
                        e.stopPropagation()
                        removeConnection(conn.id)
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        setEditingConnection(conn.id)
                        setConnectionLabelInput(conn.label || '')
                      }}
                    />
                    {/* Delete hint on hover */}
                    {isHovered && (
                      <g>
                        <circle cx={midX + (conn.label ? conn.label.length * 3.5 + 12 : 0)} cy={midY - 8} r={8} fill="#ea4335" opacity={0.9} className="pointer-events-none" />
                        <text
                          x={midX + (conn.label ? conn.label.length * 3.5 + 12 : 0)}
                          y={midY - 4}
                          textAnchor="middle"
                          fontSize="10"
                          fill="white"
                          fontWeight="bold"
                          className="pointer-events-none"
                        >
                          ×
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
              {/* Live connection preview while connecting */}
              {connectFrom && mousePos && (() => {
                const fromNode = nodes.find((n) => n.id === connectFrom)
                if (!fromNode) return null
                const from = getNodeCenter(fromNode)
                return (
                  <line
                    x1={from.x} y1={from.y}
                    x2={mousePos.x} y2={mousePos.y}
                    stroke="#4285f4"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                )
              })()}
              {connectFrom && (() => {
                const fromNode = nodes.find((n) => n.id === connectFrom)
                if (!fromNode) return null
                const from = getNodeCenter(fromNode)
                return (
                  <circle cx={from.x} cy={from.y} r="6" fill="#4285f4" opacity="0.6">
                    <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
                  </circle>
                )
              })()}
            </svg>

            {/* Connection label editor */}
            {editingConnection && (() => {
              const conn = connections.find((c) => c.id === editingConnection)
              if (!conn) return null
              const fromNode = nodes.find((n) => n.id === conn.from)
              const toNode = nodes.find((n) => n.id === conn.to)
              if (!fromNode || !toNode) return null
              const from = getNodeCenter(fromNode)
              const to = getNodeCenter(toNode)
              const midX = (from.x + to.x) / 2
              const midY = (from.y + to.y) / 2
              return (
                <div
                  className="absolute canvas-fade-in"
                  style={{ left: midX - 80, top: midY - 40, zIndex: 50 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-gcp-card border border-gcp-blue/40 rounded-lg p-2 shadow-lg flex items-center gap-1.5">
                    <Type className="w-3 h-3 text-gcp-blue shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      value={connectionLabelInput}
                      onChange={(e) => setConnectionLabelInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConnectionLabelSave(editingConnection)
                        if (e.key === 'Escape') { setEditingConnection(null); setConnectionLabelInput('') }
                      }}
                      placeholder="Label (e.g. HTTP, gRPC)"
                      className="bg-transparent border-0 text-xs text-gcp-text outline-none w-32 placeholder-gcp-muted"
                      aria-label="Connection label"
                    />
                    <button
                      onClick={() => handleConnectionLabelSave(editingConnection)}
                      className="text-[10px] px-2 py-0.5 bg-gcp-blue rounded text-white border-0 cursor-pointer hover:brightness-110"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* Nodes */}
            {nodes.map((node) => {
              const cat = GCP_SERVICE_CATEGORIES[node.service.category]
              const isSelected = selectedNode === node.id
              const isConnectSource = connectFrom === node.id
              return (
                <div
                  key={node.id}
                  className="absolute gcp-node canvas-fade-in"
                  style={{
                    left: node.x,
                    top: node.y,
                    zIndex: dragging === node.id ? 100 : 2,
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gcp-card border-2 w-28 text-center transition-all ${
                      isConnectSource ? 'ring-2 ring-gcp-blue ring-offset-2 ring-offset-gcp-darker' : ''
                    }`}
                    style={{
                      borderColor: isSelected ? cat?.color : (cat?.color + '40'),
                      boxShadow: isSelected ? `0 0 20px ${cat?.color}30` : 'none',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: cat?.color + '20', color: cat?.color }}
                    >
                      {node.service.name.slice(0, 2).toUpperCase()}
                    </div>
                    {editingLabel === node.id ? (
                      <input
                        autoFocus
                        type="text"
                        defaultValue={node.label}
                        className="text-[10px] font-medium text-gcp-text bg-gcp-darker border border-gcp-blue/40 rounded px-1 py-0.5 w-full text-center outline-none"
                        onBlur={(e) => handleLabelChange(node.id, e.target.value || node.service.name)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleLabelChange(node.id, e.target.value || node.service.name)
                          if (e.key === 'Escape') setEditingLabel(null)
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        aria-label="Node label"
                      />
                    ) : (
                      <span
                        className="text-[10px] font-medium text-gcp-text leading-tight cursor-text hover:text-gcp-blue transition-colors"
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          setEditingLabel(node.id)
                        }}
                        title="Double-click to edit label"
                      >
                        {node.label}
                      </span>
                    )}
                    <span className="text-[8px] text-gcp-muted">{cat?.label}</span>
                    {isSelected && !connectMode && (
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); removeNode(node.id) }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gcp-red flex items-center justify-center cursor-pointer border-0 hover:brightness-125 transition-all"
                        aria-label={`Remove ${node.label}`}
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Empty state */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center canvas-fade-in">
                  <div className="w-20 h-20 rounded-2xl bg-gcp-card border border-gcp-border flex items-center justify-center mx-auto mb-5">
                    <Layout className="w-10 h-10 text-gcp-border" />
                  </div>
                  <h3 className="text-lg font-semibold text-gcp-muted mb-2">Design Your Architecture</h3>
                  <p className="text-sm text-gcp-muted max-w-md mb-4">
                    Click services from the sidebar to add them, or drag and drop onto the canvas.
                    Connect services by pressing <kbd className="px-1.5 py-0.5 rounded bg-gcp-card border border-gcp-border text-[11px]">C</kbd> and clicking two nodes.
                  </p>
                  <div className="flex gap-6 justify-center text-xs text-gcp-muted/70">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-4 rounded bg-gcp-blue/20 border border-gcp-blue/30" />
                      <span>Service node</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-0 border-t-2 border-dashed border-gcp-blue/40" />
                      <ArrowRight className="w-3 h-3 text-gcp-blue/40" />
                      <span>Connection</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 px-4 py-1.5 bg-gcp-dark border-t border-gcp-border text-xs text-gcp-muted">
          <span>{nodes.length} service{nodes.length !== 1 ? 's' : ''}</span>
          <span>{connections.length} connection{connections.length !== 1 ? 's' : ''}</span>
          {snapEnabled && <span className="text-gcp-green">Grid snap on</span>}
          {connectMode && !connectFrom && <span className="text-gcp-blue">Click a node to start connection</span>}
          {connectFrom && <span className="text-gcp-yellow">Click target node (Esc to cancel)</span>}
          <div className="flex-1" />
          <span className="text-gcp-muted/50">Double-click: edit labels &middot; Double-click connection: add label</span>
        </div>
      </div>
    </div>
  )
}
