/**
 * Audio Node Executors
 *
 * These executors handle audio-related nodes using Tone.js
 */

import * as Tone from 'tone'
import type { ExecutionContext, NodeExecutorFn } from '../ExecutionEngine'
import { audioManager } from '@/services/audio/AudioManager'

// Store for persistent audio nodes (oscillators, effects, etc.)
const audioNodes = new Map<string, Tone.ToneAudioNode>()

/**
 * Get or create a Tone.js node for a given node ID
 */
function getOrCreateNode<T extends Tone.ToneAudioNode>(
  nodeId: string,
  factory: () => T
): T {
  let node = audioNodes.get(nodeId) as T | undefined
  if (!node) {
    node = factory()
    audioNodes.set(nodeId, node)
  }
  return node
}

/**
 * Dispose of an audio node when no longer needed
 */
export function disposeAudioNode(nodeId: string): void {
  const node = audioNodes.get(nodeId)
  if (node) {
    node.dispose()
    audioNodes.delete(nodeId)
  }
}

/**
 * Dispose all audio nodes
 */
export function disposeAllAudioNodes(): void {
  audioNodes.forEach(node => node.dispose())
  audioNodes.clear()
}

// ============================================================================
// Oscillator Node
// ============================================================================

export const oscillatorExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const frequency = (ctx.inputs.get('frequency') as number) ?? (ctx.controls.get('frequency') as number) ?? 440
  const detune = (ctx.inputs.get('detune') as number) ?? (ctx.controls.get('detune') as number) ?? 0
  const waveform = (ctx.controls.get('waveform') as OscillatorType) ?? 'sine'
  const volume = (ctx.controls.get('volume') as number) ?? -6 // dB

  // Get or create oscillator
  const osc = getOrCreateNode(ctx.nodeId, () => {
    const oscillator = new Tone.Oscillator({
      frequency,
      type: waveform,
      volume,
    })
    oscillator.start()
    return oscillator
  })

  // Update parameters
  osc.frequency.value = frequency
  osc.detune.value = detune
  if (osc.type !== waveform) {
    osc.type = waveform
  }
  osc.volume.value = volume

  const outputs = new Map<string, unknown>()
  outputs.set('audio', osc)
  outputs.set('frequency', frequency)
  return outputs
}

// ============================================================================
// Audio Input (Microphone) Node
// ============================================================================

export const audioInputExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const enabled = (ctx.controls.get('enabled') as boolean) ?? true

  if (!enabled) {
    const outputs = new Map<string, unknown>()
    outputs.set('audio', null)
    outputs.set('level', -Infinity)
    return outputs
  }

  // Ensure microphone is available
  if (!audioManager.hasMicrophone) {
    try {
      await audioManager.requestMicrophoneAccess()
    } catch {
      const outputs = new Map<string, unknown>()
      outputs.set('audio', null)
      outputs.set('level', -Infinity)
      outputs.set('_error', 'Microphone access denied')
      return outputs
    }
  }

  const mic = audioManager.microphoneSource
  if (!mic) {
    const outputs = new Map<string, unknown>()
    outputs.set('audio', null)
    outputs.set('level', -Infinity)
    return outputs
  }

  // Get or create meter for this node
  const meter = getOrCreateNode(`${ctx.nodeId}_meter`, () => {
    const m = new Tone.Meter()
    mic.connect(m)
    return m
  })

  const level = meter.getValue()
  const normalizedLevel = typeof level === 'number' ? level : level[0]

  const outputs = new Map<string, unknown>()
  outputs.set('audio', mic)
  outputs.set('level', normalizedLevel)
  return outputs
}

// ============================================================================
// Audio Output (Speaker) Node
// ============================================================================

