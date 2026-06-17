import { Component, ElementRef, OnDestroy, OnInit, viewChild, ViewEncapsulation, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { ThreeDAudioService } from '../product-3d-showcase/services/three-d-audio.service';

@Component({
  selector: 'app-tactile-sound-page',
  standalone: true,
  imports: [FormsModule, PageSectionComponent],
  templateUrl: './tactile-sound-page.component.html',
  styleUrl: './tactile-sound-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TactileSoundPageComponent implements OnInit, OnDestroy {
  public audio = inject(ThreeDAudioService);

  readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('visualizerCanvas');
  
  // Custom synthesizer variables
  oscillatorType: OscillatorType = 'sine';
  frequency = 440;
  duration = 0.2;
  volume = 0.4;

  // Visualizer loop variables
  private animationFrameId: number | null = null;
  private dataArray: Uint8Array = new Uint8Array(0);

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
    { name: 'Sci-Fi Laser', type: 'sawtooth' as OscillatorType, freq: 800, dur: 0.3, vol: 0.60 },
    { name: 'Heavy Bass Drop', type: 'triangle' as OscillatorType, freq: 150, dur: 0.8, vol: 0.90 },
    { name: 'Glass Chime', type: 'sine' as OscillatorType, freq: 2000, dur: 0.15, vol: 0.48 },
    { name: 'Retro Beep', type: 'square' as OscillatorType, freq: 600, dur: 0.1, vol: 0.40 }
  ];

  isToggleOn = false;
  keyboardInput = '';

  ngOnInit(): void {
    this.startVisualizer();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
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


  private startVisualizer(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      this.animationFrameId = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      // Draw background with subtle fading trails
      ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Check if Web Audio context is initialized in the service
      const analyser = this.audio.analyser;
      if (!analyser) {
        // Draw idle sine wave
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
      // Vibrant custom purple-blue neon color palette
      ctx.strokeStyle = '#a855f7';
      
      // Draw outer glowing neon blur path
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

      // Draw standard inner line without blur
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();
    };

    draw();
  }
}
