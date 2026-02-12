import { GCP_SERVICE_CATEGORIES } from '../data/gcpServices'
import {
  Server, Database, Network, Shield, BarChart3, Brain,
  GitBranch, Zap, Box
} from 'lucide-react'

const ICON_MAP = {
  Server, Database, Network, Shield, BarChart3, Brain,
  GitBranch, Zap,
}

export default function GcpServiceNode({ service, onDragStart, onClick, compact = false }) {
  const category = GCP_SERVICE_CATEGORIES[service.category]
  const Icon = ICON_MAP[category?.icon] || Box

  if (compact) {
    return (
      <button
        onClick={() => onClick?.(service)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-nebula-surface/50 border border-nebula-border hover:border-nebula-border-bright text-left transition-all text-sm w-full group"
      >
        <Icon className="w-4 h-4 shrink-0 transition-colors" style={{ color: category?.color }} />
        <span className="text-nebula-text truncate group-hover:text-white transition-colors">{service.name}</span>
      </button>
    )
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('service', JSON.stringify(service))
        onDragStart?.(service)
      }}
      className="gcp-node flex flex-col items-center gap-2 p-4 rounded-xl glass-card-static w-32 text-center"
      style={{ borderColor: category?.color + '30' }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: category?.color + '15' }}
      >
        <Icon className="w-5 h-5" style={{ color: category?.color }} />
      </div>
      <span className="text-xs font-medium text-nebula-text leading-tight">
        {service.name}
      </span>
    </div>
  )
}
