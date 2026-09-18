/** Loose checks: they catch typos, not every edge of the standards. */

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

/** At least seven digits, allowing spaces, dashes, brackets and a leading +. */
export const isPhone = (value: string) =>
  /^\+?[\d\s()-]+$/.test(value.trim()) && value.replace(/\D/g, '').length >= 7
