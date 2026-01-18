import type { NodeDefinition } from '../types'

export const templateNode: NodeDefinition = {
  id: 'template',
  name: 'Template',
  version: '1.0.0',
  category: 'code',
  description: 'String template with variable interpolation',
  icon: 'text-cursor-input',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'any', label: 'A' },
    { id: 'b', type: 'any', label: 'B' },
    { id: 'c', type: 'any', label: 'C' },
    { id: 'd', type: 'any', label: 'D' },
  ],
  outputs: [
    { id: 'output', type: 'string', label: 'Output' },
  ],
  controls: [
    { id: 'template', type: 'text', label: 'Template', default: 'Value: {{a}}', props: { placeholder: 'Use {{varname}} for interpolation' } },
  ],
}
