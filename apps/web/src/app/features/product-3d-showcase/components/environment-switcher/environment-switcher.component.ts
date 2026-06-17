import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export type Environment = {
  id: string;
  label: string;
  icon: string;
  image: string;
  exposure: number;
};

@Component({
  selector: 'app-environment-switcher',
  standalone: true,
  templateUrl: './environment-switcher.component.html',
  styleUrl: './environment-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvironmentSwitcherComponent {
  environments = input<Environment[]>([
    { id: 'neutral', label: 'Studio', icon: 'pi pi-sun', image: '', exposure: 1 },
    { id: 'warm', label: 'Warm', icon: 'pi pi-cloud', image: '', exposure: 1.2 },
    { id: 'dramatic', label: 'Dramatic', icon: 'pi pi-bolt', image: '', exposure: 0.7 },
  ]);
  activeId = input<string>('neutral');

  environmentChange = output<Environment>();

  selectEnvironment(env: Environment): void {
    this.environmentChange.emit(env);
  }
}
