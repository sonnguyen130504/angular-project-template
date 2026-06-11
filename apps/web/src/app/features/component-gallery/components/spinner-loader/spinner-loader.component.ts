import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-spinner-loader',
  standalone: true,
  templateUrl: './spinner-loader.component.html',
  styleUrl: './spinner-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerLoaderComponent {
}
