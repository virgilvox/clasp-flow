import type { NodeDefinition } from '../types'

export const consoleNode: NodeDefinition = {
  id: 'console',
  name: 'Console',
  version: '1.0.0',
  category: 'debug',
  description: 'Log value to console',
  icon: 'terminal',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [],
  controls: [
    { id: 'label', type: 'text', label: 'Label', default: 'Log' },
    { id: 'logOnChange', type: 'toggle', label: 'On Change', default: true },
  ],
}
