import React, { useState, useRef } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { CustomNodeData } from "../types/NodeTypes";
import ConfirmModal from "./ConfirmModal";
import EditNodeModal from "./EditNodeModal";
import { renderMeta } from "../utils/formatMetaVal";
import MetaTree from "./MetaTree";
import CreateNodeModal from "./CreateNodeModal";

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
  const [duplicateOpen, setDuplicateOpen] = useState(false);

  /* -------------------- Delete Node -------------------- */
  const handleDelete = () => {
    if (!selectedNode) return;

    setNodes(prev => prev.filter(n => n.id !== selectedNode.id));
    setEdges(prev =>
      prev.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id)
    );

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

  return (
    <>
      <aside
        ref={sidebarRef}
        style={{ width }}
        className="
          fixed right-0 top-0 h-screen p-4
          bg-c1 text-foreground
          border-l border-border
          z-10 flex flex-col
        "
      >
        {/* Resize handle */}
        <div
          onMouseDown={startResizing}
          className="
            absolute left-0 top-0 h-full w-1
            cursor-ew-resize
            hover:bg-c2
          "
        />

        {selectedNode ? (
          <>
            {/* Header */}
<div className="flex flex-wrap items-start justify-between gap-2 mb-4">
              <h2 className="text-lg font-bold">Node Details</h2>

<div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => setEditOpen(true)}
className="btn btn-secondary text-xs px-2 py-1"
                  title="Edit Node"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDuplicateOpen(true)}
className="btn btn-secondary text-xs px-2 py-1"
                >
                  Duplicate
                </button>

                <button
                  onClick={() => setModalOpen(true)}
className="btn btn-danger text-xs px-2 py-1"
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

            {Object.keys(selectedNode.data.meta).length === 0 ? (
              <p className="text-xs text-foreground/60">No meta data</p>
            ) : (
              <MetaTree value={selectedNode.data.meta} />
            )}
          </>
        ) : selectedEdge ? (
          <>
            {/* EDGE VIEW */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Edge Details</h2>

              <button
                onClick={() => setModalOpen(true)}
                className="btn btn-danger"
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
          <p className="text-sm text-foreground/60">No selection</p>
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
            setNodes(prev =>
              prev.map(n =>
                n.id === selectedNode.id ? { ...n, data } : n
              )
            );
            setSelectedNode(prev => prev && { ...prev, data });
            setEditOpen(false);
          }}
        />
      )}

      {/* Duplicate */}
      {selectedNode && duplicateOpen && (
        <CreateNodeModal
          initialData={selectedNode.data}
          onClose={() => setDuplicateOpen(false)}
          onSubmit={(data) => {
            setNodes(prev => [
              ...prev,
              {
                id: crypto.randomUUID(),
                type: selectedNode.type,
                position: {
                  x: selectedNode.position.x + 40,
                  y: selectedNode.position.y + 40,
                },
                data,
              },
            ]);
            setDuplicateOpen(false);
          }}
        />
      )}
    </>
  );
}
