import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { CustomNodeData } from '../../types/NodeTypes'

export default function CustomNode(props: NodeProps) {
  const data = props.data as CustomNodeData
  const selected=props.selected;

  return (
    <div className={`px-4 py-2 rounded border bg-background text-sm
    ${selected ? 'border-secondary ring-2 ring-secondary' : 'border-gray-600'}
  `}>
      <div className="font-semibold">{data.label}</div>
      <div className="text-xs opacity-70">{data.kind}</div>

      {Object.entries(data.meta).map(([k, v]) => (
        <div key={k} className="text-xs">
          {k}: {Array.isArray(v) ? v.join(', ') : String(v)}
        </div>
      ))}


      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
