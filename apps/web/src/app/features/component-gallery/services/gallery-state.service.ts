import { Injectable } from '@angular/core';

export type ExplorerTab = 'button' | 'badge' | 'card' | 'dialog' | 'toggle' | 'input' | 'toast' | 'palette' | 'skeleton' | 'spinner';

@Injectable()
export class GalleryStateService {
  activeExplorerTab: ExplorerTab = 'button';

  // Button
  btnVariant: 'primary' | 'secondary' = 'primary';
  btnSize: 'sm' | 'md' | 'lg' = 'md';
  btnDisabled = false;
  btnLoading = false;
  btnIcon: 'none' | 'left' | 'right' = 'none';
  btnLabel = 'Confirm Action';

  // Badge
  badgeTone: 'neutral' | 'positive' | 'warning' | 'negative' | 'info' = 'neutral';
  badgeVariant: 'filled' | 'subtle' | 'outline' = 'filled';
  badgeLabel = 'Featured';

  // Card
  cardAccent: 'none' | 'primary' | 'teal' = 'none';
  cardShadow: 'none' | 'soft' | 'deep' = 'soft';
  cardPadding: 'sm' | 'md' | 'lg' = 'md';
  cardTitle = 'Calm Workshop';
  cardBody = 'A collection of visual structures, neutral palettes, and minimal layout items.';

  // Dialog
  dialogTitle = 'Publish Changes';
  dialogSize: 'small' | 'medium' = 'small';
  dialogActionCount: 1 | 2 = 2;
  dialogVisible = false;

  // Toggle
  toggleSize: 'sm' | 'md' = 'md';
  toggleChecked = false;
  toggleLabel = 'Enable Alerts';

  // Float Input
  inputPlaceholder = 'Enter Username';
  inputValue = '';
  inputFocused = false;
  inputStatus: 'none' | 'success' | 'error' = 'none';

  // Toast
  toastTone: 'info' | 'success' | 'danger' = 'success';
  toastTitle = 'Record Saved';
  toastMessage = 'Changes successfully pushed to production.';
  toastVisible = false;

