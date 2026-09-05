<script setup lang="ts">
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const { user, isAuthenticated, isManager, logout } = useAuth()
const store = useAppStore()
const { isDark, setTheme } = useTheme()

useSeoMeta({
  title: t('nav.account'),
  ogTitle: t('nav.account'),
})

const building = computed(() => store.buildingOfUser(user.value))
const membership = computed(() => store.membershipOfUser(user.value))

const unitInfo = computed(() => {
  if (!membership.value?.unitId || !building.value) return null
  const unit = store.buildingUnits(building.value.id).find(item => item.id === membership.value?.unitId)
  return unit ? `واحد ${toPersianDigits(unit.number)}، طبقه ${toPersianDigits(unit.floor)}` : null
})

interface AccountMenuItem {
  label: string
  icon: string
  tint: string
  to?: string
  requiresManager?: boolean
  requiresBuilding?: boolean
}

const menuItems = computed<AccountMenuItem[]>(() => [
  { label: 'ساختمان من', icon: 'i-lucide-building-2', tint: 'bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300', to: '/building' },
  { label: 'اعضای ساختمان', icon: 'i-lucide-users', tint: 'bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300', to: '/building/members', requiresBuilding: true },
  { label: 'دعوت از ساکنین', icon: 'i-lucide-user-plus', tint: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300', to: '/building/invite', requiresManager: true },
  { label: 'پرداخت‌های من', icon: 'i-lucide-credit-card', tint: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300' },
  { label: 'پشتیبانی', icon: 'i-lucide-life-buoy', tint: 'bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300' },
].filter((item) => {
  if (item.requiresManager && (!isManager.value || !building.value)) return false
  if (item.requiresBuilding && !building.value) return false
  return true
}))

function showSoon() {
  toast.add({ title: t('common.soon'), color: 'neutral' })
}

const isLogoutDialogOpen = ref(false)

function onLogout() {
  logout()
  toast.add({ title: t('common.logoutDone'), color: 'success' })
  router.push('/auth/login')
}
</script>

<template>
  <div class="space-y-7">
    <PageHeader title="حساب من" description="پروفایل و تنظیمات حساب کاربری" />

    <!-- کاربر وارد نشده -->
    <template v-if="!isAuthenticated || !user">
      <EmptyState
        icon="i-lucide-circle-user-round"
        title="وارد حساب نشده‌اید"
        description="برای مدیریت ساختمان و تنظیمات، وارد حساب خود شوید."
      >
        <template #action>
          <div class="flex gap-2">
            <UButton color="primary" variant="solid" size="md" label="ورود" icon="i-lucide-log-in" @click="router.push('/auth/login')" />
            <UButton color="neutral" variant="soft" size="md" label="ثبت‌نام" @click="router.push('/auth/register')" />
          </div>
        </template>
      </EmptyState>
    </template>

    <template v-else>
      <!-- پروفایل -->
      <section>
        <AppCard as="section">
          <div class="flex items-center gap-4">
            <UserAvatar :name="user.name" size="xl" />
            <div class="min-w-0">
              <h2 class="text-base font-extrabold text-slate-900 dark:text-white">{{ user.name }}</h2>
              <p v-if="building" class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {{ building.name }}<template v-if="unitInfo"> • {{ unitInfo }}</template>
              </p>
              <p class="mt-1 text-xs text-slate-400 dark:text-slate-500" dir="ltr">
                {{ formatPhone(user.phone) }}
              </p>
              <StatusBadge
                class="mt-2"
                :status="user.role"
                :label="user.role === 'manager' ? 'مدیر ساختمان' : 'ساکن'"
              />
            </div>
          </div>
        </AppCard>
      </section>

      <!-- منوی حساب -->
      <section>
        <AppCard padding="none">
          <ul class="divide-y divide-slate-100 dark:divide-slate-800">
            <li v-for="item in menuItems" :key="item.label">
              <NuxtLink
                v-if="item.to"
                :to="item.to"
                class="flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span class="flex size-9 items-center justify-center rounded-xl" :class="item.tint">
                  <Icon :name="item.icon" class="size-4.5" />
                </span>
                <span class="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{{ item.label }}</span>
                <Icon name="i-lucide-chevron-left" class="size-4 text-slate-300 dark:text-slate-600" />
              </NuxtLink>
              <button
                v-else
                type="button"
                class="flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                @click="showSoon"
              >
                <span class="flex size-9 items-center justify-center rounded-xl" :class="item.tint">
                  <Icon :name="item.icon" class="size-4.5" />
                </span>
                <span class="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{{ item.label }}</span>
                <Icon name="i-lucide-chevron-left" class="size-4 text-slate-300 dark:text-slate-600" />
              </button>
            </li>
          </ul>
        </AppCard>
      </section>

      <!-- نمایش -->
      <section>
        <SectionHeader :title="t('common.appearance')" />
        <AppCard>
          <BaseSwitchField
            :model-value="isDark"
            :label="t('common.themeDark')"
            :description="t('common.themeDarkDescription')"
            @update:model-value="(value: boolean) => setTheme(value ? 'dark' : 'light')"
          />
        </AppCard>
      </section>

      <!-- درباره و خروج -->
      <section class="space-y-3">
        <p class="text-center text-[11px] text-slate-400 dark:text-slate-500">
          {{ t('common.appVersion', { version: toPersianDigits('1.0.0') }) }}
        </p>
        <UButton
          color="error"
          variant="soft"
          size="lg"
          block
          icon="i-lucide-log-out"
          :label="t('common.logout')"
          @click="isLogoutDialogOpen = true"
        />
      </section>
    </template>

    <ConfirmDialog
      v-model:open="isLogoutDialogOpen"
      :title="t('common.logout')"
      description="آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟"
      tone="danger"
      :confirm-label="t('common.logout')"
      @confirm="onLogout"
    />
  </div>
</template>
