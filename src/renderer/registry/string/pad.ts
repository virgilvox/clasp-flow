import type { NodeDefinition } from '../types'

export const stringPadNode: NodeDefinition = {
  id: 'string-pad',
  name: 'String Pad',
  version: '1.0.0',
  category: 'string',
  description: 'Pad string to target length',
  icon: 'space',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'input', type: 'string', label: 'Input' }],
  outputs: [{ id: 'result', type: 'string', label: 'Result' }],
  controls: [
    { id: 'length', type: 'number', label: 'Length', default: 10 },
    { id: 'char', type: 'text', label: 'Char', default: ' ' },
    {
      id: 'mode',
      type: 'select',
      label: 'Mode',
      default: 'start',
      props: { options: ['start', 'end'] },
    },
  ],
  tags: ['pad', 'fill', 'align', 'format'],
}
