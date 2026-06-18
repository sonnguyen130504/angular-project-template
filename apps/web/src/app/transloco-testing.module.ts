import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';
import en from '../assets/i18n/en.json';
import vi from '../assets/i18n/vi.json';

export function getTranslocoModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: { en, vi },
    translocoConfig: {
      availableLangs: ['en', 'vi'],
      defaultLang: 'en',
    },
    preloadLangs: true,
    ...options,
  });
}
