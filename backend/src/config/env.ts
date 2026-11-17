/**
 * Environment, parsed once and checked at boot.
 *
 * Every value a running server depends on is read here, so a missing or
 * nonsensical setting stops the process on the first line rather than
 * surfacing as a confusing 500 on the first request that happens to need it.
 * There are deliberately no fallbacks for the database URL or the session
 * secret: a default secret is how a development key reaches production.
 */

function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(
      `${name} is not set. Copy backend/.env.example to backend/.env and fill it in.`,
    )
  }
  return value
}

function optional(name: string, fallback: string): string {
  const value = process.env[name]?.trim()
  return value ? value : fallback
}

function integer(name: string, fallback: number): number {
  const raw = process.env[name]?.trim()
  if (!raw) return fallback
  const value = Number(raw)
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive whole number, got ${JSON.stringify(raw)}.`)
  }
  return value
}

const nodeEnv = optional('NODE_ENV', 'development')
const sessionSecret = required('SESSION_SECRET')

if (sessionSecret.length < 32) {
  throw new Error('SESSION_SECRET must be at least 32 characters. See backend/.env.example.')
}

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  port: integer('PORT', 4000),

  databaseUrl: required('DATABASE_URL'),
  /** `require` turns on TLS for a managed database. */
  databaseSsl: optional('DATABASE_SSL', 'disable') === 'require',

  sessionSecret,
  sessionHours: integer('SESSION_HOURS', 12),

  /**
   * Origins allowed to call the API with credentials. A credentialed request
   * cannot use `*`, so this is an explicit list and an unlisted origin is
   * refused rather than quietly allowed.
   */
  corsOrigins: optional('CORS_ORIGINS', 'http://localhost:8443')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean),

  seedAdmin: {
    email: optional('SEED_ADMIN_EMAIL', 'admin@addislimo.com').toLowerCase(),
    password: process.env.SEED_ADMIN_PASSWORD?.trim() ?? '',
    name: optional('SEED_ADMIN_NAME', 'Operations Admin'),
  },
} as const
