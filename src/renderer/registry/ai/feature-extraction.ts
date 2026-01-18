import type { NodeDefinition } from '../types'

export const featureExtractionNode: NodeDefinition = {
  id: 'feature-extraction',
  name: 'Text Embed',
  version: '1.0.0',
  category: 'ai',
  description: 'Convert text to embedding vectors',
  icon: 'hash',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'text', type: 'string', label: 'Text' },
    { id: 'trigger', type: 'trigger', label: 'Extract' },
  ],
  outputs: [
    { id: 'embedding', type: 'data', label: 'Embedding' },
    { id: 'dimensions', type: 'number', label: 'Dimensions' },
    { id: 'loading', type: 'boolean', label: 'Loading' },
  ],
  controls: [],
}