  triggerToast(): void {
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 4000);
  }

  closeToast(): void {
    this.toastVisible = false;
  }

  // Generate dynamic HTML based on knobs
  get htmlCodeSnippet(): string {
    switch (this.activeExplorerTab) {
      case 'button': {
        const variantAttr = this.btnVariant === 'secondary' ? ' variant="secondary"' : '';
        const sizeClass = this.btnSize !== 'md' ? ` class="btn-${this.btnSize}"` : '';
        const disabledAttr = this.btnDisabled ? ' [disabled]="true"' : '';
        const loadingAttr = this.btnLoading ? ' [loading]="true"' : '';
        
        let iconMarkup = '';
        if (this.btnIcon === 'left') {
          iconMarkup = '<i class="pi pi-check" aria-hidden="true" style="margin-right: 8px;"></i>';
        } else if (this.btnIcon === 'right') {
          iconMarkup = '<i class="pi pi-arrow-right" aria-hidden="true" style="margin-left: 8px;"></i>';
        }

        return `<app-ui-button${variantAttr}${sizeClass}${disabledAttr}${loadingAttr}>
  ${iconMarkup}${this.btnLabel}
</app-ui-button>`;
      }
      case 'badge': {
        const toneAttr = this.badgeTone !== 'neutral' ? ` tone="${this.badgeTone}"` : '';
        const classAttr = this.badgeVariant !== 'filled' ? ` class="badge-${this.badgeVariant}"` : '';
        return `<app-ui-badge${toneAttr}${classAttr}>${this.badgeLabel}</app-ui-badge>`;
      }
      case 'card': {
        const accentClass = this.cardAccent !== 'none' ? ` accent-${this.cardAccent}` : '';
        const shadowClass = ` shadow-${this.cardShadow}`;
        const padClass = ` pad-${this.cardPadding}`;
        return `<app-ui-card class="card${accentClass}${shadowClass}${padClass}">
  <h3>${this.cardTitle}</h3>
  <p>${this.cardBody}</p>
</app-ui-card>`;
      }
      case 'dialog': {
        const widthVal = this.dialogSize === 'small' ? 'min(92vw, 420px)' : 'min(92vw, 640px)';
        const buttonsMarkup = this.dialogActionCount === 2 
          ? `  <div class="dialog-actions">
    <app-ui-button (click)="dialogVisible = false">Confirm</app-ui-button>
    <app-ui-button variant="secondary" (click)="dialogVisible = false">Cancel</app-ui-button>
  </div>`
          : `  <div class="dialog-actions">
    <app-ui-button (click)="dialogVisible = false">Close</app-ui-button>
  </div>`;

        return `<p-dialog header="${this.dialogTitle}" [(visible)]="dialogVisible" [modal]="true" [style]="{ width: '${widthVal}' }">
  <p>Dialog body text content goes here.</p>
${buttonsMarkup}
</p-dialog>`;
      }
      case 'toggle': {
        const sizeClass = this.toggleSize === 'sm' ? ' class="toggle-sm"' : '';
        const labelMarkup = this.toggleLabel ? `\n  <span>${this.toggleLabel}</span>` : '';
        return `<label class="toggle-control"${sizeClass}>
  <input type="checkbox" [(ngModel)]="toggleChecked" />
  <span class="toggle-indicator"></span>${labelMarkup}
</label>`;
      }
      case 'input': {
        const statusClass = this.inputStatus !== 'none' ? ` status-${this.inputStatus}` : '';
        return `<div class="float-input-wrapper${statusClass}">
  <input 
    type="text" 
    id="float-input-field" 
    placeholder=" " 
    [(ngModel)]="inputValue" 
  />
  <label for="float-input-field">${this.inputPlaceholder}</label>
</div>`;
      }
      case 'toast': {
        const toneClass = this.toastTone !== 'success' ? ` toast-${this.toastTone}` : '';
        return `@if (toastVisible) {
  <div class="slide-toast-alert${toneClass}">
    <div class="toast-body">
      <i class="pi pi-info-circle" aria-hidden="true"></i>
      <div class="toast-content">
        <strong>${this.toastTitle}</strong>
        <p>${this.toastMessage}</p>
      </div>
    </div>
    <button type="button" class="toast-close-btn" (click)="closeToast()" aria-label="Close toast">
      <i class="pi pi-times" aria-hidden="true"></i>
    </button>
  </div>
}`;
      }
      case 'palette': {
        return `<app-command-palette></app-command-palette>`;
      }
      case 'skeleton': {
        return `<app-skeleton-loader></app-skeleton-loader>`;
      }
      case 'spinner': {
        return `<app-spinner-loader></app-spinner-loader>`;
      }
    }
  }

  // Generate dynamic TS snippet
  get tsCodeSnippet(): string {
    switch (this.activeExplorerTab) {
      case 'button':
        return `import { Component } from '@angular/core';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [UiButtonComponent],
  templateUrl: './button-demo.component.html'
})
export class ButtonDemoComponent {
  // Add handler logic if necessary
}`;
      case 'badge':
        return `import { Component } from '@angular/core';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';

@Component({
  selector: 'app-badge-demo',
  standalone: true,
  imports: [UiBadgeComponent],
  templateUrl: './badge-demo.component.html'
})
export class BadgeDemoComponent {}`;
      case 'card':
        return `import { Component } from '@angular/core';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-card-demo',
  standalone: true,
  imports: [UiCardComponent],
  templateUrl: './card-demo.component.html'
})
export class CardDemoComponent {}`;
      case 'dialog':
        return `import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

@Component({
  selector: 'app-dialog-demo',
  standalone: true,
  imports: [DialogModule, UiButtonComponent],
  templateUrl: './dialog-demo.component.html'
})
export class DialogDemoComponent {
  dialogVisible = false;
}`;
      case 'toggle':
        return `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toggle-demo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './toggle-demo.component.html',
  styleUrl: './toggle-demo.component.scss'
})
export class ToggleDemoComponent {
  toggleChecked = false;
}`;
      case 'input':
        return `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-float-input-demo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './float-input-demo.component.html',
  styleUrl: './float-input-demo.component.scss'
})
export class FloatInputDemoComponent {
  inputValue = '';
}`;
      case 'toast':
        return `import { Component } from '@angular/core';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  templateUrl: './toast-demo.component.html',
  styleUrl: './toast-demo.component.scss'
})
export class ToastDemoComponent {
  toastVisible = false;

  triggerToast(): void {
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 4000);
  }

  closeToast(): void {
    this.toastVisible = false;
  }
}`;
      case 'palette':
        return `import { Component } from '@angular/core';
import { CommandPaletteComponent } from '@app/features/component-gallery/components/command-palette/command-palette.component';

@Component({
  selector: 'app-palette-demo',
  standalone: true,
  imports: [CommandPaletteComponent],
  templateUrl: './palette-demo.component.html'
})
export class PaletteDemoComponent {}`;
      case 'skeleton':
        return `import { Component } from '@angular/core';
import { SkeletonLoaderComponent } from '@app/features/component-gallery/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-skeleton-demo',
  standalone: true,
  imports: [SkeletonLoaderComponent],
  templateUrl: './skeleton-demo.component.html'
})
export class SkeletonDemoComponent {}`;
      case 'spinner':
        return `import { Component } from '@angular/core';
import { SpinnerLoaderComponent } from '@app/features/component-gallery/components/spinner-loader/spinner-loader.component';

@Component({
  selector: 'app-spinner-demo',
  standalone: true,
  imports: [SpinnerLoaderComponent],
  templateUrl: './spinner-demo.component.html'
})
export class SpinnerDemoComponent {}`;
    }
  }
}
