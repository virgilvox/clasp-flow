# Audio Category

> Audio synthesis, processing, and analysis using Web Audio API in LATCH.

**Category Color:** Green (`#22C55E`)
**Icon:** `music`

---

## Oscillator

Generate audio waveforms at specified frequencies.

### Info

Generates a continuous audio waveform at a specified frequency. Supports sine, square, triangle, and sawtooth shapes. This is a fundamental building block for synthesis, test tones, and modulation sources.

**Tips:**
- Use sine for pure tones and sub-bass; use sawtooth for harmonically rich leads and basses.
- Connect the frequency input from a MIDI node or envelope to play melodic pitches.
- Detune two oscillators slightly against each other for a thick, chorused sound.

**Works well with:** Gain, Filter, Envelope (ADSR), Audio Output, Audio Analyzer

| Property | Value |
|----------|-------|
| **ID** | `oscillator` |
| **Icon** | `waves` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `frequency` | `number` | Frequency in Hz |
| `detune` | `number` | Detune in cents |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal (OscillatorNode) |
| `frequency` | `number` | Current frequency value |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `frequency` | `number` | `440` | Base frequency (Hz) |
| `detune` | `number` | `0` | Detune (cents) |
| `waveform` | `select` | `sine` | Wave type (sine, square, triangle, sawtooth) |
| `volume` | `number` | `-6` | Output volume (dB) |

### Implementation
Creates a Web Audio `OscillatorNode` connected to a `GainNode` for volume control.

---

## Audio Output

Output audio to speakers/headphones.

### Info

Routes audio to the system speakers or headphones. This is the final destination node in any audio chain. Volume is set in decibels and a mute toggle silences output without disconnecting the graph.

**Tips:**
- Start with the volume at -12 dB or lower to avoid unexpected loud output.
- Use the mute toggle for quick A/B testing without tearing down connections.
- Only one audio output node is needed per patch; connect a gain node before it for master volume control.

**Works well with:** Gain, Reverb, Filter, Audio Player

| Property | Value |
|----------|-------|
| **ID** | `audio-output` |
| **Icon** | `volume-2` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal to output |

### Outputs
*None*

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `volume` | `number` | `0` | Master volume (dB) |
| `mute` | `toggle` | `false` | Mute output |

### Implementation
Connects input audio node to the Web Audio `AudioContext.destination` through a gain node for volume control.

---

## Audio Analyzer

Analyze audio levels and frequency bands.

### Info

Splits an incoming audio signal into level, bass, mid, and high frequency bands as numeric outputs. Use it to drive visuals, animations, or any parameter that should react to sound.

**Tips:**
- Increase smoothing (closer to 1) for slower, more stable readings; decrease it for snappier response.
- Map the bass output to scale or brightness for kick-driven visual effects.
- Place this after a gain node to control the analysis input level independently of the output volume.

**Works well with:** Audio Player, Gain, Oscillator, Beat Detect

| Property | Value |
|----------|-------|
| **ID** | `audio-analyzer` |
| **Icon** | `bar-chart-2` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal to analyze |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `level` | `number` | Overall RMS level (0-1) |
| `bass` | `number` | Bass frequency level (0-1) |
| `mid` | `number` | Mid frequency level (0-1) |
| `high` | `number` | High frequency level (0-1) |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `smoothing` | `number` | `0.8` | Temporal smoothing (0-1) |

### Implementation
Uses Web Audio `AnalyserNode.getByteFrequencyData()`:
- Bass: 20-250 Hz bands
- Mid: 250-4000 Hz bands
- High: 4000-20000 Hz bands
- Level: RMS of all bands

---

## Gain

Adjust audio volume/amplitude.

### Info

Multiplies the audio signal amplitude by a gain factor. A value of 1 passes audio unchanged, values below 1 attenuate, and values above 1 amplify. This is the primary volume control node in any audio chain.

**Tips:**
- Connect an envelope output to the gain input for amplitude modulation.
- Place a gain node right before audio output as a master volume control.
- Use a gain of 0 as a quick mute, or connect an LFO for tremolo effects.

**Works well with:** Audio Output, Oscillator, Filter, Envelope (ADSR), Audio Player

| Property | Value |
|----------|-------|
| **ID** | `gain` |
| **Icon** | `volume-1` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal |
| `gain` | `number` | Gain multiplier |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Amplified audio |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `gain` | `number` | `1` | Gain multiplier (1 = unity) |

