<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    icon?: string
  }>(),
  {
    icon: 'i-lucide-inbox',
    description: '',
  },
)
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/40"
  >
    <span
      class="mb-1 flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
    >
      <Icon :name="icon" class="size-6" />
    </span>
    <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ title }}</p>
    <p v-if="description" class="max-w-60 text-xs leading-5 text-slate-500 dark:text-slate-400">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-2">
      <slot name="action" />
    </div>
  </div>
</template>
