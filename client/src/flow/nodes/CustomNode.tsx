import { Handle, type NodeProps } from '@xyflow/react'
import type { FlowNode } from '../../types/NodeTypes'

export default function CustomNode(props: NodeProps<FlowNode>) {
  const { data, selected } = props
  const highlighted = (props as any).highlighted
  const active = selected || highlighted

  return (
    <div
      className={`
        w-32 h-24 rounded-md border relative overflow-visible
        bg-c1 text-foreground
        shadow-sm
        ${active
          ? 'border-c9 ring-2 ring-c9/50 shadow-md'
          : 'border-border'
        }
      `}
    >
      {/* Header */}
      <div
        className={`
          font-semibold text-xs text-center truncate
          px-2 py-1 rounded-t-md
          bg-c5
        `}
      >
        {data.label}
      </div>

      {/* Kind */}
      <div className="text-[10px] text-foreground/70 text-center mt-1">
        {data.kind}
      </div>

      {/* Handles */}
      {data.handles?.map(h => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={h.position}
          className={`
            custom-handle
            ${h.type === 'source'
              ? 'handle-source'
              : 'handle-target'
            }
            ${active ? 'ring-2 ring-white/70' : ''}
          `}
          data-tooltip={h.type === 'source' ? 'OUT' : 'IN'}
        />
      ))}
    </div>
  )
}
