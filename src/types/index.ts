// ── FILE TYPES ────────────────────────────────────────────────────────────────
// Single source of truth. Every switch/case in the app references this.
export type FileType =
  | 'md' | 'json' | 'xml' | 'yaml' | 'csv' | 'html'
  | 'js' | 'ts' | 'py' | 'cs' | 'sh' | 'sql'
  | 'toml' | 'env' | 'ini' | 'log'
  | 'plain' | 'binary'

// ── VIEWER STATE ──────────────────────────────────────────────────────────────
// Discriminated union — each status only has fields that make sense for it.
// When status === 'loaded', TypeScript guarantees content exists.
// When status === 'binary', TypeScript prevents accessing content.
export type ViewerState =
  | { status: 'idle' }
  | { status: 'loaded'; fileType: FileType; content: string; fileName: string }
  | { status: 'binary'; fileName: string; ext: string }
  | { status: 'error'; message: string }

export type Theme = 'dark' | 'light'
export type HtmlMode = 'preview' | 'source'

// Groupings used for render routing
export const TREE_TYPES: FileType[] = ['json', 'xml', 'yaml']
export const CODE_TYPES: FileType[] = ['js', 'ts', 'py', 'cs', 'sh', 'sql', 'toml', 'env', 'ini', 'log']
export const RENDERED_TYPES: FileType[] = ['md', 'csv', 'html']
