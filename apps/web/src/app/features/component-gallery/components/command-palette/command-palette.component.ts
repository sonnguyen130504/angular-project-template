import { ChangeDetectionStrategy, Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent {
  dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  
  isOpen = signal(false);
  searchQuery = signal('');

  // Sample results
  results = [
    { icon: 'pi-file', label: 'Create New Document', group: 'Actions' },
    { icon: 'pi-folder', label: 'Open Project', group: 'Actions' },
    { icon: 'pi-cog', label: 'System Settings', group: 'Navigation' },
    { icon: 'pi-user', label: 'Profile', group: 'Navigation' },
  ];

  filteredResults = signal(this.results);

  open() {
    this.isOpen.set(true);
    this.searchQuery.set('');
    this.filteredResults.set(this.results);
    this.dialogRef()?.nativeElement.showModal();
  }

  close() {
    this.isOpen.set(false);
    this.dialogRef()?.nativeElement.close();
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery.set(query);
    
    if (!query) {
      this.filteredResults.set(this.results);
    } else {
      this.filteredResults.set(this.results.filter(item => item.label.toLowerCase().includes(query)));
    }
  }

  // Bind Ctrl+K (or Cmd+K) globally to open it
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.isOpen() ? this.close() : this.open();
    }
  }
}
