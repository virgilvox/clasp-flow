import type { NodeDefinition } from '../types'

export const stringConcatNode: NodeDefinition = {
  id: 'string-concat',
  name: 'String Concat',
  version: '1.0.0',
  category: 'string',
  description: 'Concatenate multiple strings',
  icon: 'plus',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'string', label: 'A' },
    { id: 'b', type: 'string', label: 'B' },
    { id: 'c', type: 'string', label: 'C' },
    { id: 'd', type: 'string', label: 'D' },
  ],
  outputs: [
    { id: 'result', type: 'string', label: 'Result' },
  ],
  controls: [
    { id: 'separator', type: 'text', label: 'Separator', default: '' },
  ],
  info: {
    overview: 'Joins up to four strings together with an optional separator between them. Empty inputs are skipped. This is the simplest way to combine multiple text values into one output string.',
    tips: [
      'Set the separator to a newline character to join lines of text.',
      'Leave unused inputs disconnected and they will be ignored.',
    ],
    pairsWith: ['string-template', 'string-split', 'string-trim', 'string-case'],
  },
}
