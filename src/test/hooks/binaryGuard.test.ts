import { describe, it, expect } from 'vitest'
import { isBinary } from '@/lib/binaryGuard'

describe('isBinary', () => {
  it('returns true for known binary extensions', () => {
    expect(isBinary('pdf')).toBe(true)
    expect(isBinary('exe')).toBe(true)
    expect(isBinary('png')).toBe(true)
    expect(isBinary('ZIP')).toBe(true) // case insensitive
  })

  it('returns false for text extensions', () => {
    expect(isBinary('json')).toBe(false)
    expect(isBinary('md')).toBe(false)
    expect(isBinary('ts')).toBe(false)
    expect(isBinary('sql')).toBe(false)
  })

  it('returns false for unknown extensions', () => {
    expect(isBinary('xyz')).toBe(false)
    expect(isBinary('')).toBe(false)
  })
})
