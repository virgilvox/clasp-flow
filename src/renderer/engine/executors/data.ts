/**
 * Data Node Executors
 *
 * Executors for array, object, and type conversion operations
 */

import type { ExecutionContext, NodeExecutorFn } from '../ExecutionEngine'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get nested property from object using dot notation path
 * Supports array indexing with brackets: "data.items[0].name"
 */
function getByPath(obj: unknown, path: string): { value: unknown; found: boolean } {
  if (!path || obj === null || obj === undefined) {
    return { value: undefined, found: false }
  }

  // Convert bracket notation to dot notation: "items[0]" -> "items.0"
  const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1')
  const parts = normalizedPath.split('.')

  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined) {
      return { value: undefined, found: false }
    }
    if (typeof current !== 'object') {
      return { value: undefined, found: false }
    }
    current = (current as Record<string, unknown>)[part]
  }

  return { value: current, found: current !== undefined }
}

/**
 * Set nested property on object using dot notation path
 * Returns a new object (immutable)
 */
function setByPath(obj: unknown, path: string, value: unknown): unknown {
  if (!path) return obj

  // Convert bracket notation to dot notation
  const normalizedPath = path.replace(/\[(\d+)\]/g, '.$1')
  const parts = normalizedPath.split('.')

  const result = Array.isArray(obj) ? [...obj] : { ...(obj as object) }
  let current: unknown = result

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    const nextPart = parts[i + 1]
    const isNextArray = /^\d+$/.test(nextPart)

    const currentObj = current as Record<string, unknown>
    if (currentObj[part] === undefined) {
      currentObj[part] = isNextArray ? [] : {}
    } else {
      const existingVal = currentObj[part]
      currentObj[part] = Array.isArray(existingVal) ? [...existingVal] : { ...(existingVal as object) }
    }
    current = currentObj[part]
  }

  (current as Record<string, unknown>)[parts[parts.length - 1]] = value
  return result
}

// ============================================================================
// Array Operations
// ============================================================================

export const arrayLengthExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')
  const outputs = new Map<string, unknown>()

  if (!Array.isArray(array)) {
    outputs.set('length', 0)
    outputs.set('isEmpty', 1)
    return outputs
  }

  outputs.set('length', array.length)
  outputs.set('isEmpty', array.length === 0 ? 1 : 0)
  return outputs
}

export const arrayGetExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')
  const index = Math.floor((ctx.inputs.get('index') as number) ?? 0)
  const defaultVal = (ctx.controls.get('default') as string) ?? ''
  const outputs = new Map<string, unknown>()

  if (!Array.isArray(array)) {
    outputs.set('value', defaultVal || undefined)
    outputs.set('found', 0)
    return outputs
  }

  // Support negative indexing
  const normalizedIndex = index < 0 ? array.length + index : index

  if (normalizedIndex >= 0 && normalizedIndex < array.length) {
    outputs.set('value', array[normalizedIndex])
    outputs.set('found', 1)
    return outputs
  }

  // Try to parse default as JSON
  let parsedDefault: unknown = defaultVal
  try {
    parsedDefault = JSON.parse(defaultVal)
  } catch {
    // Keep as string
  }

  outputs.set('value', parsedDefault)
  outputs.set('found', 0)
  return outputs
}

export const arrayFirstLastExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')
  const outputs = new Map<string, unknown>()

  if (!Array.isArray(array) || array.length === 0) {
    outputs.set('first', undefined)
    outputs.set('last', undefined)
    outputs.set('length', 0)
    return outputs
  }

  outputs.set('first', array[0])
  outputs.set('last', array[array.length - 1])
  outputs.set('length', array.length)
  return outputs
}

export const arrayContainsExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')
  const value = ctx.inputs.get('value')
  const outputs = new Map<string, unknown>()

  if (!Array.isArray(array)) {
    outputs.set('result', 0)
    outputs.set('index', -1)
    return outputs
  }

  // Use JSON stringify for object comparison
  const index = array.findIndex((item) => {
    if (typeof item === 'object' && typeof value === 'object') {
      return JSON.stringify(item) === JSON.stringify(value)
    }
    return item === value
  })

  outputs.set('result', index !== -1 ? 1 : 0)
  outputs.set('index', index)
  return outputs
}

export const arraySliceExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')
  const start = (ctx.controls.get('start') as number) ?? 0
  const end = (ctx.controls.get('end') as number) ?? -1

  if (!Array.isArray(array)) {
    return new Map<string, unknown>([['result', []]])
  }

  const result = end === -1 ? array.slice(start) : array.slice(start, end)
  return new Map<string, unknown>([['result', result]])
}

