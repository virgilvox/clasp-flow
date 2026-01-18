import type { NodeDefinition } from '../types'

export const timerNode: NodeDefinition = {
  id: 'timer',
  name: 'Timer',
  version: '1.0.0',
  category: 'timing',
  description: 'Stopwatch timer with start/stop/reset',
  icon: 'timer',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'start', type: 'trigger', label: 'Start' },
    { id: 'stop', type: 'trigger', label: 'Stop' },
    { id: 'reset', type: 'trigger', label: 'Reset' },
  ],
  outputs: [
    { id: 'elapsed', type: 'number', label: 'Elapsed (s)' },
    { id: 'running', type: 'boolean', label: 'Running' },
  ],
  controls: [],
}
