/**
 * Token Bucket Rate Limiter
 *
 * Implements the token bucket algorithm for controlling request rates.
 * Uses lazy refill (no background timer) for testability and zero overhead.
 */
export interface RateLimiterOptions {
  /** Maximum number of tokens (burst capacity) */
  maxTokens: number;
  /** Number of tokens to refill per interval */
  refillRate: number;
  /** Refill interval in milliseconds */
  refillInterval: number;
}

export class TokenBucketRateLimiter {
  private tokens: number;
  private readonly maxTokens: number;
  private readonly tokensPerMs: number;
  private lastRefillTime: number;

  constructor(options: RateLimiterOptions) {
    this.maxTokens = options.maxTokens;
    this.tokens = options.maxTokens;
    this.tokensPerMs = options.refillRate / options.refillInterval;
    this.lastRefillTime = Date.now();
  }

  /** Refill tokens based on elapsed time. */
  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefillTime;
    if (elapsed <= 0) return;

    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.tokensPerMs);
    this.lastRefillTime = now;
  }

  /**
   * Acquire a token, waiting if necessary.
   * Returns a promise that resolves when a token is available.
   */
  async acquire(): Promise<void> {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return;
    }

    // Calculate wait time until a token is available
    const deficit = 1 - this.tokens;
    const waitMs = Math.ceil(deficit / this.tokensPerMs);

    await new Promise<void>((resolve) => setTimeout(resolve, waitMs));

    // After waiting, refill and consume
    this.refill();
    this.tokens = Math.max(0, this.tokens - 1);
  }

  /**
   * Try to acquire a token without waiting.
   * Returns true if a token was available, false otherwise.
   */
  tryAcquire(): boolean {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }

    return false;
  }

  /** Get the number of currently available tokens. */
  getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }

  /** Reset the bucket to full capacity. */
  reset(): void {
    this.tokens = this.maxTokens;
    this.lastRefillTime = Date.now();
  }
}
