import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export type CameraPreset = {
  label: string;
  icon: string;
  orbit: string;
};

@Component({
  selector: 'app-camera-controls',
  standalone: true,
  templateUrl: './camera-controls.component.html',
  styleUrl: './camera-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraControlsComponent {
  presets = input<CameraPreset[]>([
    { label: 'Front', icon: 'pi pi-stop', orbit: '0deg 75deg 4m' },
    { label: 'Side', icon: 'pi pi-arrow-right', orbit: '90deg 75deg 4m' },
    { label: 'Top', icon: 'pi pi-chevron-up', orbit: '0deg 0deg 4m' },
    { label: 'Detail', icon: 'pi pi-search-plus', orbit: '30deg 60deg 2.5m' },
  ]);
  autoRotate = input<boolean>(true);
  isFullscreen = input<boolean>(false);

  cameraChange = output<string>();
  autoRotateToggle = output<boolean>();
  fullscreenToggle = output<void>();
  resetCamera = output<void>();

  activePreset = '';

  selectPreset(preset: CameraPreset): void {
    this.activePreset = preset.label;
    this.cameraChange.emit(preset.orbit);
  }

  onAutoRotateToggle(): void {
    this.autoRotateToggle.emit(!this.autoRotate());
  }

  onFullscreen(): void {
    this.fullscreenToggle.emit();
  }

  onReset(): void {
    this.activePreset = '';
    this.resetCamera.emit();
  }
}
