import { useCallback } from 'react'
import { useViewerStore, sel } from '@/store/viewerStore'
import { isBinary } from '@/lib/binaryGuard'
import { detectType } from '@/lib/detectType'
import type { FileType } from '@/types'

export function useFileLoader() {
  const setFile = useViewerStore(sel.setFile)
  const setBinary = useViewerStore(sel.setBinary)
  const setError = useViewerStore(sel.setError)

  // Load from a File object (drag/drop or file picker)
  const loadFile = useCallback((file: File) => {
    const ext = file.name.split('.').pop() ?? ''
    if (isBinary(ext)) {
      setBinary(file.name, ext)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const fileType = detectType(ext, content)
      setFile(content, file.name, fileType)
    }
    reader.onerror = () => setError('Failed to read file')
    reader.readAsText(file)
  }, [setFile, setBinary, setError])

  // Load from pasted text with optional manual type override
  const loadText = useCallback((text: string, manualType: string = 'auto') => {
    if (!text.trim()) return
    const fileType: FileType = manualType !== 'auto'
      ? manualType as FileType
      : detectType('', text)
    setFile(text, '', fileType)
  }, [setFile])

  return { loadFile, loadText }
}
