export { textGenerationNode } from './text-generation'
export { imageClassificationNode } from './image-classification'
export { sentimentAnalysisNode } from './sentiment-analysis'
export { imageCaptioningNode } from './image-captioning'
export { featureExtractionNode } from './feature-extraction'
export { objectDetectionNode } from './object-detection'
export { speechRecognitionNode } from './speech-recognition'
export { textTransformationNode } from './text-transformation'
export { mediapipeHandNode } from './mediapipe-hand'
export { mediapipeFaceNode } from './mediapipe-face'
export { mediapipePoseNode } from './mediapipe-pose'
export { mediapipeObjectNode } from './mediapipe-object'

import { textGenerationNode } from './text-generation'
import { imageClassificationNode } from './image-classification'
import { sentimentAnalysisNode } from './sentiment-analysis'
import { imageCaptioningNode } from './image-captioning'
import { featureExtractionNode } from './feature-extraction'
import { objectDetectionNode } from './object-detection'
import { speechRecognitionNode } from './speech-recognition'
import { textTransformationNode } from './text-transformation'
import { mediapipeHandNode } from './mediapipe-hand'
import { mediapipeFaceNode } from './mediapipe-face'
import { mediapipePoseNode } from './mediapipe-pose'
import { mediapipeObjectNode } from './mediapipe-object'
import type { NodeDefinition } from '../types'

export const aiNodes: NodeDefinition[] = [
  textGenerationNode,
  imageClassificationNode,
  sentimentAnalysisNode,
  imageCaptioningNode,
  featureExtractionNode,
  objectDetectionNode,
  speechRecognitionNode,
  textTransformationNode,
  mediapipeHandNode,
  mediapipeFaceNode,
  mediapipePoseNode,
  mediapipeObjectNode,
]
