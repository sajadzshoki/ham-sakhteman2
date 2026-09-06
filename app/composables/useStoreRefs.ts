import type { Ref } from 'vue'
import type { Announcement, AuthUser, Building, BuildingMember, BuildingUnit, Invitation, ProblemReport } from '~/types'

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30,
  sameSite: 'lax',
} as const

// ——— کدگذاری پایه۶۴ برای کوکی‌های پرمحتوا ———
// متن فارسی در کدگذاری پیش‌فرض (درصدی) حدود ۳ برابر بزرگ می‌شود و کوکی را از
// حد ~۴ کیلوبایت عبور می‌دهد؛ پایه۶۴ فقط ~۱.۳۳ برابر است، پس ظرفیت تقریباً دو برابر می‌شود.

function base64Encode(input: string): string {
  if (import.meta.server) return Buffer.from(input, 'utf-8').toString('base64')
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function base64Decode(input: string): string {
  if (import.meta.server) return Buffer.from(input, 'base64').toString('utf-8')
  try {
    const binary = atob(input)
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }
  catch {
    return ''
  }
}

/**
 * کوکی JSON با کدگذاری پایه۶۴ برای مجموعه‌های پرمحتوا (اطلاعیه‌ها و گزارش‌ها).
 * خروجی یک رفرنس قابل‌نوشتن از نوع داده واقعی است و جزئیات کدگذاری پنهان می‌ماند.
 */
function useBase64JsonCookie<T>(name: string, defaultValue: T): Ref<T> {
  const raw = useCookie<string>(name, {
    ...COOKIE_OPTIONS,
    default: () => JSON.stringify(defaultValue),
    encode: value => base64Encode(value ?? ''),
    decode: value => (value ? base64Decode(value) : ''),
  })

  return computed<T>({
    get() {
      if (!raw.value) return defaultValue
      try {
        return JSON.parse(raw.value) as T
      }
      catch {
        return defaultValue
      }
    },
    set(value) {
      raw.value = JSON.stringify(value)
    },
  })
}

export interface StoreRefs {
  user: Ref<AuthUser | null>
  users: Ref<AuthUser[]>
  pendingJoin: Ref<string | null>
  buildings: Ref<Building[]>
  units: Ref<BuildingUnit[]>
  members: Ref<BuildingMember[]>
  invitations: Ref<Invitation[]>
  announcements: Ref<Announcement[]>
  problems: Ref<ProblemReport[]>
  seeded: Ref<boolean>
}

/**
 * رفرنس‌های کوکی استور — در هر درخواست (سرور) یک‌بار ساخته می‌شوند و بین
 * همه کامپوننت‌ها/میدلورها به اشتراک گذاشته می‌شوند تا یک کوکی از چند نقطه
 * بازنویسی نشود. کلاینت هم در طول عمر اپ از همین رفرنس‌ها استفاده می‌کند.
 */
export function useStoreRefs(): StoreRefs {
  const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & { _hamStoreRefs?: StoreRefs }

  if (!nuxtApp._hamStoreRefs) {
    nuxtApp._hamStoreRefs = {
      user: useCookie<AuthUser | null>('ham-user', { ...COOKIE_OPTIONS, default: () => null }),
      users: useCookie<AuthUser[]>('ham-users', { ...COOKIE_OPTIONS, default: () => [] }),
      pendingJoin: useCookie<string | null>('ham-pending-join', { ...COOKIE_OPTIONS, default: () => null }),
      buildings: useCookie<Building[]>('ham-buildings', { ...COOKIE_OPTIONS, default: () => [] }),
      units: useCookie<BuildingUnit[]>('ham-units', { ...COOKIE_OPTIONS, default: () => [] }),
      members: useCookie<BuildingMember[]>('ham-members', { ...COOKIE_OPTIONS, default: () => [] }),
      invitations: useCookie<Invitation[]>('ham-invitations', { ...COOKIE_OPTIONS, default: () => [] }),
      announcements: useBase64JsonCookie<Announcement[]>('ham-announcements', []),
      problems: useBase64JsonCookie<ProblemReport[]>('ham-problems', []),
      seeded: useCookie<boolean>('ham-seeded', { ...COOKIE_OPTIONS, default: () => false }),
    }
  }

  return nuxtApp._hamStoreRefs
}
