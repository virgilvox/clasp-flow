export { textGenerationNode } from './text-generation'
export { imageClassificationNode } from './image-classification'
export { sentimentAnalysisNode } from './sentiment-analysis'
export { imageCaptioningNode } from './image-captioning'
export { featureExtractionNode } from './feature-extraction'
export { objectDetectionNode } from './object-detection'

import { textGenerationNode } from './text-generation'
import { imageClassificationNode } from './image-classification'
import { sentimentAnalysisNode } from './sentiment-analysis'
import { imageCaptioningNode } from './image-captioning'
import { featureExtractionNode } from './feature-extraction'
import { objectDetectionNode } from './object-detection'
import type { NodeDefinition } from '../types'

export const aiNodes: NodeDefinition[] = [
  textGenerationNode,
  imageClassificationNode,
  sentimentAnalysisNode,
  imageCaptioningNode,
  featureExtractionNode,
  objectDetectionNode,
]
