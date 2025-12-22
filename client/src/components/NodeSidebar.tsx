import React, { useState, useRef } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { CustomNodeData } from "../types/NodeTypes";
import ConfirmModal from "./ConfirmModal";
import EditNodeModal from "./EditNodeModal";
import { renderMeta } from "../utils/formatMetaVal";

interface Props {
  selectedNode: Node<CustomNodeData> | null;
  selectedEdge: Edge | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node<CustomNodeData> | null>>;
  setNodes: React.Dispatch<React.SetStateAction<Node<CustomNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export default function NodeSidebar({
  selectedNode,
  selectedEdge,
  setSelectedNode,
  setNodes,
  setEdges,
}: Props) {
  const [width, setWidth] = useState(288);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const isResizing = useRef(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  /* -------------------- Delete Node -------------------- */
  const handleDelete = () => {
    if (!selectedNode) return;

    setNodes(prev => prev.filter(n => n.id !== selectedNode.id));
    setEdges(prev =>
      prev.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id)
    );

    // Clear selected node
    setSelectedNode(null);
    setModalOpen(false);
  };

  /* -------------------- Delete Edge -------------------- */
  const handleDeleteEdge = () => {
    if (!selectedEdge) return;

    setEdges(prev => prev.filter(e => e.id !== selectedEdge.id));
    setModalOpen(false);
    setSelectedNode(null);
  };


  /* -------------------- Resize Logic -------------------- */
  const startResizing = () => {
    isResizing.current = true;

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 220 && newWidth <= 600) setWidth(newWidth);
    };

    const onMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  /* -------------------- Meta Renderer -------------------- */
  const metaRenderer = () =>
    <div className="mt-2 text-xs font-mono whitespace-pre">
  <pre className="m-0 p-0">
    {renderMeta(selectedNode?.data.meta)}
  </pre>
</div>


  /* -------------------- JSX -------------------- */
  return (
    <>
      <aside
        ref={sidebarRef}
        style={{ width }}
        className="fixed right-0 top-0 h-screen p-4 border-l bg-foreground text-background z-50 flex flex-col"
      >
        <div
          onMouseDown={startResizing}
          className="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-gray-400/70"
        />

        {selectedNode ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-4 gap-2">
              <h2 className="text-lg font-bold">Node Details</h2>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditOpen(true)}
                  className="px-2 py-1 rounded border-2 border-background hover:bg-gray-700 cursor-pointer"
                  title="Edit Node"
                >
                  Edit
                </button>

                <button
                  onClick={() => setModalOpen(true)}
                  className="text-blue-100 cursor-pointer px-2 bg-red-500  hover:bg-red-600 rounded"
                  title="Delete Node"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Core Fields */}
            <div className="text-sm mb-2">
              <strong>ID:</strong> {selectedNode.id}
            </div>
            <div className="text-sm mb-2">
              <strong>Label:</strong> {selectedNode.data.label}
            </div>
            <div className="text-sm mb-2">
              <strong>Kind:</strong> {selectedNode.data.kind}
            </div>

            {/* Meta */}
            <h3 className="text-md font-semibold mb-2 mt-4">Meta</h3>
            {selectedNode?.data.meta && Object.keys(selectedNode.data.meta).length > 0
              ? metaRenderer()
              : <p className="text-xs text-gray-400">No meta data</p>}

          </>
        ) : selectedEdge ? (
          /* EDGE VIEW */
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Edge Details</h2>

              <button
                onClick={() => setModalOpen(true)}
                className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded cursor-pointer"
              >
                Delete
              </button>
            </div>

            <div className="text-sm mb-2">
              <strong>ID:</strong> {selectedEdge.id}
            </div>

            <div className="text-sm mb-2">
              <strong>Source:</strong> {selectedEdge.source}
            </div>

            <div className="text-sm mb-2">
              <strong>Target:</strong> {selectedEdge.target}
            </div>
          </>
        ) : (
          <p className="text-sm text-background">No selection</p>
        )}
      </aside>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={modalOpen}
        message={
          selectedNode
            ? "Are you sure you want to delete this node? All connected edges will also be removed."
            : "Are you sure you want to delete this edge?"
        }
        onConfirm={selectedNode ? handleDelete : handleDeleteEdge}
        onCancel={() => setModalOpen(false)}
      />


      {/* Edit Modal */}
      {selectedNode && (
        <EditNodeModal
          open={editOpen}
          selectedNode={selectedNode}
          onClose={() => setEditOpen(false)}
          onSubmit={(data) => {
            // Update nodes array
            setNodes(prev =>
              prev.map(n =>
                n.id === selectedNode.id ? { ...n, data } : n
              )
            );

            // Update selectedNode to trigger sidebar re-render
            setSelectedNode(prev => prev && { ...prev, data });

            setEditOpen(false);
          }}
        />
      )}
    </>
  );
}
