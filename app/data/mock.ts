import type {
  Charge,
  ProblemCategory,
  ProblemStatus,
  ServiceCategory,
  ServiceRequest,
} from '~/types'

/** محتوای نمایشی (شارژ و خدمات) و متادیتای دسته‌بندی‌ها — داده‌های ساختمان، اطلاعیه‌ها و گزارش‌ها در استور (`useAppStore`) نگهداری می‌شوند */

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

// ——— دسته‌بندی مشکلات ———

export interface ProblemCategoryMeta {
  id: ProblemCategory
  label: string
  icon: string
  tint: string
}

/** fallback برای حالتی که دسته‌ای پیدا نشود (عملاً رخ نمی‌دهد؛ همه دسته‌ها تعریف شده‌اند) */
const OTHER_CATEGORY: ProblemCategoryMeta = {
  id: 'other',
  label: 'سایر',
  icon: 'i-lucide-ellipsis',
  tint: 'bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300',
}

export const problemCategories: ProblemCategoryMeta[] = [
  { id: 'water', label: 'آب', icon: 'i-lucide-droplets', tint: 'bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300' },
  { id: 'electricity', label: 'برق', icon: 'i-lucide-zap', tint: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300' },
  { id: 'elevator', label: 'آسانسور', icon: 'i-lucide-move-vertical', tint: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300' },
  { id: 'gas', label: 'گاز', icon: 'i-lucide-flame', tint: 'bg-orange-50 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300' },
  { id: 'common', label: 'مشاعات', icon: 'i-lucide-door-open', tint: 'bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300' },
  { id: 'cleaning', label: 'نظافت', icon: 'i-lucide-sparkles', tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300' },
  OTHER_CATEGORY,
]

export const problemCategoryOf = (id: ProblemCategory): ProblemCategoryMeta =>
  problemCategories.find(category => category.id === id) ?? OTHER_CATEGORY

/** ترتیب و برچسب وضعیت‌های گزارش برای فیلترها */
export const problemStatusFilters: { id: 'all' | ProblemStatus, label: string }[] = [
  { id: 'all', label: 'همه' },
  { id: 'new', label: 'جدید' },
  { id: 'in-progress', label: 'در حال پیگیری' },
  { id: 'resolved', label: 'حل شده' },
]
