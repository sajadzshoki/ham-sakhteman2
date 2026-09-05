<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'خطا در بارگذاری',
    description: 'اتصال به سرور برقرار نشد. لطفاً دوباره تلاش کنید.',
  },
)

defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50/60 px-6 py-10 text-center dark:border-red-400/20 dark:bg-red-400/5"
  >
    <span
      class="mb-1 flex size-12 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-400/10 dark:text-red-400"
    >
      <Icon name="i-lucide-triangle-alert" class="size-6" />
    </span>
    <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ title }}</p>
    <p v-if="description" class="max-w-64 text-xs leading-5 text-slate-500 dark:text-slate-400">
      {{ description }}
    </p>
    <UButton
      color="neutral"
      variant="solid"
      size="sm"
      class="mt-2"
      icon="i-lucide-rotate-ccw"
      label="تلاش مجدد"
      @click="$emit('retry')"
    />
  </div>
</template>
