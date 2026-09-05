<script setup lang="ts">
import { announcements, building, charges, profile } from '~/data/mock'

const { t } = useI18n()

useSeoMeta({
  title: t('nav.home'),
  ogTitle: t('nav.home'),
})

const firstName = computed(() => profile.name.split(' ')[0] ?? profile.name)
const todayLabel = formatDate(new Date(), 'weekday')

const currentCharge = computed(() => charges.find(charge => charge.status === 'pending'))

const quickActions = [
  { label: 'پرداخت شارژ', icon: 'i-lucide-wallet', tint: 'bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300', to: '/account' },
  { label: 'درخواست خدمات', icon: 'i-lucide-wrench', tint: 'bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300', to: '/services' },
  { label: 'اطلاعیه‌ها', icon: 'i-lucide-megaphone', tint: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300', to: '/' },
  { label: 'ساختمان من', icon: 'i-lucide-building-2', tint: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300', to: '/building' },
]
</script>

<template>
  <div class="space-y-7">
    <!-- خوش‌آمدگویی -->
    <section class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ todayLabel }}</p>
        <h1 class="mt-1 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          سلام، {{ firstName }} 👋
        </h1>
        <p class="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
          به «{{ building.name }}» خوش آمدید
        </p>
      </div>
      <UserAvatar :name="profile.name" size="lg" />
    </section>

    <!-- کارت شارژ ماه جاری -->
    <section
      v-if="currentCharge"
      class="space-y-4 rounded-2xl bg-teal-600 p-5 text-white shadow-md shadow-teal-600/20"
    >
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm font-medium text-teal-50">{{ currentCharge.title }}</p>
        <span class="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold">
          {{ t('status.pending') }}
        </span>
      </div>
      <div class="space-y-1">
        <p class="text-2xl font-extrabold tracking-tight">
          {{ formatAmount(currentCharge.amount) }}
          <span class="text-sm font-medium text-teal-50">تومان</span>
        </p>
        <p v-if="currentCharge.dueAt" class="text-xs text-teal-100">
          مهلت پرداخت: {{ formatDate(currentCharge.dueAt, 'short') }}
        </p>
      </div>
      <button
        type="button"
        class="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50 active:bg-teal-100"
      >
        پرداخت آنلاین شارژ
      </button>
    </section>

    <!-- دسترسی سریع -->
    <section>
      <div class="grid grid-cols-4 gap-2.5 sm:gap-3">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.to"
          class="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-1 py-3 shadow-sm ring-1 ring-slate-950/5 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-white/10"
        >
          <span class="flex size-10 items-center justify-center rounded-xl" :class="action.tint">
            <Icon :name="action.icon" class="size-5" />
          </span>
          <span class="text-center text-[11px] leading-4 font-semibold text-slate-600 dark:text-slate-300">
            {{ action.label }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- اطلاعیه‌ها -->
    <section>
      <SectionHeader title="اطلاعیه‌های ساختمان" />
      <div class="space-y-3">
        <AppCard v-for="announcement in announcements" :key="announcement.id" as="article" hover>
          <div class="flex items-center justify-between gap-2">
            <StatusBadge :status="announcement.category" />
            <time class="text-[11px] text-slate-400 dark:text-slate-500">
              {{ formatRelative(announcement.publishedAt) }}
            </time>
          </div>
          <h3 class="mt-2.5 flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-100">
            <Icon v-if="announcement.pinned" name="i-lucide-pin" class="size-3.5 text-teal-500" />
            {{ announcement.title }}
          </h3>
          <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {{ announcement.body }}
          </p>
        </AppCard>
      </div>
    </section>

    <!-- مدیر ساختمان -->
    <section>
      <AppCard>
        <div class="flex items-center justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <UserAvatar :name="building.managerName" size="md" />
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                {{ building.managerName }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">مدیر ساختمان</p>
            </div>
          </div>
          <UButton
            color="primary"
            variant="soft"
            size="md"
            icon="i-lucide-phone"
            label="تماس"
            :to="`tel:${building.managerPhone}`"
          />
        </div>
      </AppCard>
    </section>
  </div>
</template>
