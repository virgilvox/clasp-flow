export { addNode } from './add'
export { subtractNode } from './subtract'
export { multiplyNode } from './multiply'
export { divideNode } from './divide'
export { clampNode } from './clamp'
export { absNode } from './abs'
export { randomNode } from './random'
export { mapRangeNode } from './map-range'
export { smoothNode } from './smooth'

import { addNode } from './add'
import { subtractNode } from './subtract'
import { multiplyNode } from './multiply'
import { divideNode } from './divide'
import { clampNode } from './clamp'
import { absNode } from './abs'
import { randomNode } from './random'
import { mapRangeNode } from './map-range'
import { smoothNode } from './smooth'
import type { NodeDefinition } from '../types'

export const mathNodes: NodeDefinition[] = [
  addNode,
  subtractNode,
  multiplyNode,
  divideNode,
  clampNode,
  absNode,
  randomNode,
  mapRangeNode,
  smoothNode,
]
