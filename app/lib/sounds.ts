/**
 * Sound Effects System using Web Audio API
 * Generates Windows 98-style sounds using synthesized audio
 * No external audio files required
 */

export type SoundType = 
  | 'windowOpen' | 'windowClose' | 'windowMinimize' | 'windowMaximize' | 'windowRestore'
  | 'error' | 'criticalStop' | 'exclamation'
  | 'buttonClick' | 'menuOpen' | 'menuClose'
  | 'mineExplode' | 'cardDeal' | 'solitaireWin';

/**
 * Manages all sound effects for the Windows 98 system
 * Uses Web Audio API for low-latency synthesized sounds
 */
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private volume: number = 0.3;
  private muted: boolean = false;

  constructor() {
    // Lazy initialization to avoid autoplay policy issues
  }

  /**
   * Get or create AudioContext (lazy initialization)
   */
  private getContext(): AudioContext {
    if (!this.audioContext) {
      try {
        this.audioContext = new AudioContext();
      } catch (error) {
        console.error('Failed to create AudioContext:', error);
        throw error;
      }
    }
    return this.audioContext;
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Toggle mute state
   */
  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  /**
   * Main entry point for playing sounds
   */
  playSound(type: SoundType): void {
    if (this.muted) return;

    try {
      switch (type) {
        case 'windowOpen':
          this.playChirp(400, 800, 100);
          break;
        case 'windowClose':
          this.playChirp(800, 400, 100);
          break;
        case 'windowMinimize':
          this.playChirp(600, 300, 150);
          break;
        case 'windowMaximize':
          this.playChirp(400, 700, 150);
          break;
        case 'windowRestore':
          this.playChirp(400, 600, 150);
          break;
        case 'error':
          this.playBeep(400, 200, 'sawtooth');
          break;
        case 'criticalStop':
          this.playBeep(200, 300, 'square');
          break;
        case 'exclamation':
          this.playBeep(600, 100, 'sine');
          break;
        case 'buttonClick':
          this.playClick(800, 30);
          break;
        case 'menuOpen':
          this.playChirp(400, 500, 80);
          break;
        case 'menuClose':
          this.playChirp(500, 400, 80);
          break;
        case 'mineExplode':
          this.playExplosion();
          break;
        case 'cardDeal':
          this.playClick(600, 40);
          break;
        case 'solitaireWin':
          this.playArpeggio([262, 330, 392, 523], 500);
          break;
        default:
          console.warn(`Unknown sound type: ${type}`);
      }
    } catch (error) {
      console.error(`Failed to play sound "${type}":`, error);
    }
  }

  /**
   * Play a frequency chirp (ascending or descending)
   * Used for window sounds
   */
  private playChirp(startFreq: number, endFreq: number, duration: number): void {
    if (this.muted) return;

    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      endFreq,
      ctx.currentTime + duration / 1000
    );

    gain.gain.setValueAtTime(this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration / 1000
    );

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  }

  /**
   * Play a simple beep with specified waveform
   * Used for system sounds (error, critical stop, exclamation)
   */
  private playBeep(
    frequency: number,
    duration: number,
    waveType: OscillatorType = 'sine'
  ): void {
    if (this.muted) return;

    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = waveType;
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration / 1000
    );

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  }

  /**
   * Play a short click sound
   * Used for UI interactions (buttons, card dealing)
   */
  private playClick(frequency: number, duration: number): void {
    if (this.muted) return;

    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = frequency;

    // Sharp attack and decay for click effect
    gain.gain.setValueAtTime(this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      ctx.currentTime + duration / 1000
    );

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  }

  /**
   * Play an explosion sound
   * Uses noise burst and low rumble for Minesweeper mine
   */
  private playExplosion(): void {
    if (this.muted) return;

    const ctx = this.getContext();
    
    // Create noise burst using buffer with random data
    const bufferSize = ctx.sampleRate * 0.3; // 300ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill with noise that decays over time
    for (let i = 0; i < bufferSize; i++) {
      const decay = 1 - (i / bufferSize);
      data[i] = (Math.random() * 2 - 1) * decay;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseGain = ctx.createGain();
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    noiseGain.gain.setValueAtTime(this.volume * 0.5, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    // Add low rumble
    const rumble = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    
    rumble.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);
    
    rumble.type = 'sine';
    rumble.frequency.value = 100;
    
    rumbleGain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
    rumbleGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    noise.start(ctx.currentTime);
    rumble.start(ctx.currentTime);
    
    noise.stop(ctx.currentTime + 0.3);
    rumble.stop(ctx.currentTime + 0.3);
  }

  /**
   * Play an arpeggio (sequence of notes)
   * Used for Solitaire win sound (C-E-G-C)
   */
  private playArpeggio(notes: number[], totalDuration: number): void {
    if (this.muted) return;

    const ctx = this.getContext();
    const noteDuration = totalDuration / notes.length / 1000; // Convert to seconds
    
    notes.forEach((frequency, index) => {
      const startTime = ctx.currentTime + (index * noteDuration);
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.value = frequency;
      
      gain.gain.setValueAtTime(this.volume * 0.7, startTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        startTime + noteDuration
      );
      
      osc.start(startTime);
      osc.stop(startTime + noteDuration);
    });
  }

  /**
   * Cleanup - close AudioContext if needed
   */
  destroy(): void {
    if (this.audioContext) {
      this.audioContext.close().catch(error => {
        console.error('Failed to close AudioContext:', error);
      });
      this.audioContext = null;
    }
  }
}

// Export singleton instance for easy use throughout the app
export const soundManager = new SoundManager();
