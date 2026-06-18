import { Component, ChangeDetectionStrategy, signal, viewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';

type AmbientChannel = {
  id: string;
  name: string;
  icon: string;
  volume: number;
  muted: boolean;
  oscillator?: OscillatorNode;
  gainNode?: GainNode;
  frequency: number;
  type: OscillatorType;
};

type Preset = {
  name: string;
  frequency: number;
  volume: number;
  oscType: OscillatorType;
  channels: { [key: string]: number };
};

@Component({
  selector: 'app-audio-studio-page',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './audio-studio-page.component.html',
  styleUrl: './audio-studio-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AudioStudioPageComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly visualizerCanvas = viewChild<ElementRef<HTMLCanvasElement>>('visualizerCanvas');

  // System Core Toggles
  powerOn = signal<boolean>(false);
  frequency = signal<number>(440);
  masterVolume = signal<number>(0.3);
  selectedOscType = signal<OscillatorType>('sine');
  activePreset = signal<string>('Focus');

  readonly oscTypes: OscillatorType[] = ['sine', 'triangle', 'sawtooth', 'square'];

  // Ambient Loop Synthesizer Tracks
  ambientChannels = signal<AmbientChannel[]>([
    { id: 'rain', name: 'Pink Noise', icon: 'pi-cloud-rain', volume: 0.1, muted: false, frequency: 80, type: 'triangle' },
    { id: 'forest', name: 'Forest Drone', icon: 'pi-compass', volume: 0.2, muted: false, frequency: 120, type: 'sine' },
    { id: 'white', name: 'Sub Bass Glow', icon: 'pi-sun', volume: 0.15, muted: false, frequency: 55, type: 'sine' }
  ]);

  readonly presets: Preset[] = [
    {
      name: 'Focus',
      frequency: 220,
      volume: 0.25,
      oscType: 'sine',
      channels: { rain: 0.3, forest: 0.2, white: 0.1 }
    },
    {
      name: 'Relax',
      frequency: 165,
      volume: 0.2,
      oscType: 'triangle',
      channels: { rain: 0.5, forest: 0.4, white: 0.3 }
    },
    {
      name: 'Midnight',
      frequency: 110,
      volume: 0.35,
      oscType: 'sine',
      channels: { rain: 0.2, forest: 0.1, white: 0.6 }
    }
  ];

  // Audio Context Core Components
  private audioCtx: AudioContext | null = null;
  private masterOsc: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Knob interaction states
  private activeDragKnob: 'frequency' | 'volume' | null = null;
  private startY = 0;
  private startValue = 0;

  // Visualization animation thread
  private visualizerAnimationId = 0;

  ngOnInit(): void {
    // Add global window listeners for dial drag gestures
    window.addEventListener('mousemove', this.onKnobDrag);
    window.addEventListener('mouseup', this.stopKnobDrag);
    window.addEventListener('touchmove', this.onKnobDrag);
    window.addEventListener('touchend', this.stopKnobDrag);
  }

  ngAfterViewInit(): void {
    this.drawVisualizerStandby();
  }

  ngOnDestroy(): void {
    this.stopAudioContext();
    window.removeEventListener('mousemove', this.onKnobDrag);
    window.removeEventListener('mouseup', this.stopKnobDrag);
    window.removeEventListener('touchmove', this.onKnobDrag);
    window.removeEventListener('touchend', this.stopKnobDrag);
    if (this.visualizerAnimationId) {
      cancelAnimationFrame(this.visualizerAnimationId);
    }
  }

  // --- AUDIO SYNTHESIS CONTROLS ---

  togglePower(): void {
    this.powerOn.set(!this.powerOn());
    if (this.powerOn()) {
      this.initAudioContext();
      this.tickVisualizer();
    } else {
      this.stopAudioContext();
      this.drawVisualizerStandby();
    }
  }

  private initAudioContext(): void {
    try {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Initialize Analyser Node
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;

      // Master Output controls
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume(), this.audioCtx.currentTime);

      // Primary Oscillator
      this.masterOsc = this.audioCtx.createOscillator();
      this.masterOsc.type = this.selectedOscType();
      this.masterOsc.frequency.setValueAtTime(this.frequency(), this.audioCtx.currentTime);

      // Connections: Osc -> Master Gain -> Analyser -> Output
      this.masterOsc.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      this.masterOsc.start();

      // Start Ambient Channels Synthesis
      this.ambientChannels().forEach(ch => {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = ch.type;
        osc.frequency.setValueAtTime(ch.frequency, this.audioCtx.currentTime);
        
        const volumeFactor = ch.muted ? 0 : ch.volume;
        gain.gain.setValueAtTime(volumeFactor, this.audioCtx.currentTime);

        osc.connect(gain);
        gain.connect(this.analyser!);
        
        osc.start();

        ch.oscillator = osc;
        ch.gainNode = gain;
      });

    } catch (e) {
      console.error('Failed to initialize Web Audio context', e);
    }
  }

  private stopAudioContext(): void {
    this.ambientChannels().forEach(ch => {
      try {
        ch.oscillator?.stop();
      } catch (_) {}
      ch.oscillator = undefined;
      ch.gainNode = undefined;
    });

    try {
      this.masterOsc?.stop();
    } catch (_) {}

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
    }

    this.masterOsc = null;
    this.masterGain = null;
    this.analyser = null;
    this.audioCtx = null;
  }

  setOscType(type: OscillatorType): void {
    this.selectedOscType.set(type);
    if (this.masterOsc && this.audioCtx) {
      this.masterOsc.type = type;
    }
  }

  onChannelVolumeChange(id: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);

    this.ambientChannels.update(channels => 
      channels.map(ch => {
        if (ch.id === id) {
          ch.volume = value;
          if (ch.gainNode && this.audioCtx && !ch.muted) {
            ch.gainNode.gain.setValueAtTime(value, this.audioCtx.currentTime);
          }
        }
        return ch;
      })
    );
  }

  toggleChannelMute(id: string): void {
    this.ambientChannels.update(channels => 
      channels.map(ch => {
        if (ch.id === id) {
          ch.muted = !ch.muted;
          if (ch.gainNode && this.audioCtx) {
            const targetVolume = ch.muted ? 0 : ch.volume;
            ch.gainNode.gain.setValueAtTime(targetVolume, this.audioCtx.currentTime);
          }
        }
        return ch;
      })
    );
  }

  applyPreset(preset: Preset): void {
    this.activePreset.set(preset.name);
    
    // Update master signals
    this.frequency.set(preset.frequency);
    this.masterVolume.set(preset.volume);
    this.setOscType(preset.oscType);

    if (this.masterOsc && this.audioCtx) {
      this.masterOsc.frequency.setValueAtTime(preset.frequency, this.audioCtx.currentTime);
    }
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(preset.volume, this.audioCtx.currentTime);
    }

    // Update channels
    this.ambientChannels.update(channels => 
      channels.map(ch => {
        const targetVol = preset.channels[ch.id] ?? ch.volume;
        ch.volume = targetVol;
        if (ch.gainNode && this.audioCtx && !ch.muted) {
          ch.gainNode.gain.setValueAtTime(targetVol, this.audioCtx.currentTime);
        }
        return ch;
      })
    );
  }

  // --- KNOB INTERACTION MATH ---

  getKnobRotation(value: number): number {
    // Maps standard scale range into rotating angle (from -135deg to +135deg)
    let percent = 0;
    if (this.activeDragKnob === 'frequency' || value > 100) {
      // Frequency slider range: 40Hz to 1000Hz
      percent = (value - 40) / (1000 - 40);
    } else {
      // Volume range: 0% to 100%
      percent = value / 100;
    }
    percent = Math.min(1, Math.max(0, percent));
    return -135 + (percent * 270);
  }

  startKnobDrag(event: MouseEvent | TouchEvent, type: 'frequency' | 'volume'): void {
    if (!this.powerOn()) return;

    this.activeDragKnob = type;
    this.startY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    this.startValue = type === 'frequency' ? this.frequency() : this.masterVolume();
    event.preventDefault();
  }

  private onKnobDrag = (event: MouseEvent | TouchEvent): void => {
    if (!this.activeDragKnob) return;

    const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const deltaY = this.startY - currentY; // Upward drag increases value

    if (this.activeDragKnob === 'frequency') {
      const step = 2.5; // Frequency increment steps
      let newFreq = this.startValue + (deltaY * step);
      newFreq = Math.min(1000, Math.max(40, Math.round(newFreq)));
      this.frequency.set(newFreq);

      if (this.masterOsc && this.audioCtx) {
        this.masterOsc.frequency.setValueAtTime(newFreq, this.audioCtx.currentTime);
      }
    } else {
      const step = 0.003;
      let newVol = this.startValue + (deltaY * step);
      newVol = Math.min(1.0, Math.max(0.0, parseFloat(newVol.toFixed(3))));
      this.masterVolume.set(newVol);

      if (this.masterGain && this.audioCtx) {
        this.masterGain.gain.setValueAtTime(newVol, this.audioCtx.currentTime);
      }
    }
  };

  private stopKnobDrag = (): void => {
    this.activeDragKnob = null;
  };

  // --- CANVAS VISUALIZER CODE ---

  private tickVisualizer(): void {
    if (!this.powerOn()) return;

    const canvas = this.visualizerCanvas()?.nativeElement;
    const ctx = canvas?.getContext('2d');
    
    if (canvas && ctx && this.analyser) {
      const width = canvas.width;
      const height = canvas.height;
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      this.analyser.getByteTimeDomainData(dataArray);

      // CRT Scanline refresh overlay
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Drawing background telemetry grids
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.06)';
      ctx.lineWidth = 1;
      
      const gridSpacing = 30;
      for (let i = 0; i < width; i += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Drawing time wave
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#22c55e'; // Retro digital screen green color
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#22c55e';

      ctx.beginPath();
      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Reset shadows
      ctx.shadowBlur = 0;
    }

    this.visualizerAnimationId = requestAnimationFrame(() => this.tickVisualizer());
  }

  private drawVisualizerStandby(): void {
    const canvas = this.visualizerCanvas()?.nativeElement;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      const width = canvas.width;
      const height = canvas.height;

      // Dark screen
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Flat zero timeline green guide
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.fillText('OSCILLOSCOPE STANDBY - ON POWER TO INITIALIZE', 20, height - 20);
    }
  }
}
