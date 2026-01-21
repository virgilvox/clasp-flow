import type { NodeDefinition } from '../types'

export const arrayReverseNode: NodeDefinition = {
  id: 'array-reverse',
  name: 'Array Reverse',
  version: '1.0.0',
  category: 'data',
  description: 'Reverse array order',
  icon: 'arrow-down-up',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [{ id: 'result', type: 'array', label: 'Result' }],
  controls: [],
  tags: ['array', 'reverse', 'flip', 'invert'],
}
