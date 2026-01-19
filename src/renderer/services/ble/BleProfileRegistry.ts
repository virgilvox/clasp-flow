/**
 * BLE Profile Registry
 *
 * Registry of standard BLE profiles and their characteristics.
 * Provides automatic parsing for common device types like:
 * - Heart Rate Monitors
 * - Battery Service
 * - Environmental Sensors
 * - Device Information
 */

// ============================================================================
// Types
// ============================================================================

export interface BleCharacteristicProfile {
  uuid: string
  name: string
  description: string
  dataFormat: 'uint8' | 'uint16' | 'int16' | 'float32' | 'utf8' | 'custom'
  unit?: string
  parser?: (value: DataView) => ParsedBleValue
}

export interface BleServiceProfile {
  uuid: string
  shortUuid: string
  name: string
  description: string
  icon: string
  characteristics: BleCharacteristicProfile[]
}

export interface ParsedBleValue {
  raw: DataView
  value: unknown
  unit?: string
  formatted: string
  characteristics?: Record<string, unknown>
}

// ============================================================================
// Standard Profiles
// ============================================================================

/**
 * Heart Rate Service (0x180D)
 */
const heartRateService: BleServiceProfile = {
  uuid: '0000180d-0000-1000-8000-00805f9b34fb',
  shortUuid: '180d',
  name: 'Heart Rate',
  description: 'Heart Rate Monitor',
  icon: 'heart-pulse',
  characteristics: [
    {
      uuid: '00002a37-0000-1000-8000-00805f9b34fb',
      name: 'Heart Rate Measurement',
      description: 'Current heart rate in BPM',
      dataFormat: 'custom',
      unit: 'BPM',
      parser: (value: DataView): ParsedBleValue => {
        const flags = value.getUint8(0)
        const is16Bit = (flags & 0x01) !== 0
        const hasEnergyExpended = (flags & 0x08) !== 0
        const hasRRInterval = (flags & 0x10) !== 0

        let offset = 1
        const heartRate = is16Bit ? value.getUint16(offset, true) : value.getUint8(offset)
        offset += is16Bit ? 2 : 1

        let energyExpended: number | undefined
        if (hasEnergyExpended) {
          energyExpended = value.getUint16(offset, true)
          offset += 2
        }

        const rrIntervals: number[] = []
        if (hasRRInterval) {
          while (offset < value.byteLength) {
            // RR intervals are in 1/1024 seconds, convert to ms
            rrIntervals.push(value.getUint16(offset, true) * (1000 / 1024))
            offset += 2
          }
        }

        return {
          raw: value,
          value: heartRate,
          unit: 'BPM',
          formatted: `${heartRate} BPM`,
          characteristics: {
            heartRate,
            is16Bit,
            energyExpended,
            rrIntervals,
          },
        }
      },
    },
    {
      uuid: '00002a38-0000-1000-8000-00805f9b34fb',
      name: 'Body Sensor Location',
      description: 'Location of the sensor on body',
      dataFormat: 'uint8',
      parser: (value: DataView): ParsedBleValue => {
        const locationMap = ['Other', 'Chest', 'Wrist', 'Finger', 'Hand', 'Ear Lobe', 'Foot']
        const location = value.getUint8(0)
        return {
          raw: value,
          value: location,
          formatted: locationMap[location] || 'Unknown',
        }
      },
    },
  ],
}

/**
 * Battery Service (0x180F)
 */
const batteryService: BleServiceProfile = {
  uuid: '0000180f-0000-1000-8000-00805f9b34fb',
  shortUuid: '180f',
  name: 'Battery',
  description: 'Battery Level Service',
  icon: 'battery',
  characteristics: [
    {
      uuid: '00002a19-0000-1000-8000-00805f9b34fb',
      name: 'Battery Level',
      description: 'Current battery level percentage',
      dataFormat: 'uint8',
      unit: '%',
      parser: (value: DataView): ParsedBleValue => {
        const level = value.getUint8(0)
        return {
          raw: value,
          value: level,
          unit: '%',
          formatted: `${level}%`,
        }
      },
    },
  ],
}

/**
 * Device Information Service (0x180A)
 */
const deviceInfoService: BleServiceProfile = {
  uuid: '0000180a-0000-1000-8000-00805f9b34fb',
  shortUuid: '180a',
  name: 'Device Information',
  description: 'Device manufacturer and model info',
  icon: 'info',
  characteristics: [
    {
      uuid: '00002a29-0000-1000-8000-00805f9b34fb',
      name: 'Manufacturer Name',
      description: 'Device manufacturer',
      dataFormat: 'utf8',
    },
    {
      uuid: '00002a24-0000-1000-8000-00805f9b34fb',
      name: 'Model Number',
      description: 'Device model',
      dataFormat: 'utf8',
    },
    {
      uuid: '00002a25-0000-1000-8000-00805f9b34fb',
      name: 'Serial Number',
      description: 'Device serial number',
      dataFormat: 'utf8',
    },
    {
      uuid: '00002a26-0000-1000-8000-00805f9b34fb',
      name: 'Firmware Revision',
      description: 'Firmware version',
      dataFormat: 'utf8',
    },
    {
      uuid: '00002a27-0000-1000-8000-00805f9b34fb',
      name: 'Hardware Revision',
      description: 'Hardware version',
      dataFormat: 'utf8',
    },
    {
      uuid: '00002a28-0000-1000-8000-00805f9b34fb',
      name: 'Software Revision',
      description: 'Software version',
      dataFormat: 'utf8',
    },
  ],
}

