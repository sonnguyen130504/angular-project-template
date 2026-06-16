import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, DecimalPipe } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { PageSectionComponent } from '@app/shared/ui/page-section/page-section.component';
import { UiBadgeComponent } from '@app/shared/ui/ui-badge/ui-badge.component';
import { UiButtonComponent } from '@app/shared/ui/ui-button/ui-button.component';
import { UiCardComponent } from '@app/shared/ui/ui-card/ui-card.component';
import { EmptyStateVariantComponent } from './components/empty-state-variant/empty-state-variant.component';

export interface StateDefinition {
  id: 'no-data' | 'no-results' | 'denied' | 'offline' | 'error' | 'onboarding';
  title: string;
  icon: string;
  desc: string;
  tone: 'info' | 'warning' | 'negative' | 'positive';
}

@Component({
  selector: 'app-empty-state-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    PageSectionComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiCardComponent,
    EmptyStateVariantComponent,
    NgClass,
    DecimalPipe
],
  templateUrl: './empty-state-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './empty-state-page.component.scss'
})
export class EmptyStatePageComponent implements OnDestroy {
  activeStateId: StateDefinition['id'] = 'no-data';

  readonly statesList: StateDefinition[] = [
    { id: 'no-data', title: 'No Data / Blank Inbox', icon: 'pi-inbox', desc: 'Display when a collection has no records.', tone: 'info' },
    { id: 'no-results', title: 'No Search Results', icon: 'pi-search', desc: 'Display when filters match no data points.', tone: 'warning' },
    { id: 'denied', title: 'Permission Denied', icon: 'pi-lock', desc: 'Display when access privileges are insufficient.', tone: 'negative' },
    { id: 'offline', title: 'Offline Mode', icon: 'pi-wifi', desc: 'Display when connection parameters fail.', tone: 'warning' },
    { id: 'error', title: 'Server Error (500)', icon: 'pi-exclamation-triangle', desc: 'Display when backend actions return fatal codes.', tone: 'negative' },
    { id: 'onboarding', title: 'Onboarding Guide', icon: 'pi-map', desc: 'Display as a setup wizard helper.', tone: 'positive' },
  ];

  // 1. No Data State props
  isDropped = false;
  droppedFileName = '';

  // 2. Search Results props
  searchQuery = '';
  readonly allProducts = [
    { name: 'Teal Field Jacket', price: '$220', category: 'Outerwear' },
    { name: 'Forest Market Tote', price: '$85', category: 'Accessories' },
    { name: 'Blue Desk Tray', price: '$65', category: 'Home' },
    { name: 'Wool Beanie', price: '$35', category: 'Accessories' },
  ];

  get filteredProducts() {
    if (!this.searchQuery) return this.allProducts;
    return this.allProducts.filter((p) =>
      p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // 3. Permission State props
  accessRequestStatus: 'idle' | 'pending' | 'granted' = 'idle';

  // 4. Offline State props
  isOfflineMode = false;
  offlineCountdown = 10;
  private offlineTimerId?: any;

  // 5. Server Error props
  isRetrying = false;
  retryResult: 'idle' | 'success' | 'failed' = 'idle';

  // 6. Onboarding props
  onboardingStep = 1;
  readonly stepsList = [
    { num: 1, title: 'Profile Setup', desc: 'Define names and credentials.' },
    { num: 2, title: 'Store Details', desc: 'Configure shipping parameters.' },
    { num: 3, title: 'Theme Preset', desc: 'Choose colorways and layout grids.' },
    { num: 4, title: 'Launch Ready', desc: 'Index lists and start operations.' },
  ];

  ngOnDestroy(): void {
    this.stopOfflineTimer();
  }

  selectState(id: StateDefinition['id']): void {
    this.activeStateId = id;
    this.stopOfflineTimer();
    this.isOfflineMode = false;
    this.retryResult = 'idle';
    this.isRetrying = false;
    this.accessRequestStatus = 'idle';
    this.isDropped = false;
    this.droppedFileName = '';
    // Auto-trigger offline state so the user sees it immediately
    if (id === 'offline') {
      this.toggleOfflineMode();
    }
  }

  // --- No Data Action ---
  simulateFileDrop(): void {
    this.isDropped = true;
    this.droppedFileName = 'inventory_export_jun2026.csv';
  }

  clearDrop(): void {
    this.isDropped = false;
    this.droppedFileName = '';
  }

  // --- Permission Request Action ---
  requestAccess(): void {
    this.accessRequestStatus = 'pending';
    setTimeout(() => {
      this.accessRequestStatus = 'granted';
    }, 2000);
  }

  // --- Offline Timer Actions ---
  toggleOfflineMode(): void {
    this.isOfflineMode = !this.isOfflineMode;
    if (this.isOfflineMode) {
      this.offlineCountdown = 10;
      this.startOfflineTimer();
    } else {
      this.stopOfflineTimer();
    }
  }

  private startOfflineTimer(): void {
    this.stopOfflineTimer();
    this.offlineTimerId = setInterval(() => {
      if (this.offlineCountdown > 1) {
        this.offlineCountdown--;
      } else {
        // Reconnect automatically when timer hits 0
        this.isOfflineMode = false;
        this.stopOfflineTimer();
      }
    }, 1000);
  }

  private stopOfflineTimer(): void {
    if (this.offlineTimerId) {
      clearInterval(this.offlineTimerId);
      this.offlineTimerId = undefined;
    }
  }

  // --- Server Error Actions ---
  retrySync(): void {
    this.isRetrying = true;
    this.retryResult = 'idle';
    setTimeout(() => {
      this.isRetrying = false;
      // 60% chance of recovery success
      this.retryResult = Math.random() > 0.4 ? 'success' : 'failed';
    }, 1800);
  }

  // --- Onboarding Navigation ---
  onboardingNext(): void {
    if (this.onboardingStep < 4) {
      this.onboardingStep++;
    }
  }

  onboardingPrev(): void {
    if (this.onboardingStep > 1) {
      this.onboardingStep--;
    }
  }

  resetOnboarding(): void {
    this.onboardingStep = 1;
  }
}




