import type { NodeDefinition } from '../types'

export const bleDeviceNode: NodeDefinition = {
  id: 'ble-device',
  name: 'BLE Device',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Connect to a Bluetooth LE device and enumerate its services',
  icon: 'bluetooth-connected',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'device', type: 'data', label: 'Device' },
    { id: 'connect', type: 'trigger', label: 'Connect' },
    { id: 'disconnect', type: 'trigger', label: 'Disconnect' },
  ],
  outputs: [
    { id: 'services', type: 'data', label: 'Services' },
    { id: 'characteristics', type: 'data', label: 'Characteristics' },
    { id: 'deviceName', type: 'string', label: 'Device Name' },
    { id: 'deviceId', type: 'string', label: 'Device ID' },
    { id: 'connected', type: 'boolean', label: 'Connected' },
    { id: 'status', type: 'string', label: 'Status' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    {
      id: 'autoConnect',
      type: 'toggle',
      label: 'Auto Connect',
      default: false,
    },
    {
      id: 'autoReconnect',
      type: 'toggle',
      label: 'Auto Reconnect',
      default: true,
    },
    {
      id: 'serviceUUID',
      type: 'text',
      label: 'Service UUID (optional)',
      default: '',
      props: { placeholder: 'Filter to specific service' },
    },
  ],
}
