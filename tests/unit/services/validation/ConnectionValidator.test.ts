import { describe, it, expect, beforeEach } from 'vitest'
import {
  ConnectionValidator,
  getConnectionValidator,
  type NodeInfo,
  type ConnectionInfo,
  type NodeDefinitionWithConnections,
} from '@/services/validation/ConnectionValidator'
import type { NodeConnectionRequirement } from '@/services/connections/types'

describe('ConnectionValidator', () => {
  let validator: ConnectionValidator

  beforeEach(() => {
    validator = new ConnectionValidator()
  })

  describe('validateNode', () => {
    const createNode = (id: string, type: string, data: Record<string, unknown> = {}): NodeInfo => ({
      id,
      type,
      data,
    })

    const createConnection = (
      id: string,
      status: ConnectionInfo['status'],
      error?: string
    ): ConnectionInfo => ({
      id,
      status,
      error,
    })

    const createDefinition = (
      id: string,
      connections: NodeConnectionRequirement[] = []
    ): NodeDefinitionWithConnections => ({
      id,
      connections,
    })

    describe('No Connection Requirements', () => {
      it('should return valid if node has no connection requirements', () => {
        const node = createNode('node-1', 'simple-node')
        const definition = createDefinition('simple-node')

        const result = validator.validateNode(node, definition, () => undefined)

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
        expect(result.warnings).toHaveLength(0)
      })

      it('should return valid if definition is undefined', () => {
        const node = createNode('node-1', 'unknown-node')

        const result = validator.validateNode(node, undefined, () => undefined)

        expect(result.valid).toBe(true)
      })

      it('should return valid if connections array is empty', () => {
        const node = createNode('node-1', 'node-type')
        const definition = createDefinition('node-type', [])

        const result = validator.validateNode(node, definition, () => undefined)

        expect(result.valid).toBe(true)
      })
    })

    describe('Required Connection Missing', () => {
      it('should return error if required connection is not configured', () => {
        const node = createNode('node-1', 'mqtt-node', {})
        const definition = createDefinition('mqtt-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: true,
            label: 'MQTT Connection',
          },
        ])

        const result = validator.validateNode(node, definition, () => undefined)

        expect(result.valid).toBe(false)
        expect(result.errors).toHaveLength(1)
        expect(result.errors[0].code).toBe('MISSING_CONNECTION')
        expect(result.errors[0].message).toContain('mqtt')
      })

      it('should not error if optional connection is not configured', () => {
        const node = createNode('node-1', 'optional-node', {})
        const definition = createDefinition('optional-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: false,
            label: 'Optional MQTT',
          },
        ])

        const result = validator.validateNode(node, definition, () => undefined)

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    describe('Connection Not Found', () => {
      it('should return error if connection ID does not exist', () => {
        const node = createNode('node-1', 'mqtt-node', {
          mqttConnection: 'non-existent-connection',
        })
        const definition = createDefinition('mqtt-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: true,
            label: 'MQTT Connection',
          },
        ])

        const result = validator.validateNode(node, definition, () => undefined)

        expect(result.valid).toBe(false)
        expect(result.errors).toHaveLength(1)
        expect(result.errors[0].code).toBe('INVALID_CONFIG')
        expect(result.errors[0].message).toContain('non-existent-connection')
      })
    })

    describe('Connection Status: Connected', () => {
      it('should return valid for connected connection', () => {
        const node = createNode('node-1', 'mqtt-node', {
          mqttConnection: 'mqtt-1',
        })
        const definition = createDefinition('mqtt-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: true,
            label: 'MQTT Connection',
          },
        ])

        const result = validator.validateNode(node, definition, (id) =>
          id === 'mqtt-1' ? createConnection('mqtt-1', 'connected') : undefined
        )

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
        expect(result.warnings).toHaveLength(0)
      })
    })

    describe('Connection Status: Connecting/Reconnecting', () => {
      it('should return warning for connecting connection', () => {
        const node = createNode('node-1', 'mqtt-node', {
          mqttConnection: 'mqtt-1',
        })
        const definition = createDefinition('mqtt-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: true,
            label: 'MQTT Connection',
          },
        ])

        const result = validator.validateNode(node, definition, (id) =>
          id === 'mqtt-1' ? createConnection('mqtt-1', 'connecting') : undefined
        )

        expect(result.valid).toBe(true) // Still valid, just a warning
        expect(result.warnings).toHaveLength(1)
        expect(result.warnings[0].code).toBe('RECONNECTING')
      })

      it('should return warning for reconnecting connection', () => {
        const node = createNode('node-1', 'mqtt-node', {
          mqttConnection: 'mqtt-1',
        })
        const definition = createDefinition('mqtt-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: true,
            label: 'MQTT Connection',
          },
        ])

        const result = validator.validateNode(node, definition, (id) =>
          id === 'mqtt-1' ? createConnection('mqtt-1', 'reconnecting') : undefined
        )

        expect(result.valid).toBe(true)
        expect(result.warnings).toHaveLength(1)
        expect(result.warnings[0].code).toBe('RECONNECTING')
      })
    })

    describe('Connection Status: Error', () => {
      it('should return error for required connection in error state', () => {
        const node = createNode('node-1', 'mqtt-node', {
          mqttConnection: 'mqtt-1',
        })
        const definition = createDefinition('mqtt-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: true,
            label: 'MQTT Connection',
          },
        ])

        const result = validator.validateNode(node, definition, (id) =>
          id === 'mqtt-1'
            ? createConnection('mqtt-1', 'error', 'Authentication failed')
            : undefined
        )

        expect(result.valid).toBe(false)
        expect(result.errors).toHaveLength(1)
        expect(result.errors[0].code).toBe('ERROR_STATE')
        expect(result.errors[0].message).toContain('Authentication failed')
      })

      it('should return warning for optional connection in error state', () => {
        const node = createNode('node-1', 'mqtt-node', {
          mqttConnection: 'mqtt-1',
        })
        const definition = createDefinition('mqtt-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: false,
            label: 'Optional MQTT',
          },
        ])

        const result = validator.validateNode(node, definition, (id) =>
          id === 'mqtt-1' ? createConnection('mqtt-1', 'error', 'Timeout') : undefined
        )

        expect(result.valid).toBe(true) // Optional, so still valid
        expect(result.warnings).toHaveLength(1)
        expect(result.warnings[0].code).toBe('UNSTABLE')
      })

      it('should handle error state with no error message', () => {
        const node = createNode('node-1', 'mqtt-node', {
          mqttConnection: 'mqtt-1',
        })
        const definition = createDefinition('mqtt-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: true,
            label: 'MQTT Connection',
          },
        ])

        const result = validator.validateNode(node, definition, (id) =>
          id === 'mqtt-1' ? createConnection('mqtt-1', 'error') : undefined
        )

        expect(result.valid).toBe(false)
        expect(result.errors[0].message).toContain('Unknown error')
      })
    })

    describe('Connection Status: Disconnected', () => {
      it('should return error for required disconnected connection', () => {
        const node = createNode('node-1', 'mqtt-node', {
          mqttConnection: 'mqtt-1',
        })
        const definition = createDefinition('mqtt-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: true,
            label: 'MQTT Connection',
          },
        ])

        const result = validator.validateNode(node, definition, (id) =>
          id === 'mqtt-1' ? createConnection('mqtt-1', 'disconnected') : undefined
        )

        expect(result.valid).toBe(false)
        expect(result.errors).toHaveLength(1)
        expect(result.errors[0].code).toBe('DISCONNECTED')
      })

      it('should not error for optional disconnected connection', () => {
        const node = createNode('node-1', 'mqtt-node', {
          mqttConnection: 'mqtt-1',
        })
        const definition = createDefinition('mqtt-node', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: false,
            label: 'Optional MQTT',
          },
        ])

        const result = validator.validateNode(node, definition, (id) =>
          id === 'mqtt-1' ? createConnection('mqtt-1', 'disconnected') : undefined
        )

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    describe('Multiple Connections', () => {
      it('should validate all connections', () => {
        const node = createNode('node-1', 'multi-connection', {
          mqttConnection: 'mqtt-1',
          claspConnection: 'clasp-1',
        })
        const definition = createDefinition('multi-connection', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: true,
            label: 'MQTT Connection',
          },
          {
            protocol: 'clasp',
            controlId: 'claspConnection',
            required: true,
            label: 'CLASP Connection',
          },
        ])

        const connections: Record<string, ConnectionInfo> = {
          'mqtt-1': { id: 'mqtt-1', status: 'connected' },
          'clasp-1': { id: 'clasp-1', status: 'disconnected' },
        }

        const result = validator.validateNode(node, definition, (id) => connections[id])

        expect(result.valid).toBe(false)
        expect(result.errors).toHaveLength(1)
        expect(result.errors[0].requirement.protocol).toBe('clasp')
      })

      it('should collect all errors and warnings', () => {
        const node = createNode('node-1', 'multi-connection', {
          mqttConnection: 'mqtt-1',
          claspConnection: 'clasp-1',
          oscConnection: 'osc-1',
        })
        const definition = createDefinition('multi-connection', [
          {
            protocol: 'mqtt',
            controlId: 'mqttConnection',
            required: true,
            label: 'MQTT',
          },
          {
            protocol: 'clasp',
            controlId: 'claspConnection',
            required: true,
            label: 'CLASP',
          },
          {
            protocol: 'osc',
            controlId: 'oscConnection',
            required: true,
            label: 'OSC',
          },
        ])

        const connections: Record<string, ConnectionInfo> = {
          'mqtt-1': { id: 'mqtt-1', status: 'error', error: 'Failed' },
          'clasp-1': { id: 'clasp-1', status: 'connecting' },
          'osc-1': { id: 'osc-1', status: 'disconnected' },
        }

        const result = validator.validateNode(node, definition, (id) => connections[id])

        expect(result.valid).toBe(false)
        expect(result.errors).toHaveLength(2) // mqtt error + osc disconnected
        expect(result.warnings).toHaveLength(1) // clasp connecting
      })
    })
  })

  describe('validateFlow', () => {
    it('should validate all nodes in flow', () => {
      const nodes: NodeInfo[] = [
        { id: 'node-1', type: 'mqtt-publisher', data: { mqttConnection: 'mqtt-1' } },
        { id: 'node-2', type: 'mqtt-subscriber', data: { mqttConnection: 'mqtt-1' } },
        { id: 'node-3', type: 'simple-node', data: {} },
      ]

      const definitions: Record<string, NodeDefinitionWithConnections> = {
        'mqtt-publisher': {
          id: 'mqtt-publisher',
          connections: [
            { protocol: 'mqtt', controlId: 'mqttConnection', required: true, label: 'MQTT' },
          ],
        },
        'mqtt-subscriber': {
          id: 'mqtt-subscriber',
          connections: [
            { protocol: 'mqtt', controlId: 'mqttConnection', required: true, label: 'MQTT' },
          ],
        },
        'simple-node': {
          id: 'simple-node',
        },
      }

      const connections: Record<string, ConnectionInfo> = {
        'mqtt-1': { id: 'mqtt-1', status: 'connected' },
      }

      const result = validator.validateFlow(
        nodes,
        (type) => definitions[type],
        (id) => connections[id]
      )

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should aggregate errors from all nodes', () => {
      const nodes: NodeInfo[] = [
        { id: 'node-1', type: 'mqtt-node', data: { mqttConnection: 'mqtt-1' } },
        { id: 'node-2', type: 'clasp-node', data: { claspConnection: 'clasp-1' } },
      ]

      const definitions: Record<string, NodeDefinitionWithConnections> = {
        'mqtt-node': {
          id: 'mqtt-node',
          connections: [
            { protocol: 'mqtt', controlId: 'mqttConnection', required: true, label: 'MQTT' },
          ],
        },
        'clasp-node': {
          id: 'clasp-node',
          connections: [
            { protocol: 'clasp', controlId: 'claspConnection', required: true, label: 'CLASP' },
          ],
        },
      }

      const connections: Record<string, ConnectionInfo> = {
        'mqtt-1': { id: 'mqtt-1', status: 'disconnected' },
        'clasp-1': { id: 'clasp-1', status: 'error', error: 'Timeout' },
      }

      const result = validator.validateFlow(
        nodes,
        (type) => definitions[type],
        (id) => connections[id]
      )

      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(2)
      expect(result.errors.map((e) => e.nodeId)).toContain('node-1')
      expect(result.errors.map((e) => e.nodeId)).toContain('node-2')
    })

    it('should handle empty flow', () => {
      const result = validator.validateFlow(
        [],
        () => undefined,
        () => undefined
      )

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('formatResult', () => {
    it('should format errors', () => {
      const result = {
        valid: false,
        errors: [
          {
            nodeId: 'node-1',
            requirement: { protocol: 'mqtt', controlId: 'conn', required: true, label: 'MQTT' },
            message: 'MQTT connection required',
            code: 'MISSING_CONNECTION' as const,
          },
        ],
        warnings: [],
      }

      const formatted = validator.formatResult(result)

      expect(formatted).toContain('Errors:')
      expect(formatted).toContain('MQTT connection required')
    })

    it('should format warnings', () => {
      const result = {
        valid: true,
        errors: [],
        warnings: [
          {
            nodeId: 'node-1',
            message: 'Connection is reconnecting',
            code: 'RECONNECTING' as const,
          },
        ],
      }

      const formatted = validator.formatResult(result)

      expect(formatted).toContain('Warnings:')
      expect(formatted).toContain('Connection is reconnecting')
    })

    it('should format success message', () => {
      const result = {
        valid: true,
        errors: [],
        warnings: [],
      }

      const formatted = validator.formatResult(result)

      expect(formatted).toContain('All connections valid')
    })

    it('should format both errors and warnings', () => {
      const result = {
        valid: false,
        errors: [
          {
            nodeId: 'node-1',
            requirement: { protocol: 'mqtt', controlId: 'conn', required: true, label: 'MQTT' },
            message: 'Connection failed',
            code: 'ERROR_STATE' as const,
          },
        ],
        warnings: [
          {
            nodeId: 'node-2',
            message: 'Connection reconnecting',
            code: 'RECONNECTING' as const,
          },
        ],
      }

      const formatted = validator.formatResult(result)

      expect(formatted).toContain('Errors:')
      expect(formatted).toContain('Connection failed')
      expect(formatted).toContain('Warnings:')
      expect(formatted).toContain('Connection reconnecting')
    })
  })

  describe('getConnectionValidator (Singleton)', () => {
    it('should return same instance', () => {
      const validator1 = getConnectionValidator()
      const validator2 = getConnectionValidator()
      expect(validator1).toBe(validator2)
    })
  })
})