### Implementation
Creates a Web Audio `GainNode`. Gain of 0 = silence, 1 = unity, 2 = double amplitude.

---

## Filter

Filter audio frequencies using biquad filters.

### Info

A standard biquad filter that removes or emphasizes frequencies in the audio signal. Supports lowpass, highpass, bandpass, and notch modes. The Q parameter controls the sharpness of the filter curve around the cutoff frequency.

**Tips:**
- Automate the frequency input with an envelope or LFO for classic filter sweep effects.
- Use bandpass mode with a high Q to isolate a narrow frequency band.
- Chain two filters in series for a steeper rolloff (24 dB/octave instead of 12).

**Works well with:** Oscillator, Gain, Envelope (ADSR), Audio Output, SVF Filter

| Property | Value |
|----------|-------|
| **ID** | `filter` |
| **Icon** | `sliders` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal |
| `frequency` | `number` | Cutoff frequency |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Filtered audio |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `frequency` | `number` | `1000` | Cutoff frequency (Hz) |
| `Q` | `number` | `1` | Q factor (resonance) |
| `type` | `select` | `lowpass` | Filter type (lowpass, highpass, bandpass, notch) |

### Implementation
Creates a Web Audio `BiquadFilterNode` with the specified type and parameters.

---

## SVF Filter

State Variable Filter with multiple simultaneous outputs.

### Info

A state variable filter that provides simultaneous lowpass, highpass, bandpass, and notch outputs from a single input. This lets you tap multiple filter shapes at once without duplicating nodes. Includes a drive control for mild saturation.

**Tips:**
- Use the bandpass output for vocal or instrument isolation in a specific frequency range.
- Increase drive for warm saturation before the filter stage.
- Modulate the cutoff input with an LFO or envelope for evolving timbral movement.

**Works well with:** Oscillator, Gain, Envelope (ADSR), Filter, Audio Output

| Property | Value |
|----------|-------|
| **ID** | `svf-filter` |
| **Icon** | `filter` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal |
| `cutoff` | `number` | Cutoff frequency |
| `resonance` | `number` | Resonance amount |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `lowpass` | `audio` | Lowpass filtered output |
| `highpass` | `audio` | Highpass filtered output |
| `bandpass` | `audio` | Bandpass filtered output |
| `notch` | `audio` | Notch filtered output |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `cutoff` | `number` | `1000` | min: 20, max: 20000 | Cutoff frequency (Hz) |
| `resonance` | `slider` | `0.5` | min: 0, max: 1 | Resonance amount |
| `drive` | `slider` | `0` | min: 0, max: 2 | Drive/saturation |

### Implementation
Implements a state variable filter topology using Web Audio API, providing all four filter responses simultaneously from a single filter.

---

## Delay (Audio)

Add delay/echo effect to audio.

### Info

Adds a delay or echo effect to the audio signal. The feedback control determines how many times the delayed signal repeats, and the wet control blends between dry and delayed audio.

**Tips:**
- Set feedback below 0.5 for a clean slapback echo, or above 0.7 for long, building repeats.
- Automate the delay time input for tape-style pitch warble effects.
- Use a short delay (under 30ms) with no feedback to create a simple doubling or comb filter effect.

**Works well with:** Reverb, Gain, Filter, Audio Output

| Property | Value |
|----------|-------|
| **ID** | `audio-delay` |
| **Icon** | `repeat` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal |
| `time` | `number` | Delay time |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Delayed audio |

### Controls
| Control | Type | Default | Description |
|---------|------|---------|-------------|
| `time` | `number` | `0.25` | Delay time (seconds) |
| `feedback` | `number` | `0.5` | Feedback amount (0-1) |
| `wet` | `number` | `0.5` | Wet/dry mix (0-1) |

### Implementation
Creates a feedback delay using `DelayNode` and `GainNode` for feedback routing. Wet/dry mixing combines original and delayed signals.

---

## Reverb

Add reverb effect using convolution.

### Info

Simulates the reflections of a physical space by applying a reverb tail to the audio signal. The decay control sets how long the reverb rings out, and the wet control blends between dry and reverberant audio.

