import { describe, it, expect } from 'vitest'
import { detectType } from '@/lib/detectType'

describe('detectType', () => {
  it('detects by extension first', () => {
    expect(detectType('json', '{}')).toBe('json')
    expect(detectType('md', '{}')).toBe('md') // ext wins over content
    expect(detectType('py', 'SELECT * FROM foo')).toBe('py') // ext wins
  })

  it('falls back to content detection for unknown extensions', () => {
    expect(detectType('xyz', '{ "key": "value" }')).toBe('json')
    expect(detectType('xyz', '<root><child/></root>')).toBe('xml')
    expect(detectType('xyz', '# Hello\n\nThis is markdown')).toBe('md')
    expect(detectType('xyz', 'SELECT * FROM users WHERE id = 1')).toBe('sql')
  })

  it('returns plain for truly unknown content', () => {
    expect(detectType('xyz', 'just some random text with no patterns')).toBe('plain')
  })
})
