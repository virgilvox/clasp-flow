import type { NodeDefinition } from '../types'

export const stringTemplateNode: NodeDefinition = {
  id: 'string-template',
  name: 'String Template',
  version: '1.0.0',
  category: 'string',
  description: 'String interpolation with placeholders',
  icon: 'file-code',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'any', label: 'A' },
    { id: 'b', type: 'any', label: 'B' },
    { id: 'c', type: 'any', label: 'C' },
    { id: 'd', type: 'any', label: 'D' },
  ],
  outputs: [{ id: 'result', type: 'string', label: 'Result' }],
  controls: [
    {
      id: 'template',
      type: 'text',
      label: 'Template',
      default: 'Hello {a}!',
      props: { placeholder: 'Hello {a}, you have {b} messages' },
    },
  ],
  tags: ['template', 'interpolation', 'format', 'placeholder'],
}
