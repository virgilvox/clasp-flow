import type { NodeDefinition } from '../types'

export const debounceNode: NodeDefinition = {
  id: 'debounce',
  name: 'Debounce',
  version: '1.0.0',
  category: 'data',
  description: 'Only output value after it stops changing for a period',
  icon: 'timer',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'result', type: 'any', label: 'Result' }],
  controls: [
    { id: 'delay', type: 'number', label: 'Delay (ms)', default: 300 },
  ],
  tags: ['debounce', 'delay', 'wait', 'settle'],
}
