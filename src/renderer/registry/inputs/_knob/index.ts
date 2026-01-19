import type { NodeDefinition } from '../../types'

export const knobNode: NodeDefinition = {
  id: 'knob',
  name: 'Knob',
  version: '1.0.0',
  category: 'inputs',
  description: 'Rotary knob control (0-1)',
  icon: 'disc',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [{ id: 'value', type: 'number', label: 'Value' }],
  controls: [
    { id: 'value', type: 'slider', label: 'Value', default: 0.5, exposable: true, props: { min: 0, max: 1, step: 0.01 } },
    { id: 'min', type: 'number', label: 'Min', default: 0 },
    { id: 'max', type: 'number', label: 'Max', default: 1 },
  ],
}

// Export the custom node component
export { default as KnobNode } from './KnobNode.vue'
