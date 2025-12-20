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
import { useCallback } from 'react'
import '@xyflow/react/dist/style.css';
import CustomNode from './nodes/CustomNode';
import initialNodes from '../data/nodes';
import initialEdges from '../data/edges';
import ThemeToggle from '../theme/ThemeToggle';
import NodeMenu from '../components/NodeMenu';
import type { CustomNodeData } from '../types/NodeTypes';

const nodeTypes = {
    customNode: CustomNode,
};


function Flow() {

const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
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



    return (
        <div style={{ width: '100vw', height: '100vh' }} className="bg-mbackground">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            <NodeMenu onCreateNode={addNode}/>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}

            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>

        </div>
    )
}

export default Flow