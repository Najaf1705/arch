import React, { useState, useRef } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { CustomNodeData } from "../types/NodeTypes";
import ConfirmModal from "./ConfirmModal";
import EditNodeModal from "./EditNodeModal";
import MetaTree from "./MetaTree";
import CreateNodeModal from "./CreateNodeModal";

interface Props {
  selectedNode: Node<CustomNodeData> | null;
  selectedEdge: Edge | null;
  setSelectedNode: React.Dispatch<
    React.SetStateAction<Node<CustomNodeData> | null>
  >;
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);

  /* ---------------- Delete ---------------- */

  const handleDeleteNode = () => {
    if (!selectedNode) return;

    setNodes(prev => prev.filter(n => n.id !== selectedNode.id));
    setEdges(prev =>
      prev.filter(
        e => e.source !== selectedNode.id && e.target !== selectedNode.id,
      ),
    );

    setSelectedNode(null);
    setConfirmOpen(false);
  };

  const handleDeleteEdge = () => {
    if (!selectedEdge) return;

    setEdges(prev => prev.filter(e => e.id !== selectedEdge.id));
    setConfirmOpen(false);
  };

  /* ---------------- Resize ---------------- */

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

  /* ---------------- Render ---------------- */

  return (
    <>
      <aside
        ref={sidebarRef}
        style={{ width }}
        className="
          fixed right-0 top-0 h-screen
          bg-c1 text-foreground
          border-l border-border
          z-20
          flex flex-col
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

        {/* ================= CONTENT (SCROLLS) ================= */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedNode ? (
            <>
              <h2 className="text-lg font-bold mb-4">Node Details</h2>

              <div className="text-sm mb-2">
                <strong>ID:</strong> {selectedNode.id}
              </div>
              <div className="text-sm mb-2">
                <strong>Label:</strong> {selectedNode.data.label}
              </div>
              <div className="text-sm mb-2">
                <strong>Kind:</strong> {selectedNode.data.kind}
              </div>

              <h3 className="text-md font-semibold mt-4 mb-2">Meta</h3>

              {Object.keys(selectedNode.data.meta).length === 0 ? (
                <p className="text-xs text-foreground/60">
                  No meta data
                </p>
              ) : (
                <MetaTree value={selectedNode.data.meta} />
              )}
            </>
          ) : selectedEdge ? (
            <>
              <h2 className="text-lg font-bold mb-4">Edge Details</h2>

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
            <p className="text-sm text-foreground/60">
              No selection
            </p>
          )}
        </div>

        {/* ================= FOOTER (FIXED) ================= */}
        <div
          className="
            p-3
            flex flex-wrap gap-2 justify-end
            bg-c1
            backdrop-blur-sm
          "
        >
          {selectedNode && (
            <>
              <button
                onClick={() => setEditOpen(true)}
                className="btn btn-secondary text-xs px-2 py-1"
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
                onClick={() => setConfirmOpen(true)}
                className="btn btn-danger text-xs px-2 py-1"
              >
                Delete
              </button>
            </>
          )}

          {!selectedNode && selectedEdge && (
            <button
              onClick={() => setConfirmOpen(true)}
              className="btn btn-danger text-xs px-2 py-1"
            >
              Delete
            </button>
          )}
        </div>
      </aside>

      {/* ================= MODALS ================= */}

      <ConfirmModal
        isOpen={confirmOpen}
        message={
          selectedNode
            ? "Delete this node and all connected edges?"
            : "Delete this edge?"
        }
        onConfirm={selectedNode ? handleDeleteNode : handleDeleteEdge}
        onCancel={() => setConfirmOpen(false)}
      />

      {selectedNode && (
        <EditNodeModal
          open={editOpen}
          selectedNode={selectedNode}
          onClose={() => setEditOpen(false)}
          onSubmit={(data) => {
            setNodes(prev =>
              prev.map(n =>
                n.id === selectedNode.id ? { ...n, data } : n,
              ),
            );
            setSelectedNode(prev => prev && { ...prev, data });
            setEditOpen(false);
          }}
        />
      )}

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
