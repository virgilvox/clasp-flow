/**
 * String Node Executors
 *
 * These executors handle string manipulation operations
 */

import type { ExecutionContext, NodeExecutorFn } from '../ExecutionEngine'

// ============================================================================
// String Concat
// ============================================================================

export const stringConcatExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const a = (ctx.inputs.get('a') as string) ?? ''
  const b = (ctx.inputs.get('b') as string) ?? ''
  const c = (ctx.inputs.get('c') as string) ?? ''
  const d = (ctx.inputs.get('d') as string) ?? ''
  const separator = (ctx.controls.get('separator') as string) ?? ''

  // Filter out empty strings before joining
  const parts = [a, b, c, d].filter((s) => s !== '')
  const result = parts.join(separator)

  return new Map([['result', result]])
}

// ============================================================================
// String Split
// ============================================================================

export const stringSplitExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const input = (ctx.inputs.get('input') as string) ?? ''
  const separator = (ctx.controls.get('separator') as string) ?? ','
  const limit = (ctx.controls.get('limit') as number) ?? 0

  const outputs = new Map<string, unknown>()

  if (!input) {
    outputs.set('parts', [])
    outputs.set('first', '')
    outputs.set('count', 0)
    return outputs
  }

  // Handle empty separator - return whole string as single element instead of splitting into characters
  if (separator === '') {
    outputs.set('parts', [input])
    outputs.set('first', input)
    outputs.set('count', 1)
    return outputs
  }

  const parts = limit > 0 ? input.split(separator, limit) : input.split(separator)

  outputs.set('parts', parts)
  outputs.set('first', parts[0] ?? '')
  outputs.set('count', parts.length)

  return outputs
}

// ============================================================================
// String Replace
// ============================================================================

export const stringReplaceExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const input = (ctx.inputs.get('input') as string) ?? ''

  // Use nullish coalescing to properly handle empty string inputs
  // If search input is connected (even as empty string), use it; otherwise fall back to control
  const searchInput = ctx.inputs.get('search')
  const replaceInput = ctx.inputs.get('replace')

  const search = searchInput !== undefined
    ? (searchInput as string)
    : ((ctx.controls.get('search') as string) ?? '')
  const replace = replaceInput !== undefined
    ? (replaceInput as string)
    : ((ctx.controls.get('replace') as string) ?? '')
  const useRegex = (ctx.controls.get('useRegex') as boolean) ?? false
  const replaceAll = (ctx.controls.get('replaceAll') as boolean) ?? true

  const outputs = new Map<string, unknown>()

  if (!input || !search) {
    outputs.set('result', input)
    return outputs
  }

  let result: string
  try {
    if (useRegex) {
      const flags = replaceAll ? 'g' : ''
      const regex = new RegExp(search, flags)
      result = input.replace(regex, replace)
    } else {
      if (replaceAll) {
        result = input.split(search).join(replace)
      } else {
        result = input.replace(search, replace)
      }
    }
  } catch {
    // Invalid regex
    result = input
    outputs.set('_error', 'Invalid regex pattern')
  }

  outputs.set('result', result)
  return outputs
}

// ============================================================================
// String Slice
// ============================================================================

export const stringSliceExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const input = (ctx.inputs.get('input') as string) ?? ''
  const startInput = ctx.inputs.get('start') as number | undefined
  const endInput = ctx.inputs.get('end') as number | undefined

  const start = startInput ?? (ctx.controls.get('start') as number) ?? 0
  const endControl = (ctx.controls.get('end') as number) ?? -1
  const end = endInput ?? endControl

  const outputs = new Map<string, unknown>()

  if (!input) {
    outputs.set('result', '')
    outputs.set('length', 0)
    return outputs
  }

  // Handle -1 as "end of string"
  const result = end === -1 ? input.slice(start) : input.slice(start, end)

  outputs.set('result', result)
  outputs.set('length', result.length)

  return outputs
}

// ============================================================================
// String Case
// ============================================================================

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/_+/g, '_')
}

function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
}

function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

export const stringCaseExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const input = (ctx.inputs.get('input') as string) ?? ''
  const mode = (ctx.controls.get('mode') as string) ?? 'UPPER'

  let result: string

  switch (mode) {
    case 'UPPER':
      result = input.toUpperCase()
      break
    case 'lower':
      result = input.toLowerCase()
      break
    case 'Title':
      result = toTitleCase(input)
      break
    case 'camelCase':
      result = toCamelCase(input)
      break
    case 'snake_case':
      result = toSnakeCase(input)
      break
    case 'kebab-case':
      result = toKebabCase(input)
      break
    default:
      result = input
  }

  return new Map([['result', result]])
}

// ============================================================================
// String Length (NEW)
// ============================================================================

export const stringLengthExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const input = (ctx.inputs.get('input') as string) ?? ''

  return new Map([
    ['length', input.length],
    ['isEmpty', input.length === 0 ? 1 : 0],
  ])
}

// ============================================================================
// String Contains (NEW)
// ============================================================================

