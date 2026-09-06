// ——— شارژ ساختمان ———

/** وضعیت پرداخت شارژ برای هر عضو — از روی رکورد پرداخت و سررسید استخراج می‌شود */
export type ChargeStatus = 'unpaid' | 'paid' | 'overdue'

/** دوره شارژ ساختمان؛ هر عضو یک سهم با مبلغ یکسان دارد */
export interface BuildingCharge {
  id: string
  buildingId: string
  title: string
  /** مثال: شهریور ۱۴۰۵ */
  period: string
  /** مبلغ سهم هر واحد به تومان */
  amount: number
  dueAt: string
  notes?: string
  createdBy: string
  createdByName: string
  createdAt: string
}

/**
 * رکورد پرداخت شارژ — در حال حاضر ثبت دستی توسط مدیر.
 * فیلد `method` برای افزودن پرداخت آنلاین در آینده باز نگه داشته شده است.
 */
export interface ChargePayment {
  id: string
  chargeId: string
  memberId: string
  memberName: string
  /** مبلغ پرداخت‌شده به تومان */
  amount: number
  paidAt: string
  note?: string
  /** روش پرداخت؛ فعلاً فقط دستی، بعداً `online` اضافه می‌شود */
  method: 'manual'
  recordedBy: string
}

// ——— هزینه‌های ساختمان ———

/** دسته‌بندی هزینه ساختمان */
export type ExpenseCategory =
  | 'water'
  | 'gas'
  | 'electricity'
  | 'elevator'
  | 'cleaning'
  | 'repair'
  | 'other'

export interface Expense {
  id: string
  buildingId: string
  title: string
  /** مبلغ به تومان */
  amount: number
  category: ExpenseCategory
  /** تاریخ وقوع هزینه */
  date: string
  notes?: string
  /** کلید مرجع تصویر رسید (با پیشوند `img:`) مانند اطلاعیه‌ها */
  receipt?: string
  createdBy: string
  createdByName: string
  createdAt: string
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

// ——— خدمات ساختمان (دایره ارائه‌دهندگان خدمات) ———

/** دسته‌بندی ارائه‌دهنده خدمات ساختمان */
export type ProviderCategory =
  | 'plumbing'
  | 'electrical'
  | 'elevator'
  | 'cleaning'
  | 'painting'
  | 'cooler'
  | 'heating'
  | 'installations'
  | 'glazing'
  | 'locksmith'
  | 'other'

/**
 * ارائه‌دهنده خدمات ساختمان — یک آیتم دایره خدمات با جریان ساده:
 * پیدا کن ← اطلاعات را ببین ← تماس بگیر.
 * محتوای دایره داده پلتفرم است و «مورد اعتماد ساختمان» بودنِ آن برای هر
 * ساختمان جداگانه در استور نگهداری می‌شود.
 */
export interface ServiceProvider {
  id: string
  name: string
  category: ProviderCategory
  description: string
  /** امتیاز از ۵؛ مثال: ۴٫۸ */
  rating: number
  /** شماره تماس با ارقام لاتین؛ برای لینک `tel:` */
  phone: string
  /** محدوده خدمات‌رسانی؛ مثال: سعادت‌آباد و شهرک غرب */
  serviceArea: string
  /** ساعت‌های کاری؛ مثال: شنبه تا پنجشنبه، ۸ تا ۲۰ */
  workingHours: string
  /** تصویر اختیاری (مسیر عمومی یا کلید مرجع `img:`) */
  image?: string
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
