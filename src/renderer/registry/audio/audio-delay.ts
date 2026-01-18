import type { NodeDefinition } from '../types'

export const audioDelayNode: NodeDefinition = {
  id: 'audio-delay',
  name: 'Delay',
  version: '1.0.0',
  category: 'audio',
  description: 'Add delay/echo effect',
  icon: 'repeat',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
    { id: 'time', type: 'number', label: 'Time' },
  ],
  outputs: [{ id: 'audio', type: 'audio', label: 'Audio' }],
  controls: [
    { id: 'time', type: 'number', label: 'Delay (s)', default: 0.25 },
    { id: 'feedback', type: 'number', label: 'Feedback', default: 0.5 },
    { id: 'wet', type: 'number', label: 'Wet', default: 0.5 },
  ],
}
