import type { Building, BuildingMember, BuildingUnit, Invitation } from '~/types'

/**
 * دیتای دمو: با اولین بازدید بذرپاشی می‌شود تا حساب‌های «مدیر دمو» و «ساکن دمو»
 * ساختمانی آماده برای مدیریت و مشاهده داشته باشند.
 */

export const DEMO_MANAGER_ID = 'user-manager'
export const DEMO_RESIDENT_ID = 'user-resident'
export const DEMO_BUILDING_ID = 'b-1'

export const DEMO_ACCOUNTS = [
  { phone: '09121112233', password: '1234', label: 'مدیر دمو (رضا احمدی)' },
  { phone: '09123456789', password: '1234', label: 'ساکن دمو (سارا محمدی)' },
]

export const seedUnits: BuildingUnit[] = [
  { id: 'u-1', buildingId: DEMO_BUILDING_ID, number: 1, floor: 1 },
  { id: 'u-2', buildingId: DEMO_BUILDING_ID, number: 2, floor: 1 },
  { id: 'u-3', buildingId: DEMO_BUILDING_ID, number: 3, floor: 2 },
  { id: 'u-4', buildingId: DEMO_BUILDING_ID, number: 4, floor: 2 },
  { id: 'u-5', buildingId: DEMO_BUILDING_ID, number: 5, floor: 3 },
  { id: 'u-6', buildingId: DEMO_BUILDING_ID, number: 6, floor: 3 },
  { id: 'u-7', buildingId: DEMO_BUILDING_ID, number: 7, floor: 4 },
  { id: 'u-8', buildingId: DEMO_BUILDING_ID, number: 8, floor: 4 },
  { id: 'u-9', buildingId: DEMO_BUILDING_ID, number: 9, floor: 5 },
  { id: 'u-10', buildingId: DEMO_BUILDING_ID, number: 10, floor: 5 },
  { id: 'u-11', buildingId: DEMO_BUILDING_ID, number: 11, floor: 6 },
  { id: 'u-12', buildingId: DEMO_BUILDING_ID, number: 12, floor: 6 },
]

export const seedMembers: BuildingMember[] = [
  {
    id: 'm-1',
    buildingId: DEMO_BUILDING_ID,
    userId: DEMO_MANAGER_ID,
    name: 'رضا احمدی',
    phone: '09121112233',
    role: 'manager',
    joinedAt: daysAgo(170).toISOString(),
  },
  {
    id: 'm-2',
    buildingId: DEMO_BUILDING_ID,
    name: 'حامد رضایی',
    phone: '09351112244',
    role: 'resident',
    unitId: 'u-1',
    unitStatus: 'tenant',
    joinedAt: daysAgo(150).toISOString(),
  },
  {
    id: 'm-3',
    buildingId: DEMO_BUILDING_ID,
    name: 'مریم کریمی',
    role: 'resident',
    unitId: 'u-3',
    unitStatus: 'owner',
    joinedAt: daysAgo(150).toISOString(),
  },
  {
    id: 'm-4',
    buildingId: DEMO_BUILDING_ID,
    name: 'علی موسوی',
    role: 'resident',
    unitId: 'u-4',
    unitStatus: 'tenant',
    joinedAt: daysAgo(120).toISOString(),
  },
  {
    id: 'm-5',
    buildingId: DEMO_BUILDING_ID,
    userId: DEMO_RESIDENT_ID,
    name: 'سارا محمدی',
    phone: '09123456789',
    role: 'resident',
    unitId: 'u-5',
    unitStatus: 'owner',
    joinedAt: daysAgo(170).toISOString(),
  },
  {
    id: 'm-6',
    buildingId: DEMO_BUILDING_ID,
    name: 'نادر شریفی',
    role: 'resident',
    unitId: 'u-6',
    unitStatus: 'owner',
    joinedAt: daysAgo(80).toISOString(),
  },
  {
    id: 'm-7',
    buildingId: DEMO_BUILDING_ID,
    name: 'زهرا حسینی',
    phone: '09198887766',
    role: 'resident',
    unitId: 'u-7',
    unitStatus: 'tenant',
    joinedAt: daysAgo(55).toISOString(),
  },
]

export const seedBuildings: Building[] = [
  {
    id: DEMO_BUILDING_ID,
    name: 'ساختمان آسمان',
    address: 'تهران، سعادت‌آباد، بلوار سرو غربی، پلاک ۱۲',
    unitsCount: 12,
    description: 'ساختمان مسکونی ۶ طبقه با لابی، پارکینگ اختصاصی و سیستم اعلام حریق.',
    managerId: DEMO_MANAGER_ID,
    createdAt: daysAgo(200).toISOString(),
  },
]

/** کد دعوت فعال دمو برای تست جریان پیوستن: /join?code=K7X2M9 */
export const seedInvitations: Invitation[] = [
  {
    id: 'inv-1',
    buildingId: DEMO_BUILDING_ID,
    code: 'K7X2M9',
    role: 'resident',
    createdBy: DEMO_MANAGER_ID,
    createdAt: daysAgo(25).toISOString(),
    expiresAt: daysAhead(340).toISOString(),
    status: 'active',
  },
]
