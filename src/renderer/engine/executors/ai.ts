/**
 * AI Node Executors
 *
 * These executors handle AI/ML nodes using Transformers.js.
 * IMPORTANT: Models must be pre-loaded via the AI Model Manager.
 * Executors will NOT auto-load models to prevent UI freezing.
 */

import type { ExecutionContext, NodeExecutorFn } from '../ExecutionEngine'
import { aiInference } from '@/services/ai/AIInference'

// Cache for node state and results
const nodeCache = new Map<string, unknown>()

// Track pending async operations per node
const pendingOperations = new Map<string, Promise<void>>()

function getCached<T>(key: string, defaultValue: T): T {
  const val = nodeCache.get(key)
  return val !== undefined ? (val as T) : defaultValue
}

function setCached(key: string, value: unknown): void {
  nodeCache.set(key, value)
}

// ============================================================================
// Text Generation Node
// ============================================================================

export const textGenerationExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const outputs = new Map<string, unknown>()
  const prompt = (ctx.inputs.get('prompt') as string) ?? (ctx.controls.get('prompt') as string) ?? ''
  const trigger = ctx.inputs.get('trigger')

  // Check if model is loaded (non-blocking)
  const modelId = ctx.controls.get('model') as string | undefined
  const isLoaded = aiInference.isModelLoaded('text-generation', modelId)

  if (!isLoaded) {
    outputs.set('text', getCached(`${ctx.nodeId}:lastOutput`, ''))
    outputs.set('loading', false)
    outputs.set('_error', 'Model not loaded. Open AI Model Manager to load.')
    return outputs
  }

  // Return cached if no trigger and prompt unchanged
  const lastPrompt = getCached<string>(`${ctx.nodeId}:lastPrompt`, '')
  // Only consider it a trigger if it's explicitly true or 1 (not just any truthy value)
  const hasTrigger = trigger === true || trigger === 1
  const promptChanged = prompt !== lastPrompt && prompt.trim() !== ''

  if (!hasTrigger && !promptChanged) {
    outputs.set('text', getCached(`${ctx.nodeId}:lastOutput`, ''))
    outputs.set('loading', getCached(`${ctx.nodeId}:loading`, false))
    return outputs
  }

  // Check if already processing
  if (pendingOperations.has(ctx.nodeId)) {
    outputs.set('text', getCached(`${ctx.nodeId}:lastOutput`, ''))
    outputs.set('loading', true)
    return outputs
  }

  if (!prompt.trim()) {
    outputs.set('text', '')
    outputs.set('loading', false)
    return outputs
  }

  // Start async generation (non-blocking)
  setCached(`${ctx.nodeId}:loading`, true)
  setCached(`${ctx.nodeId}:lastPrompt`, prompt)

  const maxTokens = (ctx.controls.get('maxTokens') as number) ?? 50
  const temperature = (ctx.controls.get('temperature') as number) ?? 0.7

  const operation = (async () => {
    try {
      const result = await aiInference.generateText(prompt, {
        maxLength: maxTokens,
        temperature,
      }, modelId)
      setCached(`${ctx.nodeId}:lastOutput`, result)
      setCached(`${ctx.nodeId}:loading`, false)
    } catch (error) {
      console.error('[AI] Text generation error:', error)
      setCached(`${ctx.nodeId}:loading`, false)
    } finally {
      pendingOperations.delete(ctx.nodeId)
    }
  })()

  pendingOperations.set(ctx.nodeId, operation)

  outputs.set('text', getCached(`${ctx.nodeId}:lastOutput`, ''))
  outputs.set('loading', true)
  return outputs
}

// ============================================================================
// Image Classification Node
// ============================================================================

