import { useState, useEffect } from "react";
import type { CustomNodeData } from "../types/NodeTypes";
import type { Node } from "@xyflow/react";
import Editor from "@monaco-editor/react";
import { isDark } from "../theme/theme";
import { useAppSelector } from "../redux/hooks";


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
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("");
  const [metaText, setMetaText] = useState("{}");
  const [error, setError] = useState("");
  const x=useAppSelector((state)=>state.user.name);

  useEffect(() => {
    if (open && selectedNode) {
      setLabel(selectedNode.data.label);
      setKind(selectedNode.data.kind);
      setMetaText(JSON.stringify(selectedNode.data.meta, null, 2));
      setError("");
    }
  }, [open, selectedNode]);

  if (!open || !selectedNode) return null;

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
        handles: selectedNode.data.handles,
      });

      onClose();
    } catch {
      setError("Meta must be valid JSON");
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-background/60 backdrop-blur-sm
      "
      onClick={onClose}
    >
      <h2>{x}</h2>
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-[500px]
          rounded-lg
          bg-c1
          border border-border
          shadow-lg
          p-4
          text-foreground
        "
      >
        <h2 className="text-lg font-semibold mb-4">
          Edit Node
        </h2>

        {/* Label */}
        <div className="mb-3">
          <label className="text-sm mb-1 block">
            Label
          </label>
          <input
            className="input"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        {/* Kind */}
        <div className="mb-3">
          <label className="text-sm mb-1 block">
            Kind
          </label>
          <input
            className="input"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          />
        </div>

        {/* Meta */}
        <div className="mb-3">
          <label className="text-sm mb-1 block">
            Meta (JSON)
          </label>

          <Editor
            height="160px"
            language="json"
            value={metaText}
            theme={isDark() ? "vs-dark" : "vs-light"}
            onChange={(value) => {
              setMetaText(value ?? "{}");
              setError("");
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              automaticLayout: true,
              formatOnType: true,
              formatOnPaste: true,
              tabSize: 2,
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-c10 mb-2">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
