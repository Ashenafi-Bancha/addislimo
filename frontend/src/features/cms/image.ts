/**
 * Turns an uploaded photo into a data URL small enough to keep.
 *
 * Until the backend has an upload endpoint, an image lives inside the saved
 * content itself, and browsers give a site roughly 5 MB of storage. A phone
 * photo is often larger than that on its own, so it is scaled to fit
 * `maxEdge` and re-encoded as JPEG (PNG for logos, which need transparency).
 */

export interface PreparedImage {
  dataUrl: string
  bytes: number
  originalBytes: number
}

export async function prepareImage(file: File, maxEdge = 1600): Promise<PreparedImage> {
  if (!file.type.startsWith('image/')) throw new Error('That file is not an image.')
  if (file.size > 25 * 1024 * 1024) throw new Error('That image is over 25 MB. Please choose a smaller one.')

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('That image could not be read.'))
      el.src = objectUrl
    })

    const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale))
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('This browser cannot process images.')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const keepAlpha = file.type === 'image/png' || file.type === 'image/svg+xml' || file.type === 'image/webp'
    const dataUrl = keepAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.82)
    // Base64 carries four characters for every three bytes.
    const bytes = Math.round(((dataUrl.length - dataUrl.indexOf(',') - 1) * 3) / 4)
    return { dataUrl, bytes, originalBytes: file.size }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}
