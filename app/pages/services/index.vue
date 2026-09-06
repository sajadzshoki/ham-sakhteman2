<script setup lang="ts">
import type { ProviderCategory } from '~/types'
import { providerCategories, providerCategoryOf } from '~/data/mock'

const { user, isManager } = useAuth()
const store = useAppStore()

useSeoMeta({
  title: 'خدمات ساختمان',
  ogTitle: 'خدمات ساختمان',
})

const building = computed(() => store.buildingOfUser(user.value))

// ——— جستجو و فیلتر دسته‌بندی ———
const query = ref('')
const categoryFilter = ref<'all' | ProviderCategory>('all')

/** متن جستجو را ساده نرمال می‌کند: فاصله‌های اضافی و ح ی/ک عربی */
const normalize = (value: string) => value
  .trim()
  .replace(/ي/g, 'ی')
  .replace(/ك/g, 'ک')
  .replace(/\s+/g, ' ')

const providers = computed(() => {
  if (!building.value) return []
  const list = store.sortedProviders(building.value.id)

  const filtered = categoryFilter.value === 'all'
    ? list
    : list.filter(provider => provider.category === categoryFilter.value)

  const needle = normalize(query.value)
  if (!needle) return filtered

  return filtered.filter((provider) => {
    const haystack = normalize(
      `${provider.name} ${providerCategoryOf(provider.category).label} ${provider.serviceArea} ${provider.description}`,
    )
    return haystack.includes(needle)
  })
})

const hasActiveFilter = computed(() => categoryFilter.value !== 'all' || query.value.trim() !== '')

function clearFilters() {
  query.value = ''
  categoryFilter.value = 'all'
}
</script>

<template>
  <div class="space-y-5">
    <PageHeader
      title="خدمات ساختمان"
      description="پیدا کن، اطلاعات را ببین و مستقیم تماس بگیر."
    />

    <!-- جستجو -->
    <UInput
      v-model="query"
      size="lg"
      icon="i-lucide-search"
      placeholder="جستجوی نام، خدمت یا محدوده…"
      aria-label="جستجوی ارائه‌دهنده خدمات"
      class="w-full"
    />

    <!-- فیلتر دسته‌بندی -->
    <div class="-mx-4 overflow-x-auto px-4 pb-1">
      <div class="flex w-max gap-2">
        <button
          type="button"
          class="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 transition-colors"
          :class="categoryFilter === 'all'
            ? 'bg-teal-600 text-white ring-teal-600 dark:bg-teal-500 dark:ring-teal-500'
            : 'bg-white text-slate-600 ring-slate-200 hover:ring-teal-300 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10 dark:hover:ring-teal-500/60'"
          @click="categoryFilter = 'all'"
        >
          همه
        </button>
        <button
          v-for="category in providerCategories"
          :key="category.id"
          type="button"
          class="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 transition-colors"
          :class="categoryFilter === category.id
            ? 'bg-teal-600 text-white ring-teal-600 dark:bg-teal-500 dark:ring-teal-500'
            : 'bg-white text-slate-600 ring-slate-200 hover:ring-teal-300 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10 dark:hover:ring-teal-500/60'"
          @click="categoryFilter = category.id"
        >
          <Icon :name="category.icon" class="size-3.5" />
          {{ category.label }}
        </button>
      </div>
    </div>

    <!-- راهنمای مدیر برای «مورد اعتماد ساختمان» -->
    <p
      v-if="isManager"
      class="flex items-start gap-1.5 text-[11px] leading-5 text-slate-400 dark:text-slate-500"
    >
      <Icon name="i-lucide-badge-check" class="mt-0.5 size-3.5 shrink-0 text-amber-500" />
      از صفحه هر ارائه‌دهنده می‌توانید آن را به‌عنوان «مورد اعتماد ساختمان» به ساکنین معرفی کنید.
    </p>

    <!-- نتایج -->
    <section>
      <div class="mb-3 flex items-center justify-between gap-2">
        <h2 class="text-base font-bold text-slate-900 dark:text-white">ارائه‌دهندگان خدمات</h2>
        <span class="shrink-0 text-xs text-slate-400 dark:text-slate-500">
          {{ toPersianDigits(providers.length) }} مورد
        </span>
      </div>

      <div v-if="providers.length" class="space-y-3">
        <ProviderCard
          v-for="provider in providers"
          :key="provider.id"
          :provider="provider"
          :trusted="building ? store.isProviderTrusted(building.id, provider.id) : false"
        />
      </div>

      <EmptyState
        v-else-if="hasActiveFilter"
        icon="i-lucide-search-x"
        title="نتیجه‌ای پیدا نشد"
        description="عبارت دیگری جستجو کنید یا فیلتر دسته‌بندی را تغییر دهید."
      >
        <template #action>
          <UButton color="neutral" variant="soft" size="md" label="حذف فیلترها" icon="i-lucide-filter-x" @click="clearFilters" />
        </template>
      </EmptyState>

      <EmptyState
        v-else
        icon="i-lucide-concierge-bell"
        title="هنوز ارائه‌دهنده‌ای ثبت نشده"
        description="به‌زودی فهرست ارائه‌دهندگان خدمات در دسترس قرار می‌گیرد."
      />
    </section>
  </div>
</template>
