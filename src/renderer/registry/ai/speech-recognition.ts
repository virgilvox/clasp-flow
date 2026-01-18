import type { NodeDefinition } from '../types'

export const speechRecognitionNode: NodeDefinition = {
  id: 'speech-recognition',
  name: 'Speech to Text',
  version: '1.0.0',
  category: 'ai',
  description: 'Transcribe audio to text using Whisper models',
  icon: 'mic',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'audio', type: 'audio', label: 'Audio' },
    { id: 'trigger', type: 'trigger', label: 'Transcribe' },
  ],
  outputs: [
    { id: 'text', type: 'string', label: 'Transcribed Text' },
    { id: 'loading', type: 'boolean', label: 'Loading' },
  ],
  controls: [],
}
