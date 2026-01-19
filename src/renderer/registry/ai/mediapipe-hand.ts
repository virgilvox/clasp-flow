import type { NodeDefinition } from '../types'

export const mediapipeHandNode: NodeDefinition = {
  id: 'mediapipe-hand',
  name: 'Hand Tracking',
  version: '1.0.0',
  category: 'ai',
  description: 'Detect and track hand landmarks using MediaPipe',
  icon: 'hand',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'video', type: 'video', label: 'Video' },
  ],
  outputs: [
    { id: 'landmarks', type: 'data', label: 'Landmarks' },
    { id: 'worldLandmarks', type: 'data', label: 'World Landmarks' },
    { id: 'handedness', type: 'string', label: 'Handedness' },
    { id: 'confidence', type: 'number', label: 'Confidence' },
    { id: 'gestureType', type: 'string', label: 'Gesture' },
    { id: 'fingerTips', type: 'data', label: 'Finger Tips' },
    { id: 'handCount', type: 'number', label: 'Hand Count' },
    { id: 'detected', type: 'boolean', label: 'Detected' },
    { id: 'loading', type: 'boolean', label: 'Loading' },
  ],
  controls: [
    {
      id: 'enabled',
      type: 'toggle',
      label: 'Enabled',
      default: true,
    },
    {
      id: 'handIndex',
      type: 'slider',
      label: 'Hand Index',
      default: 0,
      props: { min: 0, max: 1, step: 1 },
    },
  ],
}
