import type { NodeDefinition } from '../types'

export const typeOfNode: NodeDefinition = {
  id: 'type-of',
  name: 'Type Of',
  version: '1.0.0',
  category: 'logic',
  description: 'Get the type of a value',
  icon: 'tag',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'value', type: 'any', label: 'Value' }],
  outputs: [{ id: 'type', type: 'string', label: 'Type' }],
  controls: [],
  tags: ['type', 'typeof', 'check', 'inspect'],
}