export const audioOutputExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const audio = ctx.inputs.get('audio') as Tone.ToneAudioNode | null
  const volume = (ctx.controls.get('volume') as number) ?? 0 // dB
  const mute = (ctx.controls.get('mute') as boolean) ?? false

  // Get or create gain for this output
  const gain = getOrCreateNode(`${ctx.nodeId}_gain`, () => {
    const g = new Tone.Gain(1)
    g.connect(audioManager.getMasterOutput())
    return g
  })

  // Update volume
  gain.gain.value = mute ? 0 : Tone.dbToGain(volume)

  // Connect input to gain if available
  if (audio && 'connect' in audio) {
    // Check if already connected
    const prevInput = audioNodes.get(`${ctx.nodeId}_input`)
    if (prevInput !== audio) {
      if (prevInput) {
        prevInput.disconnect(gain)
      }
      audio.connect(gain)
      audioNodes.set(`${ctx.nodeId}_input`, audio)
    }
  }

  const outputs = new Map<string, unknown>()
  outputs.set('_connected', audio !== null)
  return outputs
}

// ============================================================================
// Audio Analyzer Node
// ============================================================================

export const audioAnalyzerExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const audio = ctx.inputs.get('audio') as Tone.ToneAudioNode | null
  const smoothing = (ctx.controls.get('smoothing') as number) ?? 0.8

  if (!audio) {
    const outputs = new Map<string, unknown>()
    outputs.set('level', -Infinity)
    outputs.set('bass', 0)
    outputs.set('mid', 0)
    outputs.set('high', 0)
    return outputs
  }

  // Get or create FFT analyzer
  const fft = getOrCreateNode(`${ctx.nodeId}_fft`, () => {
    const f = new Tone.FFT(256)
    f.smoothing = smoothing
    return f
  }) as Tone.FFT

  // Get or create meter
  const meter = getOrCreateNode(`${ctx.nodeId}_meter`, () => {
    return new Tone.Meter()
  }) as Tone.Meter

  // Connect input
  const prevInput = audioNodes.get(`${ctx.nodeId}_input`)
  if (prevInput !== audio) {
    if (prevInput) {
      prevInput.disconnect(fft)
      prevInput.disconnect(meter)
    }
    audio.connect(fft)
    audio.connect(meter)
    audioNodes.set(`${ctx.nodeId}_input`, audio)
  }

  // Get FFT data
  const fftData = fft.getValue()

  // Calculate frequency bands (simple averaging)
  const bassRange = Math.floor(fftData.length * 0.1) // 0-10%
  const midStart = bassRange
  const midEnd = Math.floor(fftData.length * 0.5) // 10-50%
  const highStart = midEnd

  let bass = 0, mid = 0, high = 0

  for (let i = 0; i < bassRange; i++) {
    bass += fftData[i] + 100 // Normalize from dB
  }
  bass = Math.max(0, bass / bassRange / 100)

  for (let i = midStart; i < midEnd; i++) {
    mid += fftData[i] + 100
  }
  mid = Math.max(0, mid / (midEnd - midStart) / 100)

  for (let i = highStart; i < fftData.length; i++) {
    high += fftData[i] + 100
  }
  high = Math.max(0, high / (fftData.length - highStart) / 100)

  const level = meter.getValue()
  const normalizedLevel = typeof level === 'number' ? level : level[0]

  const outputs = new Map<string, unknown>()
  outputs.set('level', normalizedLevel)
  outputs.set('bass', bass)
  outputs.set('mid', mid)
  outputs.set('high', high)
  return outputs
}

// ============================================================================
// Gain Node
// ============================================================================

export const gainExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const audio = ctx.inputs.get('audio') as Tone.ToneAudioNode | null
  const gain = (ctx.inputs.get('gain') as number) ?? (ctx.controls.get('gain') as number) ?? 1

  if (!audio) {
    const outputs = new Map<string, unknown>()
    outputs.set('audio', null)
    return outputs
  }

  // Get or create gain node
  const gainNode = getOrCreateNode(ctx.nodeId, () => {
    return new Tone.Gain(gain)
  }) as Tone.Gain

  // Update gain
  gainNode.gain.value = gain

  // Connect input
  const prevInput = audioNodes.get(`${ctx.nodeId}_input`)
  if (prevInput !== audio) {
    if (prevInput) {
      prevInput.disconnect(gainNode)
    }
    audio.connect(gainNode)
    audioNodes.set(`${ctx.nodeId}_input`, audio)
  }

  const outputs = new Map<string, unknown>()
  outputs.set('audio', gainNode)
  return outputs
}