export const imageClassificationExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const outputs = new Map<string, unknown>()
  const imageData = ctx.inputs.get('image') as ImageData | HTMLCanvasElement | null

  // Check if model is loaded
  const modelId = ctx.controls.get('model') as string | undefined
  const isLoaded = aiInference.isModelLoaded('image-classification', modelId)

  if (!isLoaded) {
    outputs.set('labels', [])
    outputs.set('topLabel', '')
    outputs.set('topScore', 0)
    outputs.set('loading', false)
    outputs.set('_error', 'Model not loaded. Open AI Model Manager to load.')
    return outputs
  }

  if (!imageData) {
    outputs.set('labels', getCached(`${ctx.nodeId}:labels`, []))
    outputs.set('topLabel', getCached(`${ctx.nodeId}:topLabel`, ''))
    outputs.set('topScore', getCached(`${ctx.nodeId}:topScore`, 0))
    outputs.set('loading', false)
    return outputs
  }

  // Frame-based throttling
  const currentFrame = ctx.frameCount
  const lastFrame = getCached<number>(`${ctx.nodeId}:lastFrame`, 0)
  const interval = (ctx.controls.get('interval') as number) ?? 30

  if (lastFrame && (currentFrame - lastFrame) < interval) {
    outputs.set('labels', getCached(`${ctx.nodeId}:labels`, []))
    outputs.set('topLabel', getCached(`${ctx.nodeId}:topLabel`, ''))
    outputs.set('topScore', getCached(`${ctx.nodeId}:topScore`, 0))
    outputs.set('loading', getCached(`${ctx.nodeId}:loading`, false))
    return outputs
  }

  // Check if already processing
  if (pendingOperations.has(ctx.nodeId)) {
    outputs.set('labels', getCached(`${ctx.nodeId}:labels`, []))
    outputs.set('topLabel', getCached(`${ctx.nodeId}:topLabel`, ''))
    outputs.set('topScore', getCached(`${ctx.nodeId}:topScore`, 0))
    outputs.set('loading', true)
    return outputs
  }

  setCached(`${ctx.nodeId}:loading`, true)
  setCached(`${ctx.nodeId}:lastFrame`, currentFrame)

  const topK = (ctx.controls.get('topK') as number) ?? 5

  const operation = (async () => {
    try {
      const results = await aiInference.classifyImage(imageData, topK, modelId)
      setCached(`${ctx.nodeId}:labels`, results)
      const topResult = results[0]
      setCached(`${ctx.nodeId}:topLabel`, topResult?.label ?? '')
      setCached(`${ctx.nodeId}:topScore`, topResult?.score ?? 0)
      setCached(`${ctx.nodeId}:loading`, false)
    } catch (error) {
      console.error('[AI] Image classification error:', error)
      setCached(`${ctx.nodeId}:loading`, false)
    } finally {
      pendingOperations.delete(ctx.nodeId)
    }
  })()

  pendingOperations.set(ctx.nodeId, operation)

  outputs.set('labels', getCached(`${ctx.nodeId}:labels`, []))
  outputs.set('topLabel', getCached(`${ctx.nodeId}:topLabel`, ''))
  outputs.set('topScore', getCached(`${ctx.nodeId}:topScore`, 0))
  outputs.set('loading', true)
  return outputs
}

// ============================================================================
// Sentiment Analysis Node
// ============================================================================

export const sentimentAnalysisExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const outputs = new Map<string, unknown>()
  const text = (ctx.inputs.get('text') as string) ?? ''

  // Check if model is loaded
  const modelId = ctx.controls.get('model') as string | undefined
  const isLoaded = aiInference.isModelLoaded('sentiment-analysis', modelId)

  if (!isLoaded) {
    outputs.set('sentiment', '')
    outputs.set('score', 0)
    outputs.set('positive', 0)
    outputs.set('negative', 0)
    outputs.set('loading', false)
    outputs.set('_error', 'Model not loaded. Open AI Model Manager to load.')
    return outputs
  }

  if (!text.trim()) {
    outputs.set('sentiment', '')
    outputs.set('score', 0)
    outputs.set('positive', 0)
    outputs.set('negative', 0)
    outputs.set('loading', false)
    return outputs
  }

  // Return cached if text unchanged
  const lastText = getCached<string>(`${ctx.nodeId}:lastText`, '')
  if (text === lastText) {
    outputs.set('sentiment', getCached(`${ctx.nodeId}:sentiment`, ''))
    outputs.set('score', getCached(`${ctx.nodeId}:score`, 0))
    outputs.set('positive', getCached(`${ctx.nodeId}:positive`, 0))
    outputs.set('negative', getCached(`${ctx.nodeId}:negative`, 0))
    outputs.set('loading', false)
    return outputs
  }

  // Check if already processing
  if (pendingOperations.has(ctx.nodeId)) {
    outputs.set('sentiment', getCached(`${ctx.nodeId}:sentiment`, ''))
    outputs.set('score', getCached(`${ctx.nodeId}:score`, 0))
    outputs.set('positive', getCached(`${ctx.nodeId}:positive`, 0))
    outputs.set('negative', getCached(`${ctx.nodeId}:negative`, 0))
    outputs.set('loading', true)
    return outputs
  }

  setCached(`${ctx.nodeId}:loading`, true)
  setCached(`${ctx.nodeId}:lastText`, text)

  const operation = (async () => {
    try {
      const results = await aiInference.analyzeSentiment(text, modelId)

      let positive = 0
      let negative = 0
      for (const result of results) {
        if (result.label.toLowerCase().includes('positive')) {
          positive = result.score
        } else if (result.label.toLowerCase().includes('negative')) {
          negative = result.score
        }
      }

      const topResult = results[0]
      setCached(`${ctx.nodeId}:sentiment`, topResult?.label ?? '')
      setCached(`${ctx.nodeId}:score`, topResult?.score ?? 0)
      setCached(`${ctx.nodeId}:positive`, positive)
      setCached(`${ctx.nodeId}:negative`, negative)
      setCached(`${ctx.nodeId}:loading`, false)
    } catch (error) {
      console.error('[AI] Sentiment analysis error:', error)
      setCached(`${ctx.nodeId}:loading`, false)
    } finally {
      pendingOperations.delete(ctx.nodeId)
    }
  })()

  pendingOperations.set(ctx.nodeId, operation)

  outputs.set('sentiment', getCached(`${ctx.nodeId}:sentiment`, ''))
  outputs.set('score', getCached(`${ctx.nodeId}:score`, 0))
  outputs.set('positive', getCached(`${ctx.nodeId}:positive`, 0))
  outputs.set('negative', getCached(`${ctx.nodeId}:negative`, 0))
  outputs.set('loading', true)
  return outputs
}

