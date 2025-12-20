import { useState } from 'react'
import type { CustomNodeData } from '../types/NodeTypes'
import CreateNodeModal from './CreateNodeModal'

type NodeMenuProps = {
  onCreateNode: (data: CustomNodeData) => void
}

export default function NodeMenu({ onCreateNode }: NodeMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating button */}
      <div
        className="
          fixed bottom-5 left-1/2 -translate-x-1/2
          z-50
        "
      >
        <button
          onClick={() => setOpen(true)}
          className="
            px-4 py-2 rounded
            bg-amber-500 text-black
            font-medium shadow cursor-pointer
          "
        >
          Add Node
        </button>
      </div>

      {/* Modal */}
      {open && (
        <CreateNodeModal
          onClose={() => setOpen(false)}
          onSubmit={(data) => {
            onCreateNode(data)
            setOpen(false)
          }}
        />
      )}
    </>
  )
}
