/**
 * ابزارهای فرمت‌دهی اعداد و تاریخ برای زبان فارسی.
 * همه خروجی‌ها با ارقام و تقویم فارسی (جلالی) تولید می‌شوند.
 */

const NUMBER_FORMATTER = new Intl.NumberFormat('fa-IR')

const DATE_FORMATTERS = {
  /** مثال: ۱۴ مهر */
  short: new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long' }),
  /** مثال: سه‌شنبه ۱۴ مهر */
  weekday: new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }),
  /** مثال: ۱۴ مهر ۱۴۰۴ */
  full: new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' }),
  /** مثال: ۱۴ مهر ۱۴۰۴، ساعت ۱۸:۳۰ */
  withTime: new Intl.DateTimeFormat('fa-IR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }),
} as const

export type DateFormat = keyof typeof DATE_FORMATTERS

/** تبدیل ارقام لاتین به ارقام فارسی */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'.charAt(Number(digit)))
}

/** فرمت مبلغ با جداکننده هزارگان فارسی؛ مثال: ۸۵۰٬۰۰۰ */
export function formatAmount(amount: number): string {
  return NUMBER_FORMATTER.format(amount)
}

/** فرمت مبلغ به همراه واحد تومان؛ مثال: ۸۵۰٬۰۰۰ تومان */
export function formatPrice(amount: number): string {
  return `${formatAmount(amount)} تومان`
}

/** فرمت تاریخ با تقویم جلالی */
export function formatDate(date: Date | string, format: DateFormat = 'full'): string {
  const value = typeof date === 'string' ? new Date(date) : date
  return DATE_FORMATTERS[format].format(value)
}

/** نمایش زمان نسبی؛ مثال: دیروز، ۳ روز پیش */
export function formatRelative(date: Date | string): string {
  const value = typeof date === 'string' ? new Date(date) : date
  const diffMs = value.getTime() - Date.now()
  const diffDays = Math.round(diffMs / 86_400_000)

  if (Math.abs(diffDays) <= 30) {
    const formatter = new Intl.RelativeTimeFormat('fa', { numeric: 'auto' })
    return formatter.format(diffDays, 'day')
  }

  return formatDate(value, 'full')
}

/** فرمت شماره موبایل برای نمایش؛ مثال: ۰۹۱۲ ۳۴۵ ۶۷۸۹ */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const parts = [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7)]
  return toPersianDigits(parts.filter(Boolean).join(' '))
}
