import { create } from 'zustand'
import type { ViewerState, FileType, Theme } from '@/types'

interface ViewerStore {
  // State
  viewerState: ViewerState
  rawContent: string
  searchQuery: string
  matchCount: number
  currentMatchIndex: number
  theme: Theme

  // File actions
  setFile: (content: string, fileName: string, fileType: FileType) => void
  setBinary: (fileName: string, ext: string) => void
  setError: (message: string) => void
  clear: () => void

  // Search actions
  setSearchQuery: (query: string) => void
  setMatchCount: (count: number) => void
  nextMatch: () => void
  prevMatch: () => void
  clearSearch: () => void

  // Theme
  toggleTheme: () => void
}

export const useViewerStore = create<ViewerStore>((set, get) => ({
  viewerState: { status: 'idle' },
  rawContent: '',
  searchQuery: '',
  matchCount: 0,
  currentMatchIndex: -1,
  theme: 'dark',

  setFile: (content, fileName, fileType) => set({
    rawContent: content,
    viewerState: { status: 'loaded', content, fileName, fileType },
    searchQuery: '',
    matchCount: 0,
    currentMatchIndex: -1,
  }),

  setBinary: (fileName, ext) => set({
    rawContent: '',
    viewerState: { status: 'binary', fileName, ext },
    searchQuery: '',
    matchCount: 0,
    currentMatchIndex: -1,
  }),

  setError: (message) => set({ viewerState: { status: 'error', message } }),

  clear: () => set({
    viewerState: { status: 'idle' },
    rawContent: '',
    searchQuery: '',
    matchCount: 0,
    currentMatchIndex: -1,
  }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setMatchCount: (count) => set({
    matchCount: count,
    currentMatchIndex: count > 0 ? 0 : -1,
  }),

  nextMatch: () => {
    const { matchCount, currentMatchIndex } = get()
    if (matchCount === 0) return
    set({ currentMatchIndex: (currentMatchIndex + 1) % matchCount })
  },

  prevMatch: () => {
    const { matchCount, currentMatchIndex } = get()
    if (matchCount === 0) return
    set({ currentMatchIndex: (currentMatchIndex - 1 + matchCount) % matchCount })
  },

  clearSearch: () => set({ searchQuery: '', matchCount: 0, currentMatchIndex: -1 }),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('light', next === 'light')
    set({ theme: next })
  },
}))

// Selectors — use these in components to prevent unnecessary re-renders.
// Components only re-render when their specific slice changes.
export const sel = {
  viewerState: (s: ViewerStore) => s.viewerState,
  rawContent: (s: ViewerStore) => s.rawContent,
  searchQuery: (s: ViewerStore) => s.searchQuery,
  matchCount: (s: ViewerStore) => s.matchCount,
  currentMatchIndex: (s: ViewerStore) => s.currentMatchIndex,
  theme: (s: ViewerStore) => s.theme,
  setFile: (s: ViewerStore) => s.setFile,
  setBinary: (s: ViewerStore) => s.setBinary,
  setError: (s: ViewerStore) => s.setError,
  clear: (s: ViewerStore) => s.clear,
  setSearchQuery: (s: ViewerStore) => s.setSearchQuery,
  setMatchCount: (s: ViewerStore) => s.setMatchCount,
  nextMatch: (s: ViewerStore) => s.nextMatch,
  prevMatch: (s: ViewerStore) => s.prevMatch,
  clearSearch: (s: ViewerStore) => s.clearSearch,
  toggleTheme: (s: ViewerStore) => s.toggleTheme,
}
