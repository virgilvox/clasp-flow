import type { NodeDefinition } from '../../types'

export const functionNode: NodeDefinition = {
  id: 'function',
  name: 'Function',
  version: '1.0.0',
  category: 'code',
  description: 'Custom JavaScript function with sandboxed execution',
  icon: 'code-2',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'a', type: 'any', label: 'A' },
    { id: 'b', type: 'any', label: 'B' },
    { id: 'c', type: 'any', label: 'C' },
    { id: 'd', type: 'any', label: 'D' },
  ],
  outputs: [
    { id: 'result', type: 'any', label: 'Result' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'code', type: 'code', label: 'Code', default: `// Access inputs via: inputs.a, inputs.b, etc.
// Access time via: time, deltaTime, frame
// Use state: getState('key', default), setState('key', value)
// Return a value or object with multiple outputs

return inputs.a + inputs.b;` },
  ],
  info: {
    overview: 'Runs custom JavaScript code in a sandboxed environment with up to four generic inputs. You can maintain state across frames and return values to downstream nodes. The error output fires when your code throws, making it possible to handle failures gracefully.',
    tips: [
      'Use getState/setState to persist values between frames instead of relying on closures.',
      'Return an object with named keys to populate multiple outputs from a single function.',
      'Connect the error output to a console node during development to surface runtime issues quickly.',
    ],
    pairsWith: ['console', 'expression', 'trigger', 'monitor'],
  },
}
