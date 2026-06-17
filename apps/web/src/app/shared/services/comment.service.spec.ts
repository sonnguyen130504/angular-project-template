import { TestBed } from '@angular/core/testing';
import { CommentService } from './comment.service';

describe('CommentService profanity handling', () => {
  let service: CommentService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('detects spaced and zero-width obfuscation', () => {
    const containsProfanity = (service as unknown as { containsProfanity(text: string): boolean }).containsProfanity.bind(service);

    expect(containsProfanity('f u c k')).toBeTrue();
    expect(containsProfanity('f\u200Bu\u200Bc\u200Bk')).toBeTrue();
  });

  it('detects Vietnamese profanity variants with punctuation and spacing', () => {
    const containsProfanity = (service as unknown as { containsProfanity(text: string): boolean }).containsProfanity.bind(service);

    expect(containsProfanity('đ m')).toBeTrue();
    expect(containsProfanity('du-me')).toBeTrue();
    expect(containsProfanity('o c h o')).toBeTrue();
  });

  it('masks profane content in the filtered output', () => {
    const filterProfanity = (service as unknown as { filterProfanity(text: string): string }).filterProfanity.bind(service);

    expect(filterProfanity('This is f u c k.')).toContain('****');
    expect(filterProfanity('đ m')).toContain('**');
  });

  it('rejects profane author names', async () => {
    const result = await service.addComment('f u c k name', 'This is fine');

    expect(result.success).toBeFalse();
    expect(result.message).toContain('Name cannot contain profanity');
  });

  it('rejects profane comments, including punctuation-obfuscated variants', async () => {
    const result1 = await service.addComment('Friendly Name', 'f.u.c.k this');
    const result2 = await service.addComment('Friendly Name', 'f_u_c_k this');

    expect(result1.success).toBeFalse();
    expect(result1.message).toContain('Comment cannot contain profanity');
    expect(result2.success).toBeFalse();
    expect(result2.message).toContain('Comment cannot contain profanity');
  });

  it('rejects Vietnamese content variants with punctuation and spacing', async () => {
    const result = await service.addComment('Friendly Name', 'd-u m-e');

    expect(result.success).toBeFalse();
    expect(result.message).toContain('Comment cannot contain profanity');
  });
});
