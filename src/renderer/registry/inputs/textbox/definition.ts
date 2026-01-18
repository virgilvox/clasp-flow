import type { NodeDefinition } from '../../types'

export const textboxNode: NodeDefinition = {
  id: 'textbox',
  name: 'Textbox',
  version: '1.0.0',
  category: 'inputs',
  description: 'Resizable text input that outputs a string',
  icon: 'type',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'trigger', type: 'trigger', label: 'Trigger' },
  ],
  outputs: [{ id: 'text', type: 'string', label: 'Text' }],
  controls: [
    { id: 'text', type: 'text', label: 'Text', default: '' },
    { id: 'height', type: 'number', label: 'Height', default: 100 },
  ],
}
