/**
 * CSV export for admin tables.
 *
 * Built in the browser from what is on screen, so staff can take the current
 * filtered view into a spreadsheet today. When the backend exists this can
 * move server-side for exports larger than a page of results.
 */

export interface CsvColumn<T> {
  header: string
  value: (row: T) => string | number
}

function escapeCell(value: string | number): string {
  const text = String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(',')
  const body = rows.map((row) => columns.map((c) => escapeCell(c.value(row))).join(','))
  return [header, ...body].join('\r\n')
}

export function downloadCsv(filename: string, csv: string) {
  // The byte-order mark makes Excel read the file as UTF-8, so names like
  // "Be'ata" and the ETB amounts survive the round trip.
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/** `bookings` -> `addis-limo-bookings-2026-09-14.csv` */
export function datedFilename(name: string): string {
  const d = new Date()
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return `addis-limo-${name}-${stamp}.csv`
}
