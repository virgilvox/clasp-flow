import type { NodeDefinition } from '../types'

export const toStringNode: NodeDefinition = {
  id: 'to-string',
  name: 'To String',
  version: '1.0.0',
  category: 'data',
  description: 'Convert any value to string',
  icon: 'type',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'result', type: 'string', label: 'Result' }],
  controls: [
    {
      id: 'format',
      type: 'select',
      label: 'Format',
      default: 'default',
      props: { options: ['default', 'json', 'fixed'] },
    },
    { id: 'precision', type: 'number', label: 'Precision', default: 2 },
  ],
  tags: ['convert', 'string', 'format', 'stringify'],
  info: {
    overview: 'Converts any value to a string representation. Supports default conversion, JSON serialization, and fixed-precision numeric formatting. The precision control applies only in fixed mode.',
    tips: [
      'Use json format mode for objects and arrays to get a complete string representation.',
      'Use fixed mode with a precision of 0 to display whole numbers without decimal places.',
    ],
    pairsWith: ['to-number', 'json-stringify', 'format-number', 'array-join'],
  },
}
