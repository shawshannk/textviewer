import { useMemo } from 'react'
import { TreeNode } from './TreeNode'
import { parseYAML } from '@/lib/parsers/yamlParser'
import type { FileType } from '@/types'

interface Props {
  content: string
  fileType: FileType
}

type TreeValue = Parameters<typeof TreeNode>[0]['value']

export function TreeViewer({ content, fileType }: Props) {
  const data = useMemo<TreeValue | { error: string }>(() => {
    try {
      if (fileType === 'json') return JSON.parse(content)
      if (fileType === 'yaml') return parseYAML(content) as TreeValue
      if (fileType === 'xml') return parseXML(content)
      return null
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Parse error' }
    }
  }, [content, fileType])

  if (data && typeof data === 'object' && 'error' in data && !Array.isArray(data)) {
    return (
      <div className="text-xs p-4" style={{ color: 'var(--color-accent2)', fontFamily: 'var(--font-mono)' }}>
        ⚠ Parse error: {(data as { error: string }).error}
      </div>
    )
  }

  return (
    <div className="p-2">
      <TreeNode value={data as TreeValue} />
    </div>
  )
}

// Converts a parsed XML DOM node into a plain object for the tree renderer.
function parseXML(text: string): TreeValue {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'application/xml')
  const err = doc.querySelector('parsererror')
  if (err) throw new Error('Invalid XML')
  return domToObj(doc.documentElement)
}

function domToObj(node: Element): TreeValue {
  const result: Record<string, TreeValue> = {}

  // Attributes
  if (node.attributes.length > 0) {
    const attrs: Record<string, TreeValue> = {}
    Array.from(node.attributes).forEach((a) => { attrs[`@${a.name}`] = a.value })
    result['@attributes'] = attrs
  }

  const children = Array.from(node.childNodes)
  const elementChildren = children.filter((c) => c.nodeType === Node.ELEMENT_NODE) as Element[]
  const textContent = children
    .filter((c) => c.nodeType === Node.TEXT_NODE)
    .map((c) => c.textContent?.trim())
    .filter(Boolean)
    .join('')

  if (elementChildren.length === 0) {
    if (textContent) result['#text'] = textContent
  } else {
    elementChildren.forEach((child) => {
      const key = child.tagName
      if (key in result) {
        // Multiple children with same tag → array
        if (!Array.isArray(result[key])) result[key] = [result[key]]
        ;(result[key] as TreeValue[]).push(domToObj(child))
      } else {
        result[key] = domToObj(child)
      }
    })
  }

  return Object.keys(result).length === 0 ? null : result
}
