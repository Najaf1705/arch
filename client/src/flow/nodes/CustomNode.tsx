import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { FlowNode } from '../../types/NodeTypes'
import { renderMeta } from '../../utils/formatMetaVal'

export default function CustomNode(props: NodeProps<FlowNode>) {
  const { data, selected } = props
  const highlighted = (props as any).highlighted

  return (
    <div
      className={`px-4 py-2 rounded border bg-background text-sm
        ${selected || highlighted
          ? 'border-secondary ring-2 ring-secondary'
          : 'border-gray-600'
        }
      `}
    >
      <div className="font-semibold">{data.label}</div>
      <div className="text-xs opacity-70">{data.kind}</div>


      <pre className="mt-2 text-xs font-mono whitespace-pre">
        {renderMeta(data.meta)}
      </pre>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
