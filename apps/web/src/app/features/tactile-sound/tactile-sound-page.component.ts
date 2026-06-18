import { Component, ElementRef, OnDestroy, AfterViewInit, viewChild, ViewEncapsulation, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { ThreeDAudioService } from '../product-3d-showcase/services/three-d-audio.service';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-tactile-sound-page',
  standalone: true,
  imports: [FormsModule, PageSectionComponent, TranslocoDirective],
  templateUrl: './tactile-sound-page.component.html',
  styleUrl: './tactile-sound-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TactileSoundPageComponent implements AfterViewInit, OnDestroy {
  public audio = inject(ThreeDAudioService);

  readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('visualizerCanvas');
  readonly pannerPadRef = viewChild<ElementRef<HTMLDivElement>>('pannerPad');
  
  // Custom synthesizer variables
  oscillatorType: OscillatorType = 'sine';
  frequency = 440;
  duration = 0.2;
  volume = 0.15;

  // Visualizer loop variables
  private animationFrameId: number | null = null;
  private dataArray: Uint8Array = new Uint8Array(0);

  // Sequencer Variables
  sequencerGrid = signal<boolean[][]>([
    [false, false, false, false, false, false, false, false], // C5
    [false, false, false, false, false, false, false, false], // G4
    [false, false, false, false, false, false, false, false], // E4
    [false, false, false, false, false, false, false, false]  // C4
  ]);
  isPlaying = signal<boolean>(false);
  bpm = signal<number>(120);
  currentStep = signal<number>(0);
  private sequencerIntervalId: any = null;

  // 3D Spatial Audio Panner Variables
  pannerX = signal<number>(0); // Range: -100 to 100
  pannerY = signal<number>(0); // Range: -100 to 100
  isDraggingPanner = signal<boolean>(false);

  // Preset profiles
  readonly presets = [
    { name: 'Hover Tick', desc: 'Slight high-pitched sine click (50ms)', action: () => this.audio.playTick() },
    { name: 'Select Click', desc: 'Double tap tactile feedback (80ms)', action: () => this.audio.playClick() },
    { name: 'Success Chime', desc: 'Melodic ascending C-E-G arpeggio', action: () => this.audio.playSuccess() },
    { name: 'Error Buzz', desc: 'Low-pitch retro sawtooth buzzer (180ms)', action: () => this.audio.playError() },
    { name: 'System Notification', desc: 'Sweet high-pitched double chime', action: () => this.audio.playNotification() },
    { name: 'Delete Sweep', desc: 'Descending sweep sweep for trash action', action: () => this.audio.playDelete() }
  ];

  // Dynamic sounds
  readonly laserPresets = [
    { name: 'Sci-Fi Laser', type: 'sawtooth' as OscillatorType, freq: 800, dur: 0.3, vol: 0.3 },
    { name: 'Heavy Bass Drop', type: 'triangle' as OscillatorType, freq: 150, dur: 0.8, vol: 0.3 },
    { name: 'Glass Chime', type: 'sine' as OscillatorType, freq: 2000, dur: 0.15, vol: 0.2 },
    { name: 'Retro Beep', type: 'square' as OscillatorType, freq: 600, dur: 0.1, vol: 0.25 }
  ];

  isToggleOn = false;
  keyboardInput = '';

  ngAfterViewInit(): void {
    this.startVisualizer();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.stopSequencer();
  }

  playCustom(): void {
    this.audio.playCustom(this.oscillatorType, this.frequency, this.duration, this.volume);
  }

  playLaser(preset: { type: OscillatorType; freq: number; dur: number; vol: number }): void {
    this.audio.playCustom(preset.type, preset.freq, preset.dur, preset.vol);
  }

  onToggleChange(): void {
    this.isToggleOn = !this.isToggleOn;
    this.audio.playToggle(this.isToggleOn);
  }

  onKeypress(): void {
    this.audio.playKeypress();
  }

  // Interactive pad interactions
  onPadHover(): void {
    this.audio.playTick();
  }

  onPadClick(): void {
    this.audio.playClick();
  }

  onPadSuccess(): void {
    this.audio.playSuccess();
  }

  onPadError(): void {
    this.audio.playError();
  }

  // --- SEQUENCER METHODS ---
  toggleSequencerCell(row: number, col: number): void {
    const grid = this.sequencerGrid();
    grid[row][col] = !grid[row][col];
    this.sequencerGrid.set([...grid]);
    this.audio.playTick();
  }

  toggleSequencerPlay(): void {
    if (this.isPlaying()) {
      this.stopSequencer();
    } else {
      this.startSequencer();
    }
  }

  private startSequencer(): void {
    this.isPlaying.set(true);
    const stepTime = (60 / this.bpm()) * 1000 / 2; // Eighth notes
    const run = () => {
      this.tickSequencer();
      const nextTime = (60 / this.bpm()) * 1000 / 2;
      if (this.isPlaying()) {
        this.sequencerIntervalId = setTimeout(run, nextTime);
      }
    };
    this.sequencerIntervalId = setTimeout(run, stepTime);
  }

  private stopSequencer(): void {
    this.isPlaying.set(false);
    if (this.sequencerIntervalId) {
      clearTimeout(this.sequencerIntervalId);
      this.sequencerIntervalId = null;
    }
  }

  private tickSequencer(): void {
    const nextStep = (this.currentStep() + 1) % 8;
    this.currentStep.set(nextStep);

    // Play activated notes for this step
    const notes = [523.25, 392.00, 329.63, 261.63]; // C5, G4, E4, C4
    const grid = this.sequencerGrid();
    for (let row = 0; row < 4; row++) {
      if (grid[row][nextStep]) {
        this.playSequencerNote(notes[row]);
      }
    }
  }

  private playSequencerNote(freq: number): void {
    this.audio.playCustom('sine', freq, 0.12, this.volume);
  }

  updateBpm(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.bpm.set(parseInt(target.value, 10));
  }

  clearSequencer(): void {
    this.sequencerGrid.set([
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false]
    ]);
  }

  // --- 3D SPATIAL AUDIO METHODS ---
  playPanningCustom(): void {
    const ctx = this.audio.analyser ? this.audio.analyser.context : null;
    if (!ctx) {
      this.playCustom();
      return;
    }
    if (ctx.state === 'suspended' && 'resume' in ctx) {
      (ctx as AudioContext).resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    let panner: StereoPannerNode | null = null;
    try {
      panner = ctx.createStereoPanner();
    } catch (e) {
      // Fallback
    }

    osc.type = this.oscillatorType;
    osc.frequency.setValueAtTime(this.frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(10, this.frequency / 4), ctx.currentTime + this.duration);

    gain.gain.setValueAtTime(this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + this.duration);

    osc.connect(gain);
    if (panner) {
      // Map pannerX coordinate (-100 to 100) to panning value (-1.0 to 1.0)
      const panVal = Math.max(-1, Math.min(1, this.pannerX() / 100));
      panner.pan.setValueAtTime(panVal, ctx.currentTime);
      gain.connect(panner);
      if (this.audio.analyser) {
        panner.connect(this.audio.analyser);
      } else {
        panner.connect(ctx.destination);
      }
    } else {
      if (this.audio.analyser) {
        gain.connect(this.audio.analyser);
      } else {
        gain.connect(ctx.destination);
      }
    }

    osc.start();
    osc.stop(ctx.currentTime + this.duration);
  }

  startPannerDrag(event: MouseEvent): void {
    this.isDraggingPanner.set(true);
    this.updatePannerPosition(event);
    window.addEventListener('mousemove', this.onPannerDrag);
    window.addEventListener('mouseup', this.stopPannerDrag);
  }

  private onPannerDrag = (event: MouseEvent): void => {
    if (this.isDraggingPanner()) {
      this.updatePannerPosition(event);
    }
  };

  private stopPannerDrag = (): void => {
    this.isDraggingPanner.set(false);
    window.removeEventListener('mousemove', this.onPannerDrag);
    window.removeEventListener('mouseup', this.stopPannerDrag);
    this.audio.playClick();
  };

  private updatePannerPosition(event: MouseEvent): void {
    const pad = this.pannerPadRef()?.nativeElement;
    if (!pad) return;

    const rect = pad.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Convert to range -100 to 100 relative to center
    const x = Math.max(-100, Math.min(100, ((clickX / rect.width) * 200) - 100));
    const y = Math.max(-100, Math.min(100, ((clickY / rect.height) * 200) - 100));

    this.pannerX.set(x);
    this.pannerY.set(y);
  }

  private startVisualizer(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      this.animationFrameId = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const analyser = this.audio.analyser;
      if (!analyser) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        const sliceWidth = width / 100;
        let x = 0;
        for (let i = 0; i < 100; i++) {
          const v = 0.5 + Math.sin(i * 0.15 + Date.now() * 0.015) * 0.05;
          const y = v * height;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      if (this.dataArray.length !== bufferLength) {
        this.dataArray = new Uint8Array(bufferLength);
      }

      analyser.getByteTimeDomainData(this.dataArray as any);

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#a855f7';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#a855f7';

      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = this.dataArray[i] / 128.0;
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

      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();
    };

    draw();
  }
}
