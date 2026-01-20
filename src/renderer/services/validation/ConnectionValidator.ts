/**
 * Connection Validator
 *
 * Validates that nodes have their required connections configured and connected
 * before flow execution.
 */

import type {
  ConnectionValidationResult,
  ConnectionValidationError,
  ConnectionValidationWarning,
  NodeConnectionRequirement,
  ConnectionStatus,
} from '../connections/types'

// ============================================================================
// Types
// ============================================================================

export interface NodeInfo {
  id: string
  type: string
  data: Record<string, unknown>
}

export interface ConnectionInfo {
  id: string
  status: ConnectionStatus
  error?: string
}

export interface NodeDefinitionWithConnections {
  id: string
  connections?: NodeConnectionRequirement[]
}

// ============================================================================
// Validator Class
// ============================================================================

export class ConnectionValidator {
  /**
   * Validate a single node's connections
   */
  validateNode(
    node: NodeInfo,
    nodeDefinition: NodeDefinitionWithConnections | undefined,
    getConnection: (id: string) => ConnectionInfo | undefined
  ): ConnectionValidationResult {
    const errors: ConnectionValidationError[] = []
    const warnings: ConnectionValidationWarning[] = []

    // If no connection requirements defined, node is valid
    if (!nodeDefinition?.connections || nodeDefinition.connections.length === 0) {
      return { valid: true, errors, warnings }
    }

    for (const requirement of nodeDefinition.connections) {
      // Get the connection ID from the node's data
      const connectionId = node.data[requirement.controlId] as string | undefined

      if (!connectionId) {
        // No connection selected
        if (requirement.required) {
          errors.push({
            nodeId: node.id,
            requirement,
            message: `Required ${requirement.protocol} connection not configured`,
            code: 'MISSING_CONNECTION',
          })
        }
        continue
      }

      // Get connection status
      const connection = getConnection(connectionId)

      if (!connection) {
        errors.push({
          nodeId: node.id,
          requirement,
          message: `Connection "${connectionId}" not found`,
          code: 'INVALID_CONFIG',
        })
        continue
      }

      // Check connection status
      switch (connection.status) {
        case 'connected':
          // All good
          break

        case 'connecting':
        case 'reconnecting':
          warnings.push({
            nodeId: node.id,
            message: `Connection "${connectionId}" is ${connection.status}`,
            code: 'RECONNECTING',
          })
          break

        case 'error':
          if (requirement.required) {
            errors.push({
              nodeId: node.id,
              requirement,
              message: `Connection "${connectionId}" has error: ${connection.error || 'Unknown error'}`,
              code: 'ERROR_STATE',
            })
          } else {
            warnings.push({
              nodeId: node.id,
              message: `Optional connection "${connectionId}" has error: ${connection.error || 'Unknown error'}`,
              code: 'UNSTABLE',
            })
          }
          break

        case 'disconnected':
          if (requirement.required) {
            errors.push({
              nodeId: node.id,
              requirement,
              message: `Required connection "${connectionId}" is disconnected`,
              code: 'DISCONNECTED',
            })
          }
          break
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }

  /**
   * Validate all nodes in a flow
   */
  validateFlow(
    nodes: NodeInfo[],
    getNodeDefinition: (nodeType: string) => NodeDefinitionWithConnections | undefined,
    getConnection: (id: string) => ConnectionInfo | undefined
  ): ConnectionValidationResult {
    const allErrors: ConnectionValidationError[] = []
    const allWarnings: ConnectionValidationWarning[] = []

    for (const node of nodes) {
      const definition = getNodeDefinition(node.type)
      const result = this.validateNode(node, definition, getConnection)
      allErrors.push(...result.errors)
      allWarnings.push(...result.warnings)
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    }
  }

  /**
   * Format validation result for display
   */
  formatResult(result: ConnectionValidationResult): string {
    const lines: string[] = []

    if (result.errors.length > 0) {
      lines.push('Errors:')
      for (const error of result.errors) {
        lines.push(`  - ${error.message}`)
      }
    }

    if (result.warnings.length > 0) {
      lines.push('Warnings:')
      for (const warning of result.warnings) {
        lines.push(`  - ${warning.message}`)
      }
    }

    if (result.valid && result.warnings.length === 0) {
      lines.push('All connections valid')
    }

    return lines.join('\n')
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let instance: ConnectionValidator | null = null

/**
 * Get the connection validator instance
 */
export function getConnectionValidator(): ConnectionValidator {
  if (!instance) {
    instance = new ConnectionValidator()
  }
  return instance
}
