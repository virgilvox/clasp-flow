import type { NodeDefinition } from '../types'

export const stringTrimNode: NodeDefinition = {
  id: 'string-trim',
  name: 'String Trim',
  version: '1.0.0',
  category: 'string',
  description: 'Remove whitespace from string',
  icon: 'scissors',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'input', type: 'string', label: 'Input' }],
  outputs: [{ id: 'result', type: 'string', label: 'Result' }],
  controls: [
    {
      id: 'mode',
      type: 'select',
      label: 'Mode',
      default: 'both',
      props: { options: ['both', 'start', 'end'] },
    },
  ],
  tags: ['trim', 'whitespace', 'clean', 'strip'],
}
