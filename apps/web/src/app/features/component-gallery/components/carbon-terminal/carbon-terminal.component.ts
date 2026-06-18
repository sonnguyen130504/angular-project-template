import { Component, input, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-carbon-terminal',
  standalone: true,
  imports: [],
  templateUrl: './carbon-terminal.component.html',
  styleUrl: './carbon-terminal.component.scss',
})
export class CarbonTerminalComponent {
  htmlSnippet = input('');
  tsSnippet = input('');

  copiedText = '';
  showCopyToast = false;

  copySnippet(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copiedText = code;
      this.showCopyToast = true;
      setTimeout(() => {
        this.showCopyToast = false;
      }, 2000);
    });
  }
}
