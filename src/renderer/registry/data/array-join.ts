import type { NodeDefinition } from '../types'

export const arrayJoinNode: NodeDefinition = {
  id: 'array-join',
  name: 'Array Join',
  version: '1.0.0',
  category: 'data',
  description: 'Join array elements into string',
  icon: 'link',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'array', type: 'array', label: 'Array' }],
  outputs: [{ id: 'result', type: 'string', label: 'Result' }],
  controls: [
    { id: 'separator', type: 'text', label: 'Separator', default: ',' },
  ],
  tags: ['array', 'join', 'concat', 'string'],
}