/**
 * Environmental Sensing Service (0x181A)
 */
const environmentalService: BleServiceProfile = {
  uuid: '0000181a-0000-1000-8000-00805f9b34fb',
  shortUuid: '181a',
  name: 'Environmental Sensing',
  description: 'Temperature, humidity, pressure sensors',
  icon: 'thermometer',
  characteristics: [
    {
      uuid: '00002a6e-0000-1000-8000-00805f9b34fb',
      name: 'Temperature',
      description: 'Temperature reading',
      dataFormat: 'int16',
      unit: '°C',
      parser: (value: DataView): ParsedBleValue => {
        // Temperature is in 0.01 degrees Celsius
        const temp = value.getInt16(0, true) / 100
        return {
          raw: value,
          value: temp,
          unit: '°C',
          formatted: `${temp.toFixed(1)}°C`,
        }
      },
    },
    {
      uuid: '00002a6f-0000-1000-8000-00805f9b34fb',
      name: 'Humidity',
      description: 'Relative humidity',
      dataFormat: 'uint16',
      unit: '%',
      parser: (value: DataView): ParsedBleValue => {
        // Humidity is in 0.01%
        const humidity = value.getUint16(0, true) / 100
        return {
          raw: value,
          value: humidity,
          unit: '%',
          formatted: `${humidity.toFixed(1)}%`,
        }
      },
    },
    {
      uuid: '00002a6d-0000-1000-8000-00805f9b34fb',
      name: 'Pressure',
      description: 'Atmospheric pressure',
      dataFormat: 'custom',
      unit: 'hPa',
      parser: (value: DataView): ParsedBleValue => {
        // Pressure is in 0.1 Pascal
        const pressure = value.getUint32(0, true) / 1000 // Convert to hPa
        return {
          raw: value,
          value: pressure,
          unit: 'hPa',
          formatted: `${pressure.toFixed(1)} hPa`,
        }
      },
    },
  ],
}

/**
 * Cycling Speed and Cadence Service (0x1816)
 */
const cyclingService: BleServiceProfile = {
  uuid: '00001816-0000-1000-8000-00805f9b34fb',
  shortUuid: '1816',
  name: 'Cycling Speed & Cadence',
  description: 'Cycling speed and cadence sensors',
  icon: 'bike',
  characteristics: [
    {
      uuid: '00002a5b-0000-1000-8000-00805f9b34fb',
      name: 'CSC Measurement',
      description: 'Speed and cadence data',
      dataFormat: 'custom',
      parser: (value: DataView): ParsedBleValue => {
        const flags = value.getUint8(0)
        const hasWheel = (flags & 0x01) !== 0
        const hasCrank = (flags & 0x02) !== 0

        let offset = 1
        let wheelRevolutions: number | undefined
        let lastWheelEvent: number | undefined
        let crankRevolutions: number | undefined
        let lastCrankEvent: number | undefined

        if (hasWheel) {
          wheelRevolutions = value.getUint32(offset, true)
          offset += 4
          lastWheelEvent = value.getUint16(offset, true)
          offset += 2
        }

        if (hasCrank) {
          crankRevolutions = value.getUint16(offset, true)
          offset += 2
          lastCrankEvent = value.getUint16(offset, true)
        }

        return {
          raw: value,
          value: { wheelRevolutions, crankRevolutions },
          formatted: `Wheel: ${wheelRevolutions || 0}, Crank: ${crankRevolutions || 0}`,
          characteristics: {
            wheelRevolutions,
            lastWheelEvent,
            crankRevolutions,
            lastCrankEvent,
          },
        }
      },
    },
  ],
}

/**
 * Running Speed and Cadence Service (0x1814)
 */
