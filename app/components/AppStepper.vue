<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** عنوان مرحله‌ها به ترتیب */
    steps: string[]
    /** شماره مرحله فعال (از صفر) */
    current?: number
  }>(),
  {
    current: 0,
  },
)
</script>

<template>
  <ol class="flex items-start" aria-label="مراحل">
    <li
      v-for="(step, index) in props.steps"
      :key="step"
      class="flex flex-1 flex-col items-center gap-1.5"
    >
      <div class="flex w-full items-center">
        <span
          class="h-0.5 flex-1 rounded-full transition-colors"
          :class="index > 0 && index <= current ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'"
        />
        <span
          class="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-colors"
          :class="
            index < current
              ? 'bg-teal-600 text-white'
              : index === current
                ? 'bg-teal-600 text-white ring-4 ring-teal-100 dark:ring-teal-400/20'
                : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          "
        >
          <Icon v-if="index < current" name="i-lucide-check" class="size-4" />
          <template v-else>{{ toPersianDigits(index + 1) }}</template>
        </span>
        <span
          class="h-0.5 flex-1 rounded-full transition-colors"
          :class="index < current ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'"
        />
      </div>
      <span
        class="px-1 text-center text-[11px] leading-4 font-semibold"
        :class="index === current ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400 dark:text-slate-500'"
      >
        {{ step }}
      </span>
    </li>
  </ol>
</template>
