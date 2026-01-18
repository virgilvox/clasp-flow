import { describe, it, expect } from 'vitest'
import { areTypesCompatible, validateConnection } from '@/utils/connections'
import type { NodeDefinition, DataType } from '@/stores/nodes'

describe('connections utility', () => {
  describe('areTypesCompatible', () => {
    it('allows any type to connect to any', () => {
      const types: DataType[] = ['trigger', 'number', 'string', 'boolean', 'audio', 'video', 'texture', 'data', 'array']
      for (const type of types) {
        expect(areTypesCompatible(type, 'any')).toBe(true)
      }
    })

    it('allows same type connections', () => {
      const types: DataType[] = ['trigger', 'number', 'string', 'boolean', 'audio', 'video', 'texture', 'data', 'array']
      for (const type of types) {
        expect(areTypesCompatible(type, type)).toBe(true)
      }
    })

    it('allows number to string coercion', () => {
      expect(areTypesCompatible('number', 'string')).toBe(true)
    })

    it('allows number to boolean coercion', () => {
      expect(areTypesCompatible('number', 'boolean')).toBe(true)
    })

    it('allows boolean to number coercion', () => {
      expect(areTypesCompatible('boolean', 'number')).toBe(true)
    })

    it('allows boolean to string coercion', () => {
      expect(areTypesCompatible('boolean', 'string')).toBe(true)
    })

    it('prevents audio to number connection', () => {
      expect(areTypesCompatible('audio', 'number')).toBe(false)
    })

    it('prevents video to audio connection', () => {
      expect(areTypesCompatible('video', 'audio')).toBe(false)
    })

    it('prevents trigger to number connection', () => {
      expect(areTypesCompatible('trigger', 'number')).toBe(false)
    })

    it('prevents string to number connection', () => {
      expect(areTypesCompatible('string', 'number')).toBe(false)
    })
  })

  describe('validateConnection', () => {
    const mockDefinitions: Record<string, NodeDefinition> = {
      constant: {
        id: 'constant',
        name: 'Constant',
        version: '1.0.0',
        category: 'inputs',
        description: 'Output a constant value',
        icon: 'hash',
        platforms: ['web', 'electron'],
        inputs: [],
        outputs: [{ id: 'value', type: 'number', label: 'Value' }],
        controls: [],
      },
      monitor: {
        id: 'monitor',
        name: 'Monitor',
        version: '1.0.0',
        category: 'debug',
        description: 'Display values',
        icon: 'eye',
        platforms: ['web', 'electron'],
        inputs: [{ id: 'value', type: 'any', label: 'Value' }],
        outputs: [],
        controls: [],
      },
      'audio-output': {
        id: 'audio-output',
        name: 'Audio Output',
        version: '1.0.0',
        category: 'outputs',
        description: 'Output audio',
        icon: 'speaker',
        platforms: ['web', 'electron'],
        inputs: [{ id: 'audio', type: 'audio', label: 'Audio' }],
        outputs: [],
        controls: [],
      },
    }

    const mockNodeData: Record<string, { nodeType: string }> = {
      node1: { nodeType: 'constant' },
      node2: { nodeType: 'monitor' },
      node3: { nodeType: 'audio-output' },
    }

    const getDefinition = (nodeType: string) => mockDefinitions[nodeType]
    const getNodeData = (nodeId: string) => mockNodeData[nodeId]

    it('allows valid number to any connection', () => {
      const result = validateConnection(
        { source: 'node1', sourceHandle: 'value', target: 'node2', targetHandle: 'value' },
        getDefinition,
        getNodeData
      )
      expect(result.valid).toBe(true)
    })

    it('rejects connection to self', () => {
      const result = validateConnection(
        { source: 'node1', sourceHandle: 'value', target: 'node1', targetHandle: 'value' },
        getDefinition,
        getNodeData
      )
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('itself')
    })

    it('rejects incompatible type connection', () => {
      const result = validateConnection(
        { source: 'node1', sourceHandle: 'value', target: 'node3', targetHandle: 'audio' },
        getDefinition,
        getNodeData
      )
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Cannot connect')
    })

    it('rejects connection with missing data', () => {
      const result = validateConnection(
        { source: '', sourceHandle: 'value', target: 'node2', targetHandle: 'value' },
        getDefinition,
        getNodeData
      )
      expect(result.valid).toBe(false)
    })
  })
})
