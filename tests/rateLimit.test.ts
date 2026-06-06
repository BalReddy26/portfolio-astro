import { describe, expect, it } from 'vitest';
import { InMemoryRateLimiter } from '../src/lib/rateLimit';

describe('InMemoryRateLimiter', () => {
  it('first request allowed', () => {
    const rl = new InMemoryRateLimiter({ windowMs: 60_000, max: 5 });
    const res = rl.check('1.2.3.4', 0);
    expect(res).toEqual({ allowed: true });
  });

  it('requests below limit allowed', () => {
    const rl = new InMemoryRateLimiter({ windowMs: 60_000, max: 5 });
    const now = 0;
    for (let i = 0; i < 4; i++) {
      const res = rl.check('ip', now + i * 1000);
      expect(res).toEqual({ allowed: true });
    }
  });

  it('request exceeding limit blocked', () => {
    const rl = new InMemoryRateLimiter({ windowMs: 60_000, max: 5 });
    const now = 0;

    // max=5 => allowed count 5, (6th) should be blocked
    for (let i = 0; i < 5; i++) {
      const res = rl.check('ip', now + i);
      expect(res).toEqual({ allowed: true });
    }

    const blocked = rl.check('ip', now + 6);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it('window expiration behavior allows again', () => {
    const rl = new InMemoryRateLimiter({ windowMs: 10_000, max: 2 });
    const now = 1_000;

    expect(rl.check('ip', now)).toEqual({ allowed: true });
    expect(rl.check('ip', now + 1_000)).toEqual({ allowed: true });
    const blocked = rl.check('ip', now + 2_000);
    expect(blocked.allowed).toBe(false);

    // after window expiration
    const allowedAfter = rl.check('ip', now + 10_000 + 1);
    expect(allowedAfter).toEqual({ allowed: true });
  });

  it('multiple IP isolation', () => {
    const rl = new InMemoryRateLimiter({ windowMs: 60_000, max: 1 });
    const now = 0;

    expect(rl.check('ipA', now)).toEqual({ allowed: true });
    const blockedA = rl.check('ipA', now + 1);
    expect(blockedA.allowed).toBe(false);

    // ipB should not be affected
    expect(rl.check('ipB', now + 1)).toEqual({ allowed: true });
  });
});

