import type { NodeDefinition } from '../types'

export const changedNode: NodeDefinition = {
  id: 'changed',
  name: 'Changed',
  version: '1.0.0',
  category: 'logic',
  description: 'Only output when value changes from previous',
  icon: 'diff',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [
    { id: 'result', type: 'any', label: 'Result' },
    { id: 'changed', type: 'boolean', label: 'Changed' },
  ],
  controls: [],
  tags: ['detect', 'change', 'state', 'difference'],
}
