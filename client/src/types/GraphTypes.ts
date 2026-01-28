import type { BackendEdge } from "./EdgeTypes"
import type { FlowNode } from "./NodeTypes"

export type Graph={
    id: string
    graphId: string
    title: string
    createdBy: string
    nodes?: FlowNode[],
    edges?: BackendEdge[],
}