import type { Node } from "@xyflow/react"
import type { Position } from '@xyflow/react'

export type MetaValue =
| string
| number
| boolean
| null
| MetaValue[]
| { [key: string]: MetaValue }

export type NodeHandle = {
  id: string
  type: 'source' | 'target'
  position: Position
}

export type CustomNodeData = {
  label: string
  kind: string
  meta: Record<string, MetaValue>
  highlighted?: boolean   // ✅ MOVE HERE
  handles?: NodeHandle[]
}

export type FlowNode = Node<CustomNodeData>
