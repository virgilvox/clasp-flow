import type { NodeDefinition } from '../types'

export const jsonParseNode: NodeDefinition = {
  id: 'json-parse',
  name: 'JSON Parse',
  version: '1.0.0',
  category: 'data',
  description: 'Parse JSON string to object',
  icon: 'braces',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'string', label: 'JSON String' },
  ],
  outputs: [
    { id: 'output', type: 'data', label: 'Object' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'path', type: 'text', label: 'Path', default: '', props: { placeholder: 'e.g., data.items[0]' } },
  ],
}
