import type { NodeDefinition } from '../types'

export const audioAnalyzerNode: NodeDefinition = {
  id: 'audio-analyzer',
  name: 'Audio Analyzer',
  version: '1.0.0',
  category: 'audio',
  description: 'Analyze audio levels and frequencies',
  icon: 'bar-chart-2',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'audio', type: 'audio', label: 'Audio' }],
  outputs: [
    { id: 'level', type: 'number', label: 'Level' },
    { id: 'bass', type: 'number', label: 'Bass' },
    { id: 'mid', type: 'number', label: 'Mid' },
    { id: 'high', type: 'number', label: 'High' },
  ],
  controls: [
    { id: 'smoothing', type: 'number', label: 'Smoothing', default: 0.8 },
  ],
}
