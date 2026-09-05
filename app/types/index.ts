/** وضعیت پرداخت شارژ */
export type ChargeStatus = 'paid' | 'pending' | 'overdue'

/** وضعیت سکونت واحد */
export type UnitOccupancy = 'owner' | 'tenant' | 'vacant'

/** دسته اطلاعیه */
export type AnnouncementCategory = 'info' | 'warning' | 'urgent'

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

export interface Announcement {
  id: string
  title: string
  body: string
  category: AnnouncementCategory
  publishedAt: Date
  pinned?: boolean
}

export interface Charge {
  id: string
  title: string
  period: string
  amount: number
  status: ChargeStatus
  dueAt?: Date
}

export interface Unit {
  id: string
  number: number
  floor: number
  occupancy: UnitOccupancy
  residentName?: string
}

export interface ServiceRequest {
  id: string
  title: string
  category: ServiceCategory
  status: ServiceRequestStatus
  createdAt: Date
  description?: string
}

export interface UserProfile {
  name: string
  unitNumber: number
  floor: number
  phone: string
  role: 'resident'
}

export interface BuildingInfo {
  name: string
  address: string
  unitsCount: number
  floorsCount: number
  /** سال ساخت به شمسی */
  builtYear: string
  managerName: string
  managerPhone: string
  amenities: string[]
}

export interface NavItem {
  /** کلید ترجمه برای عنوان */
  labelKey: string
  to: string
  icon: string
}
