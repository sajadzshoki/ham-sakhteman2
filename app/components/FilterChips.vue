<script setup lang="ts">
export interface FilterChipOption {
  id: string
  label: string
  icon?: string
}

defineProps<{ options: FilterChipOption[] }>()
const model = defineModel<string>({ default: 'all' })
</script>

<template>
  <div class="scrollbar-none -mx-4 overflow-x-auto px-4 pb-1">
    <div class="flex w-max gap-2">
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        class="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60"
        :class="model === option.id
          ? 'bg-teal-600 text-white ring-teal-600 dark:bg-teal-500 dark:ring-teal-500'
          : 'bg-white text-slate-600 ring-slate-200 hover:ring-teal-300 dark:bg-slate-900 dark:text-slate-300 dark:ring-white/10 dark:hover:ring-teal-500/60'"
        :aria-pressed="model === option.id"
        @click="model = option.id"
      >
        <Icon v-if="option.icon" :name="option.icon" class="size-3.5" />
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
