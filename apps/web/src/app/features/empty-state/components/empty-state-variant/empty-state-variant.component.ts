import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-empty-state-variant',
  standalone: true,
  imports: [NgClass],
  templateUrl: './empty-state-variant.component.html',
  styleUrl: './empty-state-variant.component.scss'
})
export class EmptyStateVariantComponent {
  icon = input('');
  title = input('');
  description = input('');
  tone = input<'info' | 'warning' | 'negative' | 'positive' | 'neutral'>('neutral');
  wrapperClass = input('text-center workspace-shell');
  showVisual = input(true);
  
  // This is a naive check. A real app might use @ContentChild to check if projected content exists.
  // For simplicity, we just assume if there's no custom visual projected, the consumer leaves it empty.
  // Actually, ng-content doesn't easily let us know if it's empty in the template.
  // We'll add an Input to toggle default icon:
  hasVisualContent = input(false);
}
