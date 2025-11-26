/**
 * Sound Service using Web Audio API
 * Optimized for mobile (iOS/Android) compatibility
 */

class SoundService {
  constructor() {
    this.audioContext = null;
    this.buffers = {};
    this.musicSource = null;
    this.musicGain = null;
    this.initialized = false;
    this.muted = localStorage.getItem('soundMuted') === 'true';
    this.musicEnabled = false;

    // Small base64-encoded sounds for MVP (can be replaced with MP3 files)
    // These are tiny placeholder sounds - replace with actual sounds in production
    this.soundData = {
      // Placeholder: simple beep sounds
      // In production, replace with actual MP3 URLs: '/sounds/move.mp3'
      move: '/sounds/move.mp3',
      capture: '/sounds/capture.mp3',
      check: '/sounds/check.mp3',
      checkmate: '/sounds/checkmate.mp3'
    };
  }

  /**
   * Initialize audio context and load sounds
   * Must be called after user interaction (iOS requirement)
   */
  async init() {
    if (this.initialized) return;

    try {
      // Create AudioContext (supports both webkit and standard)
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Resume context if suspended (iOS requirement)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Load all sound buffers
      await this.loadSounds();

      this.initialized = true;
      console.log('Sound service initialized');
    } catch (error) {
      console.error('Failed to initialize sound service:', error);
    }
  }

  /**
   * Load all sound files
   */
  async loadSounds() {
    const soundNames = Object.keys(this.soundData);
    const promises = soundNames.map(name => this.loadSound(name));

    try {
      await Promise.all(promises);
      console.log('All sounds loaded');
    } catch (error) {
      console.error('Failed to load sounds:', error);
      // Continue even if sounds fail to load
    }
  }

  /**
   * Load a single sound file
   */
  async loadSound(name) {
    try {
      const response = await fetch(this.soundData[name]);

      if (!response.ok) {
        console.warn(`Sound file not found: ${name}`);
        return;
      }

      const arrayBuffer = await response.arrayBuffer();
      this.buffers[name] = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.warn(`Failed to load sound: ${name}`, error);
      // Don't throw - allow app to continue without this sound
    }
  }

  /**
   * Play a sound by name
   */
  play(soundName, volume = 1.0) {
    if (this.muted || !this.initialized) return;
    if (!this.buffers[soundName]) {
      console.warn(`Sound not loaded: ${soundName}`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = this.buffers[soundName];
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start(0);
    } catch (error) {
      console.error(`Failed to play sound: ${soundName}`, error);
    }
  }

  /**
   * Play move sound
   */
  playMove() {
    this.play('move', 0.5);
  }

  /**
   * Play capture sound
   */
  playCapture() {
    this.play('capture', 0.6);
  }

  /**
   * Play check sound
   */
  playCheck() {
    this.play('check', 0.7);
  }

  /**
   * Play checkmate sound
   */
  playCheckmate() {
    this.play('checkmate', 0.8);
  }

  /**
   * Toggle background music
   */
  async toggleMusic() {
    if (!this.initialized) await this.init();

    this.musicEnabled = !this.musicEnabled;

    if (this.musicEnabled) {
      await this.startMusic();
    } else {
      this.stopMusic();
    }

    return this.musicEnabled;
  }

  /**
   * Start background music (looping)
   */
  async startMusic() {
    try {
      if (!this.buffers.ambient) {
        // Load ambient music if not loaded
        const response = await fetch('/sounds/ambient.mp3');
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          this.buffers.ambient = await this.audioContext.decodeAudioData(arrayBuffer);
        } else {
          console.warn('Ambient music not found');
          return;
        }
      }

      // Stop existing music if playing
      if (this.musicSource) {
        this.stopMusic();
      }

      // Create music source with loop
      this.musicSource = this.audioContext.createBufferSource();
      this.musicGain = this.audioContext.createGain();

      this.musicSource.buffer = this.buffers.ambient;
      this.musicSource.loop = true;
      this.musicGain.gain.value = 0.3; // Low volume for background

      this.musicSource.connect(this.musicGain);
      this.musicGain.connect(this.audioContext.destination);

      this.musicSource.start(0);
    } catch (error) {
      console.error('Failed to start music:', error);
    }
  }

  /**
   * Stop background music
   */
  stopMusic() {
    if (this.musicSource) {
      try {
        this.musicSource.stop();
        this.musicSource.disconnect();
        this.musicGain.disconnect();
      } catch (error) {
        // Ignore errors when stopping
      }
      this.musicSource = null;
      this.musicGain = null;
    }
  }

  /**
   * Set muted state
   */
  setMuted(muted) {
    this.muted = muted;
    localStorage.setItem('soundMuted', muted.toString());

    // Stop music if muting
    if (muted && this.musicSource) {
      this.stopMusic();
      this.musicEnabled = false;
    }
  }

  /**
   * Get muted state
   */
  isMuted() {
    return this.muted;
  }

  /**
   * Get music enabled state
   */
  isMusicEnabled() {
    return this.musicEnabled;
  }

  /**
   * Get initialization state
   */
  isInitialized() {
    return this.initialized;
  }
}

// Export singleton instance
export default new SoundService();
