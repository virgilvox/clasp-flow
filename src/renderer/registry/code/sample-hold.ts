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
  info: {
    overview: 'Captures the current value of its input only when the trigger fires, then holds that value until the next trigger. This is useful for freezing a continuously changing signal at a specific moment. The output stays constant between triggers regardless of input changes.',
    tips: [
      'Pair with an interval node to sample a signal at a fixed rate.',
      'Use with a random or oscillator source to generate stepped random sequences.',
      'Chain multiple sample-hold nodes with offset triggers for a shift-register effect.',
    ],
    pairsWith: ['trigger', 'interval', 'oscillator', 'lfo'],
  },
}
