import { useState, useRef, useCallback } from 'react'
import {
  Layout, Trash2, Download, RotateCcw, ZoomIn, ZoomOut,
  Link as LinkIcon, MousePointer, Plus, X, ChevronDown, ChevronRight
} from 'lucide-react'
import { GCP_SERVICES, GCP_SERVICE_CATEGORIES } from '../data/gcpServices'
import GcpServiceNode from '../components/GcpServiceNode'

const INITIAL_NODES = []

export default function ArchitectureCanvas() {
  const canvasRef = useRef(null)
  const [nodes, setNodes] = useState(INITIAL_NODES)
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

  const nextId = useRef(1)

  const addNode = useCallback((service, x, y) => {
    const id = `node-${nextId.current++}`
    setNodes((prev) => [...prev, {
      id,
      serviceId: service.id,
      service,
      x: x || 200 + Math.random() * 300,
      y: y || 100 + Math.random() * 200,
      label: service.name,
    }])
  }, [])

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
          setConnections((prev) => [...prev, { from: connectFrom, to: nodeId, id: `conn-${Date.now()}` }])
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
    if (!dragging) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom - dragOffset.x
    const y = (e.clientY - rect.top) / zoom - dragOffset.y
    setNodes((prev) => prev.map((n) =>
      n.id === dragging ? { ...n, x: Math.max(0, x), y: Math.max(0, y) } : n
    ))
  }

  function handleCanvasMouseUp() {
    setDragging(null)
  }

  function removeNode(nodeId) {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId))
    setConnections((prev) => prev.filter((c) => c.from !== nodeId && c.to !== nodeId))
    if (selectedNode === nodeId) setSelectedNode(null)
  }

  function removeConnection(connId) {
    setConnections((prev) => prev.filter((c) => c.id !== connId))
  }

  function clearCanvas() {
    setNodes([])
    setConnections([])
    setSelectedNode(null)
    nextId.current = 1
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
        }
      }),
    }
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
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

  function getNodeCenter(nodeId) {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return { x: 0, y: 0 }
    return { x: node.x + 56, y: node.y + 36 }
  }

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <div className="w-64 bg-gcp-dark border-r border-gcp-border flex flex-col shrink-0">
        <div className="p-3 border-b border-gcp-border">
          <div className="flex items-center gap-2 mb-3">
            <Layout className="w-4 h-4 text-gcp-yellow" />
            <span className="text-sm font-semibold text-gcp-text">Services</span>
          </div>
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-gcp-darker border border-gcp-border rounded-lg text-xs text-gcp-text placeholder-gcp-muted outline-none focus:border-gcp-blue"
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

        <div className="p-2 border-t border-gcp-border text-xs text-gcp-muted text-center">
          Click or drag services onto the canvas
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
          />

          <div className="flex-1" />

          <button
            onClick={() => { setConnectMode(!connectMode); setConnectFrom(null) }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
              connectMode
                ? 'bg-gcp-blue/15 border-gcp-blue/40 text-gcp-blue'
                : 'bg-transparent border-gcp-border text-gcp-muted hover:text-gcp-text'
            }`}
            title="Toggle connection mode"
          >
            {connectMode ? <LinkIcon className="w-3.5 h-3.5" /> : <MousePointer className="w-3.5 h-3.5" />}
            {connectMode ? 'Connecting...' : 'Connect'}
          </button>

          <div className="flex items-center gap-1 border border-gcp-border rounded-lg">
            <button
              onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
              className="p-1.5 text-gcp-muted hover:text-gcp-text bg-transparent border-0 cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-gcp-muted w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
              className="p-1.5 text-gcp-muted hover:text-gcp-text bg-transparent border-0 cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={exportDesign}
            disabled={nodes.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-transparent border border-gcp-border text-gcp-muted hover:text-gcp-text transition-colors cursor-pointer disabled:opacity-40"
            title="Export design as JSON"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>

          <button
            onClick={clearCanvas}
            disabled={nodes.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-transparent border border-gcp-border text-gcp-muted hover:text-gcp-red transition-colors cursor-pointer disabled:opacity-40"
            title="Clear canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 architecture-canvas overflow-auto relative"
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onClick={() => { if (!connectMode) setSelectedNode(null) }}
          style={{ cursor: connectMode ? 'crosshair' : 'default' }}
        >
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: '2000px', minHeight: '1500px', position: 'relative' }}>
            {/* Connections SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {connections.map((conn) => {
                const from = getNodeCenter(conn.from)
                const to = getNodeCenter(conn.to)
                return (
                  <g key={conn.id}>
                    <line
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="#4285f4"
                      strokeWidth="2"
                      strokeDasharray="8 4"
                      className="connection-line"
                    />
                    <line
                      x1={from.x} y1={from.y}
                      x2={to.x} y2={to.y}
                      stroke="transparent"
                      strokeWidth="12"
                      className="pointer-events-auto cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); removeConnection(conn.id) }}
                    />
                  </g>
                )
              })}
              {connectFrom && (() => {
                const from = getNodeCenter(connectFrom)
                return (
                  <circle cx={from.x} cy={from.y} r="6" fill="#4285f4" opacity="0.6">
                    <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
                  </circle>
                )
              })()}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const cat = GCP_SERVICE_CATEGORIES[node.service.category]
              const isSelected = selectedNode === node.id
              const isConnectSource = connectFrom === node.id
              return (
                <div
                  key={node.id}
                  className="absolute gcp-node"
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
                    <span className="text-[10px] font-medium text-gcp-text leading-tight">
                      {node.label}
                    </span>
                    {isSelected && !connectMode && (
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); removeNode(node.id) }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gcp-red flex items-center justify-center cursor-pointer border-0"
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
                <div className="text-center">
                  <Layout className="w-16 h-16 text-gcp-border mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gcp-muted mb-2">Blank Canvas</h3>
                  <p className="text-sm text-gcp-muted max-w-sm">
                    Click services from the sidebar or drag them onto the canvas to start
                    designing your GCP architecture.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 px-4 py-1.5 bg-gcp-dark border-t border-gcp-border text-xs text-gcp-muted">
          <span>{nodes.length} services</span>
          <span>{connections.length} connections</span>
          {connectMode && <span className="text-gcp-blue">Click two nodes to connect them</span>}
          {connectFrom && <span className="text-gcp-yellow">Select target node...</span>}
        </div>
      </div>
    </div>
  )
}
