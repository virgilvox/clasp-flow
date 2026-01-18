import type { NodeDefinition } from '../../types'

export const xyPadNode: NodeDefinition = {
  id: 'xy-pad',
  name: 'XY Pad',
  version: '1.0.0',
  category: 'inputs',
  description: '2D position controller with X/Y outputs',
  icon: 'move',
  platforms: ['web', 'electron'],
  inputs: [],
  outputs: [
    { id: 'rawX', type: 'number', label: 'Raw X' },
    { id: 'rawY', type: 'number', label: 'Raw Y' },
    { id: 'normX', type: 'number', label: '0-1 X' },
    { id: 'normY', type: 'number', label: '0-1 Y' },
  ],
  controls: [
    { id: 'normalizedX', type: 'number', label: 'X', default: 0.5, exposable: true },
    { id: 'normalizedY', type: 'number', label: 'Y', default: 0.5, exposable: true },
    { id: 'minX', type: 'number', label: 'Min X', default: 0 },
    { id: 'maxX', type: 'number', label: 'Max X', default: 1 },
    { id: 'minY', type: 'number', label: 'Min Y', default: 0 },
    { id: 'maxY', type: 'number', label: 'Max Y', default: 1 },
  ],
}
