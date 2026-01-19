import type { NodeDefinition } from '../../types'

export const envelopeVisualNode: NodeDefinition = {
  id: 'envelope-visual',
  name: 'Envelope Editor',
  version: '1.0.0',
  category: 'audio',
  description: 'Visual ADSR envelope with draggable curve control points',
  icon: 'trending-up',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'trigger', type: 'trigger', label: 'Trigger' },
    { id: 'release', type: 'trigger', label: 'Release' },
  ],
  outputs: [
    { id: 'envelope', type: 'audio', label: 'Envelope' },
    { id: 'value', type: 'number', label: 'Value' },
  ],
  controls: [
    { id: 'attack', type: 'number', label: 'Attack', default: 0.01, props: { min: 0.001, max: 2, step: 0.001 } },
    { id: 'decay', type: 'number', label: 'Decay', default: 0.1, props: { min: 0.001, max: 2, step: 0.001 } },
    { id: 'sustain', type: 'number', label: 'Sustain', default: 0.5, props: { min: 0, max: 1, step: 0.01 } },
    { id: 'release', type: 'number', label: 'Release', default: 0.3, props: { min: 0.001, max: 5, step: 0.001 } },
  ],
}

// Export the custom node component
export { default as EnvelopeVisualNode } from './EnvelopeVisualNode.vue'