export const stringContainsExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const input = (ctx.inputs.get('input') as string) ?? ''
  const search = (ctx.inputs.get('search') as string) ?? ''
  const caseSensitive = (ctx.controls.get('caseSensitive') as boolean) ?? true

  if (!input || !search) {
    return new Map([
      ['result', 0],
      ['index', -1],
    ])
  }

  let result: boolean
  let index: number

  if (caseSensitive) {
    index = input.indexOf(search)
    result = index !== -1
  } else {
    index = input.toLowerCase().indexOf(search.toLowerCase())
    result = index !== -1
  }

  return new Map([
    ['result', result ? 1 : 0],
    ['index', index],
  ])
}

// ============================================================================
// String Starts/Ends With (NEW)
// ============================================================================

export const stringStartsEndsExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const input = (ctx.inputs.get('input') as string) ?? ''
  const search = (ctx.inputs.get('search') as string) ?? ''
  const caseSensitive = (ctx.controls.get('caseSensitive') as boolean) ?? true

  if (!input || !search) {
    return new Map([
      ['startsWith', 0],
      ['endsWith', 0],
    ])
  }

  let startsWith: boolean
  let endsWith: boolean

  if (caseSensitive) {
    startsWith = input.startsWith(search)
    endsWith = input.endsWith(search)
  } else {
    const lowerInput = input.toLowerCase()
    const lowerSearch = search.toLowerCase()
    startsWith = lowerInput.startsWith(lowerSearch)
    endsWith = lowerInput.endsWith(lowerSearch)
  }

  return new Map([
    ['startsWith', startsWith ? 1 : 0],
    ['endsWith', endsWith ? 1 : 0],
  ])
}

// ============================================================================
// String Trim (NEW)
// ============================================================================

export const stringTrimExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const input = (ctx.inputs.get('input') as string) ?? ''
  const mode = (ctx.controls.get('mode') as string) ?? 'both'

  let result: string

  switch (mode) {
    case 'both':
      result = input.trim()
      break
    case 'start':
      result = input.trimStart()
      break
    case 'end':
      result = input.trimEnd()
      break
    default:
      result = input.trim()
  }

  return new Map([['result', result]])
}

// ============================================================================
// String Pad (NEW)
// ============================================================================

export const stringPadExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const input = (ctx.inputs.get('input') as string) ?? ''
  const length = (ctx.controls.get('length') as number) ?? 10
  const char = (ctx.controls.get('char') as string) ?? ' '
  const mode = (ctx.controls.get('mode') as string) ?? 'start'

  const padChar = char || ' ' // Ensure at least space

  let result: string

  if (mode === 'start') {
    result = input.padStart(length, padChar)
  } else {
    result = input.padEnd(length, padChar)
  }

  return new Map([['result', result]])
}

// ============================================================================
// String Template (NEW)
// ============================================================================

export const stringTemplateExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const a = ctx.inputs.get('a')
  const b = ctx.inputs.get('b')
  const c = ctx.inputs.get('c')
  const d = ctx.inputs.get('d')
  const template = (ctx.controls.get('template') as string) ?? ''

  // Replace placeholders {a}, {b}, {c}, {d} with values
  const result = template
    .replace(/\{a\}/g, String(a ?? ''))
    .replace(/\{b\}/g, String(b ?? ''))
    .replace(/\{c\}/g, String(c ?? ''))
    .replace(/\{d\}/g, String(d ?? ''))

  return new Map([['result', result]])
}

// ============================================================================
// String Match (Regex) (NEW)
// ============================================================================

export const stringMatchExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const input = (ctx.inputs.get('input') as string) ?? ''
  const pattern = (ctx.controls.get('pattern') as string) ?? '.*'
  const flags = (ctx.controls.get('flags') as string) ?? ''

  const outputs = new Map<string, unknown>()

  try {
    const regex = new RegExp(pattern, flags)
    const match = input.match(regex)

    if (match) {
      outputs.set('match', 1)
      outputs.set('groups', match.slice(1)) // Capture groups
      outputs.set('fullMatch', match[0])
    } else {
      outputs.set('match', 0)
      outputs.set('groups', [])
      outputs.set('fullMatch', '')
    }
  } catch {
    // Invalid regex
    outputs.set('match', 0)
    outputs.set('groups', [])
    outputs.set('fullMatch', '')
    outputs.set('_error', 'Invalid regex pattern')
  }

  return outputs
}

// ============================================================================
// Registry
// ============================================================================

export const stringExecutors: Record<string, NodeExecutorFn> = {
  'string-concat': stringConcatExecutor,
  'string-split': stringSplitExecutor,
  'string-replace': stringReplaceExecutor,
  'string-slice': stringSliceExecutor,
  'string-case': stringCaseExecutor,
  // New string operations
  'string-length': stringLengthExecutor,
  'string-contains': stringContainsExecutor,
  'string-starts-ends': stringStartsEndsExecutor,
  'string-trim': stringTrimExecutor,
  'string-pad': stringPadExecutor,
  'string-template': stringTemplateExecutor,
  'string-match': stringMatchExecutor,
}
