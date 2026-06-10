# TextViewer

A local file viewer that renders or syntax-highlights any text file in the browser. No server, no upload, nothing leaves your machine.

## Supported Formats

| Type | Rendering |
|---|---|
| `.md` | Rendered markdown |
| `.json` `.xml` `.yaml` | Collapsible tree |
| `.csv` | Sticky-header table |
| `.html` | Live preview + source toggle |
| `.js` `.ts` `.py` `.cs` `.sh` `.sql` `.toml` `.env` `.ini` `.log` | Syntax highlighted |
| Any other text file | Plain text with line numbers |
| Binary files | Blocked with warning |

## Getting Started

```bash
npm install
npm run dev
```

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once (used in CI)
npm run type-check   # TypeScript check without building
```

## Stack

React 18 · TypeScript · Vite · Tailwind CSS v4 · Zustand · shadcn/ui · Vitest
