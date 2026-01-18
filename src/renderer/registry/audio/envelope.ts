import type { NodeDefinition } from '../types'

export const envelopeNode: NodeDefinition = {
  id: 'envelope',
  name: 'Envelope (ADSR)',
  version: '1.0.0',
  category: 'audio',
  description: 'ADSR amplitude envelope',
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
    { id: 'attack', type: 'slider', label: 'Attack', default: 0.01, props: { min: 0.001, max: 2, step: 0.001 } },
    { id: 'decay', type: 'slider', label: 'Decay', default: 0.1, props: { min: 0.001, max: 2, step: 0.001 } },
    { id: 'sustain', type: 'slider', label: 'Sustain', default: 0.5, props: { min: 0, max: 1, step: 0.01 } },
    { id: 'release', type: 'slider', label: 'Release', default: 0.3, props: { min: 0.001, max: 5, step: 0.001 } },
  ],
}
