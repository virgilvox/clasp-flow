import type { NodeDefinition } from '../types'

export const jsonStringifyNode: NodeDefinition = {
  id: 'json-stringify',
  name: 'JSON Stringify',
  version: '1.0.0',
  category: 'data',
  description: 'Convert object to JSON string',
  icon: 'braces',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'data', label: 'Object' },
  ],
  outputs: [
    { id: 'output', type: 'string', label: 'JSON String' },
  ],
  controls: [
    { id: 'pretty', type: 'toggle', label: 'Pretty Print', default: false },
  ],
}
