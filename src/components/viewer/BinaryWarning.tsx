import { Ban } from 'lucide-react'

interface Props {
  fileName: string
  ext: string
}

export function BinaryWarning({ fileName, ext }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <Ban size={36} style={{ color: 'var(--color-accent2)' }} />
      <p className="text-sm font-semibold" style={{ color: 'var(--color-accent2)' }}>
        Binary file — cannot display as text
      </p>
      <p className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
        {fileName} <span className="uppercase">.{ext}</span>
      </p>
      <p className="text-xs max-w-sm" style={{ color: 'var(--color-muted)' }}>
        Blocked types include .pdf, .docx, .png, .zip, .exe and similar.
        Only plain-text files are supported. If this file contains text,
        rename its extension or paste the content manually.
      </p>
    </div>
  )
}
