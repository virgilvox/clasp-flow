import type { NodeDefinition } from '../types'

export const stringStartsEndsNode: NodeDefinition = {
  id: 'string-starts-ends',
  name: 'Starts/Ends With',
  version: '1.0.0',
  category: 'string',
  description: 'Check if string starts or ends with substring',
  icon: 'arrow-right-from-line',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'string', label: 'Input' },
    { id: 'search', type: 'string', label: 'Search' },
  ],
  outputs: [
    { id: 'startsWith', type: 'boolean', label: 'Starts With' },
    { id: 'endsWith', type: 'boolean', label: 'Ends With' },
  ],
  controls: [
    { id: 'caseSensitive', type: 'toggle', label: 'Case Sensitive', default: true },
  ],
  tags: ['prefix', 'suffix', 'starts', 'ends', 'begins'],
}
