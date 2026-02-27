/**
 * Exponential backoff retry utility with jitter.
 *
 * Implements a retry strategy that increases delay exponentially
 * between attempts, with optional random jitter to prevent
 * thundering herd problems.
 */

export interface RetryOptions {
  /** Maximum number of retry attempts (not counting the initial attempt) */
  maxRetries: number;
  /** Base delay in milliseconds */
  baseDelay: number;
  /** Maximum delay in milliseconds (caps exponential growth) */
  maxDelay?: number;
  /** Whether to apply random jitter to delays (default: true) */
  jitter?: boolean;
  /** Optional callback for logging retry attempts */
  onRetry?: (error: Error, attempt: number, delay: number) => void;
}

/**
 * Execute a function with exponential backoff retry.
 *
 * @param fn - Async function to execute
 * @param options - Retry configuration
 * @returns The result of the function
 * @throws The last error if all retries are exhausted
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const { maxRetries, baseDelay, maxDelay = 30_000, jitter = true, onRetry } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt >= maxRetries) break;

      // Calculate delay: baseDelay * 2^attempt, capped at maxDelay
      let delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

      // Apply jitter: 50-100% of computed delay
      if (jitter) {
        delay = delay * (0.5 + Math.random() * 0.5);
      }

      delay = Math.ceil(delay);

      if (onRetry) {
        onRetry(lastError, attempt + 1, delay);
      }

      await new Promise<void>((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Determine if an error is retryable (e.g., network errors, 5xx status codes).
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network errors
    if (
      message.includes('econnrefused') ||
      message.includes('econnreset') ||
      message.includes('etimedout') ||
      message.includes('fetch failed') ||
      message.includes('network')
    ) {
      return true;
    }

    // HTTP 5xx errors (if encoded in message)
    if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
      return true;
    }

    // Rate limiting
    if (message.includes('429') || message.includes('rate limit')) {
      return true;
    }
  }

  return false;
}
