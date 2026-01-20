/**
 * Credential Store
 *
 * Secure storage for connection credentials (passwords, tokens, API keys).
 * Uses Electron's safeStorage API when available, falls back to memory-only
 * storage in the browser with a user warning.
 */

import { isElectron } from '@/utils/platform'

// ============================================================================
// Types
// ============================================================================

export interface CredentialStore {
  /** Store a credential */
  set(key: string, value: string): Promise<void>
  /** Retrieve a credential */
  get(key: string): Promise<string | null>
  /** Delete a credential */
  delete(key: string): Promise<void>
  /** Check if a credential exists */
  has(key: string): Promise<boolean>
  /** Delete all credentials for a connection */
  deleteForConnection(connectionId: string): Promise<void>
  /** Check if secure storage is available */
  isSecure(): boolean
}

// ============================================================================
// Memory Store (fallback for browser)
// ============================================================================

class MemoryCredentialStore implements CredentialStore {
  private store = new Map<string, string>()

  async set(key: string, value: string): Promise<void> {
    this.store.set(key, value)
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  async has(key: string): Promise<boolean> {
    return this.store.has(key)
  }

  async deleteForConnection(connectionId: string): Promise<void> {
    const prefix = `conn:${connectionId}:`
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key)
      }
    }
  }

  isSecure(): boolean {
    return false
  }
}

// ============================================================================
// Electron Safe Storage Store
// ============================================================================

class ElectronCredentialStore implements CredentialStore {
  private encryptedStore = new Map<string, string>()
  private isEncryptionAvailable = false

  constructor() {
    this.checkEncryption()
  }

  private async checkEncryption() {
    try {
      // Check if safeStorage is available via IPC
      const safeStorage = getSafeStorageAPI()
      if (safeStorage) {
        this.isEncryptionAvailable = await safeStorage.isEncryptionAvailable()
      }
    } catch {
      this.isEncryptionAvailable = false
    }
  }

  async set(key: string, value: string): Promise<void> {
    const safeStorage = getSafeStorageAPI()
    if (this.isEncryptionAvailable && safeStorage) {
      // Encrypt and store
      const encrypted = await safeStorage.encrypt(value)
      this.encryptedStore.set(key, encrypted)
    } else {
      // Fall back to memory-only
      this.encryptedStore.set(key, value)
    }
  }

  async get(key: string): Promise<string | null> {
    const stored = this.encryptedStore.get(key)
    if (!stored) return null

    const safeStorage = getSafeStorageAPI()
    if (this.isEncryptionAvailable && safeStorage) {
      try {
        return await safeStorage.decrypt(stored)
      } catch {
        return null
      }
    }

    return stored
  }

  async delete(key: string): Promise<void> {
    this.encryptedStore.delete(key)
  }

  async has(key: string): Promise<boolean> {
    return this.encryptedStore.has(key)
  }

  async deleteForConnection(connectionId: string): Promise<void> {
    const prefix = `conn:${connectionId}:`
    for (const key of this.encryptedStore.keys()) {
      if (key.startsWith(prefix)) {
        this.encryptedStore.delete(key)
      }
    }
  }

  isSecure(): boolean {
    return this.isEncryptionAvailable
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let instance: CredentialStore | null = null

/**
 * Get the credential store instance
 */
export function getCredentialStore(): CredentialStore {
  if (!instance) {
    instance = isElectron() ? new ElectronCredentialStore() : new MemoryCredentialStore()
  }
  return instance
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a credential key for a connection field
 */
export function makeCredentialKey(connectionId: string, field: string): string {
  return `conn:${connectionId}:${field}`
}

/**
 * Store credentials for a connection
 */
export async function setConnectionCredentials(
  connectionId: string,
  credentials: Record<string, string>
): Promise<void> {
  const store = getCredentialStore()
  for (const [field, value] of Object.entries(credentials)) {
    if (value) {
      await store.set(makeCredentialKey(connectionId, field), value)
    }
  }
}

/**
 * Retrieve credentials for a connection
 */
export async function getConnectionCredentials(
  connectionId: string,
  fields: string[]
): Promise<Record<string, string | null>> {
  const store = getCredentialStore()
  const result: Record<string, string | null> = {}
  for (const field of fields) {
    result[field] = await store.get(makeCredentialKey(connectionId, field))
  }
  return result
}

/**
 * Delete all credentials for a connection
 */
export async function deleteConnectionCredentials(connectionId: string): Promise<void> {
  const store = getCredentialStore()
  await store.deleteForConnection(connectionId)
}

/**
 * Check if credentials exist for a connection
 */
export async function hasConnectionCredentials(
  connectionId: string,
  fields: string[]
): Promise<Record<string, boolean>> {
  const store = getCredentialStore()
  const result: Record<string, boolean> = {}
  for (const field of fields) {
    result[field] = await store.has(makeCredentialKey(connectionId, field))
  }
  return result
}

// ============================================================================
// Electron Safe Storage API (optional extension)
// ============================================================================

interface SafeStorageAPI {
  isEncryptionAvailable(): Promise<boolean>
  encrypt(data: string): Promise<string>
  decrypt(encrypted: string): Promise<string>
}

function getSafeStorageAPI(): SafeStorageAPI | undefined {
  // Access safeStorage if available (may be added via electron preload extension)
  const api = window.electronAPI as { safeStorage?: SafeStorageAPI } | undefined
  return api?.safeStorage
}
