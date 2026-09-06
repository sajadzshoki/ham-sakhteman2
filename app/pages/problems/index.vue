<script setup lang="ts">
import type { ProblemCategory, ProblemStatus } from '~/types'
import { problemCategories, problemCategoryOf, problemStatusFilters } from '~/data/mock'

const router = useRouter()
const { user, isManager } = useAuth()
const store = useAppStore()

useSeoMeta({
  title: 'مشکلات ساختمان',
  ogTitle: 'مشکلات ساختمان',
})

const building = computed(() => store.buildingOfUser(user.value))

const statusFilter = ref<'all' | ProblemStatus>('all')
const categoryFilter = ref<'all' | ProblemCategory>('all')

/** مدیر همه گزارش‌ها را می‌بیند؛ ساکن فقط گزارش‌های خودش را */
const baseProblems = computed(() => {
  if (!building.value || !user.value) return []
  return isManager.value
    ? store.buildingProblems(building.value.id)
    : store.problemsOfUser(building.value.id, user.value.id)
})

const filteredProblems = computed(() =>
  baseProblems.value.filter((problem) => {
    if (statusFilter.value !== 'all' && problem.status !== statusFilter.value) return false
    if (categoryFilter.value !== 'all' && problem.category !== categoryFilter.value) return false
    return true
  }),
)

const openCount = computed(() => baseProblems.value.filter(item => item.status !== 'resolved').length)

function clearFilters() {
  statusFilter.value = 'all'
  categoryFilter.value = 'all'
}

function statusLabel(status: ProblemStatus): string {
  return problemStatusFilters.find(item => item.id === status)?.label ?? status
}

function goNew() {
  router.push('/problems/new')
}
</script>

<template>
  <div class="space-y-5">
    <PageHeader
      title="مشکلات ساختمان"
      :description="isManager ? `${toPersianDigits(openCount)} گزارش در انتظار رسیدگی` : 'گزارش‌های ثبت‌شده توسط شما'"
    >
      <template #actions>
        <UButton color="primary" variant="solid" size="md" label="گزارش مشکل" icon="i-lucide-plus" @click="goNew" />
      </template>
    </PageHeader>

    <LoadingState v-if="!building" :rows="3" />

    <template v-else-if="baseProblems.length">
      <!-- فیلتر وضعیت -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in problemStatusFilters"
          :key="option.id"
          type="button"
          class="rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 transition-colors"
          :class="statusFilter === option.id
            ? 'bg-teal-600 text-white ring-teal-600 dark:bg-teal-500 dark:ring-teal-500'
            : 'bg-white text-slate-600 ring-slate-200 hover:ring-teal-300 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10 dark:hover:ring-teal-500/60'"
          @click="statusFilter = option.id"
        >
          {{ option.label }}
        </button>
      </div>

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
            همه دسته‌ها
          </button>
          <button
            v-for="category in problemCategories"
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

      <!-- لیست گزارش‌ها -->
      <div v-if="filteredProblems.length" class="space-y-3">
        <NuxtLink
          v-for="problem in filteredProblems"
          :key="problem.id"
          :to="`/problems/${problem.id}`"
          class="block"
        >
          <AppCard as="article" hover>
            <div class="flex items-start gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-xl" :class="problemCategoryOf(problem.category).tint">
                <Icon :name="problemCategoryOf(problem.category).icon" class="size-5" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{{ problem.title }}</p>
                  <StatusBadge :status="problem.status" :label="statusLabel(problem.status)" />
                </div>
                <p class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                  {{ problemCategoryOf(problem.category).label }}
                  •
                  {{ formatRelative(problem.createdAt) }}
                  <template v-if="isManager">
                    •
                    {{ problem.reportedByName }}
                  </template>
                </p>
              </div>
            </div>
          </AppCard>
        </NuxtLink>
      </div>

      <EmptyState
        v-else
        icon="i-lucide-filter-x"
        title="موردی با این فیلترها پیدا نشد"
        description="فیلترها را تغییر دهید یا حذف کنید."
      >
        <template #action>
          <UButton color="neutral" variant="soft" size="md" label="حذف فیلترها" icon="i-lucide-filter-x" @click="clearFilters" />
        </template>
      </EmptyState>
    </template>

    <EmptyState
      v-else
      icon="i-lucide-circle-check"
      :title="isManager ? 'هنوز گزارشی ثبت نشده' : 'هنوز گزارشی ثبت نکرده‌اید'"
      :description="isManager
        ? 'وقتی ساکنین مشکلی را گزارش کنند، اینجا نمایش داده می‌شود.'
        : 'اگر مشکلی در ساختمان دیدید، همین حالا گزارش دهید تا مدیر پیگیری کند.'"
    >
      <template #action>
        <UButton color="primary" variant="solid" size="md" label="گزارش مشکل" icon="i-lucide-plus" @click="goNew" />
      </template>
    </EmptyState>
  </div>
</template>
