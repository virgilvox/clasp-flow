export { timeNode } from './time'
export { lfoNode } from './lfo'
export { startNode } from './start'
export { intervalNode } from './interval'
export { delayNode } from './delay'
export { timerNode } from './timer'

import { timeNode } from './time'
import { lfoNode } from './lfo'
import { startNode } from './start'
import { intervalNode } from './interval'
import { delayNode } from './delay'
import { timerNode } from './timer'
import type { NodeDefinition } from '../types'

export const timingNodes: NodeDefinition[] = [
  timeNode,
  lfoNode,
  startNode,
  intervalNode,
  delayNode,
  timerNode,
]
