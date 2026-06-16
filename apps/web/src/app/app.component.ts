import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppShellComponent } from './layout/app-shell/app-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppShellComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.scss',
})
export class AppComponent {}
