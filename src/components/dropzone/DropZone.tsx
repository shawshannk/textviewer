import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'
import { useFileLoader } from '@/hooks/useFileLoader'
import { cn } from '@/lib/utils'

export function DropZone() {
  const { loadFile } = useFileLoader()
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) loadFile(file)
  }, [loadFile])

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
    e.target.value = '' // reset so same file can be re-selected
  }, [loadFile])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={cn(
        'relative rounded-lg border-2 border-dashed px-8 py-8 text-center transition-all cursor-pointer',
        isDragging ? 'border-accent' : 'hover:border-accent/60'
      )}
      style={{
        borderColor: isDragging ? 'var(--color-accent)' : 'var(--color-border)',
        backgroundColor: isDragging ? 'var(--color-surface2)' : 'var(--color-surface)',
      }}
    >
      <input
        type="file"
        onChange={onFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        <Upload size={22} style={{ color: 'var(--color-accent)' }} />
        <p className="text-sm">
          <span className="font-bold" style={{ color: 'var(--color-accent)' }}>Drop a file here</span>
          {' '}<span style={{ color: 'var(--color-muted)' }}>or click to browse</span>
        </p>
        <p className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
          Supported: md · json · yaml · csv · html · xml · toml · ini · env · log · txt
        </p>
        <p className="text-xs" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
          Code: js · ts · py · cs · sh · sql &nbsp;·&nbsp; Binary files are blocked
        </p>
      </div>
    </div>
  )
}
