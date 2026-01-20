import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock the platform utility before importing CredentialStore
vi.mock('@/utils/platform', () => ({
  isElectron: vi.fn(() => false),
}))

import {
  getCredentialStore,
  makeCredentialKey,
  setConnectionCredentials,
  getConnectionCredentials,
  deleteConnectionCredentials,
  hasConnectionCredentials,
} from '@/services/connections/CredentialStore'
import { isElectron } from '@/utils/platform'

describe('CredentialStore', () => {
  beforeEach(() => {
    // Reset the mock to return false (browser mode)
    vi.mocked(isElectron).mockReturnValue(false)
  })

  describe('Memory Credential Store (Browser)', () => {
    it('should store and retrieve credentials', async () => {
      const store = getCredentialStore()

      await store.set('test-key', 'secret-value')
      const value = await store.get('test-key')

      expect(value).toBe('secret-value')
    })

    it('should return null for non-existent key', async () => {
      const store = getCredentialStore()
      const value = await store.get('non-existent')
      expect(value).toBe(null)
    })

    it('should delete credentials', async () => {
      const store = getCredentialStore()

      await store.set('delete-me', 'value')
      await store.delete('delete-me')
      const value = await store.get('delete-me')

      expect(value).toBe(null)
    })

    it('should check if credential exists', async () => {
      const store = getCredentialStore()

      await store.set('exists', 'value')

      expect(await store.has('exists')).toBe(true)
      expect(await store.has('not-exists')).toBe(false)
    })

    it('should delete all credentials for a connection', async () => {
      const store = getCredentialStore()

      await store.set('conn:my-conn:password', 'secret1')
      await store.set('conn:my-conn:token', 'secret2')
      await store.set('conn:other-conn:password', 'secret3')

      await store.deleteForConnection('my-conn')

      expect(await store.get('conn:my-conn:password')).toBe(null)
      expect(await store.get('conn:my-conn:token')).toBe(null)
      expect(await store.get('conn:other-conn:password')).toBe('secret3')
    })

    it('should report as not secure', () => {
      const store = getCredentialStore()
      expect(store.isSecure()).toBe(false)
    })

    it('should overwrite existing values', async () => {
      const store = getCredentialStore()

      await store.set('key', 'value1')
      await store.set('key', 'value2')

      expect(await store.get('key')).toBe('value2')
    })
  })

  describe('Helper Functions', () => {
    describe('makeCredentialKey', () => {
      it('should create correct key format', () => {
        const key = makeCredentialKey('conn-123', 'password')
        expect(key).toBe('conn:conn-123:password')
      })

      it('should handle special characters in IDs', () => {
        const key = makeCredentialKey('conn-with:colons', 'field')
        expect(key).toBe('conn:conn-with:colons:field')
      })
    })

    describe('setConnectionCredentials', () => {
      it('should store multiple credentials', async () => {
        await setConnectionCredentials('my-connection', {
          password: 'secret',
          apiKey: 'abc123',
        })

        const store = getCredentialStore()
        expect(await store.get('conn:my-connection:password')).toBe('secret')
        expect(await store.get('conn:my-connection:apiKey')).toBe('abc123')
      })

      it('should skip empty values', async () => {
        await setConnectionCredentials('my-connection', {
          password: 'secret',
          empty: '',
        })

        const store = getCredentialStore()
        expect(await store.get('conn:my-connection:password')).toBe('secret')
        expect(await store.has('conn:my-connection:empty')).toBe(false)
      })
    })

    describe('getConnectionCredentials', () => {
      it('should retrieve multiple credentials', async () => {
        const store = getCredentialStore()
        await store.set('conn:test-conn:password', 'pass123')
        await store.set('conn:test-conn:token', 'token456')

        const credentials = await getConnectionCredentials('test-conn', ['password', 'token'])

        expect(credentials).toEqual({
          password: 'pass123',
          token: 'token456',
        })
      })

      it('should return null for missing credentials', async () => {
        const credentials = await getConnectionCredentials('test-conn', [
          'missing1',
          'missing2',
        ])

        expect(credentials).toEqual({
          missing1: null,
          missing2: null,
        })
      })

      it('should handle partial credentials', async () => {
        const store = getCredentialStore()
        await store.set('conn:partial-conn:password', 'exists')

        const credentials = await getConnectionCredentials('partial-conn', [
          'password',
          'token',
        ])

        expect(credentials).toEqual({
          password: 'exists',
          token: null,
        })
      })
    })

    describe('deleteConnectionCredentials', () => {
      it('should delete all credentials for connection', async () => {
        const store = getCredentialStore()
        await store.set('conn:to-delete:pass', 'a')
        await store.set('conn:to-delete:key', 'b')
        await store.set('conn:to-keep:pass', 'c')

        await deleteConnectionCredentials('to-delete')

        expect(await store.get('conn:to-delete:pass')).toBe(null)
        expect(await store.get('conn:to-delete:key')).toBe(null)
        expect(await store.get('conn:to-keep:pass')).toBe('c')
      })
    })

    describe('hasConnectionCredentials', () => {
      it('should check existence of multiple credentials', async () => {
        const store = getCredentialStore()
        await store.set('conn:check-conn:password', 'exists')

        const result = await hasConnectionCredentials('check-conn', ['password', 'token'])

        expect(result).toEqual({
          password: true,
          token: false,
        })
      })
    })
  })

  describe('Singleton Behavior', () => {
    it('should return same store instance', () => {
      const store1 = getCredentialStore()
      const store2 = getCredentialStore()
      expect(store1).toBe(store2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string keys', async () => {
      const store = getCredentialStore()
      await store.set('', 'value')
      expect(await store.get('')).toBe('value')
    })

    it('should handle unicode values', async () => {
      const store = getCredentialStore()
      const unicodeValue = '密码🔐'
      await store.set('unicode', unicodeValue)
      expect(await store.get('unicode')).toBe(unicodeValue)
    })

    it('should handle very long values', async () => {
      const store = getCredentialStore()
      const longValue = 'a'.repeat(10000)
      await store.set('long', longValue)
      expect(await store.get('long')).toBe(longValue)
    })

    it('should handle JSON-like strings', async () => {
      const store = getCredentialStore()
      const jsonValue = '{"token":"abc","secret":"xyz"}'
      await store.set('json', jsonValue)
      expect(await store.get('json')).toBe(jsonValue)
    })
  })
})

describe('Electron Credential Store', () => {
  beforeEach(() => {
    // Mock electron environment
    vi.mocked(isElectron).mockReturnValue(true)

    // Mock window.electronAPI
    const mockSafeStorage = {
      isEncryptionAvailable: vi.fn().mockResolvedValue(true),
      encrypt: vi.fn().mockImplementation((data: string) => Promise.resolve(`encrypted:${data}`)),
      decrypt: vi.fn().mockImplementation((data: string) =>
        Promise.resolve(data.replace('encrypted:', ''))
      ),
    }

    Object.defineProperty(window, 'electronAPI', {
      value: { safeStorage: mockSafeStorage },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    // Clean up
    delete (window as unknown as Record<string, unknown>).electronAPI
    vi.resetModules()
  })

  // Note: These tests are limited because the CredentialStore module
  // creates a singleton at import time. A proper test would require
  // dynamic imports and module resets.

  it('should detect electron environment', () => {
    expect(isElectron()).toBe(true)
  })

  it('should have electronAPI available', () => {
    expect(window.electronAPI?.safeStorage).toBeDefined()
  })
})
