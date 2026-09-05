import type { Ref } from 'vue'
import type { AuthUser, Building, BuildingMember, BuildingUnit, Invitation } from '~/types'

const COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24 * 30,
  sameSite: 'lax',
} as const

export interface StoreRefs {
  user: Ref<AuthUser | null>
  users: Ref<AuthUser[]>
  pendingJoin: Ref<string | null>
  buildings: Ref<Building[]>
  units: Ref<BuildingUnit[]>
  members: Ref<BuildingMember[]>
  invitations: Ref<Invitation[]>
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
      seeded: useCookie<boolean>('ham-seeded', { ...COOKIE_OPTIONS, default: () => false }),
    }
  }

  return nuxtApp._hamStoreRefs
}
