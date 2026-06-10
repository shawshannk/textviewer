import { useState, useMemo } from 'react'
import { CodeViewer } from './CodeViewer'
import type { HtmlMode } from '@/types'

interface Props { content: string }

export function HtmlViewer({ content }: Props) {
  const [mode, setMode] = useState<HtmlMode>('preview')

  // Create a blob URL for the sandboxed iframe.
  // useMemo so we don't recreate the blob on every render.
  const blobUrl = useMemo(() => {
    const blob = new Blob([content], { type: 'text/html' })
    return URL.createObjectURL(blob)
  }, [content])

  return (
    <div className="flex flex-col gap-0">
      {/* Mode toggle */}
      <div
        className="flex gap-1 p-2 border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        {(['preview', 'source'] as HtmlMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="px-3 py-1 rounded text-xs capitalize transition-colors"
            style={{
              fontFamily: 'var(--font-mono)',
              backgroundColor: mode === m ? 'var(--color-accent)' : 'var(--color-surface2)',
              color: mode === m ? 'white' : 'inherit',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'preview' ? (
        <iframe
          src={blobUrl}
          sandbox="allow-scripts allow-same-origin"
          className="w-full border-0 rounded-b-lg"
          style={{ height: '60vh', background: 'white' }}
          title="HTML Preview"
        />
      ) : (
        <CodeViewer content={content} fileType="html" />
      )}
    </div>
  )
}
