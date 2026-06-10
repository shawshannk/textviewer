import { useState, useRef } from 'react'
import { useFileLoader } from '@/hooks/useFileLoader'
import { useViewerStore, sel } from '@/store/viewerStore'

export function PasteArea() {
  const [text, setText] = useState('')
  const { loadText } = useFileLoader()
  const clear = useViewerStore(sel.clear)
  const selectRef = useRef<HTMLSelectElement>(null)

  const handleRender = () => {
    const typeSelect = document.getElementById('type-select') as HTMLSelectElement
    const manualType = typeSelect?.value ?? 'auto'
    loadText(text, manualType)
  }

  const handleClear = () => {
    setText('')
    clear()
  }

  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-xs uppercase tracking-widest"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}
      >
        Or paste text
      </span>
      <textarea
        ref={selectRef as unknown as React.RefObject<HTMLTextAreaElement>}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your content here… select type in the header if needed"
        rows={5}
        className="w-full rounded-lg border px-4 py-3 text-xs outline-none resize-y transition-colors"
        style={{
          fontFamily: 'var(--font-mono)',
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
          lineHeight: 1.6,
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
      />
      <div className="flex gap-2">
        <button
          onClick={handleRender}
          className="px-4 py-1.5 rounded-md text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}
        >
          Render
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-1.5 rounded-md text-xs border transition-opacity hover:opacity-80"
          style={{
            fontFamily: 'var(--font-mono)',
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface2)',
          }}
        >
          Clear
        </button>
      </div>
    </div>
  )
}