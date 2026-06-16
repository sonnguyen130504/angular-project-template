import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    PageSectionComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent
],
  templateUrl: './sign-in-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './sign-in-page.component.scss',
})
export class SignInPageComponent implements OnInit, OnDestroy {
  // Slideshow state
  currentSlideIndex = 0;
  private slideIntervalId?: any;

  readonly slides = [
    {
      title: 'Calm Commerce Workbench',
      desc: 'Practical tools, clear metadata labels, and minimal layout structures.',
      image: 'assets/calm_commerce_hero.png',
    },
    {
      title: 'Tactile Motion Controls',
      desc: 'Real-time spring physics engines and staggered initialization pipelines.',
      image: 'assets/field_jacket_detail.png',
    },
    {
      title: 'Minimalist Architecture',
      desc: 'Rebuilt for visual hierarchy, scanning speed, and extreme responsiveness.',
      image: 'assets/market_tote_detail.png',
    },
  ];

  // Form inputs
  email = 'you@example.com';
  password = '';
  rememberMe = true;
  showPassword = false;
  loading = false;
  locked = false;
  submitted = false;
  isSuccess = false;

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  private startSlideshow(): void {
    this.slideIntervalId = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    }, 5000);
  }

  private stopSlideshow(): void {
    if (this.slideIntervalId) {
      clearInterval(this.slideIntervalId);
    }
  }

  setSlide(index: number): void {
    this.currentSlideIndex = index;
    // Reset timer to prevent instant jumping
    this.stopSlideshow();
    this.startSlideshow();
  }

  get canSubmit(): boolean {
    return this.email.includes('@') && this.password.length >= 8;
  }

  submit(): void {
    if (!this.canSubmit) {
      this.submitted = true;
      return;
    }

    this.loading = true;
    this.submitted = true;
    this.isSuccess = false;

    window.setTimeout(() => {
      this.loading = false;
      this.isSuccess = true;
    }, 1500);
  }

  toggleLocked(): void {
    this.locked = !this.locked;
  }
}