// ============================================================================
// Image Captioning Node
// ============================================================================

export const imageCaptioningExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const outputs = new Map<string, unknown>()
  const imageData = ctx.inputs.get('image') as ImageData | HTMLCanvasElement | null
  const trigger = ctx.inputs.get('trigger')

  // Check if model is loaded
  const modelId = ctx.controls.get('model') as string | undefined
  const isLoaded = aiInference.isModelLoaded('image-to-text', modelId)

  if (!isLoaded) {
    outputs.set('caption', getCached(`${ctx.nodeId}:caption`, ''))
    outputs.set('loading', false)
    outputs.set('_error', 'Model not loaded. Open AI Model Manager to load.')
    return outputs
  }

  if (!imageData) {
    outputs.set('caption', '')
    outputs.set('loading', false)
    return outputs
  }

  // Check trigger or interval
  const currentFrame = ctx.frameCount
  const lastFrame = getCached<number>(`${ctx.nodeId}:lastFrame`, 0)
  const interval = (ctx.controls.get('interval') as number) ?? 60
  // Only consider it a trigger if it's explicitly true or 1
  const hasTrigger = trigger === true || trigger === 1
  const shouldCaption = hasTrigger || !lastFrame || (currentFrame - lastFrame) >= interval

  if (!shouldCaption) {
    outputs.set('caption', getCached(`${ctx.nodeId}:caption`, ''))
    outputs.set('loading', getCached(`${ctx.nodeId}:loading`, false))
    return outputs
  }

  // Check if already processing
  if (pendingOperations.has(ctx.nodeId)) {
    outputs.set('caption', getCached(`${ctx.nodeId}:caption`, ''))
    outputs.set('loading', true)
    return outputs
  }

  setCached(`${ctx.nodeId}:loading`, true)
  setCached(`${ctx.nodeId}:lastFrame`, currentFrame)

  const operation = (async () => {
    try {
      const caption = await aiInference.captionImage(imageData, modelId)
      setCached(`${ctx.nodeId}:caption`, caption)
      setCached(`${ctx.nodeId}:loading`, false)
    } catch (error) {
      console.error('[AI] Image captioning error:', error)
      setCached(`${ctx.nodeId}:loading`, false)
    } finally {
      pendingOperations.delete(ctx.nodeId)
    }
  })()

  pendingOperations.set(ctx.nodeId, operation)

  outputs.set('caption', getCached(`${ctx.nodeId}:caption`, ''))
  outputs.set('loading', true)
  return outputs
}

// ============================================================================
// Feature Extraction (Embeddings) Node
// ============================================================================

export const featureExtractionExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const outputs = new Map<string, unknown>()
  const text = (ctx.inputs.get('text') as string) ?? ''

  // Check if model is loaded
  const modelId = ctx.controls.get('model') as string | undefined
  const isLoaded = aiInference.isModelLoaded('feature-extraction', modelId)

  if (!isLoaded) {
    outputs.set('embedding', [])
    outputs.set('dimensions', 0)
    outputs.set('loading', false)
    outputs.set('_error', 'Model not loaded. Open AI Model Manager to load.')
    return outputs
  }

  if (!text.trim()) {
    outputs.set('embedding', [])
    outputs.set('dimensions', 0)
    outputs.set('loading', false)
    return outputs
  }

  // Return cached if text unchanged
  const lastText = getCached<string>(`${ctx.nodeId}:lastText`, '')
  if (text === lastText) {
    outputs.set('embedding', getCached(`${ctx.nodeId}:embedding`, []))
    outputs.set('dimensions', getCached(`${ctx.nodeId}:dimensions`, 0))
    outputs.set('loading', false)
    return outputs
  }

  // Check if already processing
  if (pendingOperations.has(ctx.nodeId)) {
    outputs.set('embedding', getCached(`${ctx.nodeId}:embedding`, []))
    outputs.set('dimensions', getCached(`${ctx.nodeId}:dimensions`, 0))
    outputs.set('loading', true)
    return outputs
  }

  setCached(`${ctx.nodeId}:loading`, true)
  setCached(`${ctx.nodeId}:lastText`, text)

  const operation = (async () => {
    try {
      const embedding = await aiInference.extractFeatures(text, modelId)
      setCached(`${ctx.nodeId}:embedding`, embedding)
      setCached(`${ctx.nodeId}:dimensions`, embedding.length)
      setCached(`${ctx.nodeId}:loading`, false)
    } catch (error) {
      console.error('[AI] Feature extraction error:', error)
      setCached(`${ctx.nodeId}:loading`, false)
    } finally {
      pendingOperations.delete(ctx.nodeId)
    }
  })()

  pendingOperations.set(ctx.nodeId, operation)

  outputs.set('embedding', getCached(`${ctx.nodeId}:embedding`, []))
  outputs.set('dimensions', getCached(`${ctx.nodeId}:dimensions`, 0))
  outputs.set('loading', true)
  return outputs
}

