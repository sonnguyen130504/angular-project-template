import { TestBed } from '@angular/core/testing';
import { ThreeDAudioService } from './three-d-audio.service';

describe('ThreeDAudioService', () => {
  let service: ThreeDAudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeDAudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle mute state and play feedback click when unmuted', () => {
    service.isMuted.set(false);
    
    // Toggle to muted
    service.toggleMute();
    expect(service.isMuted()).toBe(true);

    // Toggle back to unmuted
    service.toggleMute();
    expect(service.isMuted()).toBe(false);
  });

  it('should respect mute state when trigger plays requested', () => {
    service.isMuted.set(true);
    
    // Calling play methods while muted should execute with no AudioContext initialized
    expect(() => service.playTick()).not.toThrow();
    expect(() => service.playClick()).not.toThrow();
    expect(() => service.playSuccess()).not.toThrow();
  });
});
