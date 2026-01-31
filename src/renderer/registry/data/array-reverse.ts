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
  info: {
    overview: 'Reverses the order of elements in an array. The first element becomes the last, and the last becomes the first. This does not modify the original array.',
    tips: [
      'Combine with Array Sort to quickly switch between ascending and descending order.',
      'Use after Array Slice to reverse just a portion of the original array.',
    ],
    pairsWith: ['array-sort', 'array-slice', 'array-first-last', 'array-join'],
  },
}
