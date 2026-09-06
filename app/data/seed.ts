import type {
  Announcement,
  AppNotification,
  Building,
  BuildingCharge,
  BuildingMember,
  BuildingUnit,
  ChargePayment,
  Expense,
  Invitation,
  ProblemReport,
} from '~/types'

/**
 * دیتای دمو: با اولین بازدید بذرپاشی می‌شود تا حساب‌های «مدیر دمو» و «ساکن دمو»
 * ساختمانی آماده برای مدیریت و مشاهده داشته باشند.
 */

export const DEMO_MANAGER_ID = 'user-manager'
export const DEMO_RESIDENT_ID = 'user-resident'
export const DEMO_ADMIN_ID = 'user-admin'
export const DEMO_BUILDING_ID = 'b-1'

export const DEMO_ACCOUNTS = [
  { phone: '09121112233', password: '1234', label: 'مدیر دمو (رضا احمدی)' },
  { phone: '09123456789', password: '1234', label: 'ساکن دمو (سارا محمدی)' },
  { phone: '09120000000', password: '1234', label: 'سوپرادمین دمو (نگار توکلی)' },
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

/** ارائه‌دهندگان «مورد اعتماد ساختمان» برای ساختمان دمو */
export const seedTrustedProviderIds = ['sp-1', 'sp-3', 'sp-5']

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
// نکته: متن‌های دمو عمداً کوتاه نگه داشته شده‌اند تا مجموع کوکی‌ها از سقف هدر سرور عبور نکند.

export const seedAnnouncements: Announcement[] = [
  {
    id: 'ann-s1',
    buildingId: DEMO_BUILDING_ID,
    title: 'سرویس دوره‌ای آسانسور',
    body: 'آسانسور روز شنبه از ساعت ۹ تا ۱۲ برای سرویس دوره‌ای خاموش است. لطفاً از پله‌ها استفاده کنید.',
    importance: 'important',
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

// ——— اعلان‌های دمو ———
// متن‌ها کوتاه نگه داشته می‌شوند تا کوکی اعلان‌ها در بودجه حجم هدر بماند.

export const seedNotifications: AppNotification[] = [
  {
    id: 'ntf-s1',
    userId: DEMO_RESIDENT_ID,
    type: 'announcement-important',
    title: 'اطلاعیه مهم: «سرویس دوره‌ای آسانسور»',
    link: '/announcements/ann-s1',
    createdAt: daysAgo(1, 10, 30).toISOString(),
  },
  {
    id: 'ntf-s4',
    userId: DEMO_MANAGER_ID,
    type: 'problem-new',
    title: 'گزارش مشکل جدید: «صدای غیرعادی کابین آسانسور»',
    link: '/problems/pr-s2',
    createdAt: daysAgo(1, 16, 45).toISOString(),
  },
]

// ——— شارژها، پرداخت‌ها و هزینه‌های دمو ———

export const seedCharges: BuildingCharge[] = [
  {
    id: 'ch-s1',
    buildingId: DEMO_BUILDING_ID,
    title: 'شارژ ماهانه',
    period: 'شهریور ۱۴۰۵',
    amount: 850_000,
    dueAt: daysAhead(6).toISOString(),
    notes: 'شامل هزینه نظافت، برق مشاعات و نگهداری آسانسور.',
    createdBy: DEMO_MANAGER_ID,
    createdByName: 'رضا احمدی',
    createdAt: daysAgo(4, 9).toISOString(),
  },
  {
    id: 'ch-s2',
    buildingId: DEMO_BUILDING_ID,
    title: 'شارژ ماهانه',
    period: 'مرداد ۱۴۰۵',
    amount: 850_000,
    dueAt: daysAgo(25).toISOString(),
    createdBy: DEMO_MANAGER_ID,
    createdByName: 'رضا احمدی',
    createdAt: daysAgo(35, 9).toISOString(),
  },
  {
    id: 'ch-s3',
    buildingId: DEMO_BUILDING_ID,
    title: 'سهم تعمیر ایزوگام پشت‌بام',
    period: 'تابستان ۱۴۰۵',
    amount: 1_200_000,
    dueAt: daysAgo(70).toISOString(),
    notes: 'هزینه کل تعمیر ۸٬۴۰۰٬۰۰۰ تومان بین ۷ واحد تقسیم شد.',
    createdBy: DEMO_MANAGER_ID,
    createdByName: 'رضا احمدی',
    createdAt: daysAgo(80, 10).toISOString(),
  },
]

export const seedPayments: ChargePayment[] = [
  // شارژ مرداد — پرداخت‌شده توسط ۳ عضو، بقیه دیرکرد
  {
    id: 'pay-s1',
    chargeId: 'ch-s2',
    memberId: 'm-5',
    memberName: 'سارا محمدی',
    amount: 850_000,
    paidAt: daysAgo(28, 18, 30).toISOString(),
    note: 'کارت به کارت',
    method: 'manual',
    recordedBy: DEMO_MANAGER_ID,
  },
  {
    id: 'pay-s2',
    chargeId: 'ch-s2',
    memberId: 'm-1',
    memberName: 'رضا احمدی',
    amount: 850_000,
    paidAt: daysAgo(27, 11).toISOString(),
    method: 'manual',
    recordedBy: DEMO_MANAGER_ID,
  },
  {
    id: 'pay-s3',
    chargeId: 'ch-s2',
    memberId: 'm-3',
    memberName: 'مریم کریمی',
    amount: 850_000,
    paidAt: daysAgo(20, 16, 45).toISOString(),
    note: 'پرداخت نقدی',
    method: 'manual',
    recordedBy: DEMO_MANAGER_ID,
  },
  // سهم ایزوگام — ۵ عضو پرداخت کرده‌اند
  {
    id: 'pay-s4',
    chargeId: 'ch-s3',
    memberId: 'm-1',
    memberName: 'رضا احمدی',
    amount: 1_200_000,
    paidAt: daysAgo(75, 10).toISOString(),
    method: 'manual',
    recordedBy: DEMO_MANAGER_ID,
  },
  {
    id: 'pay-s5',
    chargeId: 'ch-s3',
    memberId: 'm-3',
    memberName: 'مریم کریمی',
    amount: 1_200_000,
    paidAt: daysAgo(74, 12).toISOString(),
    method: 'manual',
    recordedBy: DEMO_MANAGER_ID,
  },
  {
    id: 'pay-s6',
    chargeId: 'ch-s3',
    memberId: 'm-5',
    memberName: 'سارا محمدی',
    amount: 1_200_000,
    paidAt: daysAgo(73, 9, 30).toISOString(),
    method: 'manual',
    recordedBy: DEMO_MANAGER_ID,
  },
  {
    id: 'pay-s7',
    chargeId: 'ch-s3',
    memberId: 'm-6',
    memberName: 'نادر شریفی',
    amount: 1_200_000,
    paidAt: daysAgo(72, 14).toISOString(),
    method: 'manual',
    recordedBy: DEMO_MANAGER_ID,
  },
  {
    id: 'pay-s8',
    chargeId: 'ch-s3',
    memberId: 'm-7',
    memberName: 'زهرا حسینی',
    amount: 1_200_000,
    paidAt: daysAgo(71, 17, 15).toISOString(),
    method: 'manual',
    recordedBy: DEMO_MANAGER_ID,
  },
]

export const seedExpenses: Expense[] = [
  {
    id: 'ex-s1',
    buildingId: DEMO_BUILDING_ID,
    title: 'قبض آب مشاعات',
    amount: 480_000,
    category: 'water',
    date: daysAgo(3, 9).toISOString(),
    notes: 'دوره سه‌ماهه بهار',
    createdBy: DEMO_MANAGER_ID,
    createdByName: 'رضا احمدی',
    createdAt: daysAgo(3, 10).toISOString(),
  },
  {
    id: 'ex-s2',
    buildingId: DEMO_BUILDING_ID,
    title: 'نظافت ماهانه مشاعات',
    amount: 1_200_000,
    category: 'cleaning',
    date: daysAgo(5, 9).toISOString(),
    notes: 'قرارداد ماهانه با شرکت نظافتی',
    createdBy: DEMO_MANAGER_ID,
    createdByName: 'رضا احمدی',
    createdAt: daysAgo(5, 11).toISOString(),
  },
  {
    id: 'ex-s3',
    buildingId: DEMO_BUILDING_ID,
    title: 'سرویس دوره‌ای آسانسور',
    amount: 2_500_000,
    category: 'elevator',
    date: daysAgo(15, 9).toISOString(),
    notes: 'قرارداد نگهداری ماهانه با شرکت تعمیرکار',
    createdBy: DEMO_MANAGER_ID,
    createdByName: 'رضا احمدی',
    createdAt: daysAgo(15, 12).toISOString(),
  },
  {
    id: 'ex-s4',
    buildingId: DEMO_BUILDING_ID,
    title: 'خرید لامپ و سنسور راهرو',
    amount: 320_000,
    category: 'electricity',
    date: daysAgo(8, 16).toISOString(),
    createdBy: DEMO_MANAGER_ID,
    createdByName: 'رضا احمدی',
    createdAt: daysAgo(8, 17).toISOString(),
  },
]
