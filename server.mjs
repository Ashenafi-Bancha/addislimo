/**
 * Production server for the built frontend.
 *
 * Serves `dist/` (produced by `pnpm build`) on the port the host provides.
 * Container platforms such as AletCloud App Hosting run a process and route
 * traffic to it, so a folder of static files needs something to serve it.
 *
 * Deliberately dependency-free — only Node built-ins — so it runs even when
 * the platform prunes devDependencies after the build, and there is nothing
 * to install or keep patched.
 *
 * Contract the host expects: bind 0.0.0.0 and listen on $PORT.
 */

import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createGzip } from 'node:zlib'

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const PORT = Number(process.env.PORT) || 8080
const HOST = process.env.HOST || '0.0.0.0'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
}

/** Text is worth compressing; images and fonts already are. */
const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.txt', '.xml', '.svg', '.webmanifest'])

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

/**
 * Vite fingerprints everything in /assets/ (`index-C3r4GK02.js`), so those
 * files never change under the same name and can be cached for a year.
 * index.html must always be revalidated, or visitors keep an old build.
 */
function cacheControl(urlPath) {
  if (urlPath.startsWith('/assets/')) return 'public, max-age=31536000, immutable'
  if (urlPath === '/' || urlPath.endsWith('.html')) return 'no-cache'
  return 'public, max-age=3600'
}

/** Resolve a URL path inside ROOT, refusing anything that escapes it. */
function toFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const candidate = normalize(join(ROOT, decoded))
  return candidate === ROOT || candidate.startsWith(ROOT + sep) ? candidate : null
}

async function findFile(urlPath) {
  const path = toFilePath(urlPath)
  if (!path) return null
  try {
    const info = await stat(path)
    if (info.isFile()) return { path, info }
    if (info.isDirectory()) {
      const index = join(path, 'index.html')
      const indexInfo = await stat(index)
      if (indexInfo.isFile()) return { path: index, info: indexInfo }
    }
  } catch {
    // Not found: fall through.
  }
  return null
}

function send(req, res, status, file, urlPath) {
  const ext = extname(file.path).toLowerCase()
  const gzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')

  res.writeHead(status, {
    ...SECURITY_HEADERS,
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': cacheControl(urlPath),
    'Last-Modified': file.info.mtime.toUTCString(),
    Vary: 'Accept-Encoding',
    ...(gzip ? { 'Content-Encoding': 'gzip' } : { 'Content-Length': file.info.size }),
  })

  if (req.method === 'HEAD') return res.end()

  const stream = createReadStream(file.path)
  stream.on('error', () => res.destroy())
  if (gzip) stream.pipe(createGzip()).pipe(res)
  else stream.pipe(res)
}

const server = createServer(async (req, res) => {
  const urlPath = (req.url || '/').split('?')[0]

  // Liveness check for the host's health probe.
  if (urlPath === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
    return res.end('ok')
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' })
    return res.end()
  }

  try {
    const file = await findFile(urlPath)
    if (file) return send(req, res, 200, file, urlPath)

    // A missing asset is a genuine 404; answering it with HTML would make the
    // browser report a confusing MIME error instead.
    if (urlPath.startsWith('/assets/') || extname(urlPath)) {
      res.writeHead(404, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' })
      return res.end('Not found')
    }

    // Anything else is a page: hand it to the app. The site routes with
    // `#/…` hashes today, but this keeps pasted or future path URLs working.
    const index = await findFile('/index.html')
    if (index) return send(req, res, 200, index, '/index.html')

    res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('The site has not been built. Run `pnpm build` first.')
  } catch (error) {
    console.error(error)
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Server error')
  }
})

server.listen(PORT, HOST, () => {
  console.log(`Addis Limo serving ${ROOT} on http://${HOST}:${PORT}`)
})

// Platforms stop containers with SIGTERM on every redeploy: finish in-flight
// requests instead of cutting them off.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close(() => process.exit(0))
    setTimeout(() => process.exit(0), 5000).unref()
  })
}