export const arrayJoinExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')
  const separator = (ctx.controls.get('separator') as string) ?? ','

  if (!Array.isArray(array)) {
    return new Map<string, unknown>([['result', '']])
  }

  return new Map<string, unknown>([['result', array.join(separator)]])
}

export const arrayReverseExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')

  if (!Array.isArray(array)) {
    return new Map<string, unknown>([['result', []]])
  }

  return new Map<string, unknown>([['result', [...array].reverse()]])
}

export const arrayPushExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')
  const value = ctx.inputs.get('value')
  const position = (ctx.controls.get('position') as string) ?? 'end'

  const arr = Array.isArray(array) ? [...array] : []

  if (value !== undefined) {
    if (position === 'start') {
      arr.unshift(value)
    } else {
      arr.push(value)
    }
  }

  return new Map<string, unknown>([['result', arr]])
}

export const arrayFilterNullsExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')
  const removeEmpty = (ctx.controls.get('removeEmpty') as boolean) ?? true
  const outputs = new Map<string, unknown>()

  if (!Array.isArray(array)) {
    outputs.set('result', [])
    outputs.set('removed', 0)
    return outputs
  }

  const originalLength = array.length
  const filtered = array.filter((item) => {
    if (item === null || item === undefined) return false
    if (removeEmpty && typeof item === 'string' && item === '') return false
    return true
  })

  outputs.set('result', filtered)
  outputs.set('removed', originalLength - filtered.length)
  return outputs
}

export const arrayUniqueExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')

  if (!Array.isArray(array)) {
    return new Map<string, unknown>([['result', []]])
  }

  // Use JSON stringify for object comparison
  const seen = new Set<string>()
  const result = array.filter((item) => {
    const key = typeof item === 'object' ? JSON.stringify(item) : String(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return new Map<string, unknown>([['result', result]])
}

export const arraySortExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const array = ctx.inputs.get('array')
  const direction = (ctx.controls.get('direction') as string) ?? 'ascending'
  const sortType = (ctx.controls.get('type') as string) ?? 'auto'

  if (!Array.isArray(array)) {
    return new Map<string, unknown>([['result', []]])
  }

  const sorted = [...array].sort((a, b) => {
    let compareResult: number

    if (sortType === 'numeric' || (sortType === 'auto' && typeof a === 'number' && typeof b === 'number')) {
      compareResult = Number(a) - Number(b)
    } else {
      compareResult = String(a).localeCompare(String(b))
    }

    return direction === 'descending' ? -compareResult : compareResult
  })

  return new Map<string, unknown>([['result', sorted]])
}

export const arrayRangeExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const start = (ctx.controls.get('start') as number) ?? 0
  const end = (ctx.controls.get('end') as number) ?? 10
  const step = (ctx.controls.get('step') as number) ?? 1

  const result: number[] = []
  const safeStep = step === 0 ? 1 : Math.abs(step)

  if (start <= end) {
    for (let i = start; i < end; i += safeStep) {
      result.push(i)
      if (result.length > 10000) break // Safety limit
    }
  } else {
    for (let i = start; i > end; i -= safeStep) {
      result.push(i)
      if (result.length > 10000) break // Safety limit
    }
  }

  return new Map<string, unknown>([['result', result]])
}

// ============================================================================
// Object Operations
// ============================================================================

export const objectGetExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const obj = ctx.inputs.get('object')
  const pathInput = ctx.inputs.get('path') as string | undefined
  const defaultPath = (ctx.controls.get('defaultPath') as string) ?? ''
  const defaultVal = (ctx.controls.get('default') as string) ?? ''
  const outputs = new Map<string, unknown>()

  const path = pathInput ?? defaultPath

  const { value, found } = getByPath(obj, path)

  if (found) {
    outputs.set('value', value)
    outputs.set('found', 1)
    return outputs
  }

  // Try to parse default as JSON
  let parsedDefault: unknown = defaultVal
  try {
    parsedDefault = JSON.parse(defaultVal)
  } catch {
    // Keep as string
  }

  outputs.set('value', parsedDefault)
  outputs.set('found', 0)
  return outputs
}

