import type { NodeDefinition } from '../types'

export const formatNumberNode: NodeDefinition = {
  id: 'format-number',
  name: 'Format Number',
  version: '1.0.0',
  category: 'data',
  description: 'Format number with locale and options',
  icon: 'coins',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'number', label: 'Value' }],
  outputs: [{ id: 'result', type: 'string', label: 'Result' }],
  controls: [
    {
      id: 'style',
      type: 'select',
      label: 'Style',
      default: 'decimal',
      props: { options: ['decimal', 'percent', 'currency'] },
    },
    { id: 'currency', type: 'text', label: 'Currency', default: 'USD' },
    { id: 'decimals', type: 'number', label: 'Decimals', default: 2 },
  ],
  tags: ['format', 'number', 'currency', 'percent', 'locale'],
  info: {
    overview: 'Formats a number as a locale-aware string with support for decimal, percent, and currency styles. You can control the number of decimal places and the currency code. The output is a display-ready string.',
    tips: [
      'Set the style to "currency" and specify a currency code like "EUR" or "JPY" for localized money formatting.',
      'Use the decimals control to round values for cleaner display output.',
    ],
    pairsWith: ['to-number', 'parse-float', 'expression', 'to-string'],
  },
}
