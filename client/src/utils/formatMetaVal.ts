export function formatMetaValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    // Convert object/array to string without outer braces
    const str = JSON.stringify(value, null, 2)
    return str.replace(/^[{\[]\n?/, '').replace(/\n?[}\]]$/, '')
  }
  return String(value)
}

export function renderMeta(value: any, indent = 0): string {
  if (typeof value !== 'object' || value === null) return String(value)

  const result: string[] = []
  
  for (const [k, v] of Object.entries(value)) {
    const prefix = '  '.repeat(indent)
    
    if (typeof v === 'object' && v !== null) {
      result.push(`${prefix}${k}:`)
      result.push(renderMeta(v, indent + 1))
    } else {
      result.push(`${prefix}${k}: ${v}`)
    }
  }
  
  return result.join('\n')
}