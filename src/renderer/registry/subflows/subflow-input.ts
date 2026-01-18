import type { NodeDefinition } from '../types'

export const subflowInputNode: NodeDefinition = {
  id: 'subflow-input',
  name: 'Subflow Input',
  version: '1.0.0',
  category: 'subflows',
  description: 'Input port for a subflow',
  icon: 'log-in',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [
    { id: 'value', type: 'any', label: 'Value' },
  ],
  controls: [
    { id: 'portName', type: 'text', label: 'Port Name', default: 'input' },
    { id: 'portType', type: 'select', label: 'Type', default: 'any', props: { options: ['any', 'number', 'string', 'boolean', 'trigger', 'audio', 'texture', 'data'] } },
    { id: 'defaultValue', type: 'text', label: 'Default', default: '' },
  ],
}
