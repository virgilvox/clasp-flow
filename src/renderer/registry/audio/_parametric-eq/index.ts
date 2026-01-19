import type { NodeDefinition } from '../../types'

export const parametricEqNode: NodeDefinition = {
  id: 'parametric-eq',
  name: 'Parametric EQ',
  version: '1.0.0',
  category: 'audio',
  description: '3-band parametric equalizer with visual frequency response and draggable bands',
  icon: 'sliders-horizontal',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
  ],
  outputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
  ],
  controls: [
    // Band 1 (Low)
    { id: 'freq1', type: 'number', label: 'Freq 1', default: 200, props: { min: 20, max: 20000, step: 1 } },
    { id: 'gain1', type: 'number', label: 'Gain 1', default: 0, props: { min: -24, max: 24, step: 0.1 } },
    { id: 'q1', type: 'number', label: 'Q 1', default: 1, props: { min: 0.1, max: 10, step: 0.1 } },
    // Band 2 (Mid)
    { id: 'freq2', type: 'number', label: 'Freq 2', default: 1000, props: { min: 20, max: 20000, step: 1 } },
    { id: 'gain2', type: 'number', label: 'Gain 2', default: 0, props: { min: -24, max: 24, step: 0.1 } },
    { id: 'q2', type: 'number', label: 'Q 2', default: 1, props: { min: 0.1, max: 10, step: 0.1 } },
    // Band 3 (High)
    { id: 'freq3', type: 'number', label: 'Freq 3', default: 5000, props: { min: 20, max: 20000, step: 1 } },
    { id: 'gain3', type: 'number', label: 'Gain 3', default: 0, props: { min: -24, max: 24, step: 0.1 } },
    { id: 'q3', type: 'number', label: 'Q 3', default: 1, props: { min: 0.1, max: 10, step: 0.1 } },
  ],
}

// Export the custom node component
export { default as ParametricEqNode } from './ParametricEqNode.vue'
