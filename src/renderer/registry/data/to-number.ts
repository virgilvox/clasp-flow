import type { NodeDefinition } from '../types'

export const toNumberNode: NodeDefinition = {
  id: 'to-number',
  name: 'To Number',
  version: '1.0.0',
  category: 'data',
  description: 'Convert value to number',
  icon: 'hash',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [
    { id: 'result', type: 'number', label: 'Result' },
    { id: 'valid', type: 'boolean', label: 'Valid' },
  ],
  controls: [
    { id: 'default', type: 'number', label: 'Default', default: 0 },
  ],
  tags: ['convert', 'number', 'parse', 'cast'],
  info: {
    overview: 'Converts any value to a number. Strings are parsed, booleans become 0 or 1, and invalid values fall back to the configurable default. The valid output indicates whether the conversion succeeded.',
    tips: [
      'Set a sensible default to prevent NaN from propagating through math operations.',
      'Use Parse Int or Parse Float instead when you need more control over the parsing behavior.',
    ],
    pairsWith: ['parse-int', 'parse-float', 'format-number', 'expression'],
  },
}
