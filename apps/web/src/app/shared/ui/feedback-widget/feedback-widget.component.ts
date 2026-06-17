import { Component, inject, signal, computed, ElementRef, ViewChild, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { CommentService, Comment } from '../../services/comment.service';

@Component({
  selector: 'app-feedback-widget',
  standalone: true,
  imports: [],
  templateUrl: './feedback-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './feedback-widget.component.scss',
})
export class FeedbackWidgetComponent implements AfterViewChecked {
  @ViewChild('commentList') private commentListEl?: ElementRef<HTMLDivElement>;

  protected readonly svc = inject(CommentService);

  /* ── UI state ──────────────────────────────────────────────────── */
  isOpen = signal(false);
  authorName = signal(this.loadSavedName());
  commentText = signal('');
  feedbackMsg = signal<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);
  isSubmitting = signal(false);
  private shouldScrollToTop = false;

  /* ── Derived ───────────────────────────────────────────────────── */
  charCount    = computed(() => this.commentText().length);
  charOverLimit = computed(() => this.charCount() > 500);
  canSubmit    = computed(
    () => this.authorName().trim().length >= 2
       && this.commentText().trim().length >= 3
       && !this.charOverLimit()
       && !this.isSubmitting()
       && !this.isBanned(),
  );

  /* ── Ban status ────────────────────────────────────────────────── */
  isBanned = computed(() => this.svc.getBanStatus().banned);
  banMessage = computed(() => {
    const s = this.svc.getBanStatus();
    if (s.permanent) return 'Permanently banned for repeated profanity violations.';
    if (s.banned)    return `Temporarily banned. Try again in ${s.remainingLabel}.`;
    return '';
  });

  /* ── Lifecycle ─────────────────────────────────────────────────── */
  ngAfterViewChecked(): void {
    if (this.shouldScrollToTop && this.commentListEl) {
      this.commentListEl.nativeElement.scrollTop = 0;
      this.shouldScrollToTop = false;
    }
  }

  /* ── Actions ───────────────────────────────────────────────────── */
  toggle(): void {
    this.isOpen.update(v => !v);
    if (!this.isOpen()) this.clearFeedback();
    else this.svc.fetchComments(); // refresh on open
  }

  close(): void {
    this.isOpen.set(false);
    this.clearFeedback();
  }

  async submit(): Promise<void> {
    if (!this.canSubmit()) return;
    this.isSubmitting.set(true);
    this.clearFeedback();

    const result = await this.svc.addComment(this.authorName(), this.commentText());
    this.isSubmitting.set(false);

    if (result.success) {
      this.commentText.set('');
      this.saveName(this.authorName());
      this.showFeedback(result.hasProfanity ? 'warning' : 'success', result.message, !!result.hasProfanity);
      this.shouldScrollToTop = true;
    } else {
      this.showFeedback('error', result.message, true);
    }
  }

  likeComment(comment: Comment): void {
    this.svc.toggleLike(comment.id);
  }

  refresh(): void {
    this.svc.fetchComments();
  }

  trackById(_index: number, comment: Comment): string { return comment.id; }
  getInitials(name: string):         string { return this.svc.getInitials(name); }
  relativeTime(date: Date | string): string { return this.svc.relativeTime(date); }

  onTextareaInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    this.commentText.set(el.value);
  }

  onAuthorInput(event: Event): void {
    this.authorName.set((event.target as HTMLInputElement).value);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.submit();
    }
  }

  /* ── Private helpers ───────────────────────────────────────────── */
  private showFeedback(type: 'success' | 'warning' | 'error', text: string, persistent = false): void {
    this.feedbackMsg.set({ type, text });
    if (!persistent) {
      setTimeout(() => this.clearFeedback(), 4000);
    }
  }
  public clearFeedback(): void { this.feedbackMsg.set(null); }

  private saveName(name: string): void {
    try { localStorage.setItem('sion-feedback-author', name.trim()); } catch { /* noop */ }
  }
  private loadSavedName(): string {
    try { return localStorage.getItem('sion-feedback-author') ?? ''; } catch { return ''; }
  }
}
