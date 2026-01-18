import { describe, it, expect } from 'vitest'
import { fuzzyMatch, fuzzySearch } from '@/utils/fuzzySearch'

describe('fuzzySearch utility', () => {
  describe('fuzzyMatch', () => {
    it('matches exact strings', () => {
      const result = fuzzyMatch('test', 'test')
      expect(result).not.toBeNull()
      expect(result!.matches).toEqual([0, 1, 2, 3])
    })

    it('matches substring at start', () => {
      const result = fuzzyMatch('tes', 'testing')
      expect(result).not.toBeNull()
      expect(result!.matches).toEqual([0, 1, 2])
    })

    it('matches characters spread across the string', () => {
      const result = fuzzyMatch('mrg', 'Map Range')
      expect(result).not.toBeNull()
      // Should match M, R, g
    })

    it('matches case insensitively', () => {
      const result = fuzzyMatch('TEST', 'test')
      expect(result).not.toBeNull()
    })

    it('returns null for non-matching strings', () => {
      const result = fuzzyMatch('xyz', 'test')
      expect(result).toBeNull()
    })

    it('returns null when query is longer than target', () => {
      const result = fuzzyMatch('testing', 'test')
      expect(result).toBeNull()
    })

    it('returns match for empty query', () => {
      const result = fuzzyMatch('', 'test')
      expect(result).not.toBeNull()
      expect(result!.matches).toEqual([])
    })

    it('gives higher score to consecutive matches', () => {
      const consecutive = fuzzyMatch('abc', 'abcdef')
      const spread = fuzzyMatch('abc', 'a_b_c_')
      expect(consecutive).not.toBeNull()
      expect(spread).not.toBeNull()
      expect(consecutive!.score).toBeGreaterThan(spread!.score)
    })

    it('gives higher score to word start matches', () => {
      const wordStart = fuzzyMatch('mr', 'Map Range')
      const middle = fuzzyMatch('ap', 'Map Range')
      expect(wordStart).not.toBeNull()
      expect(middle).not.toBeNull()
      expect(wordStart!.score).toBeGreaterThan(middle!.score)
    })
  })

  describe('fuzzySearch', () => {
    const items = [
      { name: 'Constant', category: 'inputs' },
      { name: 'Map Range', category: 'math' },
      { name: 'Audio Input', category: 'audio' },
      { name: 'Monitor', category: 'debug' },
      { name: 'Slider', category: 'inputs' },
    ]

    it('returns all items for empty query', () => {
      const results = fuzzySearch(items, '', item => item.name)
      expect(results.length).toBe(items.length)
    })

    it('filters to matching items', () => {
      const results = fuzzySearch(items, 'const', item => item.name)
      expect(results.length).toBe(1)
      expect(results[0].item.name).toBe('Constant')
    })

    it('searches multiple fields', () => {
      const results = fuzzySearch(items, 'aud', item => [item.name, item.category])
      // Should match 'Audio Input' by name
      expect(results.some(r => r.item.name === 'Audio Input')).toBe(true)
    })

    it('sorts by score descending', () => {
      const results = fuzzySearch(items, 'in', item => item.name)
      // Should find items containing 'in'
      expect(results.length).toBeGreaterThan(0)

      // Scores should be in descending order
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score)
      }
    })

    it('handles fuzzy matching across strings', () => {
      const results = fuzzySearch(items, 'mrg', item => item.name)
      expect(results.some(r => r.item.name === 'Map Range')).toBe(true)
    })
  })
})
