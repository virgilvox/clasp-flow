/**
 * Tests for MediaPipe Service helper functions
 *
 * Tests gesture recognition, face mesh helpers, and data extraction
 */

import { describe, it, expect } from 'vitest'
import {
  extractFingerTips,
  recognizeGesture,
  extractHeadRotation,
  calculateFaceBox,
  extractBlendshapeValues,
  type Point3D,
} from '@/services/ai/MediaPipeService'

// Helper to create a Point3D
const point = (x: number, y: number, z: number = 0): Point3D => ({ x, y, z })

describe('MediaPipeService - extractFingerTips', () => {
  it('should return null for all tips when landmarks too short', () => {
    const result = extractFingerTips([point(0, 0), point(1, 1)])

    expect(result.thumb).toBeNull()
    expect(result.index).toBeNull()
    expect(result.middle).toBeNull()
    expect(result.ring).toBeNull()
    expect(result.pinky).toBeNull()
  })

  it('should extract finger tips from 21 landmarks', () => {
    // Create mock landmarks with 21 points
    const landmarks: Point3D[] = Array(21).fill(null).map((_, i) => point(i * 0.1, i * 0.05, 0))

    // Set specific values for finger tips
    landmarks[4] = point(0.1, 0.2, 0.01)  // Thumb tip (index 4)
    landmarks[8] = point(0.3, 0.4, 0.02)  // Index tip (index 8)
    landmarks[12] = point(0.5, 0.6, 0.03) // Middle tip (index 12)
    landmarks[16] = point(0.7, 0.8, 0.04) // Ring tip (index 16)
    landmarks[20] = point(0.9, 1.0, 0.05) // Pinky tip (index 20)

    const result = extractFingerTips(landmarks)

    expect(result.thumb).toEqual({ x: 0.1, y: 0.2, z: 0.01 })
    expect(result.index).toEqual({ x: 0.3, y: 0.4, z: 0.02 })
    expect(result.middle).toEqual({ x: 0.5, y: 0.6, z: 0.03 })
    expect(result.ring).toEqual({ x: 0.7, y: 0.8, z: 0.04 })
    expect(result.pinky).toEqual({ x: 0.9, y: 1.0, z: 0.05 })
  })
})

