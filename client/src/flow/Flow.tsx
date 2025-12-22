import {
    addEdge,
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    useEdgesState,
    useNodesState,
    type Connection,
    type Edge,
    type Node,
} from '@xyflow/react'
import { useCallback, useEffect, useState } from 'react'
import '@xyflow/react/dist/style.css'

import CustomNode from './nodes/CustomNode'
import initialNodes from '../data/nodes'
import initialEdges from '../data/edges'
import ThemeToggle from '../theme/ThemeToggle'
import NodeMenu from '../components/NodeMenu'
import NodeSidebar from '../components/NodeSidebar'

import type { CustomNodeData, FlowNode } from '../types/NodeTypes'

const nodeTypes = {
    customNode: CustomNode,
}

function Flow() {
    /* ---------------- persistence ---------------- */

    const savedNodes = localStorage.getItem('flow-nodes')
    const savedEdges = localStorage.getItem('flow-edges')

    const initialNodesState: FlowNode[] = savedNodes
        ? (JSON.parse(savedNodes) as FlowNode[])
        : (initialNodes as FlowNode[])

    const initialEdgesState: Edge[] = savedEdges
        ? (JSON.parse(savedEdges) as Edge[])
        : initialEdges

    /* ---------------- state ---------------- */

    const [nodes, setNodes, onNodesChange] =
        useNodesState<FlowNode>(initialNodesState)

    const [edges, setEdges, onEdgesChange] =
        useEdgesState(initialEdgesState)

    const [selectedNode, setSelectedNode] =
        useState<Node<CustomNodeData> | null>(null)

    const [selectedEdge, setSelectedEdge] =
        useState<Edge | null>(null)

    /* ---------------- persistence sync ---------------- */

    useEffect(() => {
        localStorage.setItem('flow-nodes', JSON.stringify(nodes))
    }, [nodes])

    useEffect(() => {
        localStorage.setItem('flow-edges', JSON.stringify(edges))
    }, [edges])

    /* ---------------- normalize highlight on load ---------------- */

    useEffect(() => {
        setNodes(ns =>
            ns.map(n => ({
                ...n,
                highlighted: false,
            })),
        )
    }, [setNodes])

    /* ---------------- edge → node highlighting ---------------- */

    useEffect(() => {
        if (!selectedEdge) {
            setNodes(ns =>
                ns.map(n => ({
                    ...n,
                    highlighted: false,
                })),
            )
            return
        }

        setNodes(ns =>
            ns.map(n => ({
                ...n,
                highlighted:
                    n.id === selectedEdge.source ||
                    n.id === selectedEdge.target,
            })),
        )
    }, [selectedEdge, setNodes])

    /* ---------------- handlers ---------------- */

    const onConnect = useCallback(
        (connection: Connection) => {
            const newEdge: Edge = {
                ...connection,
                id: crypto.randomUUID(),
                animated: true,
            }
            setEdges(eds => addEdge(newEdge, eds))
        },
        [setEdges],
    )

    const addNode = useCallback(
        (data: CustomNodeData) => {
            setNodes(ns => [
                ...ns,
                {
                    id: crypto.randomUUID(),
                    type: 'customNode',
                    position: { x: 300, y: 200 },
                    data: {
                        ...data,
                        highlighted: false,
                    },
                },
            ])
        },
        [setNodes],
    )


    function onSelectionChange({
        nodes,
        edges,
    }: {
        nodes: Node[]
        edges: Edge[]
    }) {
        setSelectedNode(
            nodes.length ? (nodes[0] as Node<CustomNodeData>) : null,
        )

        setSelectedEdge(edges.length ? edges[0] : null)

        // selecting a node clears edge highlight
        if (nodes.length) {
            setSelectedEdge(null)
        }
    }

    /* ---------------- render ---------------- */

    return (
        <div className="w-screen h-screen bg-mbackground relative">
            {/* overlays */}
            <div className="absolute bottom-4 left-12 z-50">
                <ThemeToggle />
            </div>

            <div className="absolute top-4 left-4 z-50">
                <NodeMenu onCreateNode={addNode} />
            </div>

            {/* canvas */}
            <ReactFlow
                className="absolute inset-0"
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>

            {/* sidebar */}
            <NodeSidebar
                selectedNode={selectedNode}
                selectedEdge={selectedEdge}
                setSelectedNode={setSelectedNode}
                setNodes={setNodes}
                setEdges={setEdges}
            />
        </div>
    )
}

export default Flow
