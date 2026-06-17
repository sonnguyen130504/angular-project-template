import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThreeDAudioService {
  private audioCtx: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  readonly isMuted = signal<boolean>(false);

  constructor() {}

  private initAudioContext(): void {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute(): void {
    this.isMuted.update((m) => !m);
    // Play sound immediately after toggling mute (if unmuted)
    if (!this.isMuted()) {
      this.playClick();
    }
  }

  private connectNode(node: AudioNode): void {
    if (this.analyser) {
      node.connect(this.analyser);
    } else if (this.audioCtx) {
      node.connect(this.audioCtx.destination);
    }
  }

  /**
   * Play a very short high-pitched click for hovers (tactile feedback)
   */
  playTick(): void {
    if (this.isMuted()) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    this.connectNode(gain);

    // High frequency short sine wave
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.24, this.audioCtx.currentTime); // louder tactile feedback
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.05);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  /**
   * Play a satisfying click for selections (double oscillator sound)
   */
  playClick(): void {
    if (this.isMuted()) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    this.connectNode(gain);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.60, this.audioCtx.currentTime); // louder select
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.08);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);

    // Double tap click
    setTimeout(() => {
      if (this.isMuted() || !this.audioCtx) return;
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.connect(gain2);
      this.connectNode(gain2);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(500, this.audioCtx.currentTime);
      gain2.gain.setValueAtTime(0.32, this.audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.05);
      osc2.start();
      osc2.stop(this.audioCtx.currentTime + 0.05);
    }, 40);
  }

  /**
   * Soft ascending chime for successful action feedback
   */
  playSuccess(): void {
    if (this.isMuted()) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const playNote = (freq: number, startDelay: number, duration: number) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.connect(gain);
      this.connectNode(gain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + startDelay);
      gain.gain.setValueAtTime(0.40, now + startDelay); // louder success
      gain.gain.exponentialRampToValueAtTime(0.0001, now + startDelay + duration);
      osc.start(now + startDelay);
      osc.stop(now + startDelay + duration);
    };

    playNote(523.25, 0, 0.15); // C5
    playNote(659.25, 0.08, 0.15); // E5
    playNote(783.99, 0.16, 0.25); // G5
  }

  /**
   * A low-pitch synth buzz for errors or failures
   */
  playError(): void {
    if (this.isMuted()) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    this.connectNode(gain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.audioCtx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.48, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.18);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.18);
  }

  /**
   * A sweet notification chime (A5 then C#6)
   */
  playNotification(): void {
    if (this.isMuted()) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const playNote = (freq: number, startDelay: number, duration: number) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      osc.connect(gain);
      this.connectNode(gain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + startDelay);
      gain.gain.setValueAtTime(0.40, now + startDelay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + startDelay + duration);
      osc.start(now + startDelay);
      osc.stop(now + startDelay + duration);
    };

    playNote(880.00, 0, 0.15); // A5
    playNote(1109.73, 0.06, 0.25); // C#6
  }

  /**
   * Toggle button state transition sound
   */
  playToggle(isOn: boolean): void {
    if (this.isMuted()) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    this.connectNode(gain);

    osc.type = 'sine';
    if (isOn) {
      // Ascending toggle beep
      osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, this.audioCtx.currentTime + 0.1);
    } else {
      // Descending toggle beep
      osc.frequency.setValueAtTime(700, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, this.audioCtx.currentTime + 0.1);
    }

    gain.gain.setValueAtTime(0.32, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.1);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  /**
   * Descending sweep for delete actions
   */
  playDelete(): void {
    if (this.isMuted()) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    this.connectNode(gain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.audioCtx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.48, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.25);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.25);
  }

  /**
   * Keyboard click sound
   */
  playKeypress(): void {
    if (this.isMuted()) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    this.connectNode(gain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, this.audioCtx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.32, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.015);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.015);
  }

  /**
   * Play a custom synthesized sound for the sandbox
   */
  playCustom(type: OscillatorType, frequency: number, duration: number, volume: number): void {
    if (this.isMuted()) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    this.connectNode(gain);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(10, frequency / 4), this.audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }
}
