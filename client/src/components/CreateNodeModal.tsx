import { useState } from 'react'
import { Position } from '@xyflow/react'
import type { CustomNodeData } from '../types/NodeTypes'
import Editor from '@monaco-editor/react'
import { isDark } from '../theme/theme'

type CreateNodeModalProps = {
  onClose: () => void
  onSubmit: (data: CustomNodeData) => void
  initialData?: CustomNodeData
}

type HandleSide = 'top' | 'bottom' | 'left' | 'right'

type HandleConfig = {
  enabled: boolean
  type: 'source' | 'target'
}

const positionMap: Record<HandleSide, Position> = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
}

export default function CreateNodeModal({
  onClose,
  onSubmit,
  initialData,
}: CreateNodeModalProps) {
  const [label, setLabel] = useState(initialData?.label ?? '')
  const [kind, setKind] = useState(initialData?.kind ?? '')
  const [metaText, setMetaText] = useState(
    initialData ? JSON.stringify(initialData.meta, null, 2) : '{}'
  )
  const [metaError, setMetaError] = useState<string | null>(null)

  const [handles, setHandles] = useState<Record<HandleSide, HandleConfig>>(() => {
    const base: Record<HandleSide, HandleConfig> = {
      top: { enabled: false, type: 'source' },
      bottom: { enabled: false, type: 'source' },
      left: { enabled: false, type: 'source' },
      right: { enabled: false, type: 'source' },
    }

    if (!initialData?.handles) return base

    initialData.handles.forEach(h => {
      const side = (Object.keys(positionMap) as HandleSide[]).find(
        s => positionMap[s] === h.position
      )
      if (side) base[side] = { enabled: true, type: h.type }
    })

    return base
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    let parsedMeta: Record<string, any>

    try {
      parsedMeta = metaText.trim() ? JSON.parse(metaText) : {}

      if (typeof parsedMeta !== 'object' || Array.isArray(parsedMeta)) {
        throw new Error()
      }

      setMetaError(null)
    } catch {
      setMetaError('Meta must be a valid JSON object')
      return
    }

    const generatedHandles = Object.entries(handles)
      .filter(([, cfg]) => cfg.enabled)
      .map(([side, cfg]) => ({
        id: side,
        type: cfg.type,
        position: positionMap[side as HandleSide],
      }))

    onSubmit({
      label,
      kind,
      meta: parsedMeta,
      handles: generatedHandles,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="
          w-[25%] space-y-4 p-4
          bg-c1
          border border-border
          rounded-md
          shadow-lg
          text-foreground
        "
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-semibold text-sm">
          {initialData ? 'Duplicate Node' : 'Create Node'}
        </h2>

        {/* Label */}
        <input
          required
          className="input bg-c2"
          placeholder="Label"
          value={label}
          onChange={e => setLabel(e.target.value)}
        />

        {/* Kind */}
        <input
          required
          className="input bg-c2"
          placeholder="Kind (db, app, cache...)"
          value={kind}
          onChange={e => setKind(e.target.value)}
        />

        {/* Meta */}
        <div className="space-y-1">
          <div className="text-sm font-medium">Meta (JSON)</div>

          <div className="border border-border rounded overflow-hidden bg-c2">
            <Editor
              height="160px"
              language="json"
              value={metaText}
              theme={isDark() ? 'vs-dark' : 'vs-light'}
              onChange={value => {
                setMetaText(value ?? '{}')
                setMetaError(null)
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                tabSize: 2,
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {metaError && (
            <div className="text-xs text-c10">
              {metaError}
            </div>
          )}
        </div>

        {/* Handles */}
        <div className="space-y-2">
          <div className="font-medium text-sm">Handles</div>

          {(Object.keys(handles) as HandleSide[]).map(side => (
            <div key={side} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="checkbox"
                checked={handles[side].enabled}
                onChange={e =>
                  setHandles(prev => ({
                    ...prev,
                    [side]: { ...prev[side], enabled: e.target.checked },
                  }))
                }
              />

              <span className="w-14 capitalize">{side}</span>

              {/* source */}
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  className="radio"
                  disabled={!handles[side].enabled}
                  checked={handles[side].type === 'source'}
                  onChange={() =>
                    setHandles(prev => ({
                      ...prev,
                      [side]: { ...prev[side], type: 'source' },
                    }))
                  }
                />
                source
              </label>

              {/* target */}
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  className="radio"
                  disabled={!handles[side].enabled}
                  checked={handles[side].type === 'target'}
                  onChange={() =>
                    setHandles(prev => ({
                      ...prev,
                      [side]: { ...prev[side], type: 'target' },
                    }))
                  }
                />
                target
              </label>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
          >
            {initialData ? 'Duplicate' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
