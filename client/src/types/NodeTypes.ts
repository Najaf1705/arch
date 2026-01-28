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
  handles?: NodeHandle[]
}

export type StoredNode={
  id: string
  label: string
  kind: string
  meta: Record<string, MetaValue>
  handles?: NodeHandle[]
  position: {x: Number, y: Number}
}

// export type BackendNode = Omit<FlowNode, 'highlighted'> & 'id';

export type FlowNode = Node<CustomNodeData>
