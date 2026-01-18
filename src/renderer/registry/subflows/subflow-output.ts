import type { NodeDefinition } from '../types'

export const subflowOutputNode: NodeDefinition = {
  id: 'subflow-output',
  name: 'Subflow Output',
  version: '1.0.0',
  category: 'subflows',
  description: 'Output port for a subflow',
  icon: 'log-out',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'value', type: 'any', label: 'Value' },
  ],
  outputs: [],
  controls: [
    { id: 'portName', type: 'text', label: 'Port Name', default: 'output' },
    { id: 'portType', type: 'select', label: 'Type', default: 'any', props: { options: ['any', 'number', 'string', 'boolean', 'trigger', 'audio', 'texture', 'data'] } },
  ],
}
