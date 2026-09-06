import type { Announcement, Building, BuildingMember, BuildingUnit, Invitation, ProblemReport } from '~/types'

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

// ——— اطلاعیه‌ها و گزارش‌های دمو ———

/** بنر سبک‌وزن SVG برای اطلاعیه نمونه (بدون فایل خارجی؛ عمداً بسیار کوچک تا کوکی از حد مجاز عبور نکند) */
const seedBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320"><rect width="640" height="320" fill="#0d9488"/><g fill="#ccfbf1" opacity=".95"><rect x="270" y="100" width="100" height="140" rx="8"/><rect x="292" y="122" width="16" height="16" fill="#0d9488"/><rect x="332" y="122" width="16" height="16" fill="#0d9488"/><rect x="292" y="156" width="16" height="16" fill="#0d9488"/><rect x="332" y="156" width="16" height="16" fill="#0d9488"/><rect x="306" y="198" width="28" height="42" fill="#0d9488"/><rect x="296" y="70" width="48" height="34" rx="4"/></g></svg>`

export const seedAnnouncementBanner = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(seedBannerSvg)}`

export const seedAnnouncements: Announcement[] = [
  {
    id: 'ann-s1',
    buildingId: DEMO_BUILDING_ID,
    title: 'سرویس دوره‌ای آسانسور',
    body: 'آسانسور ساختمان روز شنبه از ساعت ۹ تا ۱۲ برای سرویس دوره‌ای خاموش خواهد بود. لطفاً در این بازه از پله‌ها استفاده کنید و در صورت نیاز به جابه‌جایی وسایل سنگین، با سرایداری هماهنگ کنید.',
    importance: 'important',
    image: seedAnnouncementBanner,
    createdBy: DEMO_MANAGER_ID,
    createdByName: 'رضا احمدی',
    createdAt: daysAgo(1, 10, 30).toISOString(),
  },
  {
    id: 'ann-s2',
    buildingId: DEMO_BUILDING_ID,
    title: 'جلسه عمومی ماهانه ساکنین',
    body: 'جلسه عمومی ماه با موضوع بودجه تعمیرات زمستان، جمعه آینده ساعت ۱۸:۳۰ در لابی برگزار می‌شود. حضور همه ساکنین گرامی است.',
    importance: 'normal',
    createdBy: DEMO_MANAGER_ID,
    createdByName: 'رضا احمدی',
    createdAt: daysAgo(3, 17).toISOString(),
  },
  {
    id: 'ann-s3',
    buildingId: DEMO_BUILDING_ID,
    title: 'نظافت فصلی مشاعات',
    body: 'برنامه نظافت فصلی راهروها و پارکینگ از هفته آینده آغاز می‌شود. در صورت نیاز به جابه‌جایی وسایل پارکینگ، با سرایداری هماهنگ کنید.',
    importance: 'normal',
    createdBy: DEMO_MANAGER_ID,
    createdByName: 'رضا احمدی',
    createdAt: daysAgo(5, 12).toISOString(),
  },
]

export const seedProblems: ProblemReport[] = [
  {
    id: 'pr-s1',
    buildingId: DEMO_BUILDING_ID,
    category: 'water',
    title: 'چکه شیر آب پارکینگ',
    description: 'شیر آب گوشه پارکینگ چکه می‌کند و کف پارکینگ خیس شده. لطفاً برای تعمیر اقدام شود.',
    status: 'in-progress',
    reportedBy: DEMO_RESIDENT_ID,
    reportedByName: 'سارا محمدی',
    createdAt: daysAgo(2, 9, 15).toISOString(),
    updatedAt: daysAgo(1, 11).toISOString(),
  },
  {
    id: 'pr-s2',
    buildingId: DEMO_BUILDING_ID,
    category: 'elevator',
    title: 'صدای غیرعادی کابین آسانسور',
    description: 'کابین آسانسور هنگام حرکت بین طبقات ۳ و ۴ صدای سایش می‌دهد. نیاز به بازدید شرکت نگهداری دارد.',
    status: 'new',
    reportedBy: DEMO_RESIDENT_ID,
    reportedByName: 'سارا محمدی',
    createdAt: daysAgo(1, 16, 45).toISOString(),
  },
  {
    id: 'pr-s3',
    buildingId: DEMO_BUILDING_ID,
    category: 'cleaning',
    title: 'نظافت راهرو طبقه ۵',
    description: 'راهرو طبقه ۵ نیاز به نظافت دارد؛ گرد و خاک روی نرده‌ها جمع شده است.',
    status: 'resolved',
    reportedBy: DEMO_RESIDENT_ID,
    reportedByName: 'سارا محمدی',
    createdAt: daysAgo(9, 13).toISOString(),
    updatedAt: daysAgo(6, 10).toISOString(),
  },
  {
    id: 'pr-s4',
    buildingId: DEMO_BUILDING_ID,
    category: 'electricity',
    title: 'چراغ سنسوردار راهرو طبقه ۳',
    description: 'چراغ سنسوردار راهرو طبقه ۳ با حرکت روشن نمی‌شود و همیشه خاموش است.',
    status: 'new',
    reportedBy: DEMO_MANAGER_ID,
    reportedByName: 'رضا احمدی',
    createdAt: daysAgo(4, 8, 20).toISOString(),
  },
]
