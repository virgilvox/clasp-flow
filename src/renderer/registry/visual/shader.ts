import type { NodeDefinition } from '../types'

export const shaderNode: NodeDefinition = {
  id: 'shader',
  name: 'Shader',
  version: '1.0.0',
  category: 'visual',
  description: 'Custom GLSL shader (Shadertoy compatible)',
  icon: 'code',
  platforms: ['web', 'electron'],
  inputs: [
    { id: 'param1', type: 'number', label: 'Param 1' },
    { id: 'param2', type: 'number', label: 'Param 2' },
    { id: 'param3', type: 'number', label: 'Param 3' },
    { id: 'param4', type: 'number', label: 'Param 4' },
    { id: 'texture0', type: 'texture', label: 'Texture 0' },
    { id: 'texture1', type: 'texture', label: 'Texture 1' },
  ],
  outputs: [{ id: 'texture', type: 'texture', label: 'Texture' }],
  controls: [
    { id: 'code', type: 'code', label: 'GLSL Code', default: `void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));
  fragColor = vec4(col, 1.0);
}` },
    { id: 'shadertoy', type: 'toggle', label: 'Shadertoy Mode', default: true },
  ],
}
