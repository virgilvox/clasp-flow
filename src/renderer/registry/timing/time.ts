import type { NodeDefinition } from '../types'

export const timeNode: NodeDefinition = {
  id: 'time',
  name: 'Time',
  version: '1.0.0',
  category: 'timing',
  description: 'Current time and frame info',
  icon: 'clock',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [
    { id: 'time', type: 'number', label: 'Time' },
    { id: 'delta', type: 'number', label: 'Delta' },
    { id: 'frame', type: 'number', label: 'Frame' },
  ],
  controls: [],
}
