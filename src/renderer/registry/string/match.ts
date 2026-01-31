import type { NodeDefinition } from '../types'

export const stringMatchNode: NodeDefinition = {
  id: 'string-match',
  name: 'Regex Match',
  version: '1.0.0',
  category: 'string',
  description: 'Match string against regex pattern',
  icon: 'regex',
  platforms: ['web', 'electron'],
  inputs: [{ id: 'input', type: 'string', label: 'Input' }],
  outputs: [
    { id: 'match', type: 'boolean', label: 'Match' },
    { id: 'groups', type: 'array', label: 'Groups' },
    { id: 'fullMatch', type: 'string', label: 'Full Match' },
  ],
  controls: [
    { id: 'pattern', type: 'text', label: 'Pattern', default: '.*' },
    { id: 'flags', type: 'text', label: 'Flags', default: '' },
  ],
  tags: ['regex', 'pattern', 'match', 'extract'],
  info: {
    overview: 'Tests a string against a regular expression pattern and outputs whether it matched, the full match text, and any captured groups. Supports standard JavaScript regex flags like g, i, and m.',
    tips: [
      'Use capture groups in your pattern to extract specific parts of the input via the groups output.',
      'Add the "i" flag for case-insensitive matching.',
    ],
    pairsWith: ['string-replace', 'string-contains', 'string-split', 'gate'],
  },
}