describe('MediaPipeService - recognizeGesture', () => {
  // Create a base hand with all fingers closed
  const createBaseHand = (): Point3D[] => {
    const landmarks: Point3D[] = []

    // Wrist at center
    landmarks[0] = point(0.5, 0.5, 0)

    // Thumb (indices 1-4)
    landmarks[1] = point(0.55, 0.5, 0)
    landmarks[2] = point(0.6, 0.5, 0)
    landmarks[3] = point(0.65, 0.5, 0)
    landmarks[4] = point(0.7, 0.5, 0)  // Thumb tip

    // Index (indices 5-8)
    landmarks[5] = point(0.55, 0.45, 0)  // MCP
    landmarks[6] = point(0.55, 0.5, 0)
    landmarks[7] = point(0.55, 0.52, 0)
    landmarks[8] = point(0.55, 0.55, 0)  // Index tip (below MCP = curled)

    // Middle (indices 9-12)
    landmarks[9] = point(0.5, 0.45, 0)   // MCP
    landmarks[10] = point(0.5, 0.5, 0)
    landmarks[11] = point(0.5, 0.52, 0)
    landmarks[12] = point(0.5, 0.55, 0)  // Middle tip (below MCP = curled)

    // Ring (indices 13-16)
    landmarks[13] = point(0.45, 0.45, 0)  // MCP
    landmarks[14] = point(0.45, 0.5, 0)
    landmarks[15] = point(0.45, 0.52, 0)
    landmarks[16] = point(0.45, 0.55, 0)  // Ring tip (below MCP = curled)

    // Pinky (indices 17-20)
    landmarks[17] = point(0.4, 0.45, 0)   // MCP
    landmarks[18] = point(0.4, 0.5, 0)
    landmarks[19] = point(0.4, 0.52, 0)
    landmarks[20] = point(0.4, 0.55, 0)   // Pinky tip (below MCP = curled)

    return landmarks
  }

  it('should return unknown for too few landmarks', () => {
    expect(recognizeGesture([point(0, 0)])).toBe('unknown')
    expect(recognizeGesture([])).toBe('unknown')
  })

  it('should recognize closed fist', () => {
    const hand = createBaseHand()
    // All fingers already curled in base hand
    const result = recognizeGesture(hand)
    expect(result).toBe('closed')
  })

  it('should recognize open hand', () => {
    const hand = createBaseHand()
    // Extend all fingers (tips above MCPs)
    hand[8] = point(0.55, 0.3, 0)   // Index extended
    hand[12] = point(0.5, 0.3, 0)   // Middle extended
    hand[16] = point(0.45, 0.3, 0)  // Ring extended
    hand[20] = point(0.4, 0.3, 0)   // Pinky extended

    const result = recognizeGesture(hand)
    expect(result).toBe('open')
  })

  it('should recognize pointing gesture', () => {
    const hand = createBaseHand()
    // Only index extended
    hand[8] = point(0.55, 0.3, 0)  // Index extended (tip above MCP)

    const result = recognizeGesture(hand)
    expect(result).toBe('pointing')
  })

  it('should recognize peace sign', () => {
    const hand = createBaseHand()
    // Index and middle extended
    hand[8] = point(0.55, 0.3, 0)   // Index extended
    hand[12] = point(0.5, 0.3, 0)   // Middle extended

    const result = recognizeGesture(hand)
    expect(result).toBe('peace')
  })

  it('should recognize pinch gesture', () => {
    const hand = createBaseHand()
    // Thumb and index very close together
    hand[4] = point(0.5, 0.4, 0)   // Thumb tip
    hand[8] = point(0.5, 0.4, 0)   // Index tip (same position = pinch)

    const result = recognizeGesture(hand)
    expect(result).toBe('pinch')
  })

  it('should recognize thumbs up', () => {
    const hand = createBaseHand()
    // Wrist at center, thumb extended up
    hand[0] = point(0.5, 0.5, 0)   // Wrist
    hand[4] = point(0.5, 0.3, 0)   // Thumb tip well above wrist
    // All other fingers remain curled (below their MCPs)

    const result = recognizeGesture(hand)
    expect(result).toBe('thumbs_up')
  })

  it('should recognize thumbs down', () => {
    const hand = createBaseHand()
    // Wrist at center, thumb extended down
    hand[0] = point(0.5, 0.5, 0)   // Wrist
    hand[4] = point(0.5, 0.7, 0)   // Thumb tip well below wrist
    // All other fingers remain curled

    const result = recognizeGesture(hand)
    expect(result).toBe('thumbs_down')
  })
})

describe('MediaPipeService - extractHeadRotation', () => {
  it('should return zeros for invalid matrix', () => {
    const result = extractHeadRotation(new Float32Array([1, 2, 3]))

    expect(result.pitch).toBe(0)
    expect(result.yaw).toBe(0)
    expect(result.roll).toBe(0)
  })

  it('should extract rotation from identity matrix', () => {
    // 4x4 identity matrix
    const identity = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])

    const result = extractHeadRotation(identity)

    expect(result.pitch).toBeCloseTo(0, 1)
    expect(result.yaw).toBeCloseTo(0, 1)
    expect(result.roll).toBeCloseTo(0, 1)
  })

  it('should detect pitch rotation (looking up/down)', () => {
    // Matrix with pitch rotation (around X axis)
    const angle = Math.PI / 4 // 45 degrees
    const matrix = new Float32Array([
      1, 0, 0, 0,
      0, Math.cos(angle), -Math.sin(angle), 0,
      0, Math.sin(angle), Math.cos(angle), 0,
      0, 0, 0, 1,
    ])

    const result = extractHeadRotation(matrix)

    // Pitch should be approximately 45 degrees
    expect(Math.abs(result.pitch)).toBeGreaterThan(30)
  })

  it('should detect yaw rotation (looking left/right)', () => {
    // Matrix with yaw rotation (around Y axis)
    const angle = Math.PI / 4 // 45 degrees
    const matrix = new Float32Array([
      Math.cos(angle), 0, Math.sin(angle), 0,
      0, 1, 0, 0,
      -Math.sin(angle), 0, Math.cos(angle), 0,
      0, 0, 0, 1,
    ])

    const result = extractHeadRotation(matrix)

    // Yaw should be approximately 45 degrees
    expect(Math.abs(result.yaw)).toBeGreaterThan(30)
  })
})

