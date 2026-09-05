<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const nav = useAppNavigation()
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/85"
  >
    <div class="mx-auto flex h-16 w-full max-w-md items-center justify-between gap-2 px-4 lg:max-w-3xl">
      <!-- لوگو -->
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <span
          class="flex size-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm"
        >
          <Icon name="i-lucide-building-2" class="size-5" />
        </span>
        <span class="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
          {{ t('app.name') }}
        </span>
      </NuxtLink>

      <!-- ناوبری دسکتاپ -->
      <nav class="hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors"
          :class="
            isRouteActive(item.to, route.path)
              ? 'bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
          "
        >
          <Icon :name="item.icon" class="size-4" />
          {{ t(item.labelKey) }}
        </NuxtLink>
      </nav>

      <!-- اقدامات -->
      <div class="flex items-center gap-1">
        <UButton
          color="neutral"
          variant="ghost"
          size="md"
          :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          :aria-label="isDark ? 'حالت روشن' : 'حالت تاریک'"
          @click="toggleTheme"
        />
        <UButton
          color="neutral"
          variant="ghost"
          size="md"
          icon="i-lucide-bell"
          aria-label="اعلان‌ها"
          class="relative"
        >
          <span class="absolute -top-0.5 -end-0.5 size-2.5 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-950" />
        </UButton>
      </div>
    </div>
  </header>
</template>
