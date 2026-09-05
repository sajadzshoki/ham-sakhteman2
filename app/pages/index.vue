<script setup lang="ts">
import { announcements, charges } from '~/data/mock'

const router = useRouter()
const { t } = useI18n()
const { user, isAuthenticated } = useAuth()
const store = useAppStore()

useSeoMeta({
  title: t('nav.home'),
  ogTitle: t('nav.home'),
})

const building = computed(() => store.buildingOfUser(user.value))
const manager = computed(() => (building.value ? store.buildingManager(building.value.id) : null))

const firstName = computed(() => user.value?.name.split(' ')[0] ?? '')
const todayLabel = formatDate(new Date(), 'weekday')

const currentCharge = computed(() => charges.find(charge => charge.status === 'pending'))

const quickActions = [
  { label: 'پرداخت شارژ', icon: 'i-lucide-wallet', tint: 'bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300', to: '/account' },
  { label: 'درخواست خدمات', icon: 'i-lucide-wrench', tint: 'bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300', to: '/services' },
  { label: 'ساختمان من', icon: 'i-lucide-building-2', tint: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300', to: '/building' },
  { label: 'اعضای ساختمان', icon: 'i-lucide-users', tint: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300', to: '/building/members' },
]

const features = [
  { title: 'مدیریت شارژ', description: 'پرداخت شفاف و به‌موقع شارژ ماهانه', icon: 'i-lucide-wallet', tint: 'bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300' },
  { title: 'اطلاعیه‌ها', description: 'از اخبار ساختمان جا نمانید', icon: 'i-lucide-megaphone', tint: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300' },
  { title: 'خدمات و تعمیرات', description: 'ثبت و پیگیری درخواست‌های ساختمان', icon: 'i-lucide-wrench', tint: 'bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300' },
]
</script>

<template>
  <div class="space-y-7">
    <!-- داشبورد کاربر دارای ساختمان -->
    <template v-if="isAuthenticated && building">
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
        <UserAvatar :name="user?.name ?? ''" size="lg" />
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
      <section v-if="manager">
        <AppCard>
          <div class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <UserAvatar :name="manager.name" size="md" />
              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                  {{ manager.name }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">مدیر ساختمان</p>
              </div>
            </div>
            <UButton
              v-if="manager.phone"
              color="primary"
              variant="soft"
              size="md"
              icon="i-lucide-phone"
              label="تماس"
              :to="`tel:${manager.phone}`"
            />
          </div>
        </AppCard>
      </section>
    </template>

    <!-- خوش‌آمدگویی کاربر بدون ساختمان / وارد نشده -->
    <template v-else>
      <section class="space-y-4 rounded-2xl bg-teal-600 p-6 text-white shadow-md shadow-teal-600/20">
        <span class="flex size-12 items-center justify-center rounded-2xl bg-white/15">
          <Icon name="i-lucide-building-2" class="size-6" />
        </span>
        <div class="space-y-1.5">
          <h1 class="text-xl font-extrabold tracking-tight">
            <template v-if="isAuthenticated">سلام، {{ firstName }} 👋</template>
            <template v-else>به هم‌ساختمان خوش آمدید 👋</template>
          </h1>
          <p class="text-sm leading-6 text-teal-50">
            <template v-if="isAuthenticated && user?.role === 'manager'">
              ساختمان خود را بسازید، واحدها را مدیریت کنید و ساکنین را دعوت کنید.
            </template>
            <template v-else-if="isAuthenticated">
              با کد دعوت مدیر، به ساختمان محل سکونت خود بپیوندید.
            </template>
            <template v-else>
              مدیریت شارژ، اطلاعیه‌ها، خدمات و ساکنین ساختمان — همه در یک اپ ساده و شفاف.
            </template>
          </p>
        </div>
        <div class="flex flex-col gap-2 pt-1">
          <template v-if="!isAuthenticated">
            <UButton color="neutral" variant="solid" size="lg" block label="ورود به حساب" icon="i-lucide-log-in" class="bg-white text-teal-700 hover:bg-teal-50" @click="router.push('/auth/login')" />
            <UButton color="neutral" variant="soft" size="lg" block label="ایجاد حساب جدید" class="bg-white/15 text-white hover:bg-white/25" @click="router.push('/auth/register')" />
          </template>
          <template v-else-if="user?.role === 'manager'">
            <UButton color="neutral" variant="solid" size="lg" block label="ساخت ساختمان" icon="i-lucide-plus" class="bg-white text-teal-700 hover:bg-teal-50" @click="router.push('/onboarding')" />
          </template>
          <template v-else>
            <UButton color="neutral" variant="solid" size="lg" block label="پیوستن به ساختمان" icon="i-lucide-ticket" class="bg-white text-teal-700 hover:bg-teal-50" @click="router.push('/join')" />
          </template>
        </div>
      </section>

      <!-- قابلیت‌ها -->
      <section>
        <SectionHeader title="با هم‌ساختمان" />
        <div class="space-y-3">
          <AppCard v-for="feature in features" :key="feature.title" hover>
            <div class="flex items-center gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-xl" :class="feature.tint">
                <Icon :name="feature.icon" class="size-5" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ feature.title }}</p>
                <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ feature.description }}</p>
              </div>
            </div>
          </AppCard>
        </div>
      </section>
    </template>
  </div>
</template>
