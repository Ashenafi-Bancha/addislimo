import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { closePool, pool } from './pool.ts'

/**
 * Forward-only migration runner.
 *
 * Files in `migrations/` run once each, in filename order, inside a
 * transaction. Their checksum is recorded, so editing a migration that has
 * already run is caught here rather than discovered as a schema that differs
 * between two machines.
 *
 *   pnpm migrate          apply anything outstanding
 *   pnpm migrate --reset  drop the schema first (development only)
 */

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), 'migrations')

/** `ON DELETE SET NULL (column)` on a composite key needs PostgreSQL 15. */
const MINIMUM_PG_MAJOR = 15

async function assertVersion(): Promise<void> {
  // `server_version_num` is an integer like 180002, which beats parsing a
  // display string that carries a distribution suffix on some builds.
  const { rows } = await pool.query<{ num: string; version: string }>(
    `SELECT current_setting('server_version_num') AS num,
            current_setting('server_version')     AS version`,
  )
  const num = Number(rows[0]?.num ?? 0)
  if (!Number.isFinite(num) || num === 0) {
    throw new Error('Could not read the PostgreSQL version from the server.')
  }
  const major = Math.floor(num / 10_000)
  if (major < MINIMUM_PG_MAJOR) {
    throw new Error(
      `PostgreSQL ${MINIMUM_PG_MAJOR} or newer is required; this server reports ${rows[0]?.version}.`,
    )
  }
}

async function ensureRegistry(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename   text PRIMARY KEY,
      checksum   text        NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `)
}

async function reset(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('--reset refuses to run with NODE_ENV=production.')
  }
  console.log('[migrate] dropping and recreating schema public')
  await pool.query('DROP SCHEMA public CASCADE')
  await pool.query('CREATE SCHEMA public')
}

export async function migrate({ silent = false } = {}): Promise<number> {
  const log = (message: string) => {
    if (!silent) console.log(message)
  }

  await assertVersion()
  if (process.argv.includes('--reset')) await reset()
  await ensureRegistry()

  const applied = new Map<string, string>()
  const { rows } = await pool.query<{ filename: string; checksum: string }>(
    'SELECT filename, checksum FROM schema_migrations',
  )
  for (const row of rows) applied.set(row.filename, row.checksum)

  const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith('.sql')).sort()
  let count = 0

  for (const filename of files) {
    const sql = await readFile(join(MIGRATIONS_DIR, filename), 'utf8')
    const checksum = createHash('sha256').update(sql).digest('hex').slice(0, 16)
    const previous = applied.get(filename)

    if (previous) {
      if (previous !== checksum) {
        throw new Error(
          `${filename} has changed since it was applied. Migrations are forward-only: ` +
            'add a new file instead of editing this one.',
        )
      }
      continue
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)', [
        filename,
        checksum,
      ])
      await client.query('COMMIT')
      log(`[migrate] applied ${filename}`)
      count += 1
    } catch (error) {
      await client.query('ROLLBACK').catch(() => {})
      throw new Error(`${filename} failed: ${(error as Error).message}`)
    } finally {
      client.release()
    }
  }

  log(count === 0 ? '[migrate] already up to date' : `[migrate] ${count} migration(s) applied`)
  return count
}

// Only when run directly, so tests can import `migrate` without it firing.
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('migrate.ts')) {
  migrate()
    .then(closePool)
    .catch(async (error: Error) => {
      console.error(`[migrate] ${error.message}`)
      await closePool().catch(() => {})
      process.exit(1)
    })
}
