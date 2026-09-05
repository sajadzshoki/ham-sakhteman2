<script setup lang="ts">
defineProps<{
  title: string
  /** لینک اختیاری «مشاهده همه» */
  action?: { label: string; to: string }
}>()
</script>

<template>
  <div class="mb-3 flex items-center justify-between gap-2">
    <h2 class="text-base font-bold text-slate-900 dark:text-white">{{ title }}</h2>
    <NuxtLink
      v-if="action"
      :to="action.to"
      class="flex shrink-0 items-center gap-0.5 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-300 dark:hover:text-teal-200"
    >
      {{ action.label }}
      <Icon name="i-lucide-chevron-left" class="size-4" />
    </NuxtLink>
  </div>
</template>
