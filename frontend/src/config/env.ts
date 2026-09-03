/**
 * Typed access to Vite environment variables.
 *
 * Only `VITE_`-prefixed vars reach the browser bundle. Add new keys here and
 * to `frontend/.env.example` together so nobody has to guess what the app
 * expects.
 */

export const env = {
  /**
   * Base URL of the Express API. Left empty until the backend exists — while
   * empty, `lib/api/client.ts` refuses to fire requests instead of silently
   * hitting the Vite dev server and getting an HTML 404 back.
   */
  apiUrl: (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, ''),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

export const isApiConfigured = env.apiUrl.length > 0
