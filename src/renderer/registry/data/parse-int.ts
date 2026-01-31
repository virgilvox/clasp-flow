import type { NodeDefinition } from '../types'

export const parseIntNode: NodeDefinition = {
  id: 'parse-int',
  name: 'Parse Int',
  version: '1.0.0',
  category: 'data',
  description: 'Parse string to integer with radix support',
  icon: 'binary',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'string', label: 'Value' }],
  outputs: [
    { id: 'result', type: 'number', label: 'Result' },
    { id: 'valid', type: 'boolean', label: 'Valid' },
  ],
  controls: [
    { id: 'radix', type: 'number', label: 'Radix', default: 10 },
    { id: 'default', type: 'number', label: 'Default', default: 0 },
  ],
  tags: ['parse', 'integer', 'hex', 'binary', 'convert'],
  info: {
    overview: 'Parses a string into an integer with configurable radix (base). Supports decimal, hexadecimal, binary, and other bases. Returns the parsed integer and a validity flag.',
    tips: [
      'Set the radix to 16 to parse hexadecimal color codes or other hex strings.',
      'Use the valid output to catch and handle non-numeric input before it reaches downstream nodes.',
    ],
    pairsWith: ['parse-float', 'to-number', 'format-number', 'expression'],
  },
}