**Tips:**
- Keep wet below 0.3 for subtle room ambience, or push above 0.7 for atmospheric wash effects.
- Increase pre-delay slightly to preserve transient clarity before the reverb tail begins.
- Place reverb after delay in the signal chain for a cleaner echo-into-space effect.

**Works well with:** Delay, Gain, Audio Output, Filter

| Property | Value |
|----------|-------|
| **ID** | `reverb` |
| **Icon** | `waves` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal (required) |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Reverbed audio |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `decay` | `slider` | `1.5` | min: 0.1, max: 10 | Reverb decay time (seconds) |
| `wet` | `slider` | `0.5` | min: 0, max: 1 | Wet/dry mix |
| `preDelay` | `slider` | `0.01` | min: 0, max: 0.1 | Pre-delay time |

### Implementation
Generates impulse response programmatically or uses `ConvolverNode` with a synthesized IR based on decay time.

---

## Beat Detect

Detect beats and estimate BPM from audio.

### Info

Analyzes an audio signal to detect rhythmic beats and estimate the tempo in BPM. Outputs a trigger on each detected beat, the current BPM estimate, and the instantaneous energy level.

**Tips:**
- Lower sensitivity to reduce false triggers on complex, busy audio material.
- Increase min interval to reject double-triggers on fast transients.
- Connect the beat trigger to an envelope or visual parameter for beat-synced animations.

**Works well with:** Audio Player, Audio Analyzer, Envelope (ADSR), Gain

| Property | Value |
|----------|-------|
| **ID** | `beat-detect` |
| **Icon** | `activity` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal (required) |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `beat` | `trigger` | Fires on detected beat |
| `bpm` | `number` | Estimated BPM |
| `energy` | `number` | Current energy level |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `sensitivity` | `slider` | `1.5` | min: 1, max: 3 | Detection sensitivity |
| `minInterval` | `number` | `200` | min: 50, max: 500 | Minimum beat interval (ms) |
| `decayRate` | `slider` | `0.95` | min: 0.8, max: 0.99 | Energy decay rate |

### Implementation
Uses energy-based beat detection:
1. Calculate instantaneous energy from frequency data
2. Compare to running average energy
3. Trigger beat when energy exceeds threshold
4. Track beat intervals to estimate BPM

---

## Pitch Detect

Detect pitch from audio signal.

### Info

Analyzes an audio signal to estimate its fundamental pitch. Outputs the detected frequency in Hz, the musical note name, octave number, MIDI note value, and a confidence score indicating detection reliability.

**Tips:**
- Narrow the min/max frequency range to improve accuracy for a known instrument or voice.
- Use the confidence output to gate downstream processing so only strong detections pass through.
- Feed the MIDI output into a synth node to create a pitch-following harmonizer.

**Works well with:** Audio Player, Audio Analyzer, Synth, Oscillator

| Property | Value |
|----------|-------|
| **ID** | `pitch-detect` |
| **Icon** | `music` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `frequency` | `number` | Detected frequency (Hz) |
| `note` | `string` | Note name (e.g., "A4") |
| `octave` | `number` | Octave number |
| `midi` | `number` | MIDI note number |
| `confidence` | `number` | Detection confidence (0-1) |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `minFreq` | `number` | `50` | min: 20, max: 1000 | Minimum detectable frequency |
| `maxFreq` | `number` | `2000` | min: 100, max: 10000 | Maximum detectable frequency |

### Implementation
Uses autocorrelation-based pitch detection (YIN algorithm or similar) on the audio signal's time-domain data.

---

## Envelope (ADSR)

ADSR amplitude envelope generator.

### Info

Generates a standard ADSR (Attack, Decay, Sustain, Release) amplitude envelope. When triggered, it ramps up through attack and decay to the sustain level, then ramps down on release. The envelope output can modulate volume, filter cutoff, or any other parameter.

**Tips:**
- Use a very short attack (under 5ms) for percussive sounds and longer values (50ms+) for pads.
- Connect the value output to non-audio parameters like visual brightness for synced animations.
- Pair with an oscillator and gain to build a basic subtractive synth voice from scratch.

**Works well with:** Oscillator, Gain, Filter, Synth, Beat Detect

