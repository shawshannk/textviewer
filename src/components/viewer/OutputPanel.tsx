import { useRef } from 'react'
import { Copy, Check, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { useViewerStore, sel } from '@/store/viewerStore'
import { useSearch } from '@/hooks/useSearch'
import { useClipboard } from '@/hooks/useClipboard'
import { MarkdownViewer } from './MarkdownViewer'
import { TreeViewer } from './TreeViewer'
import { CodeViewer } from './CodeViewer'
import { CsvViewer } from './CsvViewer'
import { HtmlViewer } from './HtmlViewer'
import { BinaryWarning } from './BinaryWarning'
import { TREE_TYPES, CODE_TYPES } from '@/types'

const BADGE_COLORS: Record<string, string> = {
  json: '#a78bfa', xml: '#93c5fd', yaml: '#67e8f9',
  md: '#86efac', csv: '#fcd34d', html: '#fb923c',
  js: '#fbbf24', ts: '#60a5fa', py: '#4ade80',
  cs: '#c084fc', sh: '#94a3b8', sql: '#f472b6',
  toml: '#fda4af', env: '#86efac', ini: '#d1d5db',
  log: '#9ca3af', plain: '#6b7280', binary: '#ef4444',
}

export function OutputPanel() {
  const viewerState = useViewerStore(sel.viewerState)
  const rawContent = useViewerStore(sel.rawContent)
  const { viewerRef } = useSearch()
  const { copy, copied } = useClipboard()

  if (viewerState.status === 'idle') return null

  const fileType = viewerState.status === 'loaded' ? viewerState.fileType : 'binary'
  const fileName = viewerState.status === 'loaded' || viewerState.status === 'binary'
    ? viewerState.fileName : ''
  const badgeColor = BADGE_COLORS[fileType] ?? '#6b7280'
  const isTree = TREE_TYPES.includes(fileType as typeof TREE_TYPES[number])

  return (
    <div
      className="rounded-lg border overflow-hidden flex flex-col"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Output bar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2 border-b flex-wrap"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded text-xs font-bold uppercase"
            style={{ backgroundColor: badgeColor, color: '#000', fontFamily: 'var(--font-mono)' }}
          >
            {fileType}
          </span>
          {fileName && (
            <span className="text-xs truncate max-w-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
              {fileName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Expand/collapse all — only for tree types */}
          {isTree && (
            <div className="flex gap-1">
              <TreeExpandButton expand />
              <TreeExpandButton expand={false} />
            </div>
          )}

          {/* Copy button */}
          <button
            onClick={() => copy(rawContent)}
            className="flex items-center gap-1.5 px-3 py-1 rounded border text-xs transition-all hover:opacity-80"
            style={{
              fontFamily: 'var(--font-mono)',
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface2)',
            }}
          >
            {copied ? <Check size={12} style={{ color: 'var(--color-tok-str)' }} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Viewer area */}
      <div
        ref={viewerRef}
        className="overflow-auto"
        style={{
          backgroundColor: 'var(--color-code-bg)',
          maxHeight: '72vh',
          minHeight: '120px',
        }}
      >
        {viewerState.status === 'error' && (
          <div className="p-4 text-sm" style={{ color: 'var(--color-accent2)', fontFamily: 'var(--font-mono)' }}>
            ⚠ {viewerState.message}
          </div>
        )}

        {viewerState.status === 'binary' && (
          <BinaryWarning fileName={viewerState.fileName} ext={viewerState.ext} />
        )}

        {viewerState.status === 'loaded' && (() => {
          const { content, fileType: ft } = viewerState
          if (ft === 'md') return <div className="p-6"><MarkdownViewer content={content} /></div>
          if (ft === 'csv') return <CsvViewer content={content} />
          if (ft === 'html') return <HtmlViewer content={content} />
          if (TREE_TYPES.includes(ft as typeof TREE_TYPES[number])) return <TreeViewer content={content} fileType={ft} />
          if (CODE_TYPES.includes(ft as typeof CODE_TYPES[number]) || ft === 'plain') return <CodeViewer content={content} fileType={ft} />
          return <CodeViewer content={content} fileType="plain" />
        })()}
      </div>
    </div>
  )
}

// Expand/collapse all tree nodes via DOM — avoids prop drilling through recursive TreeNode
function TreeExpandButton({ expand }: { expand: boolean }) {
  const handle = () => {
    document.querySelectorAll<HTMLButtonElement>('.tree-toggle').forEach((btn) => {
      const isCollapsed = btn.dataset.collapsed === 'true'
      if (expand && isCollapsed) btn.click()
      if (!expand && !isCollapsed) btn.click()
    })
  }
  return (
    <button
      onClick={handle}
      className="px-2 py-1 rounded border text-xs hover:opacity-80 transition-opacity"
      style={{
        fontFamily: 'var(--font-mono)',
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface2)',
      }}
    >
      {expand
        ? <ChevronsUpDown size={11} />
        : <ChevronsDownUp size={11} />
      }
    </button>
  )
}
