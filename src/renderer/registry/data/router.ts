import type { NodeDefinition } from '../types'

export const routerNode: NodeDefinition = {
  id: 'router',
  name: 'Router',
  version: '1.0.0',
  category: 'data',
  description: 'Route value to one of multiple outputs based on index',
  icon: 'git-branch',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'value', type: 'any', label: 'Value' },
    { id: 'route', type: 'number', label: 'Route' },
  ],
  outputs: [
    { id: 'out0', type: 'any', label: 'Out 0' },
    { id: 'out1', type: 'any', label: 'Out 1' },
    { id: 'out2', type: 'any', label: 'Out 2' },
    { id: 'out3', type: 'any', label: 'Out 3' },
  ],
  controls: [],
  tags: ['router', 'demux', 'switch', 'route', 'split'],
}
