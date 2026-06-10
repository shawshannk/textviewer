import { useState, useCallback } from 'react'

// Wraps clipboard API with a temporary "copied" state for UI feedback.
// The 2s reset is handled here so no component needs to manage it.
export function useClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), resetMs)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), resetMs)
    }
  }, [resetMs])

  return { copy, copied }
}
