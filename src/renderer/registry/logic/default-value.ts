import type { NodeDefinition } from '../types'

export const defaultValueNode: NodeDefinition = {
  id: 'default-value',
  name: 'Default',
  version: '1.0.0',
  category: 'logic',
  description: 'Return input value, or default if null/undefined/empty',
  icon: 'shield-check',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'result', type: 'any', label: 'Result' }],
  controls: [
    { id: 'default', type: 'text', label: 'Default', default: '' },
    { id: 'treatEmptyAsNull', type: 'toggle', label: 'Empty=Null', default: true },
  ],
  tags: ['fallback', 'default', 'null', 'coalesce'],
}
