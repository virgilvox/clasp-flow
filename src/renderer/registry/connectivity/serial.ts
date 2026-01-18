import type { NodeDefinition } from '../types'

export const serialNode: NodeDefinition = {
  id: 'serial',
  name: 'Serial Port',
  version: '1.0.0',
  category: 'connectivity',
  description: 'Serial port communication (Web Serial API)',
  icon: 'usb',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'send', type: 'string', label: 'Send' },
  ],
  outputs: [
    { id: 'data', type: 'string', label: 'Raw Data' },
    { id: 'line', type: 'string', label: 'Last Line' },
    { id: 'value', type: 'number', label: 'Value' },
    { id: 'connected', type: 'boolean', label: 'Connected' },
    { id: 'error', type: 'string', label: 'Error' },
  ],
  controls: [
    { id: 'baudRate', type: 'select', label: 'Baud Rate', default: 9600, props: { options: [9600, 19200, 38400, 57600, 115200] } },
    { id: 'connect', type: 'toggle', label: 'Connect', default: false },
  ],
}
