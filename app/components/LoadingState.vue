<script setup lang="ts">
withDefaults(
  defineProps<{
    /** تعداد ردیف‌های اسکلتی */
    rows?: number
    /** نمایش دایره آواتار در ابتدای هر ردیف */
    avatar?: boolean
  }>(),
  {
    rows: 3,
    avatar: true,
  },
)

const barWidths = ['w-4/5', 'w-3/5', 'w-2/3', 'w-1/2', 'w-3/4']
</script>

<template>
  <div class="space-y-4" role="status" aria-live="polite">
    <div v-for="row in rows" :key="row" class="flex animate-pulse items-center gap-3">
      <span
        v-if="avatar"
        class="size-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700/70"
      />
      <div class="flex-1 space-y-2">
        <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-700/70" :class="barWidths[row % barWidths.length]" />
        <div class="h-2.5 w-2/5 rounded-full bg-slate-200/80 dark:bg-slate-700/50" />
      </div>
      <span class="h-5 w-16 shrink-0 rounded-full bg-slate-200/80 dark:bg-slate-700/50" />
    </div>
    <span class="sr-only">در حال بارگذاری</span>
  </div>
</template>
