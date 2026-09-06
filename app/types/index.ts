// ——— شارژ ———

/** وضعیت پرداخت شارژ */
export type ChargeStatus = 'paid' | 'pending' | 'overdue'

export interface Charge {
  id: string
  title: string
  period: string
  amount: number
  status: ChargeStatus
  dueAt?: Date
}

// ——— اطلاعیه‌ها ———

/** اهمیت اطلاعیه */
export type AnnouncementImportance = 'normal' | 'important'

export interface Announcement {
  id: string
  buildingId: string
  title: string
  body: string
  importance: AnnouncementImportance
  /**
   * کلید مرجع تصویر (با پیشوند `img:`) که خود تصویر در حافظه محلی مرورگر
   * نگهداری می‌شود — کوکی‌ها ظرفیت محدودی دارند.
   */
  image?: string
  createdBy: string
  createdByName: string
  createdAt: string
  updatedAt?: string
}

// ——— گزارش مشکلات ———

/** دسته‌بندی مشکل گزارش‌شده */
export type ProblemCategory =
  | 'water'
  | 'electricity'
  | 'elevator'
  | 'gas'
  | 'common'
  | 'cleaning'
  | 'other'

/** وضعیت رسیدگی به گزارش مشکل */
export type ProblemStatus = 'new' | 'in-progress' | 'resolved'

export interface ProblemReport {
  id: string
  buildingId: string
  category: ProblemCategory
  title: string
  description: string
  /** کلید مرجع تصویر مانند اطلاعیه‌ها */
  image?: string
  status: ProblemStatus
  reportedBy: string
  reportedByName: string
  createdAt: string
  updatedAt?: string
}

// ——— خدمات ———

/** وضعیت درخواست خدمات */
export type ServiceRequestStatus = 'pending' | 'in-progress' | 'done' | 'canceled'

/** دسته‌بندی خدمات */
export type ServiceCategory =
  | 'cleaning'
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'elevator'
  | 'security'

export interface ServiceRequest {
  id: string
  title: string
  category: ServiceCategory
  status: ServiceRequestStatus
  createdAt: Date
  description?: string
}

// ——— احراز هویت ———

/** نقش کاربر در اپ */
export type MemberRole = 'manager' | 'resident'

/** روش‌های ورود؛ در حال حاضر رمز عبور فعال است و زیرساخت برای کد یک‌بارمصرف آماده نگه داشته شده */
export type AuthMethod = 'password' | 'otp'

export interface AuthUser {
  id: string
  name: string
  phone: string
  role: MemberRole
  /** فقط برای نسخه نمایشی — در نسخه واقعی هرگز سمت کلاینت ذخیره نمی‌شود */
  password?: string
  createdAt: string
}

// ——— ساختمان، واحد، عضو ———

export interface Building {
  id: string
  name: string
  address: string
  /** تعداد واحدهای تعریف‌شده برای ساختمان */
  unitsCount: number
  description?: string
  managerId: string
  createdAt: string
}

export interface BuildingUnit {
  id: string
  buildingId: string
  number: number
  floor: number
}

/** وضعیت سکونت عضو نسبت به واحد */
export type UnitStatus = 'owner' | 'tenant'

export interface BuildingMember {
  id: string
  buildingId: string
  /** در صورت داشتن حساب کاربری */
  userId?: string
  name: string
  phone?: string
  role: MemberRole
  unitId?: string
  /** مالک یا مستأجر بودن نسبت به واحد تخصیص‌یافته */
  unitStatus?: UnitStatus
  joinedAt: string
}

// ——— دعوت‌نامه ———

export type InvitationStatus = 'active' | 'used' | 'expired'

export interface Invitation {
  id: string
  buildingId: string
  /** کد کوتاه قابل اشتراک‌گذاری */
  code: string
  /** نقشی که پس از پیوستن به عضو داده می‌شود */
  role: MemberRole
  createdBy: string
  createdAt: string
  expiresAt: string
  status: InvitationStatus
}

// ——— ناوبری ———

export interface NavItem {
  /** کلید ترجمه برای عنوان */
  labelKey: string
  to: string
  icon: string
}
