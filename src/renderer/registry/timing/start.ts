import type { NodeDefinition } from '../types'

export const startNode: NodeDefinition = {
  id: 'start',
  name: 'Start',
  version: '1.0.0',
  category: 'timing',
  description: 'Fires once when flow starts running',
  icon: 'play',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [{ id: 'trigger', type: 'trigger', label: 'Trigger' }],
  controls: [],
}
