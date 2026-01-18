export { compareNode } from './compare'
export { andNode } from './and'
export { orNode } from './or'
export { notNode } from './not'
export { gateNode } from './gate'
export { switchNode } from './switch'
export { selectNode } from './select'

import { compareNode } from './compare'
import { andNode } from './and'
import { orNode } from './or'
import { notNode } from './not'
import { gateNode } from './gate'
import { switchNode } from './switch'
import { selectNode } from './select'
import type { NodeDefinition } from '../types'

export const logicNodes: NodeDefinition[] = [
  compareNode,
  andNode,
  orNode,
  notNode,
  gateNode,
  switchNode,
  selectNode,
]
