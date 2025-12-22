import type { Node } from "@xyflow/react"

export type MetaValue =
  | string
  | number
  | boolean
  | null
  | MetaValue[]
  | { [key: string]: MetaValue }

export type CustomNodeData = {
  label: string
  kind: string
  meta: Record<string, MetaValue>
  highlighted?: boolean   // ✅ MOVE HERE
}

export type FlowNode = Node<CustomNodeData>
