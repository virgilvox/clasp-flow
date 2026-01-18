import type { NodeDefinition } from '../types'

export const httpRequestNode: NodeDefinition = {
  id: 'http-request',
  name: 'HTTP Request',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Make HTTP/REST API requests',
  icon: 'globe',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'url', type: 'string', label: 'URL' },
    { id: 'headers', type: 'data', label: 'Headers' },
    { id: 'body', type: 'data', label: 'Body' },
    { id: 'trigger', type: 'trigger', label: 'Fetch' },
  ],
  outputs: [
    { id: 'response', type: 'data', label: 'Response' },
    { id: 'status', type: 'number', label: 'Status' },
    { id: 'error', type: 'string', label: 'Error' },
    { id: 'loading', type: 'boolean', label: 'Loading' },
  ],
  controls: [
    { id: 'url', type: 'text', label: 'URL', default: 'https://api.example.com/data' },
    { id: 'method', type: 'select', label: 'Method', default: 'GET', props: { options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] } },
  ],
}
