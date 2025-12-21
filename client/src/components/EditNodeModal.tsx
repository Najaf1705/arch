import { useState } from "react";
import type { CustomNodeData } from "../types/NodeTypes";

interface Props {
  open: boolean;
  initialData: CustomNodeData;
  onClose: () => void;
  onSubmit: (data: CustomNodeData) => void;
}

export default function EditNodeModal({
  open,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [label, setLabel] = useState(initialData.label);
  const [kind, setKind] = useState(initialData.kind);
  const [metaText, setMetaText] = useState(
    JSON.stringify(initialData.meta, null, 2)
  );
  const [error, setError] = useState("");

  if (!open) return null;

  function handleSubmit() {
    try {
      const meta = JSON.parse(metaText);
      onSubmit({
        label,
        kind,
        meta,
      });
      onClose();
    } catch {
      setError("Meta must be valid JSON");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="w-[500px] bg-foreground p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Edit Node</h2>

        <div className="mb-3">
          <label className="text-sm block mb-1">Label</label>
          <input
            className="w-full p-2 bg-background rounded"
            value={label}
            onChange={e => setLabel(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="text-sm block mb-1">Kind</label>
          <input
            className="w-full p-2 bg-background rounded"
            value={kind}
            onChange={e => setKind(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="text-sm block mb-1">Meta (JSON)</label>
          <textarea
            className="w-full h-40 p-2 bg-background font-mono text-xs rounded"
            value={metaText}
            onChange={e => setMetaText(e.target.value)}
          />
        </div>

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-amber-500 text-black rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