describe('MediaPipeService - calculateFaceBox', () => {
  it('should return zero box for empty landmarks', () => {
    const result = calculateFaceBox([])

    expect(result.x).toBe(0)
    expect(result.y).toBe(0)
    expect(result.width).toBe(0)
    expect(result.height).toBe(0)
  })

  it('should calculate bounding box from landmarks', () => {
    const landmarks: Point3D[] = [
      point(0.2, 0.3, 0),
      point(0.8, 0.3, 0),
      point(0.5, 0.1, 0),
      point(0.5, 0.9, 0),
    ]

    const result = calculateFaceBox(landmarks)

    expect(result.x).toBeCloseTo(0.2, 5)
    expect(result.y).toBeCloseTo(0.1, 5)
    expect(result.width).toBeCloseTo(0.6, 5)  // 0.8 - 0.2
    expect(result.height).toBeCloseTo(0.8, 5) // 0.9 - 0.1
  })

  it('should handle single point', () => {
    const result = calculateFaceBox([point(0.5, 0.5, 0)])

    expect(result.x).toBe(0.5)
    expect(result.y).toBe(0.5)
    expect(result.width).toBe(0)
    expect(result.height).toBe(0)
  })

  it('should correctly find min/max across many points', () => {
    const landmarks: Point3D[] = Array(100).fill(null).map((_, i) => {
      const angle = (i / 100) * Math.PI * 2
      return point(
        0.5 + Math.cos(angle) * 0.2,
        0.5 + Math.sin(angle) * 0.3,
        0
      )
    })

    const result = calculateFaceBox(landmarks)

    expect(result.x).toBeCloseTo(0.3, 1)     // 0.5 - 0.2
    expect(result.y).toBeCloseTo(0.2, 1)     // 0.5 - 0.3
    expect(result.width).toBeCloseTo(0.4, 1)  // 0.2 * 2
    expect(result.height).toBeCloseTo(0.6, 1) // 0.3 * 2
  })
})

describe('MediaPipeService - extractBlendshapeValues', () => {
  it('should convert blendshapes array to record', () => {
    const blendshapes = [
      { categoryName: 'mouthSmile', score: 0.8 },
      { categoryName: 'eyeBlinkLeft', score: 0.2 },
      { categoryName: 'eyeBlinkRight', score: 0.1 },
    ]

    const result = extractBlendshapeValues(blendshapes)

    expect(result.mouthSmile).toBe(0.8)
    expect(result.eyeBlinkLeft).toBe(0.2)
    expect(result.eyeBlinkRight).toBe(0.1)
  })

  it('should return empty record for empty array', () => {
    const result = extractBlendshapeValues([])
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('should handle many blendshapes', () => {
    const blendshapes = Array(52).fill(null).map((_, i) => ({
      categoryName: `blendshape_${i}`,
      score: i / 52,
    }))

    const result = extractBlendshapeValues(blendshapes)

    expect(Object.keys(result)).toHaveLength(52)
    expect(result.blendshape_0).toBe(0)
    expect(result.blendshape_51).toBeCloseTo(51/52, 5)
  })
})

describe('MediaPipeService - gesture recognition edge cases', () => {
  it('should handle exactly 21 landmarks', () => {
    const landmarks = Array(21).fill(null).map(() => point(0.5, 0.5, 0))
    const result = recognizeGesture(landmarks)
    // With all points at same location, should return something (likely unknown)
    expect(['open', 'closed', 'pointing', 'peace', 'thumbs_up', 'thumbs_down', 'pinch', 'unknown']).toContain(result)
  })

  it('should handle landmarks with z values', () => {
    const landmarks = Array(21).fill(null).map((_, i) => point(i * 0.05, i * 0.05, i * 0.01))
    const result = recognizeGesture(landmarks)
    // Should not crash with z values
    expect(typeof result).toBe('string')
  })

  it('should handle negative coordinates', () => {
    const landmarks = Array(21).fill(null).map((_, i) => point(i * 0.1 - 1, i * 0.1 - 1, 0))
    const result = recognizeGesture(landmarks)
    // Should not crash with negative values
    expect(typeof result).toBe('string')
  })
})
