export { shaderNode } from './shader'
export { webcamNode } from './webcam'
export { colorNode } from './color'
export { textureDisplayNode } from './texture-display'
export { blendNode } from './blend'
export { blurNode } from './blur'
export { colorCorrectionNode } from './color-correction'
export { displacementNode } from './displacement'
export { transform2dNode } from './transform-2d'

import { shaderNode } from './shader'
import { webcamNode } from './webcam'
import { colorNode } from './color'
import { textureDisplayNode } from './texture-display'
import { blendNode } from './blend'
import { blurNode } from './blur'
import { colorCorrectionNode } from './color-correction'
import { displacementNode } from './displacement'
import { transform2dNode } from './transform-2d'
import type { NodeDefinition } from '../types'

export const visualNodes: NodeDefinition[] = [
  shaderNode,
  webcamNode,
  colorNode,
  textureDisplayNode,
  blendNode,
  blurNode,
  colorCorrectionNode,
  displacementNode,
  transform2dNode,
]
