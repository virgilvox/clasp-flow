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
  info: {
    overview: 'Builds a string by inserting input values into a template with {a}, {b}, {c}, and {d} placeholders. Accepts any input type and converts values to strings automatically. Good for composing messages, prompts, or formatted output.',
    tips: [
      'Use this to build prompts for the Text Generate node by inserting dynamic values into a base template.',
      'Placeholders that have no connected input are replaced with an empty string.',
    ],
    pairsWith: ['text-generation', 'string-concat', 'string-case', 'string-replace'],
  },
}
