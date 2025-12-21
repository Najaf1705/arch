import React, { useState, useRef } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { CustomNodeData } from "../types/NodeTypes";
import ConfirmModal from "./ConfirmModal";
import EditNodeModal from "./EditNodeModal";

interface Props {
    selectedNode: Node<CustomNodeData> | null;
    setNodes: React.Dispatch<React.SetStateAction<Node<CustomNodeData>[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export default function NodeSidebar({ selectedNode, setNodes, setEdges }: Props) {
    const [width, setWidth] = useState(288);
    const sidebarRef = useRef<HTMLDivElement | null>(null);
    const isResizing = useRef(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);


    const handleDelete = () => {
        if (!selectedNode) return;
        setNodes(prev => prev.filter(n => n.id !== selectedNode.id));
        setEdges(prev => prev.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
        setModalOpen(false);
    };

    const startResizing = () => {
        isResizing.current = true;
        const onMouseMove = (e: MouseEvent) => {
            if (!isResizing.current || !sidebarRef.current) return;
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 200 && newWidth < 600) setWidth(newWidth);
        };
        const onMouseUp = () => {
            isResizing.current = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const sidebarStyle = { width };

    function renderMetaValue(value: unknown) {
        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            return <span>{String(value)}</span>;
        }

        return (
            <pre className="mt-1 text-xs bg-background/50 p-2 rounded overflow-auto">
                {JSON.stringify(value, null, 2)}
            </pre>
        );
    }


    const renderMeta = () =>
        Object.entries(selectedNode?.data.meta || {}).map(([key, value]) => (
            <div key={key} className="text-sm mb-1">
                <strong>{key}:</strong> {renderMetaValue(value)}
            </div>
        ));

    return (
        <>
            <aside
                ref={sidebarRef}
                style={sidebarStyle}
                className="fixed right-0 top-0 h-screen p-4 border-l bg-foreground text-background z-50 flex flex-col"
            >
                <div
                    onMouseDown={startResizing}
                    className="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-gray-400/70"
                />
                {!selectedNode ? (
                    <p className="text-sm text-background">No node selected</p>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Node Details</h2>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="text-red-500 hover:text-red-600 cursor-pointer"
                                title="Delete Node"
                            >
                                🗑️
                            </button>
                            <button
                                onClick={() => setEditOpen(true)}
                                className="text-sm px-2 py-1 rounded bg-background hover:bg-gray-700"
                            >
                                ✏️ Edit
                            </button>

                        </div>
                        <div className="text-sm mb-2">
                            <strong>ID:</strong> {selectedNode.id}
                        </div>
                        <div className="text-sm mb-2">
                            <strong>Label:</strong> {selectedNode.data.label}
                        </div>
                        <div className="text-sm mb-2">
                            <strong>Kind:</strong> {selectedNode.data.kind}
                        </div>

                        <h3 className="text-md font-semibold mb-2 mt-4">Meta</h3>
                        {renderMeta().length === 0 && (
                            <p className="text-xs text-gray-400">No meta data</p>
                        )}
                        {renderMeta()}
                    </>
                )}
            </aside>

            <ConfirmModal
                isOpen={modalOpen}
                message="Are you sure you want to delete this node? All connected edges will also be removed."
                onConfirm={handleDelete}
                onCancel={() => setModalOpen(false)}
            />

            {selectedNode && (
                <EditNodeModal
                    open={editOpen}
                    initialData={selectedNode.data}
                    onClose={() => setEditOpen(false)}
                    onSubmit={(data) => {
                        setNodes(prev =>
                            prev.map(n =>
                                n.id === selectedNode.id
                                    ? { ...n, data }
                                    : n
                            )
                        );
                    }}
                />
            )}

        </>
    );
}
