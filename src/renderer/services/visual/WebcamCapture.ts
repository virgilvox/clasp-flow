/**
 * Webcam Capture - Video input from camera devices
 *
 * Handles:
 * - Camera device enumeration
 * - Video stream capture
 * - Frame extraction to canvas
 */

export interface VideoDevice {
  deviceId: string
  label: string
}

export interface WebcamState {
  isCapturing: boolean
  currentDevice: string | null
  width: number
  height: number
  devices: VideoDevice[]
}

class WebcamCaptureService {
  private _stream: MediaStream | null = null
  private _video: HTMLVideoElement | null = null
  private _canvas: HTMLCanvasElement | null = null
  private _ctx: CanvasRenderingContext2D | null = null
  private _devices: VideoDevice[] = []
  private _currentDevice: string | null = null
  private _width = 640
  private _height = 480
  private _listeners: Set<() => void> = new Set()

  /**
   * Initialize the webcam service
   */
  async initialize(): Promise<void> {
    await this.refreshDevices()
  }

  /**
   * Refresh the list of available video devices
   */
  async refreshDevices(): Promise<void> {
    try {
      // Request permission first to get device labels
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true })
      tempStream.getTracks().forEach(track => track.stop())

      const devices = await navigator.mediaDevices.enumerateDevices()
      this._devices = devices
        .filter(d => d.kind === 'videoinput')
        .map(d => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${d.deviceId.slice(0, 8)}`,
        }))

      this.notifyListeners()
    } catch (error) {
      console.error('[WebcamCapture] Failed to enumerate devices:', error)
    }
  }

  /**
   * Start capturing from webcam
   */
  async start(deviceId?: string, width = 640, height = 480): Promise<void> {
    // Stop existing stream
    this.stop()

    this._width = width
    this._height = height

    try {
      // Build constraints - use 'ideal' instead of 'exact' for deviceId to avoid OverconstrainedError
      // when the requested device is not available
      const videoConstraints: MediaTrackConstraints = {
        width: { ideal: width },
        height: { ideal: height },
      }

      // Only add deviceId constraint if a specific device is requested and not 'default'
      if (deviceId && deviceId !== 'default') {
        videoConstraints.deviceId = { ideal: deviceId }
      }

      const constraints: MediaStreamConstraints = {
        video: videoConstraints,
      }

      this._stream = await navigator.mediaDevices.getUserMedia(constraints)
      this._currentDevice = deviceId ?? 'default'

      // Create video element
      this._video = document.createElement('video')
      this._video.srcObject = this._stream
      this._video.playsInline = true
      this._video.muted = true
      await this._video.play()

      // Get actual dimensions
      this._width = this._video.videoWidth || width
      this._height = this._video.videoHeight || height

      // Create canvas for frame extraction
      this._canvas = document.createElement('canvas')
      this._canvas.width = this._width
      this._canvas.height = this._height
      this._ctx = this._canvas.getContext('2d')

      console.log(`[WebcamCapture] Started: ${this._width}x${this._height}`)
      this.notifyListeners()
    } catch (error) {
      console.error('[WebcamCapture] Failed to start:', error)
      throw error
    }
  }

  /**
   * Stop capturing
   */
  stop(): void {
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop())
      this._stream = null
    }

    if (this._video) {
      this._video.srcObject = null
      this._video = null
    }

    this._canvas = null
    this._ctx = null
    this._currentDevice = null

    this.notifyListeners()
  }

  /**
   * Get current frame as canvas
   */
  getFrame(): HTMLCanvasElement | null {
    if (!this._video || !this._canvas || !this._ctx) return null
    if (this._video.readyState < 2) return null // Not ready

    this._ctx.drawImage(this._video, 0, 0, this._width, this._height)
    return this._canvas
  }

  /**
   * Get current frame as ImageData
   */
  getImageData(): ImageData | null {
    if (!this._ctx) return null
    const frame = this.getFrame()
    if (!frame) return null
    return this._ctx.getImageData(0, 0, this._width, this._height)
  }

  /**
   * Get the video element for direct use
   */
  getVideo(): HTMLVideoElement | null {
    return this._video
  }

  /**
   * Check if currently capturing
   */
  get isCapturing(): boolean {
    return this._stream !== null && this._video !== null
  }

  /**
   * Get current state
   */
  getState(): WebcamState {
    return {
      isCapturing: this.isCapturing,
      currentDevice: this._currentDevice,
      width: this._width,
      height: this._height,
      devices: this._devices,
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: () => void): () => void {
    this._listeners.add(listener)
    return () => {
      this._listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    this._listeners.forEach(listener => listener())
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.stop()
    this._listeners.clear()
  }
}

// Singleton instance
export const webcamCapture = new WebcamCaptureService()
