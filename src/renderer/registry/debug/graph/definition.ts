import type { NodeDefinition } from '@/stores/nodes'

export const graphNode: NodeDefinition = {
  id: 'graph',
  name: 'Graph',
  version: '1.0.0',
  category: 'debug',
  description: 'Plot X/Y values with dynamic point inputs',
  icon: 'line-chart',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'x0', type: 'number', label: 'X' },
    { id: 'y0', type: 'number', label: 'Y' },
  ],
  outputs: [],
  controls: [
    { id: 'pointCount', type: 'number', label: 'Points', default: 1, props: { min: 1, max: 8 } },
    { id: 'displayMode', type: 'select', label: 'Mode', default: 'line', props: { options: ['line', 'scatter'] } },
    { id: 'showGrid', type: 'toggle', label: 'Grid', default: true },
    { id: 'autoScale', type: 'toggle', label: 'Auto Scale', default: true },
  ],
}