// ============================================================================
// Filter Node
// ============================================================================

export const filterExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const audio = ctx.inputs.get('audio') as Tone.ToneAudioNode | null
  const frequency = (ctx.inputs.get('frequency') as number) ?? (ctx.controls.get('frequency') as number) ?? 1000
  const Q = (ctx.controls.get('Q') as number) ?? 1
  const type = (ctx.controls.get('type') as BiquadFilterType) ?? 'lowpass'

  if (!audio) {
    const outputs = new Map<string, unknown>()
    outputs.set('audio', null)
    return outputs
  }

  // Get or create filter
  const filter = getOrCreateNode(ctx.nodeId, () => {
    return new Tone.Filter({
      frequency,
      type,
      Q,
    })
  }) as Tone.Filter

  // Update parameters
  filter.frequency.value = frequency
  filter.Q.value = Q
  if (filter.type !== type) {
    filter.type = type
  }

  // Connect input
  const prevInput = audioNodes.get(`${ctx.nodeId}_input`)
  if (prevInput !== audio) {
    if (prevInput) {
      prevInput.disconnect(filter)
    }
    audio.connect(filter)
    audioNodes.set(`${ctx.nodeId}_input`, audio)
  }

  const outputs = new Map<string, unknown>()
  outputs.set('audio', filter)
  return outputs
}

// ============================================================================
// Delay Node
// ============================================================================

export const delayExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const audio = ctx.inputs.get('audio') as Tone.ToneAudioNode | null
  const delayTime = (ctx.inputs.get('time') as number) ?? (ctx.controls.get('time') as number) ?? 0.25
  const feedback = (ctx.controls.get('feedback') as number) ?? 0.5
  const wet = (ctx.controls.get('wet') as number) ?? 0.5

  if (!audio) {
    const outputs = new Map<string, unknown>()
    outputs.set('audio', null)
    return outputs
  }

  // Get or create delay
  const delay = getOrCreateNode(ctx.nodeId, () => {
    return new Tone.FeedbackDelay({
      delayTime,
      feedback,
      wet,
    })
  }) as Tone.FeedbackDelay

  // Update parameters
  delay.delayTime.value = delayTime
  delay.feedback.value = feedback
  delay.wet.value = wet

  // Connect input
  const prevInput = audioNodes.get(`${ctx.nodeId}_input`)
  if (prevInput !== audio) {
    if (prevInput) {
      prevInput.disconnect(delay)
    }
    audio.connect(delay)
    audioNodes.set(`${ctx.nodeId}_input`, audio)
  }

  const outputs = new Map<string, unknown>()
  outputs.set('audio', delay)
  return outputs
}

// ============================================================================
// Beat Detection Node
// ============================================================================

// State for beat detection per node
const beatState = new Map<string, {
  lastEnergy: number
  threshold: number
  lastBeatTime: number
  bpm: number
  beatTimes: number[]
}>()

