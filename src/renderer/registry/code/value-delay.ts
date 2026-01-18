import type { NodeDefinition } from '../types'

export const valueDelayNode: NodeDefinition = {
  id: 'value-delay',
  name: 'Value Delay',
  version: '1.0.0',
  category: 'code',
  description: 'Delay value by N frames',
  icon: 'timer',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'any', label: 'Input' },
  ],
  outputs: [
    { id: 'output', type: 'any', label: 'Output' },
  ],
  controls: [
    { id: 'frames', type: 'number', label: 'Frames', default: 1, props: { min: 1, max: 300 } },
  ],
}
