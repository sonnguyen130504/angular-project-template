import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

/* ─── Data Model ──────────────────────────────────────────────────── */

export interface Comment {
  id: string;
  author: string;
  avatarColor: string;
  content: string;
  timestamp: string;   // ISO string
  likes: number;
  likedByUser: boolean;
}

export interface CommentResult {
  success: boolean;
  message: string;
  comment?: Comment;
}

/** Persisted ban record (per-browser, localStorage). */
interface BanRecord {
  strikes: number;
  bannedUntil: number | null;  // epoch ms | null = not banned | -1 = permanent
}

/* ─── API base URL ────────────────────────────────────────────────── */

/** Resolves to /api/comments in production, same in dev when proxied. */
const API_BASE = '/api/comments';

/* ─── Service ─────────────────────────────────────────────────────── */

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly http = inject(HttpClient);

  /* ── Reactive state ─────────────────────────────────────────────── */
  private readonly _comments = signal<Comment[]>([]);
  public readonly comments = this._comments.asReadonly();
  public readonly commentCount = computed(() => this._comments().length);

  private readonly _loading = signal(true);
  public readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  public readonly error = this._error.asReadonly();

  /* ── Rate limiting (1 post / 30 s, client-side) ─────────────────── */
  private lastPostTime = 0;
  private static readonly RATE_LIMIT_MS = 30_000;

  /* ── Like tracking (localStorage persisted) ──────────────────────── */
  private readonly likedIds = new Set<string>(this.loadLikes());

  /* ── Ban system (per-browser localStorage) ──────────────────────── */
  private ban: BanRecord = this.loadBan();

  private static readonly BAN_TIERS: { strikes: number; durationMs: number }[] = [
    { strikes: 3,  durationMs: 5 * 60_000 },
    { strikes: 5,  durationMs: 30 * 60_000 },
    { strikes: 8,  durationMs: 2 * 3_600_000 },
    { strikes: 10, durationMs: -1 },
  ];

  /* ── Avatar colours ─────────────────────────────────────────────── */
  private static readonly AVATAR_COLORS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  ];

  /* ── Profanity blacklist (EN + VI) ──────────────────────────────── */
  private static readonly PROFANITY_LIST: RegExp[] = [
    // English
    /\bf+[\W_]*u+[\W_]*c+[\W_]*k/gi,
    /\bs+[\W_]*h+[\W_]*[i1!]+[\W_]*t/gi,
    /\ba+[\W_]*s+[\W_]*s+[\W_]*h+[\W_]*o+[\W_]*l+[\W_]*e/gi,
    /\bb+[\W_]*[i1!]+[\W_]*t+[\W_]*c+[\W_]*h/gi,
    /\bd+[\W_]*[a@]+[\W_]*m+[\W_]*n/gi,
    /\bb+[\W_]*a+[\W_]*s+[\W_]*t+[\W_]*a+[\W_]*r+[\W_]*d/gi,
    /\bd+[\W_]*[i1!]+[\W_]*c+[\W_]*k/gi,
    /\bp+[\W_]*[i1!]+[\W_]*s+[\W_]*s/gi,
    /\bc+[\W_]*u+[\W_]*n+[\W_]*t/gi,
    /\bw+[\W_]*h+[\W_]*o+[\W_]*r+[\W_]*e/gi,
    /\bs+[\W_]*l+[\W_]*u+[\W_]*t/gi,
    /\bn+[\W_]*[i1!]+[\W_]*g+[\W_]*g/gi,
    /\bp+[\W_]*r+[\W_]*[i1!]+[\W_]*c+[\W_]*k/gi,
    // Vietnamese
    /\b[dđ]+[\W_]*[iíìỉĩị]+[\W_]*t[\W_]*m+[\W_]*[eẹéèẻẽê]+/gi,
    /\b[dđ]+[\W_]*[uùúủũụư]+[\W_]*[.,!?]*/gi,
    /\bl+[\W_]*[oòóỏõọô]+[\W_]*[nN]+/gi,
    /\bc+[\W_]*[aàáảãạ]+[\W_]*[cC]+/gi,
    /\b[dđ]+[\W_]*[eêéèẻẽẹ]+[\W_]*[.,!?]*[\W_]*c+[\W_]*h+[\W_]*[oòóỏõọ]+/gi,
    /\bm+[\W_]*[aàáảãạ]+[\W_]*[yỹỷýỳ]+[\W_]*[.,!?]*/gi,
    /\b[cC]+[\W_]*[hH]+[\W_]*[oòóỏõọô]+[\W_]*[.,!?]*/gi,
    /\bv+[\W_]*[aàáảãạ]+[\W_]*[iíìỉĩị]+[\W_]*l+[\W_]*[oòóỏõọô]+[\W_]*[nN]+/gi,
    /\bn+[\W_]*g+[\W_]*u+[\W_]*[.,!?]*[\W_]*x+[\W_]*u+[\W_]*a+[\W_]*n+/gi,
  ];

  constructor() {
    this.fetchComments();
  }

  /* ══════════════════════════════════════════════════════════════════
     Public API
     ══════════════════════════════════════════════════════════════════ */

  /** Fetch latest comments from server (call to refresh). */
  async fetchComments(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const raw = await firstValueFrom(
        this.http.get<Omit<Comment, 'likedByUser'>[]>(API_BASE)
      );
      // Merge server data with client-side likedByUser state
      this._comments.set(
        raw.map(c => ({ ...c, likedByUser: this.likedIds.has(c.id) }))
      );
    } catch {
      this._error.set('Could not load comments. Please try again later.');
    } finally {
      this._loading.set(false);
    }
  }

  /** Post a new comment (client validates → server stores). */
  async addComment(author: string, content: string): Promise<CommentResult> {

    /* ── 0. Ban check ─────────────────────────────────────────────── */
    const banStatus = this.getBanStatus();
    if (banStatus.banned) {
      const msg = banStatus.permanent
        ? 'You have been permanently banned for repeated violations.'
        : `You are temporarily banned. Try again in ${banStatus.remainingLabel}.`;
      return { success: false, message: msg };
    }

    /* ── 1. Author validation ─────────────────────────────────────── */
    const trimmedAuthor = author.trim();
    if (!trimmedAuthor)
      return { success: false, message: 'Please enter your name.' };
    if (trimmedAuthor.length < 2 || trimmedAuthor.length > 30)
      return { success: false, message: 'Name must be 2–30 characters.' };
    if (/^[\d\W]+$/.test(trimmedAuthor))
      return { success: false, message: 'Name must contain at least one letter.' };

    /* ── 2. Content validation ────────────────────────────────────── */
    const trimmedContent = content.trim();
    if (!trimmedContent)
      return { success: false, message: 'Please enter a comment.' };
    if (trimmedContent.length < 3)
      return { success: false, message: 'Comment must be at least 3 characters.' };
    if (trimmedContent.length > 500)
      return { success: false, message: 'Comment must be under 500 characters.' };

    /* ── 3. Rate limiting ─────────────────────────────────────────── */
    const now = Date.now();
    const elapsed = now - this.lastPostTime;
    if (elapsed < CommentService.RATE_LIMIT_MS) {
      const wait = Math.ceil((CommentService.RATE_LIMIT_MS - elapsed) / 1000);
      return { success: false, message: `Please wait ${wait}s before posting again.` };
    }

    /* ── 4. Duplicate detection ───────────────────────────────────── */
    const current = this._comments();
    if (current.length > 0 && current[0].content === trimmedContent) {
      return { success: false, message: 'This comment was already posted.' };
    }

    /* ── 5. Profanity filter + strike tracking ────────────────────── */
    const escaped = this.escapeHtml(trimmedContent);
    const hasProfanity = this.containsProfanity(escaped);
    const sanitizedContent = hasProfanity ? this.filterProfanity(escaped) : escaped;
    const sanitizedAuthor  = this.escapeHtml(trimmedAuthor);

    if (hasProfanity) {
      this.addStrike();
      const newBan = this.getBanStatus();
      if (newBan.banned) {
        const banMsg = newBan.permanent
          ? '🚫 Permanently banned for repeated profanity violations.'
          : `⚠️ Too many violations — banned for ${newBan.remainingLabel}.`;
        return { success: false, message: banMsg };
      }
    }

    /* ── 6. POST to server ────────────────────────────────────────── */
    const avatarColor = this.pickAvatarColor(sanitizedAuthor);
    try {
      const saved = await firstValueFrom(
        this.http.post<Omit<Comment, 'likedByUser'>>(API_BASE, {
          author:      sanitizedAuthor,
          content:     sanitizedContent,
          avatarColor,
        })
      );
      const withClient: Comment = { ...saved, likedByUser: false };
      this._comments.update(list => [withClient, ...list]);
      this.lastPostTime = now;

      const warnSuffix = hasProfanity
        ? ` (Warning: ${this.ban.strikes}/${this.nextBanThreshold()} strikes)`
        : '';
      return { success: true, message: 'Comment posted!' + warnSuffix, comment: withClient };
    } catch {
      return { success: false, message: 'Failed to post comment. Please try again.' };
    }
  }

  /** Toggle like (client-side tracking + server sync). */
  async toggleLike(id: string): Promise<void> {
    const alreadyLiked = this.likedIds.has(id);
    const action = alreadyLiked ? 'unlike' : 'like';

    // Optimistic update
    this._comments.update(list =>
      list.map(c => {
        if (c.id !== id) return c;
        if (alreadyLiked) {
          this.likedIds.delete(id);
          return { ...c, likes: Math.max(0, c.likes - 1), likedByUser: false };
        } else {
          this.likedIds.add(id);
          return { ...c, likes: c.likes + 1, likedByUser: true };
        }
      })
    );
    this.saveLikes();

    // Sync to server
    try {
      await firstValueFrom(
        this.http.post(`${API_BASE}/like`, { id, action })
      );
    } catch { /* optimistic already applied — swallow error */ }
  }

  /* ── Ban status ─────────────────────────────────────────────────── */
  public getBanStatus(): { banned: boolean; permanent: boolean; remainingLabel: string } {
    const now = Date.now();
    if (this.ban.bannedUntil === null)
      return { banned: false, permanent: false, remainingLabel: '' };
    if (this.ban.bannedUntil === -1)
      return { banned: true, permanent: true, remainingLabel: 'permanently' };
    if (now < this.ban.bannedUntil) {
      return { banned: true, permanent: false, remainingLabel: this.formatDuration(this.ban.bannedUntil - now) };
    }
    // Expired
    this.ban.bannedUntil = null;
    this.saveBan();
    return { banned: false, permanent: false, remainingLabel: '' };
  }

  public get strikeCount(): number { return this.ban.strikes; }

  /* ── Utilities ──────────────────────────────────────────────────── */
  public relativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 5) return 'just now';
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  public getInitials(name: string): string {
    return name.split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  /* ══════════════════════════════════════════════════════════════════
     Private helpers
     ══════════════════════════════════════════════════════════════════ */

  private containsProfanity(text: string): boolean {
    return CommentService.PROFANITY_LIST.some(p => { p.lastIndex = 0; return p.test(text); });
  }

  private filterProfanity(text: string): string {
    let r = text;
    for (const p of CommentService.PROFANITY_LIST) {
      p.lastIndex = 0;
      r = r.replace(p, m => '*'.repeat(m.length));
    }
    return r;
  }

  private escapeHtml(s: string): string {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  private pickAvatarColor(name: string): string {
    const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
    return CommentService.AVATAR_COLORS[hash % CommentService.AVATAR_COLORS.length];
  }

  private uid(): string {
    return `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  /* ── Ban helpers ─────────────────────────────────────────────────── */
  private addStrike(): void {
    this.ban.strikes++;
    let tier: { strikes: number; durationMs: number } | null = null;
    for (const t of CommentService.BAN_TIERS) {
      if (this.ban.strikes >= t.strikes) tier = t;
    }
    if (tier) {
      this.ban.bannedUntil = tier.durationMs === -1 ? -1 : Date.now() + tier.durationMs;
    }
    this.saveBan();
  }

  private nextBanThreshold(): number {
    for (const t of CommentService.BAN_TIERS) {
      if (this.ban.strikes < t.strikes) return t.strikes;
    }
    return CommentService.BAN_TIERS[CommentService.BAN_TIERS.length - 1].strikes;
  }

  private formatDuration(ms: number): string {
    const s = Math.ceil(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.ceil(s / 60);
    if (m < 60) return `${m} min`;
    const h = Math.floor(m / 60), rm = m % 60;
    return rm ? `${h}h ${rm}m` : `${h}h`;
  }

  private loadBan(): BanRecord {
    try {
      const raw = localStorage.getItem('sion-feedback-ban');
      if (raw) {
        const p = JSON.parse(raw) as BanRecord;
        if (typeof p.strikes === 'number') return p;
      }
    } catch { /* corrupted */ }
    return { strikes: 0, bannedUntil: null };
  }

  private saveBan(): void {
    try { localStorage.setItem('sion-feedback-ban', JSON.stringify(this.ban)); }
    catch { /* quota */ }
  }

  private loadLikes(): string[] {
    try {
      const raw = localStorage.getItem('sion-feedback-likes');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch { /* corrupted */ }
    return [];
  }

  private saveLikes(): void {
    try {
      localStorage.setItem('sion-feedback-likes', JSON.stringify([...this.likedIds]));
    } catch { /* quota */ }
  }
}
