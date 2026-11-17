import pg from 'pg'
import { env } from '../config/env.ts'

/**
 * The connection pool, and the two helpers everything else uses to reach it.
 *
 * `query` is for a single statement. `transaction` is for anything that writes
 * more than one row and must not half-happen — deleting a partner takes their
 * vehicles and drivers with them, and a booking that gets a driver also marks
 * that driver busy. Those are one unit of work or they are a bug.
 */

/**
 * Postgres returns `numeric` as a string, because it is arbitrary precision
 * and would lose digits as a float. Money here is ETB with two decimals,
 * which is far inside what a double holds exactly, and the API contract in
 * `frontend/src/types/index.ts` says `amount: number`. So parse it, rather
 * than let `"3400.00"` reach the client where a number is expected.
 */
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => Number(value))
/** `int8` likewise: counts from COUNT() are well inside Number.MAX_SAFE_INTEGER. */
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => Number(value))

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseSsl ? { rejectUnauthorized: false } : undefined,
  max: env.isTest ? 4 : 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
})

pool.on('error', (error) => {
  // An idle client dropped by the database. The pool replaces it; this would
  // otherwise reach `process` as an unhandled error and take the server down.
  console.error('[db] idle client error:', error.message)
})

export type Queryable = Pick<pg.PoolClient, 'query'>

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: readonly unknown[] = [],
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params as unknown[])
}

/** The first row, or `null`. The shape most lookups actually want. */
export async function queryOne<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: readonly unknown[] = [],
): Promise<T | null> {
  const result = await pool.query<T>(text, params as unknown[])
  return result.rows[0] ?? null
}

/**
 * Runs `work` inside a transaction, committing on return and rolling back on
 * any throw. The client is always released, including when the rollback
 * itself fails — a leaked client is a pool that stops serving after ten of
 * them.
 */
export async function transaction<T>(work: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await work(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch (rollbackError) {
      console.error('[db] rollback failed:', (rollbackError as Error).message)
    }
    throw error
  } finally {
    client.release()
  }
}

export async function closePool(): Promise<void> {
  await pool.end()
}
