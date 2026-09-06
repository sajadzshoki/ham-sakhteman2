import type {
  ExpenseCategory,
  ProblemCategory,
  ProblemStatus,
  ProviderCategory,
} from '~/types'

/** متادیتای دسته‌بندی‌ها و محتوای نمایشی — داده‌های ساختمان، اطلاعیه‌ها، گزارش‌ها، شارژ و هزینه‌ها در استور (`useAppStore`) نگهداری می‌شوند */

// ——— دسته‌بندی ارائه‌دهندگان خدمات ———

export interface ProviderCategoryMeta {
  id: ProviderCategory
  label: string
  icon: string
  tint: string
}

const OTHER_PROVIDER_CATEGORY: ProviderCategoryMeta = {
  id: 'other',
  label: 'سایر',
  icon: 'i-lucide-ellipsis',
  tint: 'bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300',
}

export const providerCategories: ProviderCategoryMeta[] = [
  { id: 'plumbing', label: 'لوله‌کشی', icon: 'i-lucide-wrench', tint: 'bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300' },
  { id: 'electrical', label: 'برق‌کاری', icon: 'i-lucide-zap', tint: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300' },
  { id: 'elevator', label: 'آسانسور', icon: 'i-lucide-move-vertical', tint: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300' },
  { id: 'cleaning', label: 'نظافت', icon: 'i-lucide-sparkles', tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300' },
  { id: 'painting', label: 'نقاشی', icon: 'i-lucide-paint-roller', tint: 'bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300' },
  { id: 'cooler', label: 'کولر', icon: 'i-lucide-thermometer-snowflake', tint: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300' },
  { id: 'heating', label: 'پکیج و موتورخانه', icon: 'i-lucide-flame', tint: 'bg-orange-50 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300' },
  { id: 'installations', label: 'تأسیسات', icon: 'i-lucide-cog', tint: 'bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300' },
  { id: 'glazing', label: 'شیشه‌کاری', icon: 'i-lucide-frame', tint: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300' },
  { id: 'locksmith', label: 'کلیدسازی', icon: 'i-lucide-key-round', tint: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-300' },
  OTHER_PROVIDER_CATEGORY,
]

export const providerCategoryOf = (id: ProviderCategory): ProviderCategoryMeta =>
  providerCategories.find(category => category.id === id) ?? OTHER_PROVIDER_CATEGORY

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

// ——— دسته‌بندی هزینه‌ها ———

export interface ExpenseCategoryMeta {
  id: ExpenseCategory
  label: string
  icon: string
  tint: string
}

const OTHER_EXPENSE_CATEGORY: ExpenseCategoryMeta = {
  id: 'other',
  label: 'سایر',
  icon: 'i-lucide-ellipsis',
  tint: 'bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300',
}

export const expenseCategories: ExpenseCategoryMeta[] = [
  { id: 'water', label: 'آب', icon: 'i-lucide-droplets', tint: 'bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300' },
  { id: 'gas', label: 'گاز', icon: 'i-lucide-flame', tint: 'bg-orange-50 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300' },
  { id: 'electricity', label: 'برق', icon: 'i-lucide-zap', tint: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300' },
  { id: 'elevator', label: 'آسانسور', icon: 'i-lucide-move-vertical', tint: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300' },
  { id: 'cleaning', label: 'نظافت', icon: 'i-lucide-sparkles', tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300' },
  { id: 'repair', label: 'تعمیرات', icon: 'i-lucide-wrench', tint: 'bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300' },
  OTHER_EXPENSE_CATEGORY,
]

export const expenseCategoryOf = (id: ExpenseCategory): ExpenseCategoryMeta =>
  expenseCategories.find(category => category.id === id) ?? OTHER_EXPENSE_CATEGORY
