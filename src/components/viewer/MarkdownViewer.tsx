import { useMemo } from 'react'
import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

interface Props { content: string }

export function MarkdownViewer({ content }: Props) {
  // useMemo: parsing markdown is expensive for large files.
  // Only re-parses when content changes, not on every render.
  const html = useMemo(() => marked.parse(content) as string, [content])

  return (
    <div
      className="md-body prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ fontFamily: 'var(--font-sans)' }}
    />
  )
}
