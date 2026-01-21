import type { NodeDefinition } from '../types'

export const sampleHoldNode: NodeDefinition = {
  id: 'sample-hold',
  name: 'Sample & Hold',
  version: '1.0.0',
  category: 'logic',
  description: 'Sample value when triggered, hold until next trigger',
  icon: 'pin',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'value', type: 'any', label: 'Value' },
    { id: 'trigger', type: 'trigger', label: 'Trigger' },
  ],
  outputs: [{ id: 'result', type: 'any', label: 'Result' }],
  controls: [],
  tags: ['sample', 'hold', 'latch', 'capture'],
}
