import { provideZoneChangeDetection, isDevMode } from "@angular/core";
import 'zone.js';
import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { provideTransloco } from '@jsverse/transloco';
import { AppComponent } from '@app/app.component';
import { appRoutes } from '@app/app.routes';
import { TranslocoHttpLoader } from '@app/transloco-loader';

// Register Vietnamese locale for Angular pipes (date, currency, number)
registerLocaleData(localeVi);

const savedLang = localStorage.getItem('preferred-lang') || 'en';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),provideAnimations(),
    provideHttpClient(withXhr()),
    provideRouter(appRoutes),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideTransloco({
      config: {
        availableLangs: ['en', 'vi'],
        defaultLang: savedLang,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        fallbackLang: 'en',
        missingHandler: {
          useFallbackTranslation: true,
        },
      },
      loader: TranslocoHttpLoader,
    }),
  ],
}).catch((err) => console.error(err));
