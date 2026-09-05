<script setup lang="ts">
import { building, profile, units as unitsMock } from '~/data/mock'

const { t } = useI18n()

useSeoMeta({
  title: t('nav.building'),
  ogTitle: t('nav.building'),
})

const { data: units, pending, error, refresh } = useMockApi('building-units', () => unitsMock, 800)

const buildingStats = computed(() => [
  { label: 'تعداد واحد', value: toPersianDigits(building.unitsCount), icon: 'i-lucide-door-open' },
  { label: 'تعداد طبقات', value: toPersianDigits(building.floorsCount), icon: 'i-lucide-layers' },
  { label: 'سال ساخت', value: building.builtYear, icon: 'i-lucide-calendar' },
  { label: 'مدیر ساختمان', value: building.managerName, icon: 'i-lucide-user-round-cog' },
])
</script>

<template>
  <div class="space-y-7">
    <PageHeader title="ساختمان" :description="`مشخصات و ساکنین ${building.name}`" />

    <!-- مشخصات ساختمان -->
    <section>
      <AppCard as="section">
        <div class="flex items-start gap-3">
          <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300">
            <Icon name="i-lucide-building-2" class="size-5.5" />
          </span>
          <div class="min-w-0">
            <h2 class="text-base font-extrabold text-slate-900 dark:text-white">{{ building.name }}</h2>
            <p class="mt-0.5 flex items-start gap-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              <Icon name="i-lucide-map-pin" class="mt-0.5 size-3.5 shrink-0" />
              {{ building.address }}
            </p>
          </div>
        </div>
        <dl class="mt-4 grid grid-cols-2 gap-3">
          <div
            v-for="stat in buildingStats"
            :key="stat.label"
            class="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
          >
            <dt class="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Icon :name="stat.icon" class="size-3.5" />
              {{ stat.label }}
            </dt>
            <dd class="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-100">{{ stat.value }}</dd>
          </div>
        </dl>
      </AppCard>
    </section>

    <!-- امکانات -->
    <section>
      <SectionHeader title="امکانات ساختمان" />
      <div class="flex flex-wrap gap-2">
        <span
          v-for="amenity in building.amenities"
          :key="amenity"
          class="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-950/5 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10"
        >
          {{ amenity }}
        </span>
      </div>
    </section>

    <!-- ساکنین -->
    <section>
      <SectionHeader title="واحدها و ساکنین" />

      <AppCard v-if="pending">
        <LoadingState :rows="4" />
      </AppCard>

      <ErrorState v-else-if="error" @retry="refresh" />

      <AppCard v-else padding="none">
        <ul class="divide-y divide-slate-100 dark:divide-slate-800">
          <li
            v-for="unit in units"
            :key="unit.id"
            class="flex items-center gap-3 px-4 py-3.5"
          >
            <UserAvatar :name="unit.residentName ?? 'واحد خالی'" size="md" />
            <div class="min-w-0 flex-1">
              <p class="flex items-center gap-1.5 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                {{ unit.residentName ?? 'بدون ساکن' }}
                <span
                  v-if="unit.residentName === profile.name"
                  class="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:bg-teal-400/10 dark:text-teal-300"
                >
                  شما
                </span>
              </p>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                واحد {{ toPersianDigits(unit.number) }} • طبقه {{ toPersianDigits(unit.floor) }}
              </p>
            </div>
            <StatusBadge :status="unit.occupancy" />
          </li>
        </ul>
      </AppCard>
    </section>
  </div>
</template>
