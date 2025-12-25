import MetaNode from './MetaNode'

type Props = {
  value: any
  indent?: number
}

export default function MetaTree({ value, indent = 0 }: Props) {
  if (typeof value !== 'object' || value === null) return null

  return (
    <>
      {Object.entries(value).map(([k, v]) => (
        <MetaNode
          key={k}
          label={k}
          value={v}
          indent={indent}
        />
      ))}
    </>
  )
}
