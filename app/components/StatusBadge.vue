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
  overdue: { color: 'error', labelKey: 'status.overdue' },
  // درخواست‌های خدمات
  'in-progress': { color: 'info', labelKey: 'status.inProgress' },
  done: { color: 'success', labelKey: 'status.done' },
  canceled: { color: 'neutral', labelKey: 'status.canceled' },
  // واحدها
  owner: { color: 'primary', labelKey: 'status.owner' },
  tenant: { color: 'info', labelKey: 'status.tenant' },
  vacant: { color: 'neutral', labelKey: 'status.vacant' },
  // اطلاعیه‌ها
  info: { color: 'info', labelKey: 'status.info' },
  warning: { color: 'warning', labelKey: 'status.warning' },
  urgent: { color: 'error', labelKey: 'status.urgent' },
}

const preset = computed(() => statusPresets[props.status] ?? { color: 'neutral' as BadgeColor, labelKey: '' })
const text = computed(() => props.label ?? (preset.value.labelKey ? t(preset.value.labelKey) : props.status))
</script>

<template>
  <UBadge :color="preset.color" variant="subtle" size="sm" class="font-semibold">
    {{ text }}
  </UBadge>
</template>
