import { createApp } from './app.ts'
import { env } from './config/env.ts'
import { closePool, pool } from './db/pool.ts'

/**
 * The listener.
 *
 * It refuses to start without a reachable database: a server that accepts
 * connections and then fails every request is harder to diagnose than one
 * that never comes up. On the way down it stops taking new connections,
 * lets the ones in flight finish, and then closes the pool — a deploy should
 * not end a dispatcher's save halfway through.
 */

const app = createApp()

try {
  await pool.query('SELECT 1')
} catch (error) {
  console.error(`[server] cannot reach the database: ${(error as Error).message}`)
  console.error('[server] check DATABASE_URL in backend/.env')
  process.exit(1)
}

const server = app.listen(env.port, () => {
  console.log(`[server] Addis Limo API on http://localhost:${env.port}/api (${env.nodeEnv})`)
})

let shuttingDown = false

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`[server] ${signal} received, finishing in-flight requests`)

  const forced = setTimeout(() => {
    console.error('[server] still busy after 10s, exiting anyway')
    process.exit(1)
  }, 10_000)
  forced.unref()

  server.close(async () => {
    await closePool().catch(() => {})
    console.log('[server] closed')
    process.exit(0)
  })
}

process.on('SIGTERM', () => void shutdown('SIGTERM'))
process.on('SIGINT', () => void shutdown('SIGINT'))

process.on('unhandledRejection', (reason) => {
  console.error('[server] unhandled rejection:', reason)
})
