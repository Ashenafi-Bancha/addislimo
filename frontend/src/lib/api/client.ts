import { env, isApiConfigured } from '@/config/env'

/**
 * Thin `fetch` wrapper for the Addis Limo API.
 *
 * The backend does not exist yet. Rather than leave a gap that every feature
 * fills differently later, this file fixes the calling convention now:
 * one place that owns the base URL, JSON encoding, credentials and error
 * shape. Until `VITE_API_URL` is set, every call throws `ApiNotConfiguredError`
 * so a half-wired screen fails loudly in development instead of rendering
 * an empty state that looks intentional.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiNotConfiguredError extends Error {
  constructor() {
    super('VITE_API_URL is not set. The Addis Limo API is not wired up yet.')
    this.name = 'ApiNotConfiguredError'
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Serialised as JSON with the right content-type. */
  body?: unknown
  /** Appended as a query string, skipping `undefined` values. */
  query?: Record<string, string | number | boolean | undefined>
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!isApiConfigured) throw new ApiNotConfiguredError()

  const { body, query, headers, ...init } = options
  const url = new URL(`${env.apiUrl}${path.startsWith('/') ? path : `/${path}`}`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json().catch(() => null) : await response.text()

  if (!response.ok) {
    const message =
      (isJson && payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : null) ?? `Request failed with ${response.status}`
    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
