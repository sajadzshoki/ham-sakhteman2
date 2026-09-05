<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="mb-5 flex items-start justify-between gap-3">
    <div class="min-w-0 space-y-1">
      <h1 class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {{ title }}
      </h1>
      <p v-if="description" class="text-sm leading-6 text-slate-500 dark:text-slate-400">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="shrink-0 pt-1">
      <slot name="actions" />
    </div>
  </div>
</template>
