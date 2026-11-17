import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { env } from './config/env.ts'
import { pool } from './db/pool.ts'
import { loadSession } from './middleware/auth.ts'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.ts'
import { adminRoutes } from './modules/admin/routes.ts'
import { authRoutes } from './modules/auth/routes.ts'
import { bookingRoutes } from './modules/bookings/routes.ts'
import { contentRoutes } from './modules/content/routes.ts'
import { customerRoutes } from './modules/customers/routes.ts'
import { driverRoutes } from './modules/drivers/routes.ts'
import { partnerRoutes } from './modules/partners/routes.ts'
import { quoteRoutes } from './modules/quotes/routes.ts'
import { serviceRoutes } from './modules/services/routes.ts'
import { vehicleRoutes } from './modules/vehicles/routes.ts'

/**
 * The Express app, assembled.
 *
 * Mount paths match `frontend/src/lib/api/endpoints.ts` exactly, under the
 * `/api` prefix that `VITE_API_URL` carries. That file is the contract: a
 * route that does not line up with it is a route the frontend cannot reach.
 */

export function createApp(): express.Express {
  const app = express()

  // Vercel, Fly and every other proxy put the real client address in
  // X-Forwarded-For. Without this, req.ip is the proxy and the rate limiter
  // treats every visitor as the same person.
  app.set('trust proxy', 1)
  app.disable('x-powered-by')

  app.use(
    cors({
      origin(origin, callback) {
        // No origin: curl, a health check, or a same-origin request.
        if (!origin) return callback(null, true)
        const allowed = env.corsOrigins.includes(origin.replace(/\/+$/, ''))
        callback(allowed ? null : new Error(`Origin ${origin} is not allowed.`), allowed)
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  )

  // An image arrives as a base64 data URL, which inflates by a third; 6 MB of
  // body allows the 4 MB image the content route accepts.
  app.use(express.json({ limit: '6mb' }))
  app.use(cookieParser())
  app.use(loadSession)

  app.use(securityHeaders)

  app.get('/api/health', async (_req, res) => {
    try {
      await pool.query('SELECT 1')
      res.json({ ok: true, service: 'addislimo-api', time: new Date().toISOString() })
    } catch {
      res.status(503).json({ ok: false, message: 'Database unreachable.' })
    }
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/bookings', bookingRoutes)
  app.use('/api/quotes', quoteRoutes)
  app.use('/api/services', serviceRoutes)
  app.use('/api/partners', partnerRoutes)
  app.use('/api/drivers', driverRoutes)
  app.use('/api/vehicles', vehicleRoutes)
  app.use('/api/customers', customerRoutes)
  app.use('/api/content', contentRoutes)
  app.use('/api/admin', adminRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

/**
 * This server answers with JSON and never with a page, so the headers that
 * matter are the ones that stop a response being treated as something else.
 */
const securityHeaders: express.RequestHandler = (_req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff')
  res.set('Referrer-Policy', 'no-referrer')
  res.set('X-Frame-Options', 'DENY')
  res.set('Cross-Origin-Resource-Policy', 'same-site')
  next()
}
