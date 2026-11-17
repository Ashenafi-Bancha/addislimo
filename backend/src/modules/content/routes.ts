import { Router } from 'express'
import { z } from 'zod'
import { query, queryOne } from '../../db/pool.ts'
import { badRequest, notFound } from '../../lib/errors.ts'
import { param, parseBody, route } from '../../lib/http.ts'
import { newId } from '../../lib/ids.ts'
import { requireWriter } from '../../middleware/auth.ts'

/**
 * The editable copy behind the public site.
 *
 * One row per group in `frontend/src/features/cms/content.ts`. Reading is
 * public, because every visitor needs it to render the page; writing is the
 * admin's Website Content editor.
 *
 * The value is stored as jsonb exactly as the editor sends it. The server
 * deliberately does not know the shape of `home_hero` or `business`: the
 * frontend owns that schema (`features/cms/schema.ts`) and merges whatever
 * arrives over its own defaults, so adding a field there needs no change
 * here. What the server does enforce is that the key is one it recognises and
 * that the value is a JSON object of a sane size.
 */

export const contentRoutes = Router()

/** Groups the editor is allowed to write, mirroring `ContentKey`. */
const CONTENT_KEYS = [
  'business',
  'home_hero',
  'home_services',
  'home_stats',
  'airport',
  'corporate',
  'explore',
  'about',
  'fleet',
  'destinations',
  'partners',
  'services',
] as const

const MAX_GROUP_BYTES = 512 * 1024
const MAX_IMAGE_BYTES = 4 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'])

interface ContentRow {
  key: string
  value: unknown
  updated_at: Date
  updated_by: string
}

/** Everything the public site needs, in one request. */
contentRoutes.get(
  '/',
  route(async (_req, res) => {
    const result = await query<ContentRow>(
      'SELECT key, value, updated_at, updated_by FROM site_content',
    )
    const content: Record<string, unknown> = {}
    let latest: Date | null = null
    for (const row of result.rows) {
      content[row.key] = row.value
      if (!latest || row.updated_at > latest) latest = row.updated_at
    }
    // Content changes rarely and is read on every page load.
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=600')
    res.json({ content, updatedAt: latest ? latest.toISOString() : null })
  }),
)

contentRoutes.get(
  '/:key',
  route(async (req, res) => {
    const row = await queryOne<ContentRow>(
      'SELECT key, value, updated_at, updated_by FROM site_content WHERE key = $1',
      [param(req, 'key')],
    )
    if (!row) throw notFound('That content group')
    res.json({ key: row.key, value: row.value, updatedAt: row.updated_at.toISOString() })
  }),
)

contentRoutes.put(
  '/:key',
  requireWriter,
  route(async (req, res) => {
    const key = param(req, 'key')
    if (!(CONTENT_KEYS as readonly string[]).includes(key)) {
      throw badRequest(`"${key}" is not a content group this site has.`, {
        key: `Expected one of: ${CONTENT_KEYS.join(', ')}.`,
      })
    }

    const { value } = parseBody(
      z.object({
        value: z
          .record(z.unknown())
          .refine(
            (v) => Buffer.byteLength(JSON.stringify(v), 'utf8') <= MAX_GROUP_BYTES,
            `That content group is too large. Keep it under ${MAX_GROUP_BYTES / 1024} KB; upload images separately.`,
          ),
      }),
      req.body,
    )

    const row = await queryOne<ContentRow>(
      `INSERT INTO site_content (key, value, updated_by)
       VALUES ($1, $2::jsonb, $3)
       ON CONFLICT (key) DO UPDATE
         SET value = EXCLUDED.value, updated_at = now(), updated_by = EXCLUDED.updated_by
       RETURNING key, value, updated_at, updated_by`,
      [key, JSON.stringify(value), req.admin!.email],
    )

    res.json({ key: row!.key, value: row!.value, updatedAt: row!.updated_at.toISOString() })
  }),
)

/** Reverts a group to the frontend's compiled-in defaults by removing the row. */
contentRoutes.delete(
  '/:key',
  requireWriter,
  route(async (req, res) => {
    const result = await query('DELETE FROM site_content WHERE key = $1', [param(req, 'key')])
    if (result.rowCount === 0) throw notFound('That content group')
    res.status(204).end()
  }),
)

/* ── Images ── */

/**
 * The editor sends a data URL, which is what it already holds in the browser.
 * Storing the bytes and handing back a URL is what stops a 2 MB photograph
 * being inlined into the content JSON and shipped to every visitor inside the
 * page.
 */
contentRoutes.post(
  '/images',
  requireWriter,
  route(async (req, res) => {
    const { data, alt } = parseBody(
      z.object({
        data: z.string().min(1, 'Choose an image.'),
        alt: z.string().trim().max(300).default(''),
      }),
      req.body,
    )

    const match = /^data:([a-z0-9.+/-]+);base64,(.+)$/i.exec(data.trim())
    if (!match) {
      throw badRequest('That image could not be read.', {
        data: 'Expected a base64 data URL.',
      })
    }

    const mime = match[1]!.toLowerCase()
    if (!ALLOWED_IMAGE_TYPES.has(mime)) {
      throw badRequest(`${mime} images are not accepted.`, {
        data: `Use one of: ${[...ALLOWED_IMAGE_TYPES].join(', ')}.`,
      })
    }

    const bytes = Buffer.from(match[2]!, 'base64')
    if (bytes.byteLength === 0) throw badRequest('That image is empty.')
    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      throw badRequest(`That image is ${(bytes.byteLength / 1024 / 1024).toFixed(1)} MB. Keep it under ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`)
    }

    const id = newId('img')
    await query(
      'INSERT INTO content_images (id, mime, bytes, data, alt, created_by) VALUES ($1,$2,$3,$4,$5,$6)',
      [id, mime, bytes.byteLength, bytes, alt, req.admin!.email],
    )

    res.status(201).json({ url: `/api/content/images/${id}`, id, bytes: bytes.byteLength })
  }),
)

contentRoutes.get(
  '/images/:id',
  route(async (req, res) => {
    const row = await queryOne<{ mime: string; data: Buffer }>(
      'SELECT mime, data FROM content_images WHERE id = $1',
      [param(req, 'id')],
    )
    if (!row) throw notFound('That image')
    // Content-addressed by id and never rewritten, so it can be cached hard.
    res.set('Content-Type', row.mime)
    res.set('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(row.data)
  }),
)
