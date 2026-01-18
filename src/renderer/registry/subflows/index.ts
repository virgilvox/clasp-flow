export { subflowInputNode } from './subflow-input'
export { subflowOutputNode } from './subflow-output'

import { subflowInputNode } from './subflow-input'
import { subflowOutputNode } from './subflow-output'
import type { NodeDefinition } from '../types'

export const subflowNodes: NodeDefinition[] = [
  subflowInputNode,
  subflowOutputNode,
]
