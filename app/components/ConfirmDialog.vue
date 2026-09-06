<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    /** رنگ دکمه تأیید؛ برای عملیات‌های خطرناک از danger استفاده کنید */
    tone?: 'primary' | 'danger'
  }>(),
  {
    description: '',
    confirmLabel: '',
    cancelLabel: '',
    tone: 'primary',
  },
)

const emit = defineEmits<{
  confirm: []
}>()

const { t } = useI18n()

const open = defineModel<boolean>('open', { default: false })

const confirmLabel = computed(() => props.confirmLabel || t('common.confirm'))
const cancelLabel = computed(() => props.cancelLabel || t('common.cancel'))

function onConfirm() {
  open.value = false
  emit('confirm')
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="description"
    :ui="{ content: 'max-w-xs' }"
    role="alertdialog"
  >
    <template #footer>
      <div class="flex w-full flex-row-reverse gap-2">
        <UButton
          :color="tone === 'danger' ? 'error' : 'primary'"
          variant="solid"
          size="md"
          block
          :label="confirmLabel"
          @click="onConfirm"
        />
        <UButton
          color="neutral"
          variant="soft"
          size="md"
          block
          :label="cancelLabel"
          @click="open = false"
        />
      </div>
    </template>
  </UModal>
</template>
