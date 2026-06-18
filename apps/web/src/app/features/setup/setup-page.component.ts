import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';

type SetupStep = {
  id: number;
  title: string;
  body: string;
  done: boolean;
  owner: string;
  state: 'Complete' | 'Ready' | 'Blocked';
};

import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-setup-page',
  standalone: true,
  imports: [PageSectionComponent, UiBadgeComponent, UiButtonComponent, TranslocoDirective],
  templateUrl: './setup-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './setup-page.component.scss',
})
export class SetupPageComponent {
  activeStepId = 1;
  steps: SetupStep[] = [
    { id: 1, title: 'Connect workspace', body: 'Name the workspace and choose the default route group.', done: true, owner: 'Admin', state: 'Complete' },
    { id: 2, title: 'Invite team', body: 'Send at least one invite and assign a safe role.', done: false, owner: 'People', state: 'Ready' },
    { id: 3, title: 'Configure billing', body: 'Pick a plan and add a payment method.', done: false, owner: 'Finance', state: 'Blocked' },
    { id: 4, title: 'Publish checklist', body: 'Review final states before launch.', done: false, owner: 'Ops', state: 'Ready' },
  ];
  readonly environmentChecks = [
    { label: 'Routes', value: '23 mapped', ok: true },
    { label: 'Tests', value: 'Smoke suite ready', ok: true },
    { label: 'Billing', value: 'Payment method needed', ok: false },
  ];

  get activeStep(): SetupStep {
    return this.steps.find((step) => step.id === this.activeStepId) ?? this.steps[0];
  }

  get progress(): number {
    return Math.round((this.steps.filter((step) => step.done).length / this.steps.length) * 100);
  }

  completeActive(): void {
    this.steps = this.steps.map((step) => step.id === this.activeStepId ? { ...step, done: true, state: 'Complete' } : step);
    const next = this.steps.find((step) => !step.done);
    this.activeStepId = next?.id ?? this.activeStepId;
  }

  restart(): void {
    this.steps = this.steps.map((step, index) => ({ ...step, done: index === 0, state: index === 0 ? 'Complete' : step.state === 'Blocked' ? 'Blocked' : 'Ready' }));
    this.activeStepId = 1;
  }
}



