/**
 * Tests for BLE Profile Registry
 *
 * Tests standard BLE profile parsing and detection
 */

import { describe, it, expect } from 'vitest'
import {
  getServiceProfile,
  getCharacteristicProfile,
  getAllProfiles,
  parseCharacteristicValue,
  getServiceName,
  getCharacteristicName,
  detectDeviceType,
} from '@/services/ble/BleProfileRegistry'

describe('BleProfileRegistry - getServiceProfile', () => {
  it('should return heart rate service by full UUID', () => {
    const profile = getServiceProfile('0000180d-0000-1000-8000-00805f9b34fb')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Heart Rate')
    expect(profile!.shortUuid).toBe('180d')
    expect(profile!.icon).toBe('heart-pulse')
  })

  it('should return heart rate service by short UUID', () => {
    const profile = getServiceProfile('180d')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Heart Rate')
  })

  it('should return battery service', () => {
    const profile = getServiceProfile('180f')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Battery')
    expect(profile!.icon).toBe('battery')
  })

  it('should return device information service', () => {
    const profile = getServiceProfile('180a')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Device Information')
  })

  it('should return environmental sensing service', () => {
    const profile = getServiceProfile('181a')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Environmental Sensing')
    expect(profile!.icon).toBe('thermometer')
  })

  it('should return cycling service', () => {
    const profile = getServiceProfile('1816')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Cycling Speed & Cadence')
    expect(profile!.icon).toBe('bike')
  })

  it('should return running service', () => {
    const profile = getServiceProfile('1814')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Running Speed & Cadence')
    expect(profile!.icon).toBe('footprints')
  })

  it('should return undefined for unknown UUID', () => {
    const profile = getServiceProfile('ffff')
    expect(profile).toBeUndefined()
  })

  it('should be case insensitive', () => {
    const profile1 = getServiceProfile('180D')
    const profile2 = getServiceProfile('180d')

    expect(profile1).toEqual(profile2)
  })
})

describe('BleProfileRegistry - getCharacteristicProfile', () => {
  it('should return heart rate measurement characteristic', () => {
    const profile = getCharacteristicProfile('00002a37-0000-1000-8000-00805f9b34fb')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Heart Rate Measurement')
    expect(profile!.unit).toBe('BPM')
  })

  it('should return battery level characteristic by short UUID', () => {
    const profile = getCharacteristicProfile('2a19')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Battery Level')
    expect(profile!.unit).toBe('%')
  })

  it('should return temperature characteristic', () => {
    const profile = getCharacteristicProfile('2a6e')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Temperature')
    expect(profile!.unit).toBe('°C')
  })

  it('should return humidity characteristic', () => {
    const profile = getCharacteristicProfile('2a6f')

    expect(profile).toBeDefined()
    expect(profile!.name).toBe('Humidity')
    expect(profile!.unit).toBe('%')
  })

  it('should return undefined for unknown characteristic', () => {
    const profile = getCharacteristicProfile('ffff')
    expect(profile).toBeUndefined()
  })
})

describe('BleProfileRegistry - getAllProfiles', () => {
  it('should return all registered profiles', () => {
    const profiles = getAllProfiles()

    expect(profiles.length).toBeGreaterThanOrEqual(6) // At least 6 standard profiles
  })

  it('should not have duplicate profiles', () => {
    const profiles = getAllProfiles()
    const uuids = profiles.map(p => p.uuid)
    const uniqueUuids = new Set(uuids)

    expect(uniqueUuids.size).toBe(profiles.length)
  })

  it('should include all expected profiles', () => {
    const profiles = getAllProfiles()
    const names = profiles.map(p => p.name)

    expect(names).toContain('Heart Rate')
    expect(names).toContain('Battery')
    expect(names).toContain('Device Information')
    expect(names).toContain('Environmental Sensing')
  })
})

describe('BleProfileRegistry - parseCharacteristicValue', () => {
  it('should parse battery level (uint8)', () => {
    const data = new Uint8Array([75]) // 75%
    const dataView = new DataView(data.buffer)

    const result = parseCharacteristicValue('2a19', dataView)

    expect(result.value).toBe(75)
    expect(result.unit).toBe('%')
    expect(result.formatted).toBe('75%')
  })

  it('should parse heart rate measurement (8-bit)', () => {
    // Flags: 0x00 (8-bit HR, no energy, no RR)
    // HR: 72
    const data = new Uint8Array([0x00, 72])
    const dataView = new DataView(data.buffer)

    const result = parseCharacteristicValue('2a37', dataView)

    expect(result.value).toBe(72)
    expect(result.unit).toBe('BPM')
    expect(result.formatted).toBe('72 BPM')
  })

  it('should parse heart rate measurement (16-bit)', () => {
    // Flags: 0x01 (16-bit HR)
    // HR: 150 (little endian)
    const data = new Uint8Array([0x01, 0x96, 0x00])
    const dataView = new DataView(data.buffer)

    const result = parseCharacteristicValue('2a37', dataView)

    expect(result.value).toBe(150)
    expect(result.formatted).toBe('150 BPM')
  })

  it('should parse temperature', () => {
    // Temperature: 2356 = 23.56°C (in 0.01 degrees)
    const data = new Uint8Array([0x34, 0x09]) // 2356 in little endian
    const dataView = new DataView(data.buffer)

    const result = parseCharacteristicValue('2a6e', dataView)

    expect(result.value).toBeCloseTo(23.56, 1)
    expect(result.unit).toBe('°C')
  })

  it('should parse humidity', () => {
    // Humidity: 6500 = 65.00% (in 0.01%)
    const data = new Uint8Array([0x64, 0x19]) // 6500 in little endian
    const dataView = new DataView(data.buffer)

    const result = parseCharacteristicValue('2a6f', dataView)

    expect(result.value).toBeCloseTo(65.0, 1)
    expect(result.unit).toBe('%')
  })

  it('should parse body sensor location', () => {
    const data = new Uint8Array([1]) // Chest
    const dataView = new DataView(data.buffer)

    const result = parseCharacteristicValue('2a38', dataView)

    expect(result.value).toBe(1)
    expect(result.formatted).toBe('Chest')
  })

  it('should return raw hex for unknown characteristic', () => {
    const data = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF])
    const dataView = new DataView(data.buffer)

    const result = parseCharacteristicValue('unknown-uuid', dataView)

    expect(result.formatted).toBe('de ad be ef')
  })
})