export const beatDetectExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const audio = ctx.inputs.get('audio') as Tone.ToneAudioNode | null
  const sensitivity = (ctx.controls.get('sensitivity') as number) ?? 1.5
  const minInterval = (ctx.controls.get('minInterval') as number) ?? 200 // ms between beats
  const decayRate = (ctx.controls.get('decayRate') as number) ?? 0.95

  if (!audio) {
    const outputs = new Map<string, unknown>()
    outputs.set('beat', false)
    outputs.set('bpm', 0)
    outputs.set('energy', 0)
    return outputs
  }

  // Get or create FFT analyzer for this node
  const fft = getOrCreateNode(`${ctx.nodeId}_fft`, () => {
    const f = new Tone.FFT(256)
    return f
  }) as Tone.FFT

  // Connect input
  const prevInput = audioNodes.get(`${ctx.nodeId}_input`)
  if (prevInput !== audio) {
    if (prevInput) {
      prevInput.disconnect(fft)
    }
    audio.connect(fft)
    audioNodes.set(`${ctx.nodeId}_input`, audio)
  }

  // Initialize state if needed
  if (!beatState.has(ctx.nodeId)) {
    beatState.set(ctx.nodeId, {
      lastEnergy: 0,
      threshold: 0,
      lastBeatTime: 0,
      bpm: 0,
      beatTimes: [],
    })
  }

  const state = beatState.get(ctx.nodeId)!
  const now = performance.now()

  // Get FFT data and calculate energy (focus on bass frequencies for beat detection)
  const fftData = fft.getValue()
  const bassEnd = Math.floor(fftData.length * 0.15) // Focus on low frequencies

  let energy = 0
  for (let i = 0; i < bassEnd; i++) {
    const val = fftData[i] + 100 // Normalize from dB
    energy += val * val
  }
  energy = Math.sqrt(energy / bassEnd) / 100

  // Update adaptive threshold
  state.threshold = state.threshold * decayRate + energy * (1 - decayRate)

  // Detect beat
  const timeSinceLastBeat = now - state.lastBeatTime
  const isBeat =
    energy > state.threshold * sensitivity &&
    energy > state.lastEnergy &&
    timeSinceLastBeat > minInterval

  if (isBeat) {
    state.lastBeatTime = now

    // Track beat times for BPM calculation (keep last 10 beats)
    state.beatTimes.push(now)
    if (state.beatTimes.length > 10) {
      state.beatTimes.shift()
    }

    // Calculate BPM from beat intervals
    if (state.beatTimes.length >= 2) {
      const intervals: number[] = []
      for (let i = 1; i < state.beatTimes.length; i++) {
        intervals.push(state.beatTimes[i] - state.beatTimes[i - 1])
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      state.bpm = Math.round(60000 / avgInterval)

      // Clamp to reasonable BPM range
      if (state.bpm < 60) state.bpm *= 2
      if (state.bpm > 200) state.bpm = Math.round(state.bpm / 2)
    }
  }

  state.lastEnergy = energy

  const outputs = new Map<string, unknown>()
  outputs.set('beat', isBeat)
  outputs.set('bpm', state.bpm)
  outputs.set('energy', energy)
  return outputs
}

// ============================================================================
// Audio Player Node
// ============================================================================

// State for audio players
const playerState = new Map<string, {
  url: string
  player: Tone.Player | null
  loading: boolean
  error: string | null
}>()

export const audioPlayerExecutor: NodeExecutorFn = async (ctx: ExecutionContext) => {
  const url = (ctx.inputs.get('url') as string) ?? (ctx.controls.get('url') as string) ?? ''
  const play = ctx.inputs.get('play') as boolean | undefined
  const stop = ctx.inputs.get('stop') as boolean | undefined
  const loop = (ctx.controls.get('loop') as boolean) ?? false
  const volume = (ctx.controls.get('volume') as number) ?? 0 // dB
  const playbackRate = (ctx.controls.get('playbackRate') as number) ?? 1
  const autoplay = (ctx.controls.get('autoplay') as boolean) ?? false

  // Initialize state
  if (!playerState.has(ctx.nodeId)) {
    playerState.set(ctx.nodeId, {
      url: '',
      player: null,
      loading: false,
      error: null,
    })
  }

  const state = playerState.get(ctx.nodeId)!

  // Handle URL change - load new audio
  if (url && url !== state.url) {
    state.url = url
    state.loading = true
    state.error = null

    // Dispose old player
    if (state.player) {
      state.player.dispose()
      audioNodes.delete(ctx.nodeId)
    }

    try {
      const player = new Tone.Player({
        url,
        loop,
        volume,
        playbackRate,
        autostart: autoplay,
        onload: () => {
          state.loading = false
        },
        onerror: (err) => {
          state.error = err?.message ?? 'Failed to load audio'
          state.loading = false
        },
      })

      state.player = player
      audioNodes.set(ctx.nodeId, player)
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Failed to load audio'
      state.loading = false
    }
  }

  const player = state.player

  if (player) {
    // Update parameters
    player.loop = loop
    player.volume.value = volume
    player.playbackRate = playbackRate

    // Handle play/stop triggers
    if (play && player.loaded && player.state !== 'started') {
      player.start()
    }

    if (stop && player.state === 'started') {
      player.stop()
    }
  }

  const outputs = new Map<string, unknown>()
  outputs.set('audio', player)
  outputs.set('playing', player?.state === 'started')
  outputs.set('duration', player?.buffer?.duration ?? 0)
  outputs.set('loading', state.loading)
  outputs.set('error', state.error)
  return outputs
}

