import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('Global Responsive Layout', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(appRoutes), provideAnimations()],
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  it('should not cause horizontal scroll on mobile viewport across main routes', async () => {
    // Resize Karma iframe to trigger mobile media queries
    let originalWidth = '';
    let originalHeight = '';
    const karmaIframe = window.parent.document.getElementById('context') as HTMLIFrameElement;
    if (karmaIframe) {
      originalWidth = karmaIframe.style.width;
      originalHeight = karmaIframe.style.height;
      karmaIframe.style.width = '428px';
      karmaIframe.style.height = '926px';
    }

    const fixture = TestBed.createComponent(AppComponent);
    fixture.nativeElement.style.display = 'block';
    fixture.nativeElement.style.width = '100%';
    fixture.nativeElement.style.overflow = 'hidden';
    document.body.appendChild(fixture.nativeElement);

    const routesToCheck = [
      '/empty-state', 
      '/catalog', 
      '/dashboard', 
      '/component-gallery'
    ];
    
    for (const route of routesToCheck) {
      await router.navigateByUrl(route);
      fixture.detectChanges();
      await fixture.whenStable(); // wait for async rendering
      
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      
      expect(scrollWidth)
        .withContext(`Route ${route} has horizontal overflow (scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth})`)
        .toBeLessThanOrEqual(clientWidth);
    }
    
    document.body.removeChild(fixture.nativeElement);

    // Restore Karma iframe
    if (karmaIframe) {
      karmaIframe.style.width = originalWidth || '100%';
      karmaIframe.style.height = originalHeight || '100%';
    }
  });
});
