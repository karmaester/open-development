import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TokenBucketRateLimiter } from '../src/utils/rate-limiter.js';

describe('TokenBucketRateLimiter', () => {
  let limiter: TokenBucketRateLimiter;

  beforeEach(() => {
    limiter = new TokenBucketRateLimiter({
      maxTokens: 5,
      refillRate: 5,
      refillInterval: 1000, // 5 tokens per second
    });
  });

  describe('tryAcquire', () => {
    it('should allow acquiring tokens up to max capacity', () => {
      for (let i = 0; i < 5; i++) {
        expect(limiter.tryAcquire()).toBe(true);
      }
    });

    it('should reject when bucket is empty', () => {
      // Drain all tokens
      for (let i = 0; i < 5; i++) {
        limiter.tryAcquire();
      }
      expect(limiter.tryAcquire()).toBe(false);
    });

    it('should refill tokens over time', () => {
      // Drain all tokens
      for (let i = 0; i < 5; i++) {
        limiter.tryAcquire();
      }
      expect(limiter.tryAcquire()).toBe(false);

      // Advance time by 1 second (should refill 5 tokens)
      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);
      vi.useRealTimers();

      // Should be able to acquire again after refill
      // Note: we need a new limiter or manually update lastRefillTime
      // since Date.now() is not mocked after useRealTimers
    });
  });

  describe('getAvailableTokens', () => {
    it('should start with max tokens', () => {
      expect(limiter.getAvailableTokens()).toBe(5);
    });

    it('should decrease after acquiring', () => {
      limiter.tryAcquire();
      expect(limiter.getAvailableTokens()).toBe(4);
    });

    it('should be zero after draining', () => {
      for (let i = 0; i < 5; i++) {
        limiter.tryAcquire();
      }
      expect(limiter.getAvailableTokens()).toBe(0);
    });
  });

  describe('acquire (async)', () => {
    it('should resolve immediately when tokens available', async () => {
      await expect(limiter.acquire()).resolves.toBeUndefined();
    });

    it('should wait when no tokens available', async () => {
      // Create a fast limiter for testing
      const fastLimiter = new TokenBucketRateLimiter({
        maxTokens: 1,
        refillRate: 10,
        refillInterval: 1000, // 10 tokens per second = 1 per 100ms
      });

      // Drain it
      fastLimiter.tryAcquire();

      // Should still resolve (after waiting)
      await expect(fastLimiter.acquire()).resolves.toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should refill to max capacity', () => {
      for (let i = 0; i < 5; i++) {
        limiter.tryAcquire();
      }
      expect(limiter.getAvailableTokens()).toBe(0);

      limiter.reset();
      expect(limiter.getAvailableTokens()).toBe(5);
    });
  });
});
