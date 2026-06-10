import { useMemo } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useViewerStore, sel } from '@/store/viewerStore'
import type { FileType } from '@/types'

// Maps our internal FileType to react-syntax-highlighter language names
const LANG_MAP: Partial<Record<FileType, string>> = {
  js: 'javascript', ts: 'typescript',
  py: 'python', cs: 'csharp',
  sh: 'bash', sql: 'sql',
  toml: 'ini', env: 'bash',
  ini: 'ini', log: 'accesslog',
  html: 'xml', xml: 'xml',
  json: 'json', yaml: 'yaml',
  md: 'markdown', plain: 'plaintext',
}

interface Props {
  content: string
  fileType: FileType
}

export function CodeViewer({ content, fileType }: Props) {
  const theme = useViewerStore(sel.theme)
  const language = useMemo(() => LANG_MAP[fileType] ?? 'plaintext', [fileType])

  return (
    <SyntaxHighlighter
      language={language}
      style={theme === 'dark' ? atomOneDark : atomOneLight}
      showLineNumbers
      lineNumberStyle={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        color: 'var(--color-muted)',
        minWidth: '2.5em',
        paddingRight: '1em',
        userSelect: 'none',
      }}
      customStyle={{
        margin: 0,
        padding: '16px',
        background: 'transparent',
        fontSize: '0.76rem',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1.65,
      }}
      codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
      wrapLines
      wrapLongLines={false}
    >
      {content}
    </SyntaxHighlighter>
  )
}