// ============================================================================
// Object Detection Node
// ============================================================================

export const objectDetectionExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const outputs = new Map<string, unknown>()
  const imageData = ctx.inputs.get('image') as ImageData | HTMLCanvasElement | null

  // Check if model is loaded
  const modelId = ctx.controls.get('model') as string | undefined
  const isLoaded = aiInference.isModelLoaded('object-detection', modelId)

  if (!isLoaded) {
    outputs.set('objects', [])
    outputs.set('count', 0)
    outputs.set('loading', false)
    outputs.set('_error', 'Model not loaded. Open AI Model Manager to load.')
    return outputs
  }

  if (!imageData) {
    outputs.set('objects', getCached(`${ctx.nodeId}:objects`, []))
    outputs.set('count', getCached(`${ctx.nodeId}:count`, 0))
    outputs.set('loading', false)
    return outputs
  }

  // Frame-based throttling
  const currentFrame = ctx.frameCount
  const lastFrame = getCached<number>(`${ctx.nodeId}:lastFrame`, 0)
  const interval = (ctx.controls.get('interval') as number) ?? 30

  if (lastFrame && (currentFrame - lastFrame) < interval) {
    outputs.set('objects', getCached(`${ctx.nodeId}:objects`, []))
    outputs.set('count', getCached(`${ctx.nodeId}:count`, 0))
    outputs.set('loading', getCached(`${ctx.nodeId}:loading`, false))
    return outputs
  }

  // Check if already processing
  if (pendingOperations.has(ctx.nodeId)) {
    outputs.set('objects', getCached(`${ctx.nodeId}:objects`, []))
    outputs.set('count', getCached(`${ctx.nodeId}:count`, 0))
    outputs.set('loading', true)
    return outputs
  }

  setCached(`${ctx.nodeId}:loading`, true)
  setCached(`${ctx.nodeId}:lastFrame`, currentFrame)

  const threshold = (ctx.controls.get('threshold') as number) ?? 0.5

  const operation = (async () => {
    try {
      const objects = await aiInference.detectObjects(imageData, threshold, modelId)
      setCached(`${ctx.nodeId}:objects`, objects)
      setCached(`${ctx.nodeId}:count`, objects.length)
      setCached(`${ctx.nodeId}:loading`, false)
    } catch (error) {
      console.error('[AI] Object detection error:', error)
      setCached(`${ctx.nodeId}:loading`, false)
    } finally {
      pendingOperations.delete(ctx.nodeId)
    }
  })()

  pendingOperations.set(ctx.nodeId, operation)

  outputs.set('objects', getCached(`${ctx.nodeId}:objects`, []))
  outputs.set('count', getCached(`${ctx.nodeId}:count`, 0))
  outputs.set('loading', true)
  return outputs
}

// ============================================================================
// Cleanup helpers
// ============================================================================

export function disposeAINode(nodeId: string): void {
  const keys = Array.from(nodeCache.keys()).filter(k => k.startsWith(nodeId))
  keys.forEach(k => nodeCache.delete(k))
  pendingOperations.delete(nodeId)
}

export function disposeAllAINodes(): void {
  nodeCache.clear()
  pendingOperations.clear()
}

// ============================================================================
// Registry
// ============================================================================

export const aiExecutors: Record<string, NodeExecutorFn> = {
  'text-generation': textGenerationExecutor,
  'image-classification': imageClassificationExecutor,
  'sentiment-analysis': sentimentAnalysisExecutor,
  'image-captioning': imageCaptioningExecutor,
  'feature-extraction': featureExtractionExecutor,
  'object-detection': objectDetectionExecutor,
}
