<script setup lang="ts">
const router = useRouter()
const { user, isManager } = useAuth()
const store = useAppStore()

useSeoMeta({
  title: 'شارژهای ساختمان',
  ogTitle: 'شارژهای ساختمان',
})

const building = computed(() => store.buildingOfUser(user.value))
const membership = computed(() => store.membershipOfUser(user.value))

const charges = computed(() =>
  building.value ? store.buildingCharges(building.value.id) : [],
)

const statusOf = (chargeId: string) => {
  const charge = store.getCharge(chargeId)
  if (!charge || !membership.value) return 'unpaid'
  return store.chargeStatusFor(charge, membership.value.id)
}

const progressOf = (chargeId: string) => {
  if (!building.value) return { paid: 0, total: 0, percent: 0 }
  const paid = store.chargePaidCount(chargeId)
  const total = store.chargePayerCount(building.value.id)
  return { paid, total, percent: total === 0 ? 0 : Math.round((paid / total) * 100) }
}

function goNew() {
  router.push('/charges/new')
}
</script>

<template>
  <div class="space-y-5">
    <PageHeader
      title="شارژهای ساختمان"
      :description="isManager ? 'تعریف دوره‌های شارژ و پیگیری پرداخت ساکنین' : 'سهم شما در هر دوره و وضعیت پرداخت'"
    >
      <template v-if="isManager" #actions>
        <UButton color="primary" variant="solid" size="md" label="ایجاد شارژ" icon="i-lucide-plus" @click="goNew" />
      </template>
    </PageHeader>

    <LoadingState v-if="!building" :rows="3" />

    <template v-else-if="charges.length">
      <div class="space-y-3">
        <NuxtLink
          v-for="charge in charges"
          :key="charge.id"
          :to="`/charges/${charge.id}`"
          class="block"
        >
          <AppCard as="article" hover>
            <div class="flex items-center justify-between gap-2">
              <UBadge color="neutral" variant="subtle" size="sm" class="font-semibold">
                {{ charge.period }}
              </UBadge>
              <StatusBadge
                v-if="!isManager"
                :status="statusOf(charge.id)"
              />
              <span
                v-else
                class="shrink-0 text-[11px] font-bold text-slate-500 dark:text-slate-400"
              >
                {{ toPersianDigits(progressOf(charge.id).paid) }} از {{ toPersianDigits(progressOf(charge.id).total) }} پرداخت شده
              </span>
            </div>

            <div class="mt-2.5 flex items-end justify-between gap-2">
              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{{ charge.title }}</p>
                <p class="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Icon name="i-lucide-calendar-clock" class="size-3.5" />
                  سررسید: {{ formatDate(charge.dueAt, 'short') }}
                </p>
              </div>
              <p class="shrink-0 text-base font-extrabold text-slate-900 dark:text-white">
                {{ formatPrice(charge.amount) }}
              </p>
            </div>

            <div
              v-if="isManager"
              class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              role="progressbar"
              :aria-valuenow="progressOf(charge.id).percent"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="h-full rounded-full bg-teal-500 transition-all"
                :style="{ width: `${progressOf(charge.id).percent}%` }"
              />
            </div>
          </AppCard>
        </NuxtLink>
      </div>
    </template>

    <EmptyState
      v-else
      icon="i-lucide-wallet"
      title="هنوز شارژی تعریف نشده"
      :description="isManager
        ? 'اولین دوره شارژ ساختمان را تعریف کنید تا ساکنین سهم خود را ببینند.'
        : 'وقتی مدیر ساختمان شارژی تعریف کند، اینجا نمایش داده می‌شود.'"
    >
      <template v-if="isManager" #action>
        <UButton color="primary" variant="solid" size="md" label="ایجاد شارژ" icon="i-lucide-plus" @click="goNew" />
      </template>
    </EmptyState>
  </div>
</template>
