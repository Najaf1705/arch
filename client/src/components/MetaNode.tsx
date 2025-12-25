import { useState } from 'react'
import MetaTree from './MetaTree'

type Props = {
    label: string
    value: any
    indent: number
}

export default function MetaNode({ label, value, indent }: Props) {
    const [open, setOpen] = useState(false)

    const isObject = typeof value === 'object' && value !== null

    return (
        <div style={{ marginLeft: indent * 12 }} className="text-xs font-mono">
            <div
                className={`flex items-center gap-1 select-none ${isObject ? 'cursor-pointer hover:text-amber-400' : ''
                    }`}
                onClick={() => isObject && setOpen(o => !o)}
            >
                {isObject && (
                    <span
                        className={`inline-flex w-3 transition-transform duration-150 ${open ? 'rotate-90' : ''
                            }`}
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24">
                            <path
                                d="M9 18l6-6-6-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>

                )}

                <span className="font-semibold">{label}:</span>

                {!isObject && <span>{String(value)}</span>}
            </div>

            {isObject && open && (
                <MetaTree value={value} indent={indent + 1} />
            )}
        </div>
    )
}
