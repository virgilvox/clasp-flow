import type { NodeDefinition } from '../types'

export const bleNode: NodeDefinition = {
  id: 'ble',
  name: 'Bluetooth LE',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Bluetooth Low Energy communication (Web Bluetooth API)',
  icon: 'bluetooth',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'send', type: 'data', label: 'Send' },
  ],
  outputs: [
    { id: 'value', type: 'number', label: 'Value' },
    { id: 'text', type: 'string', label: 'Text' },
    { id: 'rawValue', type: 'data', label: 'Raw Value' },
    { id: 'deviceName', type: 'string', label: 'Device Name' },
    { id: 'connected', type: 'boolean', label: 'Connected' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'serviceUUID', type: 'text', label: 'Service UUID', default: '', props: { placeholder: 'e.g., heart_rate or 0000180d-...' } },
    { id: 'characteristicUUID', type: 'text', label: 'Characteristic UUID', default: '', props: { placeholder: 'UUID' } },
    { id: 'connect', type: 'toggle', label: 'Connect', default: false },
  ],
}
