export { scene3dNode } from './scene-3d'
export { camera3dNode } from './camera-3d'
export { render3dNode } from './render-3d'
export { box3dNode } from './box-3d'
export { sphere3dNode } from './sphere-3d'
export { plane3dNode } from './plane-3d'
export { cylinder3dNode } from './cylinder-3d'
export { torus3dNode } from './torus-3d'
export { transform3dNode } from './transform-3d'
export { material3dNode } from './material-3d'
export { group3dNode } from './group-3d'
export { ambientLight3dNode } from './ambient-light-3d'
export { directionalLight3dNode } from './directional-light-3d'
export { pointLight3dNode } from './point-light-3d'
export { spotLight3dNode } from './spot-light-3d'
export { gltfLoaderNode } from './gltf-loader'

import { scene3dNode } from './scene-3d'
import { camera3dNode } from './camera-3d'
import { render3dNode } from './render-3d'
import { box3dNode } from './box-3d'
import { sphere3dNode } from './sphere-3d'
import { plane3dNode } from './plane-3d'
import { cylinder3dNode } from './cylinder-3d'
import { torus3dNode } from './torus-3d'
import { transform3dNode } from './transform-3d'
import { material3dNode } from './material-3d'
import { group3dNode } from './group-3d'
import { ambientLight3dNode } from './ambient-light-3d'
import { directionalLight3dNode } from './directional-light-3d'
import { pointLight3dNode } from './point-light-3d'
import { spotLight3dNode } from './spot-light-3d'
import { gltfLoaderNode } from './gltf-loader'
import type { NodeDefinition } from '../types'

export const threeDNodes: NodeDefinition[] = [
  scene3dNode,
  camera3dNode,
  render3dNode,
  box3dNode,
  sphere3dNode,
  plane3dNode,
  cylinder3dNode,
  torus3dNode,
  transform3dNode,
  material3dNode,
  group3dNode,
  ambientLight3dNode,
  directionalLight3dNode,
  pointLight3dNode,
  spotLight3dNode,
  gltfLoaderNode,
]