export const objectSetExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const obj = ctx.inputs.get('object') ?? {}
  const pathInput = ctx.inputs.get('path') as string | undefined
  const defaultPath = (ctx.controls.get('defaultPath') as string) ?? ''
  const value = ctx.inputs.get('value')

  const path = pathInput ?? defaultPath

  if (!path) {
    return new Map<string, unknown>([['result', obj]])
  }

  const result = setByPath(obj, path, value)
  return new Map<string, unknown>([['result', result]])
}

export const objectKeysExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const obj = ctx.inputs.get('object')
  const outputs = new Map<string, unknown>()

  if (obj === null || obj === undefined || typeof obj !== 'object' || Array.isArray(obj)) {
    outputs.set('keys', [])
    outputs.set('count', 0)
    return outputs
  }

  const keys = Object.keys(obj)
  outputs.set('keys', keys)
  outputs.set('count', keys.length)
  return outputs
}

export const objectValuesExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const obj = ctx.inputs.get('object')
  const outputs = new Map<string, unknown>()

  if (obj === null || obj === undefined || typeof obj !== 'object' || Array.isArray(obj)) {
    outputs.set('values', [])
    outputs.set('count', 0)
    return outputs
  }

  const values = Object.values(obj)
  outputs.set('values', values)
  outputs.set('count', values.length)
  return outputs
}

export const objectHasExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const obj = ctx.inputs.get('object')
  const pathInput = ctx.inputs.get('path') as string | undefined
  const defaultPath = (ctx.controls.get('defaultPath') as string) ?? ''

  const path = pathInput ?? defaultPath
  const { found } = getByPath(obj, path)

  return new Map<string, unknown>([['result', found ? 1 : 0]])
}

export const objectMergeExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const a = ctx.inputs.get('a')
  const b = ctx.inputs.get('b')

  const objA = (a && typeof a === 'object' && !Array.isArray(a)) ? a : {}
  const objB = (b && typeof b === 'object' && !Array.isArray(b)) ? b : {}

  const result = { ...objA, ...objB }
  return new Map<string, unknown>([['result', result]])
}

export const objectCreateExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const key1 = ctx.inputs.get('key1') as string | undefined
  const value1 = ctx.inputs.get('value1')
  const key2 = ctx.inputs.get('key2') as string | undefined
  const value2 = ctx.inputs.get('value2')
  const key3 = ctx.inputs.get('key3') as string | undefined
  const value3 = ctx.inputs.get('value3')

  const result: Record<string, unknown> = {}

  if (key1 && key1.trim()) result[key1] = value1
  if (key2 && key2.trim()) result[key2] = value2
  if (key3 && key3.trim()) result[key3] = value3

  return new Map<string, unknown>([['result', result]])
}

export const objectEntriesExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const obj = ctx.inputs.get('object')
  const outputs = new Map<string, unknown>()

  if (obj === null || obj === undefined || typeof obj !== 'object' || Array.isArray(obj)) {
    outputs.set('entries', [])
    outputs.set('count', 0)
    return outputs
  }

  const entries = Object.entries(obj)
  outputs.set('entries', entries)
  outputs.set('count', entries.length)
  return outputs
}

// ============================================================================
// Type Conversion
// ============================================================================

export const toStringExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const value = ctx.inputs.get('value')
  const format = (ctx.controls.get('format') as string) ?? 'default'
  const precision = (ctx.controls.get('precision') as number) ?? 2

  let result: string

  switch (format) {
    case 'json':
      try {
        result = JSON.stringify(value, null, 2)
      } catch {
        result = String(value)
      }
      break
    case 'fixed':
      if (typeof value === 'number') {
        result = value.toFixed(precision)
      } else {
        result = String(value)
      }
      break
    default:
      if (value === null) {
        result = 'null'
      } else if (value === undefined) {
        result = 'undefined'
      } else if (typeof value === 'object') {
        try {
          result = JSON.stringify(value)
        } catch {
          result = String(value)
        }
      } else {
        result = String(value)
      }
  }

  return new Map<string, unknown>([['result', result]])
}

export const toNumberExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const value = ctx.inputs.get('value')
  const defaultVal = (ctx.controls.get('default') as number) ?? 0
  const outputs = new Map<string, unknown>()

  if (value === null || value === undefined) {
    outputs.set('result', defaultVal)
    outputs.set('valid', 0)
    return outputs
  }

  const num = Number(value)

  if (isNaN(num)) {
    outputs.set('result', defaultVal)
    outputs.set('valid', 0)
    return outputs
  }

  outputs.set('result', num)
  outputs.set('valid', 1)
  return outputs
}

