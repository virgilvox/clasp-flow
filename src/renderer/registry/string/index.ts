export { stringConcatNode } from './concat'
export { stringSplitNode } from './split'
export { stringReplaceNode } from './replace'
export { stringSliceNode } from './slice'
export { stringCaseNode } from './case'
// New string operations
export { stringLengthNode } from './length'
export { stringContainsNode } from './contains'
export { stringStartsEndsNode } from './starts-ends'
export { stringTrimNode } from './trim'
export { stringPadNode } from './pad'
export { stringTemplateNode } from './template'
export { stringMatchNode } from './match'

import { stringConcatNode } from './concat'
import { stringSplitNode } from './split'
import { stringReplaceNode } from './replace'
import { stringSliceNode } from './slice'
import { stringCaseNode } from './case'
// New string operations
import { stringLengthNode } from './length'
import { stringContainsNode } from './contains'
import { stringStartsEndsNode } from './starts-ends'
import { stringTrimNode } from './trim'
import { stringPadNode } from './pad'
import { stringTemplateNode } from './template'
import { stringMatchNode } from './match'
import type { NodeDefinition } from '../types'

export const stringNodes: NodeDefinition[] = [
  stringConcatNode,
  stringSplitNode,
  stringReplaceNode,
  stringSliceNode,
  stringCaseNode,
  // New string operations
  stringLengthNode,
  stringContainsNode,
  stringStartsEndsNode,
  stringTrimNode,
  stringPadNode,
  stringTemplateNode,
  stringMatchNode,
]
