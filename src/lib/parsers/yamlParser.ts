// Lightweight YAML parser for display purposes.
// Handles common YAML patterns. Falls back gracefully on edge cases.

type YamlValue = string | number | boolean | null | YamlValue[] | { [k: string]: YamlValue }

function parseScalar(v: string): YamlValue {
  if (v === 'null' || v === '~') return null
  if (v === 'true') return true
  if (v === 'false') return false
  if (v !== '' && !isNaN(Number(v))) return Number(v)
  return v.replace(/^["']|["']$/g, '')
}

function parseLines(lines: string[], start: number, baseIndent: number): { value: YamlValue; end: number } {
  const obj: Record<string, YamlValue> = {}
  const arr: YamlValue[] = []
  let isArr: boolean | null = null
  let i = start

  while (i < lines.length) {
    const raw = lines[i]
    const trimmed = raw.trimStart()
    if (!trimmed || trimmed.startsWith('#')) { i++; continue }
    const indent = raw.length - trimmed.length
    if (indent < baseIndent) break
    if (indent > baseIndent) { i++; continue }

    if (trimmed.startsWith('- ')) {
      isArr = true
      const val = trimmed.slice(2).trim()
      if (!val || val === '|' || val === '>') {
        const sub = parseLines(lines, i + 1, indent + 2)
        arr.push(sub.value); i = sub.end
      } else {
        arr.push(parseScalar(val)); i++
      }
    } else if (trimmed.includes(': ') || trimmed.endsWith(':')) {
      isArr = false
      const colonIdx = trimmed.indexOf(': ')
      const key = colonIdx > -1
        ? trimmed.slice(0, colonIdx).replace(/^["']|["']$/g, '')
        : trimmed.slice(0, -1).replace(/^["']|["']$/g, '')
      const valPart = colonIdx > -1 ? trimmed.slice(colonIdx + 2).trim() : ''
      if (!valPart || valPart === '|' || valPart === '>') {
        const sub = parseLines(lines, i + 1, indent + 2)
        obj[key] = sub.value; i = sub.end
      } else {
        obj[key] = parseScalar(valPart); i++
      }
    } else { i++ }
  }

  return { value: isArr === true ? arr : obj, end: i }
}

export function parseYAML(text: string): YamlValue {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  return parseLines(lines, 0, 0).value
}