export const toBooleanExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const value = ctx.inputs.get('value')
  const mode = (ctx.controls.get('mode') as string) ?? 'truthy'

  let result: boolean

  if (mode === 'strict') {
    // Only accept true/false/"true"/"false"/1/0
    if (value === true || value === 'true' || value === 1) {
      result = true
    } else if (value === false || value === 'false' || value === 0) {
      result = false
    } else {
      result = false
    }
  } else {
    // Truthy conversion
    result = Boolean(value)
  }

  return new Map<string, unknown>([['result', result ? 1 : 0]])
}

export const parseIntExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const value = (ctx.inputs.get('value') as string) ?? ''
  const radix = (ctx.controls.get('radix') as number) ?? 10
  const defaultVal = (ctx.controls.get('default') as number) ?? 0
  const outputs = new Map<string, unknown>()

  const parsed = parseInt(value, radix)

  if (isNaN(parsed)) {
    outputs.set('result', defaultVal)
    outputs.set('valid', 0)
    return outputs
  }

  outputs.set('result', parsed)
  outputs.set('valid', 1)
  return outputs
}

export const parseFloatExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const value = (ctx.inputs.get('value') as string) ?? ''
  const defaultVal = (ctx.controls.get('default') as number) ?? 0
  const outputs = new Map<string, unknown>()

  const parsed = parseFloat(value)

  if (isNaN(parsed)) {
    outputs.set('result', defaultVal)
    outputs.set('valid', 0)
    return outputs
  }

  outputs.set('result', parsed)
  outputs.set('valid', 1)
  return outputs
}

export const toArrayExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const value = ctx.inputs.get('value')
  const mode = (ctx.controls.get('mode') as string) ?? 'wrap'
  const separator = (ctx.controls.get('separator') as string) ?? ','

  let result: unknown[]

  switch (mode) {
    case 'split':
      if (typeof value === 'string') {
        result = separator ? value.split(separator) : [value]
      } else {
        result = [value]
      }
      break
    case 'from':
      // Try to convert array-like to array
      if (Array.isArray(value)) {
        result = value
      } else if (value && typeof value === 'object' && 'length' in value) {
        result = Array.from(value as ArrayLike<unknown>)
      } else {
        result = [value]
      }
      break
    default: // wrap
      if (Array.isArray(value)) {
        result = value
      } else {
        result = [value]
      }
  }

  return new Map<string, unknown>([['result', result]])
}

export const formatNumberExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const value = (ctx.inputs.get('value') as number) ?? 0
  const style = (ctx.controls.get('style') as string) ?? 'decimal'
  const currency = (ctx.controls.get('currency') as string) ?? 'USD'
  const decimals = (ctx.controls.get('decimals') as number) ?? 2

  try {
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }

    if (style === 'percent') {
      options.style = 'percent'
    } else if (style === 'currency') {
      options.style = 'currency'
      options.currency = currency
    }

    const result = new Intl.NumberFormat('en-US', options).format(value)
    return new Map<string, unknown>([['result', result]])
  } catch {
    return new Map<string, unknown>([['result', String(value)]])
  }
}

// ============================================================================
// Registry
// ============================================================================

export const dataExecutors: Record<string, NodeExecutorFn> = {
  // Array operations
  'array-length': arrayLengthExecutor,
  'array-get': arrayGetExecutor,
  'array-first-last': arrayFirstLastExecutor,
  'array-contains': arrayContainsExecutor,
  'array-slice': arraySliceExecutor,
  'array-join': arrayJoinExecutor,
  'array-reverse': arrayReverseExecutor,
  'array-push': arrayPushExecutor,
  'array-filter-nulls': arrayFilterNullsExecutor,
  'array-unique': arrayUniqueExecutor,
  'array-sort': arraySortExecutor,
  'array-range': arrayRangeExecutor,
  // Object operations
  'object-get': objectGetExecutor,
  'object-set': objectSetExecutor,
  'object-keys': objectKeysExecutor,
  'object-values': objectValuesExecutor,
  'object-has': objectHasExecutor,
  'object-merge': objectMergeExecutor,
  'object-create': objectCreateExecutor,
  'object-entries': objectEntriesExecutor,
  // Type conversion
  'to-string': toStringExecutor,
  'to-number': toNumberExecutor,
  'to-boolean': toBooleanExecutor,
  'parse-int': parseIntExecutor,
  'parse-float': parseFloatExecutor,
  'to-array': toArrayExecutor,
  'format-number': formatNumberExecutor,
}