| Property | Value |
|----------|-------|
| **ID** | `envelope` |
| **Icon** | `trending-up` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `trigger` | `trigger` | Trigger attack phase |
| `release` | `trigger` | Trigger release phase |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `envelope` | `audio` | Envelope signal (for modulation) |
| `value` | `number` | Current envelope value (0-1) |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `attack` | `slider` | `0.01` | min: 0.001, max: 2 | Attack time (s) |
| `decay` | `slider` | `0.1` | min: 0.001, max: 2 | Decay time (s) |
| `sustain` | `slider` | `0.5` | min: 0, max: 1 | Sustain level |
| `release` | `slider` | `0.3` | min: 0.001, max: 5 | Release time (s) |

### Implementation
Uses Web Audio `GainNode` with scheduled parameter automation for precise envelope timing. Can be used to modulate other audio parameters.

---

## Envelope Editor

Visual ADSR envelope with draggable control points.

### Info

A visual ADSR envelope editor with draggable control points for shaping attack, decay, sustain, and release curves. Functions identically to the standard Envelope node but adds an interactive graphical display for intuitive editing.

**Tips:**
- Drag the control points directly on the curve for faster, more intuitive shaping than typing numbers.
- Use this node in place of the plain Envelope when you want visual feedback during design.
- Connect the value output to visual parameters for real-time envelope monitoring.

**Works well with:** Oscillator, Gain, Filter, Synth, Beat Detect

| Property | Value |
|----------|-------|
| **ID** | `envelope-visual` |
| **Icon** | `trending-up` |
| **Version** | 1.0.0 |
| **Custom UI** | Yes (`EnvelopeVisualNode.vue`) |

Same functionality as Envelope but with visual editing UI showing the envelope curve with draggable points for ADSR parameters.

---

## Parametric EQ

3-band parametric equalizer with visual frequency response.

### Info

A 3-band parametric equalizer with a visual frequency response display and draggable band controls. Each band has independent frequency, gain, and Q settings for precise tonal shaping across the low, mid, and high ranges.

**Tips:**
- Drag the band handles in the visual display for quick, intuitive adjustments.
- Cut narrow bands (high Q, negative gain) to remove problem frequencies rather than boosting others.
- Use gentle broad boosts (low Q, small positive gain) for overall tonal warmth or brightness.

**Works well with:** Audio Player, Gain, Audio Output, Reverb, Filter

| Property | Value |
|----------|-------|
| **ID** | `parametric-eq` |
| **Icon** | `sliders-horizontal` |
| **Version** | 1.0.0 |
| **Custom UI** | Yes (`ParametricEqNode.vue`) |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Equalized audio |

### Controls (per band, 3 bands)
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `freqN` | `number` | varies | min: 20, max: 20000 | Band frequency |
| `gainN` | `number` | `0` | min: -24, max: 24 | Band gain (dB) |
| `qN` | `number` | `1` | min: 0.1, max: 10 | Band Q factor |

### Implementation
Custom UI with visual frequency response curve and draggable band markers. Uses three `BiquadFilterNode`s in series for each band.

---

## Wavetable

Wavetable oscillator with drawable waveform.

### Info

A wavetable oscillator that lets you select from preset waveforms or draw a custom waveshape. The drawn waveform is stored as a wavetable and played back at the specified frequency, giving you full control over the harmonic content.

**Tips:**
- Select the custom preset and draw directly on the waveform display to create unique timbres.
- Start from a preset waveform and modify it slightly for variations on familiar sounds.
- Modulate the frequency input with an LFO for vibrato or with a MIDI source for melodic play.

**Works well with:** Gain, Filter, Envelope (ADSR), Audio Output, SVF Filter

| Property | Value |
|----------|-------|
| **ID** | `wavetable` |
| **Icon** | `waves` |
| **Version** | 1.0.0 |
| **Custom UI** | Yes (`WavetableNode.vue`) |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `frequency` | `number` | Playback frequency |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `frequency` | `number` | `440` | min: 20, max: 2000 | Base frequency |
| `volume` | `slider` | `0.5` | min: 0, max: 1 | Output volume |
| `preset` | `select` | `sine` | options: sine, square, sawtooth, triangle, custom | Waveform preset |

### Implementation
Custom UI allows drawing custom waveforms. Uses `PeriodicWave` API to create custom oscillator waveforms from the drawn shape.

---

## Audio Player

Play audio files from URL.

### Info

Loads and plays audio files from a URL. Supports looping, autoplay, volume, and playback speed controls. Outputs the audio signal along with playback state information like duration and loading status.

