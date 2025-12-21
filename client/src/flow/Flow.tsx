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
    type Node
} from '@xyflow/react'
import { useCallback, useEffect, useState } from 'react'
import '@xyflow/react/dist/style.css';
import CustomNode from './nodes/CustomNode';
import initialNodes from '../data/nodes';
import initialEdges from '../data/edges';
import ThemeToggle from '../theme/ThemeToggle';
import NodeMenu from '../components/NodeMenu';
import type { CustomNodeData } from '../types/NodeTypes';
import NodeSidebar from '../components/NodeSidebar';

const nodeTypes = {
    customNode: CustomNode,
};


function Flow() {


    const savedNodes = localStorage.getItem("flow-nodes");
    const savedEdges = localStorage.getItem("flow-edges");

    const initialNodesState = savedNodes
        ? (JSON.parse(savedNodes) as Node<CustomNodeData>[])
        : initialNodes;

    const initialEdgesState = savedEdges
        ? (JSON.parse(savedEdges) as Edge[])
        : initialEdges;

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesState);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesState);

    const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);

    useEffect(() => {
        localStorage.setItem("flow-nodes", JSON.stringify(nodes));
    }, [nodes]);

    useEffect(() => {
        localStorage.setItem("flow-edges", JSON.stringify(edges));
    }, [edges]);


    const onConnect = useCallback((connection: Connection) => {
        const newEdge: Edge = { ...connection, animated: true, id: crypto.randomUUID() };
        setEdges(preEdges => addEdge(newEdge, preEdges));
    }, []);

    const addNode = useCallback((data: CustomNodeData) => {
        setNodes(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type: 'customNode',
                position: { x: 300, y: 200 },
                data,
            } satisfies Node<CustomNodeData>,
        ])
    }, [])

    function onSelectionChange({ nodes }: { nodes: Node[]; edges: Edge[] }) {
        setSelectedNode(nodes.length > 0 ? (nodes[0] as Node<CustomNodeData>) : null);
        console.log("Selected node ID:", nodes.length > 0 ? nodes[0].id : "none");
    }




    return (
        <div className="w-screen h-screen bg-mbackground relative">
            {/* Overlays */}
            <div className="absolute bottom-4 left-12 z-50">
                <ThemeToggle />
            </div>

            <div className="absolute top-4 left-4 z-50">
                <NodeMenu onCreateNode={addNode} />
            </div>

            {/* Canvas */}
            <ReactFlow
                className="absolute inset-0"
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onSelectionChange={onSelectionChange}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>

            {/* Sidebar */}
            <NodeSidebar selectedNode={selectedNode} setNodes={setNodes} setEdges={setEdges} />
        </div>

    )
}

export default Flow