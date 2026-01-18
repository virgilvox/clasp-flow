/**
 * Simple fuzzy search implementation
 * Matches if all characters in the query appear in order in the target
 */

export interface FuzzyMatch {
  score: number
  matches: number[] // Indices of matched characters
}

/**
 * Perform fuzzy matching
 * Returns null if no match, otherwise returns match info with score
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatch | null {
  const queryLower = query.toLowerCase()
  const targetLower = target.toLowerCase()

  if (queryLower.length === 0) {
    return { score: 1, matches: [] }
  }

  if (queryLower.length > targetLower.length) {
    return null
  }

  const matches: number[] = []
  let queryIndex = 0
  let score = 0
  let consecutiveBonus = 0
  let prevMatchIndex = -1

  for (let targetIndex = 0; targetIndex < targetLower.length && queryIndex < queryLower.length; targetIndex++) {
    if (targetLower[targetIndex] === queryLower[queryIndex]) {
      matches.push(targetIndex)

      // Base score for match
      score += 1

      // Bonus for consecutive matches
      if (prevMatchIndex === targetIndex - 1) {
        consecutiveBonus += 1
        score += consecutiveBonus
      } else {
        consecutiveBonus = 0
      }

      // Bonus for matching at word start
      if (targetIndex === 0 || /[\s\-_]/.test(target[targetIndex - 1])) {
        score += 2
      }

      // Bonus for exact case match
      if (target[targetIndex] === query[queryIndex]) {
        score += 0.5
      }

      prevMatchIndex = targetIndex
      queryIndex++
    }
  }

  // All query characters must be matched
  if (queryIndex !== queryLower.length) {
    return null
  }

  // Normalize score by query length and add penalty for longer targets
  const normalizedScore = score / queryLower.length - (targetLower.length - queryLower.length) * 0.01

  return {
    score: normalizedScore,
    matches,
  }
}

/**
 * Search through items with fuzzy matching
 */
export function fuzzySearch<T>(
  items: T[],
  query: string,
  getSearchText: (item: T) => string | string[]
): Array<{ item: T; score: number; matches: number[] }> {
  if (!query.trim()) {
    return items.map(item => ({ item, score: 1, matches: [] }))
  }

  const results: Array<{ item: T; score: number; matches: number[] }> = []

  for (const item of items) {
    const searchTexts = getSearchText(item)
    const texts = Array.isArray(searchTexts) ? searchTexts : [searchTexts]

    let bestMatch: FuzzyMatch | null = null

    for (const text of texts) {
      const match = fuzzyMatch(query, text)
      if (match && (!bestMatch || match.score > bestMatch.score)) {
        bestMatch = match
      }
    }

    if (bestMatch) {
      results.push({
        item,
        score: bestMatch.score,
        matches: bestMatch.matches,
      })
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score)

  return results
}
