import { useState, useEffect } from "react";
import type { CustomNodeData } from "../types/NodeTypes";
import type { Node } from "@xyflow/react";
import Editor from "@monaco-editor/react";
import { isDark } from "../theme/theme";


interface Props {
  open: boolean;
  selectedNode: Node<CustomNodeData> | null;
  onClose: () => void;
  onSubmit: (data: CustomNodeData) => void;
}

export default function EditNodeModal({
  open,
  selectedNode,
  onClose,
  onSubmit,
}: Props) {
  // Local state for inputs
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("");
  const [metaText, setMetaText] = useState("{}");
  const [error, setError] = useState("");

  // Initialize state whenever modal opens or selectedNode changes
  useEffect(() => {
    if (open && selectedNode) {
      setLabel(selectedNode.data.label);
      setKind(selectedNode.data.kind);
      setMetaText(JSON.stringify(selectedNode.data.meta, null, 2));
      setError("");
    }
  }, [open, selectedNode]);

  if (!open || !selectedNode) return null; // Guard against null

  const handleSubmit = () => {
    try {
      const parsedMeta = JSON.parse(metaText);

      if (
        typeof parsedMeta !== "object" ||
        parsedMeta === null ||
        Array.isArray(parsedMeta)
      ) {
        setError("Meta must be a JSON object");
        return;
      }

      onSubmit({
        label,
        kind,
        meta: parsedMeta,
        handles: selectedNode.data.handles
      });

      onClose();
    } catch {
      setError("Meta must be valid JSON");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="w-[500px] bg-foreground p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Edit Node</h2>

        <div className="mb-3">
          <label className="text-sm block mb-1">Label</label>
          <input
            className="w-full p-2 bg-background rounded"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="text-sm block mb-1">Kind</label>
          <input
            className="w-full p-2 bg-background rounded"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="text-sm block mb-1">Meta (JSON)</label>
          <Editor
            height="160px"
            language="json"
            value={metaText}
            theme={isDark()?"vs-light":"vs-dark"}
            onChange={(value) => setMetaText(value ?? "{}")}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              automaticLayout: true,
              formatOnType: true,
              formatOnPaste: true,
              tabSize: 1,
            }}
          />

        </div>

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-amber-500 text-black rounded cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
