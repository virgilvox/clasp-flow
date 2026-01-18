import type { NodeDefinition } from '../types'

export const expressionNode: NodeDefinition = {
  id: 'expression',
  name: 'Expression',
  version: '1.0.0',
  category: 'code',
  description: 'Inline math expression evaluator',
  icon: 'calculator',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'number', label: 'A' },
    { id: 'b', type: 'number', label: 'B' },
    { id: 'c', type: 'number', label: 'C' },
    { id: 'd', type: 'number', label: 'D' },
  ],
  outputs: [
    { id: 'result', type: 'number', label: 'Result' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'expression', type: 'text', label: 'Expression', default: 'a + b', props: { placeholder: 'e.g., sin(t) * a + b' } },
  ],
}
