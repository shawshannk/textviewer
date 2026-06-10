import { useEffect, useRef } from 'react'
import { useViewerStore, sel } from '@/store/viewerStore'

// Manages DOM-level search highlight within the viewer element.
// Uses useRef for the viewer DOM node — we need direct DOM access
// because search highlights span across component boundaries.
export function useSearch() {
  const query = useViewerStore(sel.searchQuery)
  const currentMatchIndex = useViewerStore(sel.currentMatchIndex)
  const setMatchCount = useViewerStore(sel.setMatchCount)
  const viewerRef = useRef<HTMLDivElement>(null)
  const matchesRef = useRef<HTMLElement[]>([])

  // Re-highlight whenever query or viewer content changes
  useEffect(() => {
    if (!viewerRef.current) return
    clearHighlights(viewerRef.current)
    if (!query.trim()) { setMatchCount(0); return }
    const matches = highlight(viewerRef.current, query)
    matchesRef.current = matches
    setMatchCount(matches.length)
  }, [query, setMatchCount])

  // Scroll to current match whenever index changes
  useEffect(() => {
    const matches = matchesRef.current
    if (!matches.length || currentMatchIndex < 0) return
    matches.forEach((m, i) => m.classList.toggle('search-current', i === currentMatchIndex))
    matches[currentMatchIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentMatchIndex])

  return { viewerRef }
}

function clearHighlights(root: HTMLElement) {
  root.querySelectorAll('mark.search-hl').forEach((mark) => {
    const parent = mark.parentNode!
    parent.replaceChild(document.createTextNode(mark.textContent ?? ''), mark)
    parent.normalize()
  })
}

function highlight(root: HTMLElement, query: string): HTMLElement[] {
  const marks: HTMLElement[] = []
  const regex = new RegExp(escapeRegex(query), 'gi')

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? ''
      if (!regex.test(text)) return
      regex.lastIndex = 0
      const frag = document.createDocumentFragment()
      let last = 0
      let m: RegExpExecArray | null
      while ((m = regex.exec(text)) !== null) {
        frag.appendChild(document.createTextNode(text.slice(last, m.index)))
        const mark = document.createElement('mark')
        mark.className = 'search-hl'
        mark.style.cssText = 'background:rgba(255,214,0,0.35);color:inherit;border-radius:2px'
        mark.textContent = m[0]
        frag.appendChild(mark)
        marks.push(mark)
        last = m.index + m[0].length
      }
      frag.appendChild(document.createTextNode(text.slice(last)))
      node.parentNode!.replaceChild(frag, node)
      return
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      // Skip iframes and existing marks
      if (el.tagName === 'IFRAME' || el.tagName === 'MARK') return
      Array.from(node.childNodes).forEach(walk)
    }
  }

  walk(root)
  return marks
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
