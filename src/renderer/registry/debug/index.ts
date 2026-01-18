// Simple debug nodes
export { consoleNode } from './console'

// Custom UI debug nodes
export { monitorNode, MonitorNode } from './monitor'
export { oscilloscopeNode, OscilloscopeNode } from './oscilloscope'
export { graphNode, GraphNode } from './graph'
export { equalizerNode, EqualizerNode } from './equalizer'

import { consoleNode } from './console'
import { monitorNode } from './monitor'
import { oscilloscopeNode } from './oscilloscope'
import { graphNode } from './graph'
import { equalizerNode } from './equalizer'
import type { NodeDefinition } from '../types'

export const debugNodes: NodeDefinition[] = [
  consoleNode,
  monitorNode,
  oscilloscopeNode,
  graphNode,
  equalizerNode,
]
