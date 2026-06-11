import { Component, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    PageSectionComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    DecimalPipe
],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
})
export class ForgotPasswordPageComponent implements OnDestroy {
  email = 'you@example.com';
  submitted = false;

  // OTP Verification state
  otpCode: string[] = ['', '', '', ''];
  otpSubmitted = false;
  otpLoading = false;
  otpTimer = 59;
  private otpIntervalId?: any;

  ngOnDestroy(): void {
    this.stopOtpTimer();
  }

  get isEmailValid(): boolean {
    return this.email.includes('@');
  }

  get isOtpComplete(): boolean {
    return this.otpCode.every((digit) => digit.trim().length === 1 && !isNaN(Number(digit)));
  }

  submit(): void {
    if (!this.isEmailValid) return;
    this.submitted = true;
    this.otpCode = ['1', '2', '3', '4'];
    this.otpTimer = 59;
    this.startOtpTimer();
  }

  verifyOtp(): void {
    if (!this.isOtpComplete) return;

    this.otpLoading = true;
    setTimeout(() => {
      this.otpLoading = false;
      this.otpSubmitted = true;
      this.stopOtpTimer();
    }, 1500);
  }

  resendOtp(): void {
    this.otpCode = ['', '', '', ''];
    this.otpTimer = 59;
    this.otpSubmitted = false;
    this.startOtpTimer();
  }

  private startOtpTimer(): void {
    this.stopOtpTimer();
    this.otpIntervalId = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        this.stopOtpTimer();
      }
    }, 1000);
  }

  private stopOtpTimer(): void {
    if (this.otpIntervalId) {
      clearInterval(this.otpIntervalId);
      this.otpIntervalId = undefined;
    }
  }

  // Handle focus transition between input boxes
  onOtpInput(event: any, index: number): void {
    const input = event.target;
    const value = input.value;
    
    // Ensure single digit
    if (value.length > 1) {
      this.otpCode[index] = value.charAt(0);
      input.value = value.charAt(0);
    }

    if (value && index < 3) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpCode[index] && index > 0) {
      const prevInput = (event.target as HTMLElement).previousElementSibling as HTMLInputElement;
      if (prevInput) {
        this.otpCode[index - 1] = '';
        prevInput.focus();
      }
    }
  }
}




