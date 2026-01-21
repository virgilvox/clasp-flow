import type { NodeDefinition } from '../types'

export const passIfNode: NodeDefinition = {
  id: 'pass-if',
  name: 'Pass If',
  version: '1.0.0',
  category: 'logic',
  description: 'Pass value through only if condition is met',
  icon: 'filter',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'value', type: 'any', label: 'Value' },
    { id: 'condition', type: 'boolean', label: 'Condition' },
  ],
  outputs: [{ id: 'result', type: 'any', label: 'Result' }],
  controls: [
    {
      id: 'mode',
      type: 'select',
      label: 'Mode',
      default: 'when-true',
      props: { options: ['when-true', 'when-false', 'when-not-null', 'when-not-empty'] },
    },
  ],
  tags: ['conditional', 'filter', 'gate', 'pass', 'block'],
}
