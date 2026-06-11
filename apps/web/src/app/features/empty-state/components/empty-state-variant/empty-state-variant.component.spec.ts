import { TestBed } from '@angular/core/testing';
import { EmptyStateVariantComponent } from './empty-state-variant.component';

describe('EmptyStateVariantComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateVariantComponent],
    }).compileComponents();
  });

  it('renders the variant title and description', () => {
    const fixture = TestBed.createComponent(EmptyStateVariantComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('description', 'Test Description');
    fixture.detectChanges();
    
    expect(fixture.nativeElement.textContent).toContain('Test Title');
    expect(fixture.nativeElement.textContent).toContain('Test Description');
  });
});
