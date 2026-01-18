import type { NodeDefinition } from '../types'

export const sampleHoldNode: NodeDefinition = {
  id: 'sample-hold',
  name: 'Sample & Hold',
  version: '1.0.0',
  category: 'code',
  description: 'Capture and hold value on trigger',
  icon: 'clipboard',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'input', type: 'any', label: 'Input' },
    { id: 'trigger', type: 'trigger', label: 'Sample' },
  ],
  outputs: [
    { id: 'output', type: 'any', label: 'Output' },
  ],
  controls: [],
}
