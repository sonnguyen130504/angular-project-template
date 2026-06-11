import { Component } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-forms-page',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    DatePickerModule,
    FormsModule,
    PageSectionComponent,
    SelectModule,
    SliderModule,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
  ],
  templateUrl: './forms-page.component.html',
  styleUrl: './forms-page.component.scss',
})
export class FormsPageComponent {
  // Stepper state
  currentFormStep = 1;

  // Step 1: Account
  email = 'you@example.com';
  password = '';

  // Step 2: Profile
  fullName = '';
  tone = 'Calm';
  priority = 62;

  // Step 3: Launch
  launchDate = new Date();
  notify = true;
  compact = false;
  notes = 'Use this page to copy complete form patterns into real features.';

  // Toast status
  isSubmitting = false;
  showSuccessToast = false;

  readonly toneOptions = ['Calm', 'Direct', 'Editorial', 'Operational'].map((value) => ({ label: value, value }));

  // Validation getters
  get emailHasError(): boolean {
    return this.email.length > 0 && !this.email.includes('@');
  }

  get passwordHasError(): boolean {
    return this.password.length > 0 && this.password.length < 8;
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.password);
  }

  get hasSpecial(): boolean {
    return /[^A-Za-z0-9]/.test(this.password);
  }

  // Password strength logic
  get passwordStrengthScore(): number {
    if (!this.password) return 0;
    let score = 0;
    if (this.password.length >= 8) score++;
    if (/[A-Z]/.test(this.password)) score++;
    if (/[0-9]/.test(this.password)) score++;
    if (/[^A-Za-z0-9]/.test(this.password)) score++;
    return score;
  }

  get passwordStrengthLabel(): string {
    const score = this.passwordStrengthScore;
    if (score === 0) return 'None';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Strong';
    return 'Excellent';
  }

  get passwordStrengthColor(): string {
    const score = this.passwordStrengthScore;
    if (score === 1) return '#a13d3d'; // Weak - Red
    if (score === 2) return '#9a6a1f'; // Fair - Orange
    if (score === 3) return '#2f5f91'; // Strong - Blue
    if (score === 4) return '#2f6f4e'; // Excellent - Green
    return '#e4d8c9'; // None - Gray
  }

  // Step Validation checks
  get step1IsValid(): boolean {
    return this.email.includes('@') && this.password.length >= 8;
  }

  get step2IsValid(): boolean {
    return this.fullName.trim().length >= 2;
  }

  get step3IsValid(): boolean {
    return !!this.launchDate;
  }

  // Navigation handlers
  nextStep(): void {
    if (this.currentFormStep === 1 && this.step1IsValid) {
      this.currentFormStep = 2;
    } else if (this.currentFormStep === 2 && this.step2IsValid) {
      this.currentFormStep = 3;
    }
  }

  prevStep(): void {
    if (this.currentFormStep > 1 && this.currentFormStep < 4) {
      this.currentFormStep--;
    }
  }

  submitForm(): void {
    if (!this.step1IsValid || !this.step2IsValid || !this.step3IsValid) return;

    this.isSubmitting = true;
    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccessToast = true;
      this.currentFormStep = 4; // Move to Success Screen
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        this.showSuccessToast = false;
      }, 4000);
    }, 1500);
  }

  resetWizard(): void {
    this.currentFormStep = 1;
    this.email = 'you@example.com';
    this.password = '';
    this.fullName = '';
    this.tone = 'Calm';
    this.priority = 62;
    this.launchDate = new Date();
    this.notify = true;
    this.compact = false;
    this.notes = '';
    this.showSuccessToast = false;
  }
}




