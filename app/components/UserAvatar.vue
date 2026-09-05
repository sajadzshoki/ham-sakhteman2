<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string
    src?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    size: 'md',
    src: undefined,
  },
)

const sizeClasses: Record<NonNullable<typeof props.size>, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-lg',
  xl: 'size-20 text-2xl',
}

/** حرف اول دو کلمه اول نام برای نمایش به‌جای تصویر */
const initials = computed(() =>
  props.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('‌'),
)
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-100 font-bold text-teal-700 ring-1 ring-teal-600/10 dark:bg-teal-400/10 dark:text-teal-300"
    :class="sizeClasses[props.size]"
  >
    <img v-if="src" :src="src" :alt="name" class="size-full object-cover">
    <template v-else>{{ initials }}</template>
  </span>
</template>
