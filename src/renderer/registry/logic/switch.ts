import type { NodeDefinition } from '../types'

export const switchNode: NodeDefinition = {
  id: 'switch',
  name: 'Switch',
  version: '1.0.0',
  category: 'logic',
  description: 'Select between two values',
  icon: 'git-branch',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'condition', type: 'boolean', label: 'Condition' },
    { id: 'true', type: 'any', label: 'True' },
    { id: 'false', type: 'any', label: 'False' },
  ],
  outputs: [{ id: 'result', type: 'any', label: 'Result' }],
  controls: [],
}
