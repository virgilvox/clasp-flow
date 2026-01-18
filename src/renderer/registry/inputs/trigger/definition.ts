import type { NodeDefinition } from '@/stores/nodes'

export const triggerNode: NodeDefinition = {
  id: 'trigger',
  name: 'Trigger',
  version: '1.0.0',
  category: 'inputs',
  description: 'Manual trigger button with various output types',
  icon: 'zap',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [{ id: 'trigger', type: 'trigger', label: 'Trigger' }],
  controls: [
    { id: 'outputType', type: 'select', label: 'Type', default: 'boolean', props: { options: ['boolean', 'number', 'string', 'json', 'timestamp'] } },
    { id: 'value', type: 'toggle', label: 'Value', default: false },
    { id: 'stringValue', type: 'text', label: 'String Value', default: '' },
    { id: 'jsonValue', type: 'text', label: 'JSON Value', default: '{}' },
  ],
}