describe('BleProfileRegistry - getServiceName', () => {
  it('should return friendly name for known service', () => {
    expect(getServiceName('180d')).toBe('Heart Rate')
    expect(getServiceName('180f')).toBe('Battery')
  })

  it('should return partial UUID for unknown service', () => {
    const name = getServiceName('12345678-0000-0000-0000-000000000000')
    expect(name).toContain('12345678')
  })
})

describe('BleProfileRegistry - getCharacteristicName', () => {
  it('should return friendly name for known characteristic', () => {
    expect(getCharacteristicName('2a37')).toBe('Heart Rate Measurement')
    expect(getCharacteristicName('2a19')).toBe('Battery Level')
  })

  it('should return partial UUID for unknown characteristic', () => {
    const name = getCharacteristicName('12345678-0000-0000-0000-000000000000')
    expect(name).toContain('12345678')
  })
})

describe('BleProfileRegistry - detectDeviceType', () => {
  it('should detect heart rate monitor', () => {
    const result = detectDeviceType(['180d', 'ffff'])

    expect(result).toBeDefined()
    expect(result!.type).toBe('180d')
    expect(result!.name).toBe('Heart Rate')
    expect(result!.icon).toBe('heart-pulse')
  })

  it('should detect battery service device', () => {
    const result = detectDeviceType(['180f'])

    expect(result).toBeDefined()
    expect(result!.name).toBe('Battery')
  })

  it('should detect environmental sensor', () => {
    const result = detectDeviceType(['181a'])

    expect(result).toBeDefined()
    expect(result!.name).toBe('Environmental Sensing')
    expect(result!.icon).toBe('thermometer')
  })

  it('should return null for unknown services', () => {
    const result = detectDeviceType(['ffff', 'eeee'])
    expect(result).toBeNull()
  })

  it('should return null for empty service list', () => {
    const result = detectDeviceType([])
    expect(result).toBeNull()
  })

  it('should return first matched service when multiple known', () => {
    const result = detectDeviceType(['180d', '180f'])

    expect(result).toBeDefined()
    // Should match first one found
    expect(result!.name).toBe('Heart Rate')
  })
})

describe('BleProfileRegistry - CSC (Cycling) parsing', () => {
  it('should parse CSC measurement with wheel data', () => {
    // Flags: 0x01 (wheel data present)
    // Wheel revolutions: 1000 (little endian)
    // Last wheel event: 2048 (little endian)
    const data = new Uint8Array([
      0x01,
      0xE8, 0x03, 0x00, 0x00, // wheel revs: 1000
      0x00, 0x08, // last wheel event: 2048
    ])
    const dataView = new DataView(data.buffer)

    const result = parseCharacteristicValue('2a5b', dataView)

    expect(result.characteristics).toBeDefined()
    expect(result.characteristics!.wheelRevolutions).toBe(1000)
    expect(result.characteristics!.lastWheelEvent).toBe(2048)
  })

  it('should parse CSC measurement with crank data', () => {
    // Flags: 0x02 (crank data present)
    // Crank revolutions: 500 (little endian)
    // Last crank event: 1024 (little endian)
    const data = new Uint8Array([
      0x02,
      0xF4, 0x01, // crank revs: 500
      0x00, 0x04, // last crank event: 1024
    ])
    const dataView = new DataView(data.buffer)

    const result = parseCharacteristicValue('2a5b', dataView)

    expect(result.characteristics).toBeDefined()
    expect(result.characteristics!.crankRevolutions).toBe(500)
    expect(result.characteristics!.lastCrankEvent).toBe(1024)
  })
})

describe('BleProfileRegistry - RSC (Running) parsing', () => {
  it('should parse RSC measurement', () => {
    // Flags: 0x00 (no stride, no distance, walking)
    // Speed: 768 (3 m/s = 768/256)
    // Cadence: 180
    const data = new Uint8Array([
      0x00,
      0x00, 0x03, // speed: 768 (little endian)
      0xB4, // cadence: 180
    ])
    const dataView = new DataView(data.buffer)

    const result = parseCharacteristicValue('2a53', dataView)

    expect(result.characteristics).toBeDefined()
    expect(result.characteristics!.speed).toBeCloseTo(3.0, 1)
    expect(result.characteristics!.cadence).toBe(180)
  })
})