const runningService: BleServiceProfile = {
  uuid: '00001814-0000-1000-8000-00805f9b34fb',
  shortUuid: '1814',
  name: 'Running Speed & Cadence',
  description: 'Running speed and stride sensors',
  icon: 'footprints',
  characteristics: [
    {
      uuid: '00002a53-0000-1000-8000-00805f9b34fb',
      name: 'RSC Measurement',
      description: 'Running speed and cadence',
      dataFormat: 'custom',
      parser: (value: DataView): ParsedBleValue => {
        const flags = value.getUint8(0)
        const hasStride = (flags & 0x01) !== 0
        const hasTotalDistance = (flags & 0x02) !== 0
        const isRunning = (flags & 0x04) !== 0

        let offset = 1

        // Speed in 1/256 m/s
        const speed = value.getUint16(offset, true) / 256
        offset += 2

        // Cadence in steps/min
        const cadence = value.getUint8(offset)
        offset += 1

        let strideLength: number | undefined
        if (hasStride) {
          strideLength = value.getUint16(offset, true) / 100 // in meters
          offset += 2
        }

        let totalDistance: number | undefined
        if (hasTotalDistance) {
          totalDistance = value.getUint32(offset, true) / 10 // in meters
        }

        return {
          raw: value,
          value: speed,
          unit: 'm/s',
          formatted: `${(speed * 3.6).toFixed(1)} km/h`,
          characteristics: {
            speed,
            cadence,
            strideLength,
            totalDistance,
            isRunning,
          },
        }
      },
    },
  ],
}

// ============================================================================
// Registry
// ============================================================================

const profiles: Map<string, BleServiceProfile> = new Map()
const characteristicProfiles: Map<string, BleCharacteristicProfile> = new Map()

// Register all profiles
function registerProfile(profile: BleServiceProfile): void {
  profiles.set(profile.uuid, profile)
  profiles.set(profile.shortUuid, profile)

  for (const char of profile.characteristics) {
    characteristicProfiles.set(char.uuid, char)
    // Also register short UUID if applicable
    if (char.uuid.includes('0000-1000-8000-00805f9b34fb')) {
      const shortUuid = char.uuid.substring(4, 8)
      characteristicProfiles.set(shortUuid, char)
    }
  }
}

// Initialize registry
registerProfile(heartRateService)
registerProfile(batteryService)
registerProfile(deviceInfoService)
registerProfile(environmentalService)
registerProfile(cyclingService)
registerProfile(runningService)

// ============================================================================
// API
// ============================================================================

/**
 * Get a service profile by UUID
 */
export function getServiceProfile(uuid: string): BleServiceProfile | undefined {
  return profiles.get(uuid.toLowerCase())
}

/**
 * Get a characteristic profile by UUID
 */
export function getCharacteristicProfile(uuid: string): BleCharacteristicProfile | undefined {
  return characteristicProfiles.get(uuid.toLowerCase())
}

/**
 * Get all registered profiles
 */
export function getAllProfiles(): BleServiceProfile[] {
  const seen = new Set<string>()
  const result: BleServiceProfile[] = []

  for (const profile of profiles.values()) {
    if (!seen.has(profile.uuid)) {
      seen.add(profile.uuid)
      result.push(profile)
    }
  }

  return result
}

/**
 * Parse a BLE value using the registered characteristic profile
 */
export function parseCharacteristicValue(uuid: string, value: DataView): ParsedBleValue {
  const profile = getCharacteristicProfile(uuid)

  if (profile?.parser) {
    return profile.parser(value)
  }

  // Default parsing based on data format
  if (profile) {
    switch (profile.dataFormat) {
      case 'uint8':
        return {
          raw: value,
          value: value.getUint8(0),
          unit: profile.unit,
          formatted: `${value.getUint8(0)}${profile.unit || ''}`,
        }
      case 'uint16':
        return {
          raw: value,
          value: value.getUint16(0, true),
          unit: profile.unit,
          formatted: `${value.getUint16(0, true)}${profile.unit || ''}`,
        }
      case 'int16':
        return {
          raw: value,
          value: value.getInt16(0, true),
          unit: profile.unit,
          formatted: `${value.getInt16(0, true)}${profile.unit || ''}`,
        }
      case 'float32':
        return {
          raw: value,
          value: value.getFloat32(0, true),
          unit: profile.unit,
          formatted: `${value.getFloat32(0, true).toFixed(2)}${profile.unit || ''}`,
        }
      case 'utf8': {
        const text = new TextDecoder().decode(value.buffer)
        return {
          raw: value,
          value: text,
          formatted: text,
        }
      }
    }
  }

  // Raw fallback
  return {
    raw: value,
    value: new Uint8Array(value.buffer),
    formatted: Array.from(new Uint8Array(value.buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(' '),
  }
}

/**
 * Get a user-friendly name for a service UUID
 */
export function getServiceName(uuid: string): string {
  const profile = getServiceProfile(uuid)
  return profile?.name || `Service ${uuid.substring(0, 8)}`
}

/**
 * Get a user-friendly name for a characteristic UUID
 */
export function getCharacteristicName(uuid: string): string {
  const profile = getCharacteristicProfile(uuid)
  return profile?.name || `Characteristic ${uuid.substring(0, 8)}`
}

/**
 * Detect device type from advertised services
 */
export function detectDeviceType(serviceUuids: string[]): {
  type: string
  name: string
  icon: string
} | null {
  for (const uuid of serviceUuids) {
    const profile = getServiceProfile(uuid)
    if (profile) {
      return {
        type: profile.shortUuid,
        name: profile.name,
        icon: profile.icon,
      }
    }
  }
  return null
}
