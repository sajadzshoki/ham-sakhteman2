import type {
  Announcement,
  Charge,
  ServiceCategory,
  ServiceRequest,
} from '~/types'

/** محتوای نمایشی (اعلامیه‌ها، شارژ و خدمات) — داده‌های ساختمان در استور (`useAppStore`) نگهداری می‌شوند */

export const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'سرویس دوره‌ای آسانسور',
    body: 'آسانسور ساختمان روز شنبه از ساعت ۹ تا ۱۲ برای سرویس دوره‌ای خاموش خواهد بود. لطفا از پله‌ها استفاده کنید.',
    category: 'warning',
    publishedAt: daysAgo(1, 10, 30),
    pinned: true,
  },
  {
    id: 'ann-2',
    title: 'جلسه عمومی ماهانه ساکنین',
    body: 'جلسه عمومی ماه با موضوع بودجه تعمیرات زمستان، جمعه آینده ساعت ۱۸:۳۰ در لابی برگزار می‌شود. حضور همه ساکنین گرامی است.',
    category: 'info',
    publishedAt: daysAgo(2, 17),
  },
  {
    id: 'ann-3',
    title: 'قطع موقت آب برای شست‌وشوی مخزن',
    body: 'روز دوشنبه از ساعت ۸ تا ۱۴ آب ساختمان به دلیل شست‌وشوی مخزن اصلی قطع خواهد بود. لطفاً ذخیره آب کافی داشته باشید.',
    category: 'urgent',
    publishedAt: daysAgo(3, 8, 15),
  },
  {
    id: 'ann-4',
    title: 'نظافت فصلی مشاعات',
    body: 'برنامه نظافت فصلی راهروها و پارکینگ از هفته آینده آغاز می‌شود. در صورت نیاز به جابه‌جایی وسایل پارکینگ، با سرایداری هماهنگ کنید.',
    category: 'info',
    publishedAt: daysAgo(5, 12),
  },
]

export const charges: Charge[] = [
  {
    id: 'ch-1',
    title: 'شارژ ماه جاری',
    period: 'مهر ۱۴۰۴',
    amount: 850_000,
    status: 'pending',
    dueAt: daysAhead(6),
  },
  {
    id: 'ch-2',
    title: 'شارژ ماه گذشته',
    period: 'شهریور ۱۴۰۴',
    amount: 850_000,
    status: 'paid',
  },
  {
    id: 'ch-3',
    title: 'هزینه تعمیر ایزوگام پشت‌بام',
    period: 'تابستان ۱۴۰۴',
    amount: 1_200_000,
    status: 'paid',
  },
]

export interface ServiceCategoryMeta {
  id: ServiceCategory
  label: string
  icon: string
  tint: string
}

export const serviceCategories: ServiceCategoryMeta[] = [
  { id: 'cleaning', label: 'نظافت', icon: 'i-lucide-sparkles', tint: 'bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300' },
  { id: 'plumbing', label: 'تأسیسات', icon: 'i-lucide-wrench', tint: 'bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300' },
  { id: 'electrical', label: 'برق‌کاری', icon: 'i-lucide-zap', tint: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300' },
  { id: 'hvac', label: 'تهویه', icon: 'i-lucide-fan', tint: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300' },
  { id: 'elevator', label: 'آسانسور', icon: 'i-lucide-move-vertical', tint: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300' },
  { id: 'security', label: 'امنیت', icon: 'i-lucide-shield-check', tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300' },
]

export const serviceRequests: ServiceRequest[] = [
  {
    id: 'sr-1',
    title: 'تعویض دستگیره درب ورودی',
    category: 'security',
    status: 'pending',
    createdAt: daysAgo(1, 11, 20),
    description: 'دستگیره درب اصلی لقی دارد و به‌سختی بسته می‌شود.',
  },
  {
    id: 'sr-2',
    title: 'سرویز پمپ آب پارکینگ',
    category: 'plumbing',
    status: 'in-progress',
    createdAt: daysAgo(3, 9),
    description: 'پمپ آب هنگام روشن شدن صدای غیرعادی می‌دهد.',
  },
  {
    id: 'sr-3',
    title: 'رفع خرابی چراغ سنسوردار راهرو',
    category: 'electrical',
    status: 'done',
    createdAt: daysAgo(8, 16, 45),
  },
  {
    id: 'sr-4',
    title: 'سرویز دوره‌ای آسانسور',
    category: 'elevator',
    status: 'done',
    createdAt: daysAgo(15, 10),
  },
]
