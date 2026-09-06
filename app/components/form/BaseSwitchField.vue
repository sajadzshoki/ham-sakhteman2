<script setup lang="ts">
defineProps<{
  label: string
  description?: string
  disabled?: boolean
}>()

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <div class="min-w-0">
      <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ label }}</p>
      <p v-if="description" class="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
        {{ description }}
      </p>
    </div>
    <USwitch v-model="model" :disabled="disabled" class="shrink-0" />
  </div>
</template>
