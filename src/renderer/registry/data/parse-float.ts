import type { NodeDefinition } from '../types'

export const parseFloatNode: NodeDefinition = {
  id: 'parse-float',
  name: 'Parse Float',
  version: '1.0.0',
  category: 'data',
  description: 'Parse string to floating point number',
  icon: 'percent',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'string', label: 'Value' }],
  outputs: [
    { id: 'result', type: 'number', label: 'Result' },
    { id: 'valid', type: 'boolean', label: 'Valid' },
  ],
  controls: [
    { id: 'default', type: 'number', label: 'Default', default: 0 },
  ],
  tags: ['parse', 'float', 'decimal', 'convert'],
  info: {
    overview: 'Parses a string into a floating-point number. Returns the parsed value and a boolean indicating whether the conversion was valid. A configurable default is returned when parsing fails.',
    tips: [
      'Use the valid output to filter out non-numeric strings before performing math.',
      'Prefer this over To Number when you specifically need decimal precision from string input.',
    ],
    pairsWith: ['format-number', 'to-number', 'expression', 'compare'],
  },
}
