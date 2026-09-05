<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    padding?: 'none' | 'sm' | 'md' | 'lg'
    as?: 'div' | 'section' | 'article'
    hover?: boolean
  }>(),
  {
    padding: 'md',
    as: 'div',
  },
)

const paddingClasses: Record<NonNullable<typeof props.padding>, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}
</script>

<template>
  <component
    :is="as"
    class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10"
    :class="[paddingClasses[props.padding], hover && 'transition-shadow hover:shadow-md']"
  >
    <slot />
  </component>
</template>
