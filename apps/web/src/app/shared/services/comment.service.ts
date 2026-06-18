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
  hasProfanity?: boolean;
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

  /* ── Profanity blacklist & filter ───────────────────────────────── */
  private static readonly BASE_BAD_WORDS = [
    'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'dick', 'cunt', 'whore', 'slut', 'nigger', 'nigga', 'pussy', 'crap', 'prick',
    'dit', 'deo', 'buoi', 'cac', 'lon', 'vcl', 'clgt', 'vl', 'dm', 'dmm', 'cmn', 'dech', 'du', 'ocho'
  ];

  private static readonly BASE_BAD_PHRASES = [
    'oc cho',
    'cho de',
    'con di',
    'di diem',
    'bu cu',
    'bu lol',
    'du me',
    'du ma',
    'ngu lo',
  ];

  private static readonly HOMOGLYPH_MAP: Record<string, string[]> = {
    a: ['a', '@', '4', 'à', 'á', 'ả', 'ã', 'ạ', 'ă', 'ằ', 'ắ', 'ẳ', 'ẵ', 'ặ', 'â', 'ầ', 'ấ', 'ẩ', 'ẫ', 'ậ'],
    b: ['b'],
    c: ['c', '(', '{', '['],
    d: ['d', 'đ'],
    e: ['e', '3', 'ê', 'è', 'é', 'ẻ', 'ẽ', 'ẹ', 'ề', 'ế', 'ể', 'ễ', 'ệ'],
    g: ['g', '9'],
    h: ['h', '#'],
    i: ['i', '1', '!', '|', 'j', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
    l: ['l', '1', '|'],
    m: ['m'],
    n: ['n'],
    o: ['o', '0', 'ò', 'ó', 'ỏ', 'õ', 'ọ', 'ô', 'ồ', 'ố', 'ổ', 'ỗ', 'ộ', 'ơ', 'ờ', 'ớ', 'ở', 'ỡ', 'ợ'],
    p: ['p'],
    r: ['r'],
    s: ['s', '$', '5'],
    t: ['t', '7', '+'],
    u: ['u', 'v', 'w', 'ù', 'ú', 'ủ', 'ũ', 'ụ', 'ư', 'ừ', 'ứ', 'ử', 'ữ', 'ự'],
    v: ['v'],
    y: ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
  };

  private static readonly ZERO_WIDTH = /[\u200B-\u200D\uFEFF]/g;
  private static readonly SEPARATOR = '[\\W_]*';
  private static readonly MIN_REPEAT = /([a-zđ])\1{2,}/gi;

  private static makeFlexibleRegex(term: string): RegExp {
    const parts = term
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => token.split('').map((char) => {
        const chars = CommentService.HOMOGLYPH_MAP[char] ?? [char];
        const escaped = chars.map((c) => CommentService.escapeRegex(c));
        return `(?:${escaped.join('|')})+`;
      }).join(CommentService.SEPARATOR));

    return new RegExp(`(?:^|\\W|\\b)${parts}(?:$|\\W|\\b)`, 'giu');
  }

  private static readonly FILTER_LIST: RegExp[] = [
    ...CommentService.BASE_BAD_WORDS.map((word) => CommentService.makeFlexibleRegex(word)),
    ...CommentService.BASE_BAD_PHRASES.map((phrase) => CommentService.makeFlexibleRegex(phrase)),
    /\b[dđ]+\W*[iíìỉĩịyýỳỷỹỵ]+\W*t+/giu,
    /\b[dđ]+\W*[eêéèẻẽẹếềểễệ]+\W*o+\W*s*/giu,
    /\b[l]+\W*[oòóỏõọôồốổỗộơờớởỡợ]+\W*n+/giu,
    /\b[c]+\W*[aàáảãạăằắẳẵặâầấẩẫậ]+\W*[c]+/giu,
    /\b[b]+\W*[uùúủũụưừứửữự]+\W*[oòóỏõọôồốổỗộơờớởỡợ]*\W*[iìíỉĩịyýỳỷỹỵ]+/giu,
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
      
      const localComments = this.loadLocalComments();
      const localLikesMap = this.loadLocalLikesMap();
      const SEED_LIKES: Record<string, number> = { seed_1: 5, seed_2: 3, seed_3: 7 };

      const mergedMap = new Map<string, Comment>();

      // Load local comments first (to preserve user's own comments if server reset)
      for (const lc of localComments) {
        mergedMap.set(lc.id, {
          ...this.sanitizeComment(lc),
          likedByUser: this.likedIds.has(lc.id)
        });
      }

      // Overwrite/merge with server comments
      for (const sc of raw) {
        const likedByUser = this.likedIds.has(sc.id);
        let likes = sc.likes;

        // Sync likes with local tracking
        if (localLikesMap.has(sc.id)) {
          likes = Math.max(likes, localLikesMap.get(sc.id) ?? 0);
        }

        // If user liked it, but server returned original seed count, increment by 1
        if (likedByUser && likes === sc.likes && sc.likes === (SEED_LIKES[sc.id] ?? 0)) {
          likes = sc.likes + 1;
        }

        mergedMap.set(sc.id, {
          ...this.sanitizeComment(sc),
          likes,
          likedByUser
        });
      }

      const mergedList = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      this._comments.set(mergedList);
      this.saveLocalComments(mergedList);
    } catch {
      const localComments = this.loadLocalComments().map(c => ({
        ...this.sanitizeComment(c),
        likedByUser: this.likedIds.has(c.id)
      }));
      this._comments.set(localComments);
      this._error.set('Could not load comments. Loaded offline comments instead.');
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
    const escapedContent = this.escapeHtml(trimmedContent);
    const escapedAuthor = this.escapeHtml(trimmedAuthor);
    const authorHasProfanity = this.containsProfanity(escapedAuthor);
    const contentHasProfanity = this.containsProfanity(escapedContent);
    if (authorHasProfanity) {
      return { success: false, message: 'Name cannot contain profanity.' };
    }
    if (contentHasProfanity) {
      return { success: false, message: 'Comment cannot contain profanity.' };
    }
    const sanitizedAuthor  = escapedAuthor;
    const sanitizedContent = escapedContent;

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
      this._comments.update(list => {
        const updated = [withClient, ...list];
        this.saveLocalComments(updated);
        return updated;
      });
      this.lastPostTime = now;

      return { success: true, message: 'Comment posted!', comment: withClient, hasProfanity: false };
    } catch {
      // Offline fallback: simulate saving to backend locally
      const mockComment: Comment = {
        id: this.uid(),
        author: sanitizedAuthor,
        content: sanitizedContent,
        avatarColor,
        timestamp: new Date().toISOString(),
        likes: 0,
        likedByUser: false
      };
      this._comments.update(list => {
        const updated = [mockComment, ...list];
        this.saveLocalComments(updated);
        return updated;
      });
      this.lastPostTime = now;
      return { success: true, message: 'Comment posted offline!', comment: mockComment, hasProfanity: false };
    }
  }

  /** Toggle like (client-side tracking + server sync). */
  async toggleLike(id: string): Promise<void> {
    const alreadyLiked = this.likedIds.has(id);
    const action = alreadyLiked ? 'unlike' : 'like';

    // Optimistic update
    this._comments.update(list => {
      const updated = list.map(c => {
        if (c.id !== id) return c;
        let likes = c.likes;
        if (alreadyLiked) {
          this.likedIds.delete(id);
          likes = Math.max(0, c.likes - 1);
          return { ...c, likes, likedByUser: false };
        } else {
          this.likedIds.add(id);
          likes = c.likes + 1;
          return { ...c, likes, likedByUser: true };
        }
      });

      this.saveLocalComments(updated);
      const target = updated.find(c => c.id === id);
      if (target) {
        this.saveLocalLikesCount(id, target.likes);
      }
      return updated;
    });
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

  private normalizeText(text: string): string {
    let s = text.toLowerCase();
    s = s.replace(CommentService.ZERO_WIDTH, '');
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    s = s.replace(/đ/g, 'd');
    const charMap: Record<string, string> = {
      '@': 'a', '4': 'a',
      '1': 'i', '!': 'i', '|': 'i', 'j': 'i',
      '0': 'o',
      '3': 'e',
      '$': 's',
      '7': 't',
      '9': 'g',
      'w': 'u',
      'v': 'u',
    };
    s = s.split('').map(c => charMap[c] || c).join('');
    s = s.replace(CommentService.MIN_REPEAT, '$1$1');
    return s;
  }

  private containsProfanity(text: string): boolean {
    const normalized = this.normalizeText(text);
    return CommentService.FILTER_LIST.some((rule: RegExp) => {
      rule.lastIndex = 0;
      return rule.test(normalized);
    });
  }

  private filterProfanity(text: string): string {
    let r = text;
    for (const p of CommentService.FILTER_LIST) {
      p.lastIndex = 0;
      r = r.replace(p, m => '*'.repeat(m.length));
    }
    return r;
  }

  private sanitizeComment(comment: Omit<Comment, 'likedByUser'> | Comment): Comment {
    const content = this.containsProfanity(comment.content) ? this.filterProfanity(comment.content) : comment.content;
    const author = this.containsProfanity(comment.author) ? this.filterProfanity(comment.author) : comment.author;
    return {
      ...comment,
      author,
      content,
      likedByUser: 'likedByUser' in comment ? comment.likedByUser : false,
    };
  }

  private static escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

  private loadLocalComments(): Comment[] {
    try {
      const raw = localStorage.getItem('sion-feedback-comments');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch { /* corrupted */ }
    return [];
  }

  private saveLocalComments(comments: Comment[]): void {
    try {
      localStorage.setItem('sion-feedback-comments', JSON.stringify(comments));
    } catch { /* quota */ }
  }

  private loadLocalLikesMap(): Map<string, number> {
    const map = new Map<string, number>();
    try {
      const raw = localStorage.getItem('sion-feedback-likes-count');
      if (raw) {
        const obj = JSON.parse(raw);
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === 'number') {
            map.set(k, v);
          }
        }
      }
    } catch { /* corrupted */ }
    return map;
  }

  private saveLocalLikesCount(id: string, count: number): void {
    try {
      const raw = localStorage.getItem('sion-feedback-likes-count');
      const obj = raw ? JSON.parse(raw) : {};
      obj[id] = count;
      localStorage.setItem('sion-feedback-likes-count', JSON.stringify(obj));
    } catch { /* quota */ }
  }
}
