import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, ApiError, buildUrl, API_PREFIX } from '@/lib/api/client';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('buildUrl', () => {
  it('builds URL with path only', () => {
    const url = buildUrl('/indicators');
    expect(url).toBe(`${API_PREFIX}/indicators`);
  });

  it('appends query params', () => {
    const url = buildUrl('/indicators', { page: 1, category: 'health' });
    expect(url).toContain('page=1');
    expect(url).toContain('category=health');
  });

  it('skips undefined params', () => {
    const url = buildUrl('/indicators', { page: 1, category: undefined });
    expect(url).toContain('page=1');
    expect(url).not.toContain('category');
  });

  it('skips empty string params', () => {
    const url = buildUrl('/indicators', { page: 1, category: '' });
    expect(url).not.toContain('category');
  });
});

describe('ApiError', () => {
  it('has status and message', () => {
    const error = new ApiError(404, 'Not found');
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.name).toBe('ApiError');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('api', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('api.post sends POST with JSON body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1' }),
    });

    const result = await api.post('/proposals', { title: 'Test' });

    expect(result).toEqual({ id: '1' });
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/proposals');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ title: 'Test' });
  });

  it('throws ApiError on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ message: 'Resource not found' }),
    });

    await expect(api.post('/bad-path')).rejects.toThrow(ApiError);
    await expect(
      api.post('/bad-path').catch((e) => {
        expect(e.status).toBe(404);
        throw e;
      }),
    ).rejects.toThrow();
  });

  it('api.patch sends PATCH method', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ updated: true }),
    });

    await api.patch('/proposals/1', { status: 'APPROVED' });

    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe('PATCH');
  });

  it('api.del sends DELETE method', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ deleted: true }),
    });

    await api.del('/proposals/1');

    const [, options] = mockFetch.mock.calls[0];
    expect(options.method).toBe('DELETE');
  });
});