**Tips:**
- Enable loop for continuous background music or ambient sound beds.
- Use the playing and duration outputs to synchronize other nodes with the audio timeline.
- Check the error output to detect broken URLs or unsupported formats.

**Works well with:** Audio Output, Gain, Audio Analyzer, Reverb, Beat Detect

| Property | Value |
|----------|-------|
| **ID** | `audio-player` |
| **Icon** | `play-circle` |
| **Version** | 1.0.0 |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `url` | `string` | Audio file URL |
| `play` | `trigger` | Start playback |
| `stop` | `trigger` | Stop playback |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio signal |
| `playing` | `boolean` | Playback state |
| `duration` | `number` | File duration (s) |
| `loading` | `boolean` | Loading state |
| `error` | `string` | Error message |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `url` | `text` | `''` | - | Audio file URL |
| `loop` | `toggle` | `false` | - | Loop playback |
| `autoplay` | `toggle` | `false` | - | Start on load |
| `volume` | `slider` | `0` | min: -40, max: 6 | Volume (dB) |
| `playbackRate` | `slider` | `1` | min: 0.5, max: 2 | Playback speed |

### Implementation
Uses `fetch()` to load audio, `AudioContext.decodeAudioData()` to decode, and `AudioBufferSourceNode` for playback.

---

## Synth

Polyphonic synthesizer with multiple instrument presets.

### Info

An all-in-one synthesizer that responds to MIDI note, velocity, and gate inputs. Includes six instrument presets ranging from simple sine to moog bass, piano, organ, pluck, and pad. Each preset exposes relevant parameters like filter cutoff, brightness, and voice count.

**Tips:**
- Use the gate input for held notes and the trigger input for one-shot percussive hits.
- Switch to the moog preset and lower the cutoff for classic acid bass lines.
- Increase voices and detune on the pad preset for wide, lush chord textures.

**Works well with:** MIDI Input, Envelope (ADSR), Audio Output, Reverb, Gain

| Property | Value |
|----------|-------|
| **ID** | `synth` |
| **Icon** | `music` |
| **Version** | 1.0.0 |
| **Custom UI** | Yes (`SynthNode.vue`) |

### Inputs
| Port | Type | Description |
|------|------|-------------|
| `note` | `number` | MIDI note number (0-127) |
| `velocity` | `number` | Note velocity (0-127) |
| `gate` | `boolean` | Note gate (true=on, false=off) |
| `trigger` | `trigger` | Alternative note trigger |

### Outputs
| Port | Type | Description |
|------|------|-------------|
| `audio` | `audio` | Audio output |

### Controls
| Control | Type | Default | Props | Description |
|---------|------|---------|-------|-------------|
| `instrument` | `select` | `sine` | options: sine, moog, piano, organ, pluck, pad | Instrument preset |
| `volume` | `number` | `-6` | min: -60, max: 0 | Volume (dB) |
| `attack` | `number` | `0.01` | min: 0.001, max: 2 | Attack time (s) |
| `decay` | `number` | `0.1` | min: 0.001, max: 2 | Decay time (s) |
| `sustain` | `number` | `0.7` | min: 0, max: 1 | Sustain level |
| `release` | `number` | `0.3` | min: 0.001, max: 5 | Release time (s) |
| `cutoff` | `number` | `2000` | min: 20, max: 20000 | Filter cutoff (Hz, Moog) |
| `resonance` | `number` | `1` | min: 0.1, max: 30 | Filter resonance (Moog) |
| `filterEnv` | `number` | `0.5` | min: 0, max: 1 | Filter envelope amount (Moog) |
| `brightness` | `number` | `0.5` | min: 0, max: 1 | Pluck brightness |
| `damping` | `number` | `0.5` | min: 0, max: 1 | Pluck damping |
| `detune` | `number` | `10` | min: 0, max: 50 | Voice detune (Pad) |
| `voices` | `number` | `3` | min: 1, max: 8 | Voice count (Pad) |

### Implementation
Polyphonic synth using Tone.js. Connects directly to Keyboard node for MIDI-style input. Each instrument preset uses different synthesis techniques:
- **sine**: Pure sine wave with ADSR envelope
- **moog**: Subtractive synth with resonant filter
- **piano**: FM synthesis piano sound
- **organ**: Additive Hammond-style organ
- **pluck**: Karplus-Strong physical modeling
- **pad**: Detuned multi-voice pad