// ============================================================================
// Envelope (ADSR) Node
// ============================================================================

export const envelopeExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const trigger = ctx.inputs.get('trigger') as boolean | undefined
  const release = ctx.inputs.get('release') as boolean | undefined
  const attack = (ctx.controls.get('attack') as number) ?? 0.01
  const decay = (ctx.controls.get('decay') as number) ?? 0.1
  const sustain = (ctx.controls.get('sustain') as number) ?? 0.5
  const releaseTime = (ctx.controls.get('release') as number) ?? 0.3

  // Get or create envelope
  const envelope = getOrCreateNode(ctx.nodeId, () => {
    return new Tone.AmplitudeEnvelope({
      attack,
      decay,
      sustain,
      release: releaseTime,
    })
  }) as Tone.AmplitudeEnvelope

  // Update parameters
  envelope.attack = attack
  envelope.decay = decay
  envelope.sustain = sustain
  envelope.release = releaseTime

  // Handle triggers
  if (trigger) {
    envelope.triggerAttack()
  }

  if (release) {
    envelope.triggerRelease()
  }

  const outputs = new Map<string, unknown>()
  outputs.set('envelope', envelope)
  outputs.set('value', envelope.value)
  return outputs
}

// ============================================================================
// Reverb Node
// ============================================================================

export const reverbExecutor: NodeExecutorFn = (ctx: ExecutionContext) => {
  const audio = ctx.inputs.get('audio') as Tone.ToneAudioNode | null
  const decay = (ctx.controls.get('decay') as number) ?? 1.5
  const wet = (ctx.controls.get('wet') as number) ?? 0.5
  const preDelay = (ctx.controls.get('preDelay') as number) ?? 0.01

  if (!audio) {
    const outputs = new Map<string, unknown>()
    outputs.set('audio', null)
    return outputs
  }

  // Get or create reverb
  const reverb = getOrCreateNode(ctx.nodeId, () => {
    return new Tone.Reverb({
      decay,
      wet,
      preDelay,
    })
  }) as Tone.Reverb

  // Update parameters
  reverb.decay = decay
  reverb.wet.value = wet
  reverb.preDelay = preDelay

  // Connect input
  const prevInput = audioNodes.get(`${ctx.nodeId}_input`)
  if (prevInput !== audio) {
    if (prevInput) {
      prevInput.disconnect(reverb)
    }
    audio.connect(reverb)
    audioNodes.set(`${ctx.nodeId}_input`, audio)
  }

  const outputs = new Map<string, unknown>()
  outputs.set('audio', reverb)
  return outputs
}

// ============================================================================
// Dispose helpers for new nodes
// ============================================================================

export function disposeBeatDetector(nodeId: string): void {
  beatState.delete(nodeId)
}

export function disposeAudioPlayer(nodeId: string): void {
  const state = playerState.get(nodeId)
  if (state?.player) {
    state.player.dispose()
  }
  playerState.delete(nodeId)
}

// ============================================================================
// Registry
// ============================================================================

export const audioExecutors: Record<string, NodeExecutorFn> = {
  oscillator: oscillatorExecutor,
  'audio-input': audioInputExecutor,
  'audio-output': audioOutputExecutor,
  'audio-analyzer': audioAnalyzerExecutor,
  gain: gainExecutor,
  filter: filterExecutor,
  'audio-delay': delayExecutor,
  'beat-detect': beatDetectExecutor,
  'audio-player': audioPlayerExecutor,
  envelope: envelopeExecutor,
  reverb: reverbExecutor,
}
