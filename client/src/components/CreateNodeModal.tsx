import { useState } from 'react'
import type { CustomNodeData } from '../types/NodeTypes'

type CreateNodeModalProps = {
  onClose: () => void
  onSubmit: (data: CustomNodeData) => void
}

export default function CreateNodeModal({ onClose, onSubmit }: CreateNodeModalProps) {
  const [label, setLabel] = useState('')
  const [kind, setKind] = useState('')
  const [meta, setMeta] = useState<Record<string, string>>({})
  const [keyInput, setKeyInput] = useState('')
  const [valueInput, setValueInput] = useState('')

  const addMeta = () => {
    if (!keyInput) return
    setMeta((prev) => ({ ...prev, [keyInput]: valueInput }))
    setKeyInput('')
    setValueInput('')
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault() // stop page reload

    onSubmit({
      label,
      kind,
      meta,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-background rounded p-4 space-y-4"
      >
        <h2 className="font-semibold text-lg">Create Node</h2>

        {/* Label */}
        <input
          required
          className="w-full px-2 py-1 border rounded"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        {/* Kind */}
        <input
          required
          className="w-full px-2 py-1 border rounded"
          placeholder="Kind (db, app, cache...)"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        />

        {/* Meta key-value */}
        <div className="flex gap-2">
          <input
            className="flex-1 px-2 py-1 border rounded"
            placeholder="Key"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <input
            className="flex-1 px-2 py-1 border rounded"
            placeholder="Value"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
          />
          <button
            type="button"
            onClick={addMeta}
            className="px-2 rounded bg-gray-700 text-white cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Meta preview */}
        {Object.entries(meta).length > 0 && (
          <div className="text-sm space-y-1">
            {Object.entries(meta).map(([k, v]) => (
              <div key={k}>
                {k}: {v}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded bg-amber-500 text-black cursor-pointer"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}
