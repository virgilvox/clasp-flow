import type { NodeDefinition } from '../types'

export const stringCaseNode: NodeDefinition = {
  id: 'string-case',
  name: 'String Case',
  version: '1.0.0',
  category: 'string',
  description: 'Convert string case',
  icon: 'case-upper',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'string', label: 'Input' },
  ],
  outputs: [
    { id: 'result', type: 'string', label: 'Result' },
  ],
  controls: [
    {
      id: 'mode',
      type: 'select',
      label: 'Mode',
      default: 'UPPER',
      props: {
        options: ['UPPER', 'lower', 'Title', 'camelCase', 'snake_case', 'kebab-case'],
      },
    },
  ],
  info: {
    overview: 'Converts a string between different casing conventions. Supports uppercase, lowercase, title case, camelCase, snake_case, and kebab-case. Useful for formatting identifiers, labels, or display text.',
    tips: [
      'Use snake_case or kebab-case modes to normalize user input into valid identifiers.',
      'Chain with String Template to format case-converted values into larger strings.',
    ],
    pairsWith: ['string-template', 'string-concat', 'string-replace', 'string-trim'],
  },
}
