import type { FileType } from '@/types'

// Explicit extension → type map. Always wins over content detection.
const EXT_MAP: Record<string, FileType> = {
  md: 'md', markdown: 'md',
  json: 'json', jsonc: 'json',
  xml: 'xml', xsl: 'xml', xslt: 'xml', xsd: 'xml',
  yaml: 'yaml', yml: 'yaml',
  csv: 'csv', tsv: 'csv',
  html: 'html', htm: 'html',
  js: 'js', jsx: 'js', mjs: 'js', cjs: 'js',
  ts: 'ts', tsx: 'ts',
  py: 'py', pyw: 'py',
  cs: 'cs',
  sh: 'sh', bash: 'sh', zsh: 'sh', fish: 'sh',
  sql: 'sql',
  toml: 'toml',
  env: 'env',
  ini: 'ini', cfg: 'ini', conf: 'ini', properties: 'ini',
  log: 'log', txt: 'plain',
}

// Runs only for unknown extensions — inspects first 500 chars of content.
function detectFromContent(content: string): FileType {
  const t = content.trimStart().slice(0, 500)
  if (t.startsWith('{') || t.startsWith('[')) return 'json'
  if (t.startsWith('<')) return /<!DOCTYPE|<html/i.test(t) ? 'html' : 'xml'
  if (/^#{1,6} /.test(t) || /^\*\*/.test(t)) return 'md'
  if (/^(import|export|const|let|var|function|class)\b/.test(t)) return 'js'
  if (/^(def |class |from |import |@)/.test(t)) return 'py'
  if (/^(using |namespace |public class|private |protected )/.test(t)) return 'cs'
  if (/^#!.*\b(sh|bash|zsh|fish)\b/.test(t) || /^(echo |export |if \[)/.test(t)) return 'sh'
  if (/^[A-Z_]+=/.test(t)) return 'env'
  if (/^\s*\[[\w\s]+\]/.test(t) && t.includes('=')) return 'ini'
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(t)) return 'sql'
  if (/^---/.test(t) || /^[\w-]+:\s/.test(t)) return 'yaml'
  if (t.split('\n')[0].includes(',')) return 'csv'
  return 'plain'
}

export function detectType(ext: string, content: string): FileType {
  const mapped = EXT_MAP[ext.toLowerCase()]
  if (mapped) return mapped
  return detectFromContent(content)
}
