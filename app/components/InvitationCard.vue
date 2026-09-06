<script setup lang="ts">
import type { Building, Invitation } from '~/types'

const props = defineProps<{
  invitation: Invitation
  building: Building
}>()

const toast = useToast()

/** مسیر نسبی برای نمایش (یکسان در سرور و کلاینت تا هیدریشن به‌هم نریزد) */
const displayUrl = computed(() => `/join?code=${props.invitation.code}`)

/** لینک کامل برای کپی/اشتراک‌گذاری */
const shareUrl = computed(() => {
  if (import.meta.server) return displayUrl.value
  return `${window.location.origin}${displayUrl.value}`
})

async function copyCode() {
  const ok = await copyToClipboard(props.invitation.code)
  toast.add({
    title: ok ? 'کد دعوت کپی شد' : 'کپی انجام نشد',
    color: ok ? 'success' : 'error',
  })
}

async function copyLink() {
  const ok = await copyToClipboard(shareUrl.value)
  toast.add({
    title: ok ? 'لینک دعوت کپی شد' : 'کپی انجام نشد',
    color: ok ? 'success' : 'error',
  })
}

async function share() {
  if (import.meta.client && navigator.share) {
    try {
      await navigator.share({
        title: `دعوت به ${props.building.name}`,
        text: `با کد «${props.invitation.code}» به ${props.building.name} در هم‌ساختمان بپیوندید.`,
        url: shareUrl.value,
      })
      return
    }
    catch {
      // کاربر اشتراک‌گذاری را لغو کرد یا مرورگر پشتیبانی نکرد؛ در ادامه کپی می‌کنیم
    }
  }
  await copyLink()
}
</script>

<template>
  <AppCard as="section">
    <div class="flex items-center justify-between gap-2">
      <p class="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
        <Icon name="i-lucide-ticket" class="size-4 text-teal-600 dark:text-teal-300" />
        کد دعوت ساختمان
      </p>
      <span class="text-[10px] text-slate-400 dark:text-slate-500">
        اعتبار تا {{ formatDate(invitation.expiresAt, 'full') }}
      </span>
    </div>

    <!-- کد -->
    <div class="mt-3 flex items-center justify-between gap-3 rounded-xl bg-teal-50 px-4 py-3.5 dark:bg-teal-400/10">
      <span dir="ltr" class="font-mono text-2xl font-extrabold tracking-[0.3em] text-teal-700 dark:text-teal-300">
        {{ invitation.code }}
      </span>
      <button
        type="button"
        class="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-teal-700 shadow-sm transition-colors hover:bg-teal-100 dark:bg-slate-900 dark:text-teal-300 dark:hover:bg-slate-800"
        @click="copyCode"
      >
        <Icon name="i-lucide-copy" class="size-3.5" />
        کپی کد
      </button>
    </div>

    <!-- لینک -->
    <div class="mt-2.5 flex items-center gap-2">
      <p dir="ltr" class="min-w-0 flex-1 truncate rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
        {{ displayUrl }}
      </p>
      <UButton color="neutral" variant="soft" size="sm" icon="i-lucide-link-2" aria-label="کپی لینک" @click="copyLink" />
      <UButton color="neutral" variant="soft" size="sm" icon="i-lucide-share-2" aria-label="اشتراک‌گذاری" @click="share" />
    </div>

    <p class="mt-3 flex items-start gap-1.5 text-[11px] leading-4 text-slate-400 dark:text-slate-500">
      <Icon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
      ساکنین می‌توانند از صفحه «پیوستن» با وارد کردن این کد یا باز کردن لینک، به ساختمان اضافه شوند.
    </p>
  </AppCard>
</template>
