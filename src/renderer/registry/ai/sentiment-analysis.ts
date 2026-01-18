import type { NodeDefinition } from '../types'

export const sentimentAnalysisNode: NodeDefinition = {
  id: 'sentiment-analysis',
  name: 'Sentiment',
  version: '1.0.0',
  category: 'ai',
  description: 'Analyze text sentiment (positive/negative)',
  icon: 'smile',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'text', type: 'string', label: 'Text' },
    { id: 'trigger', type: 'trigger', label: 'Analyze' },
  ],
  outputs: [
    { id: 'sentiment', type: 'string', label: 'Sentiment' },
    { id: 'score', type: 'number', label: 'Score' },
    { id: 'positive', type: 'number', label: 'Positive' },
    { id: 'negative', type: 'number', label: 'Negative' },
    { id: 'loading', type: 'boolean', label: 'Loading' },
  ],
  controls: [],
}
