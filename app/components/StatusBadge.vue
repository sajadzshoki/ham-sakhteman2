<script setup lang="ts">
import type { BadgeProps } from '#ui/types'

type BadgeColor = NonNullable<BadgeProps['color']>

const props = withDefaults(
  defineProps<{
    /** کلید وضعیت؛ برچسب و رنگ از روی آن تعیین می‌شود */
    status: string
    /** برچسب سفارشی به جای برچسب پیش‌فرض وضعیت */
    label?: string
  }>(),
  {
    label: undefined,
  },
)

const { t } = useI18n()

/** نگاشت وضعیت‌ها به رنگ نشان و کلید ترجمه */
const statusPresets: Record<string, { color: BadgeColor; labelKey: string }> = {
  // پرداخت‌ها
  paid: { color: 'success', labelKey: 'status.paid' },
  pending: { color: 'warning', labelKey: 'status.pending' },
  unpaid: { color: 'warning', labelKey: 'status.unpaid' },
  overdue: { color: 'error', labelKey: 'status.overdue' },
  // درخواست‌های خدمات
  'in-progress': { color: 'info', labelKey: 'status.inProgress' },
  done: { color: 'success', labelKey: 'status.done' },
  canceled: { color: 'neutral', labelKey: 'status.canceled' },
  // واحدها
  owner: { color: 'primary', labelKey: 'status.owner' },
  tenant: { color: 'info', labelKey: 'status.tenant' },
  vacant: { color: 'neutral', labelKey: 'status.vacant' },
  // اطلاعیه‌ها (اهمیت)
  normal: { color: 'neutral', labelKey: 'status.normal' },
  important: { color: 'warning', labelKey: 'status.important' },
  // گزارش مشکلات
  new: { color: 'error', labelKey: 'status.new' },
  resolved: { color: 'success', labelKey: 'status.resolved' },
  // نقش اعضا
  manager: { color: 'primary', labelKey: 'status.manager' },
  resident: { color: 'info', labelKey: 'status.resident' },
  // دعوت‌نامه‌ها
  active: { color: 'success', labelKey: 'status.active' },
  used: { color: 'neutral', labelKey: 'status.used' },
  expired: { color: 'error', labelKey: 'status.expired' },
}

const preset = computed(() => statusPresets[props.status] ?? { color: 'neutral' as BadgeColor, labelKey: '' })
const text = computed(() => props.label ?? (preset.value.labelKey ? t(preset.value.labelKey) : props.status))
</script>

<template>
  <UBadge :color="preset.color" variant="subtle" size="sm" class="font-semibold">
    {{ text }}
  </UBadge>
</template>
