import type { NodeDefinition } from '../types'

export const audioPlayerNode: NodeDefinition = {
  id: 'audio-player',
  name: 'Audio Player',
  version: '1.0.0',
  category: 'audio',
  description: 'Play audio files from URL',
  icon: 'play-circle',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'url', type: 'string', label: 'URL' },
    { id: 'play', type: 'trigger', label: 'Play' },
    { id: 'stop', type: 'trigger', label: 'Stop' },
  ],
  outputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
    { id: 'playing', type: 'boolean', label: 'Playing' },
    { id: 'duration', type: 'number', label: 'Duration' },
    { id: 'loading', type: 'boolean', label: 'Loading' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'url', type: 'text', label: 'URL', default: '' },
    { id: 'loop', type: 'toggle', label: 'Loop', default: false },
    { id: 'autoplay', type: 'toggle', label: 'Autoplay', default: false },
    { id: 'volume', type: 'slider', label: 'Volume (dB)', default: 0, props: { min: -40, max: 6, step: 1 } },
    { id: 'playbackRate', type: 'slider', label: 'Speed', default: 1, props: { min: 0.5, max: 2, step: 0.1 } },
  ],
}
