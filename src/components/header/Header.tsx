import { Moon, Sun, Search, ChevronUp, ChevronDown } from 'lucide-react'
import { useViewerStore, sel } from '@/store/viewerStore'
import { cn } from '@/lib/utils'

const FILE_TYPES = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'md', label: 'Markdown' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'toml', label: 'TOML' },
  { value: 'csv', label: 'CSV' },
  { value: 'html', label: 'HTML' },
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'py', label: 'Python' },
  { value: 'cs', label: 'C#' },
  { value: 'sh', label: 'Shell' },
  { value: 'sql', label: 'SQL' },
  { value: 'env', label: 'ENV' },
  { value: 'ini', label: 'INI / Config' },
  { value: 'log', label: 'Log file' },
  { value: 'plain', label: 'Plain text' },
]

export function Header() {
  const theme = useViewerStore(sel.theme)
  const toggleTheme = useViewerStore(sel.toggleTheme)
  const searchQuery = useViewerStore(sel.searchQuery)
  const matchCount = useViewerStore(sel.matchCount)
  const currentMatchIndex = useViewerStore(sel.currentMatchIndex)
  const setSearchQuery = useViewerStore(sel.setSearchQuery)
  const nextMatch = useViewerStore(sel.nextMatch)
  const prevMatch = useViewerStore(sel.prevMatch)

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between gap-3 px-6 py-3 border-b"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* Logo */}
      <span className="text-xl font-extrabold tracking-tight whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>
        Text<span style={{ color: 'var(--color-accent)' }}>Viewer</span>
      </span>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border"
          style={{ backgroundColor: 'var(--color-surface2)', borderColor: 'var(--color-border)' }}
        >
          <Search size={13} style={{ color: 'var(--color-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.shiftKey ? prevMatch() : nextMatch()
            }}
            placeholder="Search…"
            className="bg-transparent outline-none text-xs w-36"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}
          />
          {matchCount > 0 && (
            <span className="text-xs whitespace-nowrap" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
              {currentMatchIndex + 1}/{matchCount}
            </span>
          )}
          <button onClick={prevMatch} className={cn('p-0.5 rounded hover:opacity-70', matchCount === 0 && 'opacity-30')}>
            <ChevronUp size={13} />
          </button>
          <button onClick={nextMatch} className={cn('p-0.5 rounded hover:opacity-70', matchCount === 0 && 'opacity-30')}>
            <ChevronDown size={13} />
          </button>
        </div>

        {/* Type selector */}
        <select
          className="text-xs px-2 py-1.5 rounded-md border outline-none cursor-pointer"
          style={{
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--color-surface2)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          defaultValue="auto"
          id="type-select"
        >
          {FILE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'var(--color-surface2)',
            borderColor: 'var(--color-border)',
          }}
        >
          {theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
          {theme === 'dark' ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  )
}