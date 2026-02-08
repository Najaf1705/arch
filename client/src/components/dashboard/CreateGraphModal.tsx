import { useState } from "react";

interface CreateGraphModalProps {
  onClose: () => void;
}

type GraphType = "generic" | "dag" | "tree";

const CreateGraphModal: React.FC<CreateGraphModalProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<GraphType>("generic");

  const canCreate = name.trim().length > 0;

  const handleCreate = () => {
    if (!canCreate) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      type,
    };

    console.log("Create graph:", payload);
    // later → dispatch(createGraph(payload))

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-xl bg-background p-6">
        <h2 className="text-lg font-semibold mb-4">Create New Graph</h2>

        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Graph name"
            className="w-full rounded-md border px-3 py-2"
            autoFocus
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full rounded-md border px-3 py-2"
            rows={3}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as GraphType)}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="generic">Generic Graph</option>
            <option value="dag">Directed Acyclic Graph</option>
            <option value="tree">Tree</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className="px-4 py-1 rounded-md bg-primary text-white disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGraphModal;
