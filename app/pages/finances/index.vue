<script setup lang="ts">
import { expenseCategoryOf } from '~/data/mock'

const router = useRouter()
const { t } = useI18n()
const { user, isManager } = useAuth()
const store = useAppStore()

useSeoMeta({
  title: 'شفافیت مالی',
  ogTitle: 'شفافیت مالی',
})

const building = computed(() => store.buildingOfUser(user.value))

const summary = computed(() =>
  building.value ? store.financialSummary(building.value.id) : null,
)

const charges = computed(() =>
  building.value ? store.buildingCharges(building.value.id) : [],
)

const progressOf = (chargeId: string) => {
  if (!building.value) return { paid: 0, total: 0, percent: 0 }
  const paid = store.chargePaidCount(chargeId)
  const total = store.chargePayerCount(building.value.id)
  return { paid, total, percent: total === 0 ? 0 : Math.round((paid / total) * 100) }
}

const statCards = computed(() => {
  if (!summary.value) return []
  return [
    {
      label: 'درآمد شارژ',
      value: formatPrice(summary.value.income),
      icon: 'i-lucide-trending-up',
      tint: 'bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300',
    },
    {
      label: 'هزینه‌ها',
      value: formatPrice(summary.value.expensesTotal),
      icon: 'i-lucide-trending-down',
      tint: 'bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300',
    },
    {
      label: 'مانده ساختمان',
      value: `${summary.value.balance < 0 ? 'منفی ' : ''}${formatPrice(Math.abs(summary.value.balance))}`,
      sub: 'درآمد شارژ منهای هزینه‌ها',
      icon: 'i-lucide-wallet',
      tint: summary.value.balance >= 0
        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300'
        : 'bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-300',
    },
    {
      label: 'پرداخت‌شده',
      value: `${toPersianDigits(summary.value.paidItems)} از ${toPersianDigits(summary.value.expectedItems)} سهم`,
      sub: summary.value.unpaidItems > 0
        ? `${toPersianDigits(summary.value.unpaidItems)} سهم پرداخت‌نشده`
        : 'همه سهم‌ها پرداخت شده',
      icon: 'i-lucide-pie-chart',
      tint: 'bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300',
    },
  ]
})
</script>

<template>
  <div class="space-y-5">
    <PageHeader
      title="شفافیت مالی"
      description="نمای کلی درآمد شارژ، هزینه‌ها و مانده ساختمان"
    >
      <template v-if="isManager" #actions>
        <div class="flex gap-2">
          <UButton color="primary" variant="solid" size="sm" label="ایجاد شارژ" icon="i-lucide-plus" @click="router.push('/charges/new')" />
          <UButton color="neutral" variant="soft" size="sm" label="ثبت هزینه" icon="i-lucide-plus" @click="router.push('/expenses/new')" />
        </div>
      </template>
    </PageHeader>

    <LoadingState v-if="!building || !summary" :rows="3" />

    <template v-else>
      <!-- کارت‌های آماری -->
      <section class="grid grid-cols-2 gap-2.5 sm:gap-3">
        <AppCard v-for="card in statCards" :key="card.label" padding="sm">
          <div class="flex items-center gap-2">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg" :class="card.tint">
              <Icon :name="card.icon" class="size-4" />
            </span>
            <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400">{{ card.label }}</p>
          </div>
          <p class="mt-2 text-sm font-extrabold text-slate-900 dark:text-white">
            {{ card.value }}
          </p>
          <p v-if="card.sub" class="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{{ card.sub }}</p>
        </AppCard>
      </section>

      <!-- پیشرفت دریافت شارژها -->
      <section v-if="charges.length">
        <SectionHeader title="وضعیت دریافت شارژها" :action="{ label: t('common.showAll'), to: '/charges' }" />
        <div class="space-y-3">
          <NuxtLink
            v-for="charge in charges"
            :key="charge.id"
            :to="`/charges/${charge.id}`"
            class="block"
          >
            <AppCard hover>
              <div class="flex items-center justify-between gap-2">
                <p class="min-w-0 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                  {{ charge.title }}
                  <span class="font-medium text-slate-400 dark:text-slate-500">({{ charge.period }})</span>
                </p>
                <p class="shrink-0 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {{ toPersianDigits(progressOf(charge.id).paid) }} از {{ toPersianDigits(progressOf(charge.id).total) }}
                </p>
              </div>
              <div class="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  class="h-full rounded-full bg-teal-500 transition-all"
                  :style="{ width: `${progressOf(charge.id).percent}%` }"
                />
              </div>
            </AppCard>
          </NuxtLink>
        </div>
      </section>

      <!-- هزینه‌های اخیر -->
      <section>
        <SectionHeader title="هزینه‌های اخیر" :action="{ label: t('common.showAll'), to: '/expenses' }" />
        <div v-if="summary.recentExpenses.length" class="space-y-3">
          <AppCard v-for="expense in summary.recentExpenses" :key="expense.id">
            <div class="flex items-center gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-xl" :class="expenseCategoryOf(expense.category).tint">
                <Icon :name="expenseCategoryOf(expense.category).icon" class="size-5" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{{ expense.title }}</p>
                  <p class="shrink-0 text-sm font-extrabold text-slate-900 dark:text-white">
                    {{ formatPrice(expense.amount) }}
                  </p>
                </div>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {{ expenseCategoryOf(expense.category).label }}
                  •
                  {{ formatDate(expense.date, 'full') }}
                </p>
              </div>
            </div>
          </AppCard>
        </div>
        <EmptyState
          v-else
          icon="i-lucide-receipt-text"
          title="هنوز هزینه‌ای ثبت نشده"
          description="هزینه‌های ساختمان پس از ثبت توسط مدیر اینجا نمایش داده می‌شود."
        />
      </section>
    </template>
  </div>
</template>
