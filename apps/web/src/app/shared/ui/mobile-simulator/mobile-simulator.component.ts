import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-mobile-simulator',
  standalone: true,
  templateUrl: './mobile-simulator.component.html',
  styleUrl: './mobile-simulator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileSimulatorComponent {
  theme = input<'light' | 'dark'>('light');
}
