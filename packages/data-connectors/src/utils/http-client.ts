import { TokenBucketRateLimiter, type RateLimiterOptions } from './rate-limiter.js';
import { withRetry, isRetryableError, type RetryOptions } from './retry.js';

export interface HttpClientOptions {
  /** Base URL for all requests */
  baseUrl: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Rate limiter configuration */
  rateLimiter?: RateLimiterOptions;
  /** Retry configuration */
  retry?: RetryOptions;
  /** Default headers for all requests */
  headers?: Record<string, string>;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly rateLimiter: TokenBucketRateLimiter | null;
  private readonly retryOptions: RetryOptions;
  private readonly defaultHeaders: Record<string, string>;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.timeout = options.timeout ?? 30_000;
    this.rateLimiter = options.rateLimiter
      ? new TokenBucketRateLimiter(options.rateLimiter)
      : null;
    this.retryOptions = options.retry ?? { maxRetries: 3, baseDelay: 1000 };
    this.defaultHeaders = {
      Accept: 'application/json',
      ...options.headers,
    };
  }

  /**
   * Execute a GET request with rate limiting and retry.
   */
  async get<T = unknown>(
    path: string,
    params?: Record<string, string>,
  ): Promise<HttpResponse<T>> {
    const url = this.buildUrl(path, params);
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * Execute a POST request with rate limiting and retry.
   */
  async post<T = unknown>(path: string, body?: unknown): Promise<HttpResponse<T>> {
    const url = this.buildUrl(path);
    return this.request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(path.startsWith('http') ? path : `${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }
    return url.toString();
  }

  private async request<T>(url: string, init: RequestInit): Promise<HttpResponse<T>> {
    return withRetry(
      async () => {
        // Rate limit
        if (this.rateLimiter) {
          await this.rateLimiter.acquire();
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
          const response = await fetch(url, {
            ...init,
            headers: { ...this.defaultHeaders, ...init.headers },
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
          }

          const data = (await response.json()) as T;
          return { data, status: response.status, headers: response.headers };
        } finally {
          clearTimeout(timeoutId);
        }
      },
      {
        ...this.retryOptions,
        onRetry: (error, attempt, delay) => {
          if (isRetryableError(error)) {
            console.warn(`[HttpClient] Retry ${attempt}/${this.retryOptions.maxRetries} for ${url} (delay: ${delay}ms): ${error.message}`);
          }
        },
      },
    );
  }
}
