import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [],
  templateUrl: './language-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  private translocoService = inject(TranslocoService);

  get activeLang(): string {
    return this.translocoService.getActiveLang();
  }

  get isVietnamese(): boolean {
    return this.activeLang === 'vi';
  }

  toggleLanguage(): void {
    const newLang = this.activeLang === 'en' ? 'vi' : 'en';
    this.translocoService.setActiveLang(newLang);
    localStorage.setItem('preferred-lang', newLang);
    document.documentElement.setAttribute('lang', newLang);
  }
}
