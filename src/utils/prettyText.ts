// A single helper keeps all formatting logic in one place.
// Using Intl.DateTimeFormat keeps bundle size small (no date-fns required),
// and respects the user’s locale automatically unless you override it.
export function formatDate(
  iso: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  locale = undefined,          // ← fallback to browser locale
) {
  if (!iso) return ''
  const date = typeof iso === 'string' ? new Date(iso) : iso
  return new Intl.DateTimeFormat(locale, options).format(date)
}
